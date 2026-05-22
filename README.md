# OnlyExiles

Welcome, exile.

OnlyExiles is a Path of Exile 2 campaign planner for people who would rather spend their brain damage on the run, not on remembering which chest gives you a Greater Jewelers Orb.

Pick what matters for your build, skip the bait, add your notes, then share the plan with some other poe2 enjoyers.

Live site: [www.onlyexiles.com](https://www.onlyexiles.com)

Ads are unethical, and only scum use paywalls. If this planner helps keep your brain smooth, you can [buy me a coffee](https://www.buymeacoffee.com/jesseswan). It means I spend more time on OnlyExiles and less time on other projects smh.

## Fix Bad Data

PoE data changes, I make mistakes, and don't play the game enough to notice all the time. If an act drop, quest reward, area note, or route detail is wrong, send help:

- [Raise an issue](https://github.com/kasekun/poe2drops/issues/new) if you just want to report the problem.
- [Edit the campaign data and raise a PR](https://github.com/kasekun/poe2drops/edit/main/app/data/campaign.ts) if you know the fix and want to save everyone a round trip.

Tiny corrections are welcome. Act, area, reward, and source are the good stuff. "This is wrong lol" is funny but cursed.

## Run It Locally

Install the bits:

```bash
bun install
```

Start the dev server:

```bash
bun run dev
```

Build it like Vercel will:

```bash
bun run build
bun run preview
```

## Checks

Run the lightweight Nuxt check:

```bash
bun run check
```
