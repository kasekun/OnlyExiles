# Runbook

## Drizzle Database Commands

Drizzle reads the target database from `POSTGRES_URL` in `drizzle.config.ts`.
Always choose the env file intentionally before running `generate`, `migrate`, or `push`.

### Local Database (`.env.local`)

Use these commands for local development and resettable test databases.

```bash
POSTGRES_URL="$(bun --env-file=.env.local -e 'process.stdout.write(process.env.POSTGRES_URL ?? "")')" bun x drizzle-kit generate --config drizzle.config.ts
POSTGRES_URL="$(bun --env-file=.env.local -e 'process.stdout.write(process.env.POSTGRES_URL ?? "")')" bun x drizzle-kit migrate --config drizzle.config.ts
POSTGRES_URL="$(bun --env-file=.env.local -e 'process.stdout.write(process.env.POSTGRES_URL ?? "")')" bun x drizzle-kit push --config drizzle.config.ts
```

Use `push` when you want Drizzle to apply the current schema directly to a throwaway or freshly reset local DB.

Use `generate` followed by `migrate` when you are creating migration files that should be reviewed and later applied consistently.

### Production Database (`.env.production`)

Use production commands only when you intend to modify the production database.
Double-check that `.env.production` points at the correct production `POSTGRES_URL`.

```bash
POSTGRES_URL="$(bun --env-file=.env.production -e 'process.stdout.write(process.env.POSTGRES_URL ?? "")')" bun x drizzle-kit generate --config drizzle.config.ts
POSTGRES_URL="$(bun --env-file=.env.production -e 'process.stdout.write(process.env.POSTGRES_URL ?? "")')" bun x drizzle-kit migrate --config drizzle.config.ts
```

Avoid `push` against production unless you have explicitly decided to bypass migration files. Prefer generated, reviewed migrations for production changes.

If you need to inspect what would change, review the generated migration SQL before running `migrate`.

## Avoiding Common Drizzle Errors

Do not mix migration history between databases. `migrate` relies on the migration files and the database's recorded migration state. If those disagree, Drizzle may fail or attempt unexpected changes.

Common mismatch cases:

- `POST /api/guides` fails with a query like `delete from "api_attempts"` because the target DB is empty or missing the guide tables.
- You cleared or recreated the local database, then ran `migrate` against old migration history assumptions.
- You ran `push` locally, then later tried to test old migration files against that same database.
- You generated migrations while pointed at one database, then tried to validate them against a different database shape.
- You accidentally used `.env.production` when intending `.env.local`, or the reverse.

Recommended local reset flow:

```bash
# 1. Recreate or clear the local database.
# 2. Apply the current schema directly.
POSTGRES_URL="$(bun --env-file=.env.local -e 'process.stdout.write(process.env.POSTGRES_URL ?? "")')" bun x drizzle-kit push --config drizzle.config.ts

# 3. Start the app with the same env file.
bun run dev -- --dotenv .env.local
```

Recommended migration test flow:

```bash
# 1. Start from a database whose schema matches the last applied migration.
# 2. Generate a new migration from code changes.
POSTGRES_URL="$(bun --env-file=.env.local -e 'process.stdout.write(process.env.POSTGRES_URL ?? "")')" bun x drizzle-kit generate --config drizzle.config.ts

# 3. Apply it to that same local database.
POSTGRES_URL="$(bun --env-file=.env.local -e 'process.stdout.write(process.env.POSTGRES_URL ?? "")')" bun x drizzle-kit migrate --config drizzle.config.ts
```

If the local DB was wiped and you only need to keep developing, prefer `push` to recreate the current schema. If you need to prove migrations work from scratch, recreate the DB and run the full migration set in order instead of mixing `push` and `migrate` on the same test run.

Before any production command, confirm the target:

```bash
bun --env-file=.env.production -e 'console.log(process.env.POSTGRES_URL)'
```

Never commit `.env.local` or `.env.production`; both are ignored by `.gitignore`.

## Checking Migration State

Before generating a migration, confirm that the target database is at the migration state you think it is. Drizzle records applied migrations in its migrations table, and the migration files live in `server/db/migrations`.

First, check which database the command will target:

```bash
bun --env-file=.env.local -e 'console.log(process.env.POSTGRES_URL)'
```

Then inspect the applied Drizzle migrations in that database. The table is usually `drizzle.__drizzle_migrations`:

```bash
bun --env-file=.env.local -e '
import postgres from "postgres";
const sql = postgres(process.env.POSTGRES_URL);
const rows = await sql`
  select hash, created_at
  from drizzle.__drizzle_migrations
  order by created_at
`;
console.table(rows);
await sql.end();
'
```

Compare that output with the migration files in `server/db/migrations`. The database is a good target for `generate` or `migrate` when:

- The target URL is the database you intended.
- The applied migration list is not missing migrations that exist in the repo.
- The database was not manually changed with `push`, SQL edits, or table drops after the last migration was applied.
- A fresh `migrate` run has nothing unexpected left to apply.

If the migrations table does not exist, the database has not been migrated by Drizzle yet. If tables already exist anyway, the database was probably created with `push` or manual SQL and may not be a clean migration-test target.

## Creating a Clean Migration-Test Database

If your local database has drifted and you do not want to untangle the conflict, create a new empty database and apply the migrations from scratch.

1. Create a new database in your local Postgres or Neon branch, for example `poe2drops_migration_test`.
2. Update `.env.local` so `POSTGRES_URL` points to the new empty database.
3. Confirm the target:

```bash
bun --env-file=.env.local -e 'console.log(process.env.POSTGRES_URL)'
```

4. Apply all existing migrations:

```bash
POSTGRES_URL="$(bun --env-file=.env.local -e 'process.stdout.write(process.env.POSTGRES_URL ?? "")')" bun x drizzle-kit migrate --config drizzle.config.ts
```

5. Start the app against that same database:

```bash
bun run dev -- --dotenv .env.local
```

Use this clean database when validating a new migration from a known baseline. Use `push` only when you want the current schema quickly and do not care about testing migration history.
