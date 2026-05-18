.PHONY: format lint lint\:fix

format:
	bun run format

lint:
	bun run lint

lint\:fix:
	bun run lint:fix
