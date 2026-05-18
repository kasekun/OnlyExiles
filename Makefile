.PHONY: format lint lint\:fix typecheck

format:
	bun run format

lint:
	bun run lint

lint\:fix:
	bun run lint:fix

typecheck:
	bun run typecheck
