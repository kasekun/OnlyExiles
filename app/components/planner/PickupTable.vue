<script setup lang="ts">
import { RedoDot, X } from "lucide-vue-next";
import { pickKey, usePlannerState } from "~/composables/usePlannerState";
import type { Area } from "~/data/campaign";

const props = defineProps<{
	actId: string;
	area: Area;
}>();

const { state, readonly } = usePlannerState();

function toggleSkip(key: string) {
	if (readonly.value) return;
	state.skippedPickups[key] = !state.skippedPickups[key];
}

function isSkipped(key: string): boolean {
	return !!state.skippedPickups[key];
}

function pickupKey(pickupId: string): string {
	return pickKey(props.actId, props.area.id, pickupId);
}

function isPickupSkipped(pickupId: string): boolean {
	return isSkipped(pickupKey(pickupId));
}

function togglePickupSkip(pickupId: string): void {
	toggleSkip(pickupKey(pickupId));
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
        v-for="pickup in area.pickups"
        :key="pickup.id"
        class="last:[&>td]:border-b-0 odd:[&>td]:bg-p-row-even even:[&>td]:bg-p-row-odd"
        :data-skipped="isPickupSkipped(pickup.id) || undefined"
      >
        <!-- Skip toggle -->
        <td class="px-2 py-1.5 border-b border-p-subtle align-middle leading-[1.45] text-center">
          <button
            class="group/skip bg-transparent border border-p-subtle rounded-[3px] w-[22px] h-[22px] p-0 inline-flex items-center justify-center text-[oklch(36%_0.005_55)] transition-[border-color,color,background-color] duration-130 shrink-0 focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-2"
            :class="[
              isPickupSkipped(pickup.id) ? 'text-p-skip' : '',
              readonly ? 'cursor-default opacity-40' : 'cursor-pointer hover:border-p-amber-dim hover:text-p-amber-dim hover:bg-[oklch(76%_0.158_65/0.08)]',
            ]"
            :aria-pressed="isPickupSkipped(pickup.id)"
            :aria-label="isPickupSkipped(pickup.id) ? 'Unmark skipped' : 'Mark as skipped'"
            :disabled="readonly"
            @click="togglePickupSkip(pickup.id)"
          >
            <RedoDot
              class="block group-hover/skip:hidden"
              :class="{ 'hidden': isPickupSkipped(pickup.id) }"
              :size="13" aria-hidden="true"
            />
            <X
              class="hidden group-hover/skip:block"
              :class="{ 'block!': isPickupSkipped(pickup.id) }"
              :size="13" aria-hidden="true"
            />
          </button>
        </td>

        <!-- Item name -->
        <td class="px-2 py-1.5 border-b border-p-subtle align-middle leading-[1.45]">
          <span
            class="font-p font-normal text-foreground block"
            :class="{ 'line-through': isPickupSkipped(pickup.id) }"
          >{{ pickup.item }}</span>
        </td>

        <!-- Type badge -->
        <td class="px-2 py-1.5 border-b border-p-subtle align-middle leading-[1.45]">
          <span
            v-if="pickup.type === 'Drop'"
            class="inline-flex items-center px-[0.38rem] py-[0.1rem] rounded-[3px] text-p-xs font-medium tracking-[0.04em] whitespace-nowrap border transition-[color,background-color,border-color] duration-130"
            :class="isPickupSkipped(pickup.id)
              ? 'text-p-skip bg-transparent border-p-subtle'
              : 'text-p-green bg-p-green-bg border-p-green-bd'"
          >Drop</span>
          <span
            v-else-if="pickup.type === 'Hand-In'"
            class="inline-flex items-center px-[0.38rem] py-[0.1rem] rounded-[3px] text-p-xs font-medium tracking-[0.04em] whitespace-nowrap border transition-[color,background-color,border-color] duration-130"
            :class="isPickupSkipped(pickup.id)
              ? 'text-p-skip bg-transparent border-p-subtle'
              : 'text-p-blue bg-p-blue-bg border-p-blue-bd'"
          >Hand&#8209;In</span>
        </td>

        <!-- Source -->
        <td class="px-2 py-1.5 border-b border-p-subtle align-middle leading-[1.45]">
          <span
            class="text-muted-foreground text-p-sm block"
            :class="{ 'line-through': isPickupSkipped(pickup.id) }"
          >{{ pickup.source }}</span>
        </td>
      </tr>
    </tbody>
  </table>
</template>
