<script setup lang="ts">
import { SquareArrowOutUpRight } from "lucide-vue-next";

const REPO = "https://github.com/kasekun/poe2drops";
</script>

<template>
  <div class="float-group">
    <!-- Utility links: quiet pair, grouped tightly together -->
    <div class="float-links">
      <a
        :href="`${REPO}/issues/new`"
        target="_blank"
        rel="noreferrer noopener"
        class="float-link"
      >
        See an error? Raise an issue
        <SquareArrowOutUpRight :size="11" aria-hidden="true" />
      </a>

      <a
        :href="`${REPO}/edit/main/app/data/campaign.ts`"
        target="_blank"
        rel="noreferrer noopener"
        class="float-link"
      >
        Fix an error, raise a PR
        <SquareArrowOutUpRight :size="11" aria-hidden="true" />
      </a>
    </div>

    <!-- BMC: the warmer, more prominent anchor of the group -->
    <a
      href="https://www.buymeacoffee.com/jesseswan"
      target="_blank"
      rel="noreferrer noopener"
      class="float-bmc"
      aria-label="Buy me a coffee — support this project"
    >
      <img
        src="/bmc-logo.svg"
        class="bmc-icon"
        width="24"
        height="24"
        alt=""
        aria-hidden="true"
      />
      Buy me a coffee
      <SquareArrowOutUpRight :size="11" class="bmc-ext" aria-hidden="true" />
    </a>
  </div>
</template>

<style scoped>
.float-group {
  position: fixed;
  bottom: 1.25rem;
  right: 1.25rem;
  z-index: 40;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.625rem;
}

.float-links {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

/* ── Utility links ───────────────────────── */
.float-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  height: 1.75rem;
  padding: 0 0.6rem;
  background: var(--planner-bg-surface);
  color: var(--planner-text-muted);
  font-size: var(--planner-fs-xs);
  font-family: var(--planner-font);
  font-weight: 400;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  border: 1px solid var(--planner-border-subtle);
  border-radius: 0.5rem;
  transition: border-color 0.13s, color 0.13s;
}
.float-link:hover {
  border-color: var(--planner-border);
  color: var(--planner-text-2);
}
.float-link:focus-visible {
  outline: 1px solid var(--planner-amber-dim);
  outline-offset: 3px;
}

/* ── BMC button ──────────────────────────── */
.float-bmc {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  height: 2rem;
  padding: 0 0.625rem 0 0.375rem;
  background: var(--planner-bg-area-hd);
  color: var(--planner-text-2);
  font-size: var(--planner-fs-xs);
  font-family: var(--planner-font);
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  text-decoration: none;
  border: 1px solid var(--planner-border);
  border-radius: 0.5rem;
  transition: border-color 0.13s, color 0.13s;
}
.float-bmc:hover {
  border-color: var(--planner-amber-dim);
  color: var(--planner-text);
}
.float-bmc:focus-visible {
  outline: 1px solid var(--planner-amber-dim);
  outline-offset: 3px;
}

.bmc-icon {
  height: 1.5rem;
  width: 1.5rem;
  border-radius: 4px;
  flex-shrink: 0;
  display: block;
  background: #ffdd00;
  padding: 2px;
  object-fit: contain;
}

.bmc-ext {
  color: var(--planner-text-muted);
  flex-shrink: 0;
}

/* ── Responsive ──────────────────────────── */
@media (max-width: 640px) {
  .float-group {
    bottom: 1rem;
    right: 1rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .float-link,
  .float-bmc {
    transition: none;
  }
}
</style>
