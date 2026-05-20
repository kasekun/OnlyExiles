import {
	index,
	jsonb,
	pgTable,
	primaryKey,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/pg-core";

export const guides = pgTable(
	"guides",
	{
		id: varchar("id", { length: 14 }).primaryKey(),
		passphraseHash: varchar("passphrase_hash", { length: 72 }).notNull(),
		name: varchar("name", { length: 255 }).notNull().default("Untitled guide"),
		version: varchar("version", { length: 50 }).notNull(),
		state: jsonb("state").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		updatedAt: timestamp("updated_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		lastViewedAt: timestamp("last_viewed_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(t) => [
		index("guides_last_viewed_idx").on(t.lastViewedAt),
		index("guides_version_idx").on(t.version),
	],
);

export const editSessions = pgTable(
	"edit_sessions",
	{
		guideId: varchar("guide_id", { length: 14 }).notNull(),
		sessionId: varchar("session_id", { length: 14 }).notNull(),
		secretHash: varchar("secret_hash", { length: 72 }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
		lastUsedAt: timestamp("last_used_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(t) => [
		primaryKey({ columns: [t.guideId, t.sessionId] }),
		index("edit_sessions_last_used_idx").on(t.lastUsedAt),
	],
);

export const authAttempts = pgTable("auth_attempts", {
	ip: text("ip").notNull(),
	guideId: varchar("guide_id", { length: 14 }).notNull(),
	attemptedAt: timestamp("attempted_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

export const apiAttempts = pgTable(
	"api_attempts",
	{
		ip: text("ip").notNull(),
		action: varchar("action", { length: 32 }).notNull(),
		guideId: varchar("guide_id", { length: 14 }),
		attemptedAt: timestamp("attempted_at", { withTimezone: true })
			.notNull()
			.defaultNow(),
	},
	(t) => [
		index("api_attempts_ip_action_idx").on(t.ip, t.action, t.attemptedAt),
		index("api_attempts_guide_idx").on(t.guideId, t.attemptedAt),
	],
);
