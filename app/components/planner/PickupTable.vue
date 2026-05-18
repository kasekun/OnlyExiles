<script setup lang="ts">
import { computed } from "vue";
import { pickKey, usePlannerState } from "~/composables/usePlannerState";
import type { Area } from "~/data/campaign";

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
  <p v-if="area.pickups.length === 0" class="text-p-sm text-p-muted italic py-1">
    No rewards in this zone.
  </p>

  <table v-else class="w-full border-collapse text-p-base table-fixed tabular-nums">
    <colgroup>
      <col style="width: 2.2rem" />
      <col style="width: 38%" />
      <col style="width: 76px" />
      <col />
    </colgroup>

    <tbody>
      <tr
        v-for="(pickup, i) in area.pickups"
        :key="i"
        class="last:[&>td]:border-b-0"
        :class="i % 2 === 0 ? '[&>td]:bg-p-row-even' : '[&>td]:bg-p-row-odd'"
        :data-skipped="isSkipped(pickKey(actId, area.id, i)) || undefined"
      >
        <!-- Skip toggle -->
        <td class="px-2 py-1.5 border-b border-p-subtle align-middle leading-[1.45] text-center">
          <!-- group/skip enables icon swap on hover without JS -->
          <button
            class="group/skip bg-transparent border border-p-subtle rounded-[3px] w-[22px] h-[22px] p-0 cursor-pointer inline-flex items-center justify-center text-[oklch(36%_0.005_55)] transition-[border-color,color,background-color] duration-130 shrink-0 hover:border-p-amber-dim hover:text-p-amber-dim hover:bg-[oklch(76%_0.158_65/0.08)] focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-2"
            :class="{ 'text-p-skip': isSkipped(pickKey(actId, area.id, i)) }"
            :aria-pressed="isSkipped(pickKey(actId, area.id, i))"
            :aria-label="isSkipped(pickKey(actId, area.id, i)) ? 'Unmark skipped' : 'Mark as skipped'"
            @click="toggleSkip(pickKey(actId, area.id, i))"
          >
            <!-- Strikethrough: shown at rest, hidden on hover or when skipped -->
            <svg
              class="block group-hover/skip:hidden"
              :class="{ 'hidden': isSkipped(pickKey(actId, area.id, i)) }"
              width="11" height="10" viewBox="0 0 11 10" fill="none"
              stroke="currentColor" stroke-linecap="round" aria-hidden="true"
            >
              <line x1="1.5" y1="2.5" x2="9.5" y2="2.5" stroke-width="1.4"/>
              <line x1="1.5" y1="7.5" x2="9.5" y2="7.5" stroke-width="1.4"/>
              <line x1="0"   y1="5"   x2="11"  y2="5"   stroke-width="2"/>
            </svg>
            <!-- X: shown on hover or when skipped -->
            <svg
              class="hidden group-hover/skip:block"
              :class="{ 'block!': isSkipped(pickKey(actId, area.id, i)) }"
              width="10" height="10" viewBox="0 0 10 10" fill="none"
              stroke="currentColor" stroke-linecap="round" aria-hidden="true"
            >
              <line x1="2" y1="2" x2="8" y2="8" stroke-width="1.8"/>
              <line x1="8" y1="2" x2="2" y2="8" stroke-width="1.8"/>
            </svg>
          </button>
        </td>

        <!-- Item name -->
        <td class="px-2 py-1.5 border-b border-p-subtle align-middle leading-[1.45]">
          <span
            class="font-p font-normal text-foreground block"
            :class="{ 'line-through': isSkipped(pickKey(actId, area.id, i)) }"
          >{{ pickup.item }}</span>
        </td>

        <!-- Type badge -->
        <td class="px-2 py-1.5 border-b border-p-subtle align-middle leading-[1.45]">
          <span
            v-if="pickup.type === 'Drop'"
            class="inline-flex items-center px-[0.38rem] py-[0.1rem] rounded-[3px] text-p-xs font-medium tracking-[0.04em] whitespace-nowrap border transition-[color,background-color,border-color] duration-130"
            :class="isSkipped(pickKey(actId, area.id, i))
              ? 'text-p-skip bg-transparent border-p-subtle'
              : 'text-p-green bg-p-green-bg border-p-green-bd'"
          >Drop</span>
          <span
            v-else-if="pickup.type === 'Hand-In'"
            class="inline-flex items-center px-[0.38rem] py-[0.1rem] rounded-[3px] text-p-xs font-medium tracking-[0.04em] whitespace-nowrap border transition-[color,background-color,border-color] duration-130"
            :class="isSkipped(pickKey(actId, area.id, i))
              ? 'text-p-skip bg-transparent border-p-subtle'
              : 'text-p-blue bg-p-blue-bg border-p-blue-bd'"
          >Hand&#8209;In</span>
        </td>

        <!-- Source -->
        <td class="px-2 py-1.5 border-b border-p-subtle align-middle leading-[1.45]">
          <span
            class="text-muted-foreground text-p-sm block"
            :class="{ 'line-through': isSkipped(pickKey(actId, area.id, i)) }"
          >{{ pickup.source }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
