.PHONY: check format lint lint\:fix biome\:check typecheck

# Full pre-commit pass:
#   1. canonicalize  — rename deprecated v3 class aliases to v4 equivalents
#   2. format:classes — prettier-plugin-tailwindcss sorts class order
#   3. biome:check   — format + lint + organizeImports (runs last, wins on formatting)
check:
	bun run canonicalize
	bun run format:classes
	bun run biome:check

format:
	bun run format

lint:
	bun run lint

lint\:fix:
	bun run lint:fix

# Runs biome format + lint + organizeImports in one pass.
biome\:check:
	bun run biome:check

typecheck:
	bun run typecheck
