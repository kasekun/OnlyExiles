CREATE TABLE "api_attempts" (
	"ip" text NOT NULL,
	"action" varchar(32) NOT NULL,
	"guide_id" varchar(14),
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_attempts" (
	"ip" text NOT NULL,
	"guide_id" varchar(14) NOT NULL,
	"attempted_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "edit_sessions" (
	"guide_id" varchar(14) NOT NULL,
	"session_id" varchar(14) NOT NULL,
	"secret_hash" varchar(72) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_used_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "edit_sessions_guide_id_session_id_pk" PRIMARY KEY("guide_id","session_id")
);
--> statement-breakpoint
CREATE TABLE "guides" (
	"id" varchar(14) PRIMARY KEY NOT NULL,
	"passphrase_hash" varchar(72) NOT NULL,
	"name" varchar(255) DEFAULT 'Untitled guide' NOT NULL,
	"version" varchar(50) NOT NULL,
	"state" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_viewed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "api_attempts_ip_action_idx" ON "api_attempts" USING btree ("ip","action","attempted_at");--> statement-breakpoint
CREATE INDEX "api_attempts_guide_idx" ON "api_attempts" USING btree ("guide_id","attempted_at");--> statement-breakpoint
CREATE INDEX "edit_sessions_last_used_idx" ON "edit_sessions" USING btree ("last_used_at");--> statement-breakpoint
CREATE INDEX "guides_last_viewed_idx" ON "guides" USING btree ("last_viewed_at");--> statement-breakpoint
CREATE INDEX "guides_version_idx" ON "guides" USING btree ("version");