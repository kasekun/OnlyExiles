<script setup lang="ts">
import {
	DropdownMenuItem,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { FILTERS, type Filter, PRESETS } from "~/data/presets/index";

const emit = defineEmits<{
	selectPreset: [id: string];
	applyFilter: [filter: Filter];
}>();
</script>

<template>
  <div class="px-[0.6rem] pt-1.5 pb-1 planner-eyebrow">Presets</div>
  <DropdownMenuItem
    v-for="preset in PRESETS"
    :key="preset.id"
    class="planner-dd-item"
    @click="emit('selectPreset', preset.id)"
  >
    <div class="flex flex-col gap-1 py-1 min-w-0">
      <span class="text-p-sm font-bold text-p-text leading-snug text-balance">{{ preset.label }}</span>
      <span class="text-p-xs text-p-muted leading-[1.6] text-pretty">{{ preset.description }}</span>
    </div>
  </DropdownMenuItem>

  <DropdownMenuSeparator class="bg-p-border mx-1 my-1.5" />

  <div class="px-[0.6rem] pt-1 pb-1 planner-eyebrow">Filters</div>
  <DropdownMenuItem
    v-for="filter in FILTERS"
    :key="filter.id"
    class="planner-dd-item"
    @click="emit('applyFilter', filter)"
  >
    <div class="flex flex-col gap-1 py-1 min-w-0">
      <span class="text-p-sm font-bold text-p-text leading-snug text-balance">{{ filter.label }}</span>
      <span class="text-p-xs text-p-muted leading-[1.6] text-pretty">{{ filter.description }}</span>
    </div>
  </DropdownMenuItem>
</template>
