import { neon } from "@neondatabase/serverless";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

let _db: NeonHttpDatabase<typeof schema> | null = null;

function getDb(): NeonHttpDatabase<typeof schema> {
	if (!_db) {
		const url = process.env.POSTGRES_URL;
		if (!url) {
			throw new Error(
				"POSTGRES_URL environment variable is not set. Add it to .env.local for development.",
			);
		}
		_db = drizzle(neon(url), { schema });
	}
	return _db;
}

// Lazy proxy — defers neon() call until first DB operation,
// so the server starts without POSTGRES_URL present in dev.
export const db = new Proxy({} as NeonHttpDatabase<typeof schema>, {
	get(_target, prop) {
		return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
	},
});
