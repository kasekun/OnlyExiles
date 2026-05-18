<script setup lang="ts">
import { computed } from "vue";
import type { Area } from "~/data/campaign";
import { usePlannerState, pickKey } from "~/composables/usePlannerState";

const props = defineProps<{
	actId: string;
	area: Area;
}>();

const { state } = usePlannerState();

function toggleSkip(key: string) {
	state.skipped[key] = !state.skipped[key];
}

function isSkipped(key: string): boolean {
	return !!state.skipped[key];
}
</script>

<template>
  <p v-if="area.pickups.length === 0" class="no-pickups">No rewards in this zone.</p>
  <table v-else class="pickup-table">
    <colgroup>
      <col class="c-skip" />
      <col class="c-item" />
      <col class="c-type" />
      <col />
    </colgroup>
    <thead>
      <tr>
        <th class="th-skip"></th>
        <th>Item</th>
        <th>Type</th>
        <th>Source</th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(pickup, i) in area.pickups"
        :key="i"
        class="pickup-row"
        :class="{ skipped: isSkipped(pickKey(actId, area.id, i)) }"
      >
        <td class="td-skip">
          <button
            class="skip-btn"
            :aria-pressed="isSkipped(pickKey(actId, area.id, i))"
            :aria-label="isSkipped(pickKey(actId, area.id, i)) ? 'Unmark skipped' : 'Mark as skipped'"
            @click="toggleSkip(pickKey(actId, area.id, i))"
          >
            <!-- Strikethrough icon (at rest) -->
            <svg class="icon-strike" width="11" height="10" viewBox="0 0 11 10" fill="none"
              stroke="currentColor" stroke-linecap="round" aria-hidden="true">
              <line x1="1.5" y1="2.5" x2="9.5" y2="2.5" stroke-width="1.4"/>
              <line x1="1.5" y1="7.5" x2="9.5" y2="7.5" stroke-width="1.4"/>
              <line x1="0"   y1="5"   x2="11"  y2="5"   stroke-width="2"/>
            </svg>
            <!-- X icon (on hover / when skipped) -->
            <svg class="icon-x" width="10" height="10" viewBox="0 0 10 10" fill="none"
              stroke="currentColor" stroke-linecap="round" aria-hidden="true">
              <line x1="2" y1="2" x2="8" y2="8" stroke-width="1.8"/>
              <line x1="8" y1="2" x2="2" y2="8" stroke-width="1.8"/>
            </svg>
          </button>
        </td>
        <td>
          <span class="pickup-item">{{ pickup.item }}</span>
        </td>
        <td>
          <span v-if="pickup.type === 'Drop'" class="badge badge-drop">Drop</span>
          <span v-else-if="pickup.type === 'Hand-In'" class="badge badge-handin">Hand&#8209;In</span>
        </td>
        <td>
          <span class="pickup-source">{{ pickup.source }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.no-pickups {
  font-size: var(--planner-fs-sm);
  color: var(--planner-text-muted);
  font-style: italic;
  padding: 0.25rem 0;
}

/* ── Table layout ───────────────────────── */
.pickup-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--planner-fs-base);
  table-layout: fixed;
  font-variant-numeric: tabular-nums;
}

col.c-skip { width: 2.2rem; }
col.c-item { width: 38%; }
col.c-type { width: 76px; }

/* ── Header row ─────────────────────────── */
.pickup-table thead th {
  padding: 0.25rem 0.5rem;
  background: var(--planner-bg-th);
  color: var(--planner-text-muted);
  font-size: var(--planner-fs-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  text-align: left;
  border-bottom: 1px solid var(--planner-border);
}
.th-skip { text-align: center; width: 2.2rem; }

/* ── Body rows ──────────────────────────── */
.pickup-table tbody td {
  padding: 0.375rem 0.5rem;
  border-bottom: 1px solid var(--planner-border-subtle);
  vertical-align: middle;
  line-height: 1.45;
}
.pickup-table tbody tr:last-child td { border-bottom: none; }
.pickup-table tbody tr:nth-child(odd)  td { background: var(--planner-bg-row-odd); }
.pickup-table tbody tr:nth-child(even) td { background: var(--planner-bg-row-even); }

.td-skip { text-align: center; }

/* ── Skip button ────────────────────────── */
.skip-btn {
  background: none;
  border: 1px solid var(--planner-border-subtle);
  border-radius: 3px;
  width: 22px;
  height: 22px;
  padding: 0;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: oklch(36% 0.005 55);
  transition: border-color 0.13s, color 0.13s;
  flex-shrink: 0;
}
.skip-btn:hover {
  border-color: var(--planner-amber-dim);
  color: var(--planner-amber-dim);
}
.skip-btn:focus-visible {
  outline: 1px solid var(--planner-amber-dim);
  outline-offset: 2px;
}

/* Icon swap: strike at rest, X on hover / when skipped */
.skip-btn .icon-x      { display: none; }
.skip-btn .icon-strike { display: block; }

.skip-btn:hover .icon-strike,
.pickup-row.skipped .skip-btn .icon-strike { display: none; }

.skip-btn:hover .icon-x,
.pickup-row.skipped .skip-btn .icon-x { display: block; }

/* ── Skip state ─────────────────────────── */
.pickup-row.skipped td .pickup-item,
.pickup-row.skipped td .pickup-source {
  text-decoration: line-through;
  color: var(--planner-text-skip) !important;
}

/* ── Text cells ─────────────────────────── */
.pickup-item {
  color: var(--planner-text);
  display: block;
}

.pickup-source {
  color: var(--planner-text-2);
  font-size: var(--planner-fs-sm);
  display: block;
}

/* ── Badges ─────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.1rem 0.38rem;
  border-radius: 3px;
  font-size: var(--planner-fs-xs);
  font-weight: 600;
  letter-spacing: 0.04em;
  white-space: nowrap;
  border: 1px solid transparent;
}

.badge-drop {
  color: var(--planner-green);
  background: var(--planner-green-bg);
  border-color: var(--planner-green-bd);
}

.badge-handin {
  color: var(--planner-blue);
  background: var(--planner-blue-bg);
  border-color: var(--planner-blue-bd);
}

/* ── Responsive ─────────────────────────── */
@media (max-width: 640px) {
  col.c-item { width: 45%; }
  col.c-type { width: 64px; }
}

@media (prefers-reduced-motion: reduce) {
  .skip-btn { transition: none; }
}
</style>
