import { and, count, eq, gt, lt } from "drizzle-orm";
import { createError, getRequestIP } from "h3";
import { normalizePlannerState } from "../../../app/lib/plannerState";
import { db } from "../../db/index";
import {
	apiAttempts,
	authAttempts,
	editSessions,
	guides,
} from "../../db/schema";
import { readSizedJsonBody } from "../../lib/body";
import { hashPassphrase, hashSecret } from "../../lib/crypto";
import { generateEditSession, generateGuideId } from "../../lib/generateId";
import { CreateGuideBody } from "../../lib/validation";
import { currentVersion } from "../../lib/version";

export default defineEventHandler(async (event) => {
	const body = await readSizedJsonBody<unknown>(event);
	const parsed = CreateGuideBody.safeParse(body);
	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			message: parsed.error.issues[0]?.message ?? "Invalid request body",
		});
	}

	const { name, passphrase, state: rawState } = parsed.data;
	const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
	const now = new Date();
	const window10m = new Date(now.getTime() - 10 * 60 * 1000);
	const window24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);

	// Prune stale api_attempts before counting
	await db.delete(apiAttempts).where(lt(apiAttempts.attemptedAt, window24h));

	// Create throttle: 10/10min and 100/24h per IP
	const [shortCount] = await db
		.select({ c: count() })
		.from(apiAttempts)
		.where(
			and(
				eq(apiAttempts.ip, ip),
				eq(apiAttempts.action, "create-guide"),
				gt(apiAttempts.attemptedAt, window10m),
			),
		);
	if ((shortCount?.c ?? 0) >= 10) {
		throw createError({
			statusCode: 429,
			message: "Too many guides created — try again later",
		});
	}

	const [longCount] = await db
		.select({ c: count() })
		.from(apiAttempts)
		.where(
			and(
				eq(apiAttempts.ip, ip),
				eq(apiAttempts.action, "create-guide"),
				gt(apiAttempts.attemptedAt, window24h),
			),
		);
	if ((longCount?.c ?? 0) >= 100) {
		throw createError({
			statusCode: 429,
			message: "Too many guides created — try again later",
		});
	}

	// Opportunistic stale-guide prune (90-day retention)
	const staleCutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
	const staleGuideRows = await db
		.select({ id: guides.id })
		.from(guides)
		.where(lt(guides.lastViewedAt, staleCutoff))
		.limit(50);

	if (staleGuideRows.length > 0) {
		await db.transaction(async (tx) => {
			for (const { id: staleId } of staleGuideRows) {
				await tx.delete(editSessions).where(eq(editSessions.guideId, staleId));
				await tx.delete(authAttempts).where(eq(authAttempts.guideId, staleId));
				await tx.delete(apiAttempts).where(eq(apiAttempts.guideId, staleId));
				await tx.delete(guides).where(eq(guides.id, staleId));
			}
		});
	}

	const id = generateGuideId();
	const { sessionId, secret } = generateEditSession();
	const [passphraseHash, secretHash, version] = await Promise.all([
		hashPassphrase(passphrase),
		hashSecret(secret),
		Promise.resolve(currentVersion()),
	]);

	const normalizedState = normalizePlannerState(rawState);

	await db.transaction(async (tx) => {
		await tx.insert(guides).values({
			id,
			passphraseHash,
			name: name.trim(),
			version,
			state: normalizedState,
			createdAt: now,
			updatedAt: now,
			lastViewedAt: now,
		});

		await tx.insert(editSessions).values({
			guideId: id,
			sessionId,
			secretHash,
			createdAt: now,
			lastUsedAt: now,
		});

		await tx.insert(apiAttempts).values({
			ip,
			action: "create-guide",
			guideId: id,
			attemptedAt: now,
		});
	});

	return { id, editToken: `${sessionId}.${secret}` };
});
