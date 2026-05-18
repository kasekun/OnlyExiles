# PoE2 Campaign Planner - High-Level Specification

## 1. Overview
The PoE2 Campaign Planner is an interactive, web-based utility designed to help Path of Exile 2 players plan and optimize their campaign routing and reward pickups. It transforms a static reference list of Acts, Areas, and Rewards into a flexible, customizable, and shareable tool.

## 2. Core Objectives
- Allow players to customize their campaign route by rearranging, hiding, or skipping specific zones and rewards.
- Provide quick-apply templates for common playstyles (e.g., "Essentials Only", "Speedrun").
- Enable easy sharing of custom routes via unique URLs.
- Provide a clean, copy-pasteable export format (Markdown) for use in external tools or notes.
- Maintain a fast, highly interactive, and visually polished user experience.

## 3. Technology Stack
- **Framework:** Nuxt.js (Vue 3)
  - *Rationale:* Provides a robust Single Page Application (SPA) experience with built-in server routes (API) and Server-Side Rendering (SSR) for instant loading of shared links and rich social media previews.
- **Styling & UI:** Tailwind CSS + Shadcn-vue
  - *Rationale:* Ensures a modern, accessible, and easily customizable component library.
- **Database:** Neon (Serverless Postgres)
  - *Rationale:* Perfectly suited for serverless deployments, handling connection pooling natively while remaining cost-effective.
- **Deployment:** Vercel
  - *Rationale:* Seamless integration with Nuxt, providing edge network delivery and serverless function hosting.
- **Tooling:** Bun, BiomeJS, Husky
  - *Rationale:* Ensures a fast development environment with strict, modern linting and formatting.
- **Analytics:** Plausible Analytics (Obfuscated)
  - *Rationale:* Privacy-friendly analytics, heavily obfuscated via Vercel rewrites and custom naming to bypass standard adblockers.

## 4. Key Features & Requirements

### 4.1. Interactive Route Customization
- **Zone Management:** Users can rearrange the order of zones to reflect their specific routing.
- **Visibility Toggles:** Users can hide zones entirely, specifically those where all pickups have been skipped or where no pickups exist.
- **Reward Management:** Individual pickups within a zone can be marked as "skipped" (visually struck through).
- **Notes & Annotations:**
  - Editable "ideal character level" per zone.
  - Custom text notes per zone.
  - An Act-level note section, specifically supporting a code-box for easy copying of regex strings (e.g., for loot filters).

### 4.2. Quick-Apply Templates
- Users can apply pre-configured states to instantly modify the route.
- Examples include: "I want everything" (reset to default), "Give me the essentials" (skips minor currency/lore), "I want to go fast" (bare minimum required for progression).

### 4.3. Export & Sharing
- **Markdown Export:** Users can export their current configuration as a formatted Markdown document. Pickups marked as "skipped" will be excluded from this export.
- **Save & Share:** 
  - Users can generate a unique, shareable link (format: `www.domain.com/guide/GD<12char>`).
  - **Immutability:** When a user views an existing shared link and makes edits, clicking "Save" will generate a *new* unique link rather than overwriting the original.

### 4.4. Monetization & Community
- Integration of a "Buy me a coffee" button.
- Integration of a "Link to GitHub" button, alongside a specific call-to-action: "See an error? Raise an issue on GitHub."

## 5. High-Level Architecture

### 5.1. Data State (Frontend)
The application will rely on a robust reactive state (e.g., via Pinia) that holds the base template of Acts/Areas/Pickups, overlaid with the user's current customizations (order, visibility, skipped status, notes).

### 5.2. Storage Model (Backend)
Given the highly nested and flexible nature of the user configurations, the database schema will be intentionally simple, relying on JSONB storage.

**Proposed Schema (Neon Postgres):**
- `id` (VARCHAR): The unique 12-character identifier (e.g., 'GD123456789012').
- `config` (JSONB): The serialized representation of the user's custom state.
- `created_at` (TIMESTAMP): Standard creation timestamp.

### 5.3. Analytics Implementation
To ensure analytics capture despite adblockers, the implementation will use first-party proxying:
- **Vercel Rewrites:** Traffic will be routed through the primary domain (e.g., `/koguma.js` rewriting to the Plausible script, and `/koguma` rewriting to the Plausible event API).
- **Build-Time Injection:** The tracking script will be injected dynamically, avoiding standard recognizable filenames or endpoints in the source code.