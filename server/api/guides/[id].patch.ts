import { and, count, eq, gt, lt } from "drizzle-orm";
import { createError, getHeader, getRequestIP } from "h3";
import { normalizePlannerState } from "../../../app/lib/plannerState";
import { db } from "../../db/index";
import { apiAttempts, editSessions, guides } from "../../db/schema";
import { readSizedJsonBody } from "../../lib/body";
import { verifySecret } from "../../lib/crypto";
import { UpdateGuideBody } from "../../lib/validation";
import { currentVersion } from "../../lib/version";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	if (!id) throw createError({ statusCode: 400, message: "Missing guide ID" });

	// Parse bearer token
	const authHeader = getHeader(event, "authorization") ?? "";
	const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
	const dotIdx = token.indexOf(".");
	if (dotIdx < 0) {
		throw createError({ statusCode: 401, message: "Missing edit token" });
	}
	const sessionId = token.slice(0, dotIdx);
	const secret = token.slice(dotIdx + 1);

	// Look up session
	const [session] = await db
		.select()
		.from(editSessions)
		.where(
			and(eq(editSessions.guideId, id), eq(editSessions.sessionId, sessionId)),
		)
		.limit(1);

	if (!session) {
		throw createError({ statusCode: 401, message: "Invalid edit token" });
	}

	const secretValid = await verifySecret(secret, session.secretHash);
	if (!secretValid) {
		throw createError({ statusCode: 401, message: "Invalid edit token" });
	}

	const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
	const now = new Date();
	const window10m = new Date(now.getTime() - 10 * 60 * 1000);

	// Update throttle cleanup must not delete create attempts used by the 24h cap.
	await db
		.delete(apiAttempts)
		.where(
			and(
				eq(apiAttempts.action, "update-guide"),
				lt(apiAttempts.attemptedAt, window10m),
			),
		);

	const [guideUpdateCount] = await db
		.select({ c: count() })
		.from(apiAttempts)
		.where(
			and(
				eq(apiAttempts.guideId, id),
				eq(apiAttempts.action, "update-guide"),
				gt(apiAttempts.attemptedAt, window10m),
			),
		);
	if ((guideUpdateCount?.c ?? 0) >= 60) {
		throw createError({
			statusCode: 429,
			message: "Too many updates - try again shortly",
		});
	}

	const [ipUpdateCount] = await db
		.select({ c: count() })
		.from(apiAttempts)
		.where(
			and(
				eq(apiAttempts.ip, ip),
				eq(apiAttempts.action, "update-guide"),
				gt(apiAttempts.attemptedAt, window10m),
			),
		);
	if ((ipUpdateCount?.c ?? 0) >= 120) {
		throw createError({
			statusCode: 429,
			message: "Too many updates - try again shortly",
		});
	}

	const body = await readSizedJsonBody<unknown>(event);
	const parsed = UpdateGuideBody.safeParse(body);
	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			message: parsed.error.issues[0]?.message ?? "Invalid request body",
		});
	}

	await db
		.update(guides)
		.set({
			updatedAt: now,
			lastViewedAt: now,
			version: currentVersion(),
			...(parsed.data.name !== undefined
				? { name: parsed.data.name.trim() }
				: {}),
			...(parsed.data.state !== undefined
				? { state: normalizePlannerState(parsed.data.state) }
				: {}),
		})
		.where(eq(guides.id, id));

	// Update session lastUsedAt and prune old sessions
	const staleSessionCutoff = new Date(
		now.getTime() - 180 * 24 * 60 * 60 * 1000,
	);
	await Promise.all([
		db
			.update(editSessions)
			.set({ lastUsedAt: now })
			.where(
				and(
					eq(editSessions.guideId, id),
					eq(editSessions.sessionId, sessionId),
				),
			),
		db
			.delete(editSessions)
			.where(lt(editSessions.lastUsedAt, staleSessionCutoff)),
	]);

	await db.insert(apiAttempts).values({
		ip,
		action: "update-guide",
		guideId: id,
		attemptedAt: now,
	});

	return { ok: true };
});
