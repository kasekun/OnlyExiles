import { and, count, eq, lt } from "drizzle-orm";
import { createError, getRequestIP } from "h3";
import { db } from "../../../db/index";
import { authAttempts, editSessions, guides } from "../../../db/schema";
import { readSizedJsonBody } from "../../../lib/body";
import { hashSecret, verifyPassphrase } from "../../../lib/crypto";
import { generateEditSession } from "../../../lib/generateId";
import { AuthBody } from "../../../lib/validation";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	if (!id) throw createError({ statusCode: 400, message: "Missing guide ID" });

	const ip = getRequestIP(event, { xForwardedFor: true }) ?? "unknown";
	const now = new Date();
	const window10m = new Date(now.getTime() - 10 * 60 * 1000);

	// Prune stale failed attempts
	await db.delete(authAttempts).where(lt(authAttempts.attemptedAt, window10m));

	// Rate limit: 5 failed attempts per IP per guide per 10 minutes
	const [failCount] = await db
		.select({ c: count() })
		.from(authAttempts)
		.where(and(eq(authAttempts.ip, ip), eq(authAttempts.guideId, id)));

	if ((failCount?.c ?? 0) >= 5) {
		throw createError({
			statusCode: 429,
			message: "Too many failed attempts - try again in 10 minutes",
		});
	}

	const body = await readSizedJsonBody<unknown>(event);
	const parsed = AuthBody.safeParse(body);
	if (!parsed.success) {
		throw createError({
			statusCode: 400,
			message: parsed.error.issues[0]?.message ?? "Invalid request body",
		});
	}

	const [guide] = await db
		.select({ passphraseHash: guides.passphraseHash })
		.from(guides)
		.where(eq(guides.id, id))
		.limit(1);

	if (!guide) {
		throw createError({ statusCode: 404, message: "Guide not found" });
	}

	const valid = await verifyPassphrase(
		parsed.data.passphrase,
		guide.passphraseHash,
	);

	if (!valid) {
		await db.insert(authAttempts).values({ ip, guideId: id, attemptedAt: now });
		throw createError({ statusCode: 401, message: "Incorrect passphrase" });
	}

	// Clear prior failures for this IP/guide
	await db
		.delete(authAttempts)
		.where(and(eq(authAttempts.ip, ip), eq(authAttempts.guideId, id)));

	// Prune stale edit sessions (180-day retention)
	const staleSessionCutoff = new Date(
		now.getTime() - 180 * 24 * 60 * 60 * 1000,
	);
	await db
		.delete(editSessions)
		.where(
			and(
				eq(editSessions.guideId, id),
				lt(editSessions.lastUsedAt, staleSessionCutoff),
			),
		);

	// Create new edit session
	const { sessionId, secret } = generateEditSession();
	const secretHash = await hashSecret(secret);

	await db.insert(editSessions).values({
		guideId: id,
		sessionId,
		secretHash,
		createdAt: now,
		lastUsedAt: now,
	});

	return { editToken: `${sessionId}.${secret}` };
});
