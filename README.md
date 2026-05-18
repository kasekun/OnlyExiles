# Poe2Drops

First deployable Nuxt slice for the Poe2Drops planner.

## Local Development

Install dependencies:

```bash
bun install
```

Start the development server:

```bash
bun run dev
```

Build and preview the production output:

```bash
bun run build
bun run preview
```

## Checks

Husky runs the lightweight Nuxt preparation check before commits:

```bash
bun run check
```

## Vercel

Import the repository into Vercel and use the detected Nuxt framework settings. If Vercel does not infer Bun automatically, set the install command to `bun install` and the build command to `bun run build`.
