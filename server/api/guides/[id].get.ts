import { eq } from "drizzle-orm";
import { createError } from "h3";
import { db } from "../../db/index";
import { guides } from "../../db/schema";
import { currentVersion } from "../../lib/version";

export default defineEventHandler(async (event) => {
	const id = getRouterParam(event, "id");
	if (!id) throw createError({ statusCode: 400, message: "Missing guide ID" });

	const [guide] = await db
		.select()
		.from(guides)
		.where(eq(guides.id, id))
		.limit(1);

	if (!guide) {
		throw createError({ statusCode: 404, message: "Guide not found" });
	}

	// Refresh lastViewedAt asynchronously - fire and forget
	db.update(guides)
		.set({ lastViewedAt: new Date() })
		.where(eq(guides.id, id))
		.catch(() => {});

	return {
		id: guide.id,
		name: guide.name,
		version: guide.version,
		currentVersion: currentVersion(),
		state: guide.state,
		updatedAt: guide.updatedAt,
		lastViewedAt: guide.lastViewedAt,
	};
});
