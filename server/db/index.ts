import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let _db: PostgresJsDatabase<typeof schema> | null = null;

function getDb(): PostgresJsDatabase<typeof schema> {
	if (!_db) {
		const url = process.env.POSTGRES_URL;
		if (!url) {
			throw new Error(
				"POSTGRES_URL environment variable is not set. Add it to .env.local for development.",
			);
		}
		_db = drizzle(postgres(url, { prepare: false }), { schema });
	}
	return _db;
}

// Lazy proxy - defers Postgres client creation until first DB operation,
// so the server starts without POSTGRES_URL present in dev.
export const db = new Proxy({} as PostgresJsDatabase<typeof schema>, {
	get(_target, prop) {
		return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
	},
});
