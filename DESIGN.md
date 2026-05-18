---
name: PoE2 Campaign Planner
description: Interactive campaign routing tool for Path of Exile 2.
colors:
  bg: "oklch(11.5% 0.008 55)"
  bg-surface: "oklch(15.5% 0.008 55)"
  bg-inset: "oklch(13% 0.007 55)"
  bg-layer-act: "oklch(15% 0.018 62)"
  bg-layer-area: "oklch(18.5% 0.010 58)"
  border: "oklch(26% 0.008 55)"
  border-subtle: "oklch(20% 0.007 55)"
  text-primary: "oklch(88% 0.008 75)"
  text-secondary: "oklch(66% 0.008 70)"
  text-muted: "oklch(44% 0.006 60)"
  text-skip: "oklch(33% 0.004 55)"
  ember-gold: "oklch(76% 0.158 65)"
  ember-gold-dim: "oklch(54% 0.100 65)"
  signal-green: "oklch(70% 0.130 148)"
  signal-blue: "oklch(70% 0.110 258)"
  error-red: "oklch(64% 0.200 25)"
typography:
  headline:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "1.1875rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  title:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "-0.01em"
  body:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: "0.09em"
  mono:
    fontFamily: "'SF Mono', 'Fira Code', 'Fira Mono', ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "3px"
  md: "4px"
  lg: "5px"
spacing:
  sp-1: "4px"
  sp-2: "8px"
  sp-3: "12px"
  sp-4: "16px"
  sp-6: "24px"
components:
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "0.28rem 0.6rem"
  button-ghost-hover:
    backgroundColor: "transparent"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.md}"
    padding: "0.28rem 0.6rem"
  button-ghost-danger:
    backgroundColor: "transparent"
    textColor: "{colors.error-red}"
    rounded: "{rounded.md}"
    padding: "0.28rem 0.6rem"
  button-act:
    backgroundColor: "transparent"
    textColor: "{colors.ember-gold-dim}"
    rounded: "{rounded.sm}"
    padding: "0.2rem 0.48rem"
  button-act-hover:
    backgroundColor: "oklch(76% 0.158 65 / 0.10)"
    textColor: "{colors.ember-gold}"
    rounded: "{rounded.sm}"
    padding: "0.2rem 0.48rem"
---

# Design System: PoE2 Campaign Planner

## 1. Overview

**Creative North Star: "The Cartographer's Companion"**

This is a dense field guide rendered on-screen — the kind of annotated map a veteran player would hand you before a run, confident and warm without being flashy. Every interface decision starts from that image: trusted, legible, purposeful. The surface is as dark as charcoal paper, the accent is the color of a lantern through a tent wall. Information fills the space because the journey is complex, not because the interface failed to edit itself.

The system is restrained by design. One accent — Ember Gold — does all the emotional lifting: act headers, interactive affordances, level badges, hover states. Everything else is a discipline of near-blacks and warm grays that recede behind the content. Secondary semantic colors (Signal Green, Signal Blue) exist only in pickup-type badges; they never bleed into layout. The result is a UI where the content is the color, and the chrome is close to invisible.

What this system explicitly rejects: atmospheric overload (textured fantasy backgrounds, glow halos, particle effects — the game handles its own atmosphere), generic SaaS patterns (white backgrounds, gradient cards, metric dashboards), the MediaWiki wall-of-text aesthetic, and the mid-gray Discord-clone dark theme. Being dense is a commitment; being dark does not mean being purple.

**Key Characteristics:**
- Tonal layering, not shadows — depth through OKLCH lightness steps, no box-shadows
- One accent, used sparingly — Ember Gold on act headers, badges, and interactive elements only
- Major second type scale (~1.125 ratio) — compact without feeling small
- 4pt base spacing — disciplined rhythm, not generous whitespace
- System font stack — no web font loading, no latency, no FOIT
- All colors in OKLCH with warm-brown hue bias (h≈55–75); neutrals are never truly gray

## 2. Colors: The Ember Palette

A single warm-brown bias runs through every neutral. Even at the darkest end (`bg`, 11.5% lightness) the hue sits at h≈55 with minimal chroma — enough to feel intentional, not enough to read as "brown". The palette earns its warmth from the Ember Gold accent, which saturates the equation.

### Primary

- **Ember Gold** (`oklch(76% 0.158 65)`): The single accent. Act section headers, interactive button labels, the level badge, hover reveals, active skip-button state. Never used as a background fill at full opacity. Its rarity is the point.
- **Ember Gold (dim)** (`oklch(54% 0.100 65)`): The at-rest version of Ember Gold — used for borders on amber-context elements and as the default label color on act-level buttons. Steps up to full Ember Gold on hover.

### Secondary

- **Signal Green** (`oklch(70% 0.130 148)`): Quest-reward badge text. Background is `oklch(21% 0.042 148)`, border is `oklch(33% 0.070 148)`. Used only in pickup-type badges; never in layout, never in copy.
- **Signal Blue** (`oklch(70% 0.110 258)`): Passive-reward badge text. Background/border follow the same tonal pattern as Signal Green. Used only in badges.

### Tertiary

- **Error Red** (`oklch(64% 0.200 25)`): Destructive hover only — appears on the border and text of "Reset" or delete actions on hover. Never shown at rest; the UI does not telegraph danger until the user approaches it.

### Neutral

- **Base Canvas** (`oklch(11.5% 0.008 55)`, `--bg`): The page background. The lowest point in the tonal stack.
- **Inset Background** (`oklch(13% 0.007 55)`, `--bg-inset`): Recessed surfaces — the body of an act section that contains its areas.
- **Surface** (`oklch(15.5% 0.008 55)`, `--bg-surface`): The standard card/area surface.
- **Act Layer** (`oklch(15% 0.018 62)`, `--bg-layer-act`): Act header row — slightly more chroma than Surface, shifts the hue toward the Ember spectrum.
- **Area Layer** (`oklch(18.5% 0.010 58)`, `--bg-layer-area`): Area header row — lighter and slightly warmer than Surface.
- **Table Header** (`oklch(17.5% 0.009 56)`, `--bg-th`): Column header rows in pickup tables.
- **Row Odd / Row Even** (`oklch(14% 0.007 55)` / `oklch(12.5% 0.006 55)`): Alternating table rows — the contrast is intentionally minimal (1.5% lightness step), enough to register stripe rhythm without competing with text.
- **Border** (`oklch(26% 0.008 55)`, `--border`): Standard separator — act-section borders, table header bottom, input rings.
- **Border Subtle** (`oklch(20% 0.007 55)`, `--border-subtle`): Lighter separator — between table rows, area section outlines.
- **Text Primary** (`oklch(88% 0.008 75)`, `--text`): Body copy, item names, area labels. Warm-shifted — hue at 75 rather than 55 to read slightly warmer than the background stack.
- **Text Secondary** (`oklch(66% 0.008 70)`, `--text-2`): Source lines in pickup rows, supporting labels.
- **Text Muted** (`oklch(44% 0.006 60)`, `--text-muted`): Column headers, placeholder text, default button labels.
- **Text Skip** (`oklch(33% 0.004 55)`, `--text-skip`): Skipped-state items — struck through and dimmed to near-disappearance. Lowest chroma in the stack.

### Named Rules

**The One Accent Rule.** Ember Gold is the only accent. Signal Green and Signal Blue are semantic only, confined to pickup-type badges. Never add a second decorative accent. If Ember Gold does not solve it, solve it with lightness contrast instead.

**The Warm Neutral Rule.** Every neutral — including the darkest background — carries hue h≈55 with chroma ≥0.004. Pure grays (`#888`, `oklch(50% 0 0)`) are prohibited. The warmth should be felt, not named.

## 3. Typography

**Body/UI Font:** System-UI stack (`system-ui, -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif`)
**Mono Font:** `'SF Mono', 'Fira Code', 'Fira Mono', ui-monospace, monospace`

**Character:** A humanist system-font stack chosen for zero loading cost and maximum legibility at dense information density. No display font — the page has no headline to play with, only structured data to clarify. Mono appears in regex code-boxes and level badges, grounding anything numeric or copyable in a fixed frame.

The scale is tuned at 93.75% root (`html { font-size: 93.75% }` = 15px) with a major-second ratio (~1.125), producing a tight range from 11px to 19px. The narrowness is intentional: this is a planning tool, not a reading experience.

### Hierarchy

- **Headline** (700, 1.1875rem/19px, lh 1.3, ls -0.01em): Page title only. Rendered in Ember Gold. Appears once per view.
- **Title** (700, 1.0625rem/17px, lh 1.4, ls -0.01em): Act section headers. Also in Ember Gold. The most prominent typographic element per section.
- **Body** (400, 0.9375rem/15px, lh 1.6): Primary data — area names (600 weight), pickup item names, notes textarea, act-level note text.
- **Secondary** (400, 0.8125rem/13px, lh 1.6, color text-secondary): Source attribution lines in pickup rows, button labels, act-button labels.
- **Label** (700, 0.6875rem/11px, lh 1.4, ls 0.09em, uppercase): Column headers in pickup tables, section eyebrows (`NOTES`, `PICKUPS`, `LEVEL`). The only uppercase in the system.
- **Mono** (400, 0.8125rem/13px, lh 1.6): Level badge numerals, regex code-boxes, any copyable technical string.

### Named Rules

**The Amber Type Rule.** Ember Gold appears on type only at the Headline and Title levels (act headers, page title). Body copy in amber is prohibited — it would dilute the accent's signal. If an item needs to be highlighted, use a badge rather than coloring the text.

**The No-Display Rule.** There is no display or hero font. The first typographic element the eye lands on is an act header — 17px, 700 weight, amber. That is the maximum. Nothing should feel editorial or expressive.

## 4. Elevation

This system is entirely flat. There are no `box-shadow` declarations anywhere. Depth is conveyed exclusively through tonal layering — OKLCH lightness steps that stack from the base canvas upward:

`bg (11.5%) → bg-inset (13%) → bg-row-even (12.5%) → bg-row-odd (14%) → bg-surface (15.5%) → bg-layer-act (15%) → bg-layer-area (18.5%) → bg-th (17.5%)`

Borders provide structural separation. The visual model is a physical stack of translucent films — each layer reads as above the one below because it is lighter, not because it casts a shadow.

**The Shadow-Free Rule.** No `box-shadow`. No `drop-shadow`. No `filter: blur()` used decoratively. If a new component needs to feel "above" the surface, raise its OKLCH lightness by 2–4% and add `border: 1px solid {colors.border}`. That is the only permitted elevation gesture.

## 5. Components

### Buttons

The system has two button families — header chrome buttons and act-level contextual buttons — plus one icon-button variant (skip toggle). All are quiet at rest and reveal warmth on hover.

**Header Chrome Buttons** (the global "Reset", "Copy Markdown" buttons):
- **Shape:** Gently rounded (4px radius)
- **At rest:** Transparent background, 1px `border-subtle` border, `text-muted` label (0.8125rem, 13px)
- **Hover:** Border steps up to `border`, text steps up to `text-secondary`. No fill change; no amber reveal. Color change only, transition 130ms.
- **Danger variant (hover only):** Border steps to `error-red`, text steps to `error-red`. Danger is never visible at rest.

**Act-Level Contextual Buttons** (collapse, "Add note", per-act actions in the act header):
- **Shape:** Tightly rounded (3px radius)
- **At rest:** Transparent background, 1px `ember-gold-dim` border (25% opacity), `ember-gold-dim` label (0.6875rem, 11px)
- **Hover:** Border steps to `ember-gold-dim` (full), label steps to `ember-gold`, background fills with `ember-gold` tint (10% opacity). Transition 130ms.

**Skip Toggle** (icon button in pickup table rows):
- **Shape:** 3px radius, 22×22px
- **At rest:** Transparent, 1px `border-subtle` border, strikethrough icon at near-invisible opacity
- **Hover:** Border steps to `ember-gold-dim`, icon swaps to X at `ember-gold-dim`. No fill.
- **Skipped state:** X icon shown at `ember-gold-dim`; row text gets `text-skip` color and line-through decoration.

### Chips / Badges

Pickup-type indicators. Inline, non-interactive.

- **Style:** 3px radius, small (0.6875rem/11px, 700 weight, uppercase, ls 0.02em), background tint at 10–20% opacity of the signal color, 1px border at 25% opacity.
- **Amber badge** (e.g. "level" recommendation): background `oklch(76% 0.158 65 / 0.10)`, border `oklch(54% 0.100 65 / 0.25)`, text `ember-gold-dim`. Font: mono.
- **Green badge** (quest reward): background `oklch(21% 0.042 148)`, border `oklch(33% 0.070 148)`, text `signal-green`.
- **Blue badge** (passive): background `oklch(20% 0.048 258)`, border `oklch(30% 0.072 258)`, text `signal-blue`.

Badges are the only place Signal Green and Signal Blue appear. Do not use these colors elsewhere.

### Cards / Containers

The system uses nested section containers, not cards. Structure is: act-section > area-section > pickup table. Never add a card grid or card-as-component. The only valid card-like unit is an area section.

- **Act Section:** Full-width, 5px radius, 1px `border` border. Header background `bg-layer-act`. Body background `bg-inset` (slightly recessed).
- **Area Section:** Full-width, 4px radius, 1px `border-subtle` border. Header background `bg-layer-area`. Body background `bg-surface`.
- **No cards within sections.** If content needs grouping inside an area, use a labeled block with an eyebrow label, not a nested container.

### Inputs / Fields

- **Notes textarea:** Full-width, no resize handle (auto-grow via JS), background `bg-inset`, 1px `border-subtle` border, 3px radius. Focus: border steps to `border`. No glow, no fill change. Placeholder text in `text-muted` + italic + 50% opacity.
- **Level number input:** Inline, minimal — effectively a number field inside the level badge. Mono font, amber palette.
- **Regex code-box:** `bg-inset` background, mono font, `border-subtle` border, easy-copy button adjacent. Should feel like a terminal snippet, not a form field.

### Pickup Table (Signature Component)

The central data surface. A standard HTML table with fixed layout, alternating row tints, and a compact type scale.

- **Column structure:** Skip toggle (2.2rem) | Item name + source (38%) | Type badge (76px) | remaining columns for source, notes, etc.
- **Header row:** `bg-th` background, `text-muted` label-size uppercase headers, 1px `border` bottom separator.
- **Row alternation:** Odd rows at `bg-row-odd` (14%), even at `bg-row-even` (12.5%). The stripe contrast is subtle — 1.5% lightness difference. The rhythm matters; the contrast should not.
- **Skipped rows:** All text in `text-skip`, `text-decoration: line-through`. The row does not disappear; it dims. The skip-button X icon confirms state.

### Collapsible Sections

Act and area sections both collapse via a chevron toggle. Behavior:
- Chevron rotates −90° when collapsed. Transition: 180ms `cubic-bezier(0.4, 0, 0.2, 1)`.
- Content hides via `display: none` on `.collapsed` — no height animation (avoids layout animation cost).
- Act-level contextual buttons hide when the act is collapsed.
- `prefers-reduced-motion`: chevron transition and other transitions should be `0ms` when the media query matches.

## 6. Do's and Don'ts

### Do:
- **Do** use OKLCH for all color declarations. The project is OKLCH-first; every neutral carries h≈55 and chroma ≥0.004.
- **Do** confine Ember Gold to act headers (as text/icon color), level badges, and interactive hover reveals. If a new element needs color, reach for a badge rather than amber copy.
- **Do** use tonal layering for depth — raise lightness by 2–4% and add a 1px border. Never add `box-shadow`.
- **Do** keep the type scale tight. The five steps (11px → 13px → 15px → 17px → 19px) cover every case. Adding a new size is prohibited.
- **Do** use the Label style (0.6875rem, 700, uppercase, ls 0.09em) for all section eyebrows and table column headers. It is the only uppercase text in the system.
- **Do** treat Signal Green and Signal Blue as badge-only semantic tokens. They exist to differentiate pickup types, nothing else.
- **Do** ensure all interactive elements (skip buttons, collapse toggles, drag handles) have visible `:focus-visible` treatment — a 1px amber-dim outline offset by 2px is sufficient.
- **Do** respect `prefers-reduced-motion` — set all transition durations to `0ms` when the media query matches.

### Don't:
- **Don't** add atmospheric overload: no textured backgrounds, glow halos around icons, ambient particle effects, or any visual that competes with the game's own atmosphere. The game handles atmosphere; the tool steps back.
- **Don't** use generic SaaS patterns: no white or light-mode backgrounds, no gradient cards, no metric dashboards, no floating action buttons, no hero sections. This is not a startup landing page.
- **Don't** create a wiki dump: no unstructured walls of text, no MediaWiki-style link density, no tables without typographic hierarchy. Structure earns density.
- **Don't** use a Discord-clone dark theme: no mid-gray surfaces (`oklch(30-40% 0 0)`), no saturated purple or blue accent colors, no server-panel layout metaphors.
- **Don't** use gradient text (`background-clip: text`). Emphasis is weight or size. Color for emphasis means amber text at most; gradient text is decoration without meaning.
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on cards, alerts, or list items. Use a full border, a background tint, or nothing.
- **Don't** add a second decorative accent color. Ember Gold is singular. If a new element tempts a second accent, you are looking at a badge problem, not a color problem.
- **Don't** add shadows. The design tests clean if no `box-shadow` keyword appears anywhere in the stylesheet.
- **Don't** use Pure grays. `oklch(50% 0 0)` and `#888888` are prohibited. Minimum chroma is 0.004 on all neutrals.
- **Don't** animate layout properties (`height`, `width`, `top`, `left`, `padding`). Collapse is `display: none`; transitions use `opacity` and `transform` only.
