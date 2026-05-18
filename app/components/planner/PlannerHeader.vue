<script setup lang="ts">
import { computed, ref } from "vue";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { usePlannerState } from "~/composables/usePlannerState";
import { TEMPLATES } from "~/data/templates";

const { state, resetAll, expandAll, collapseAll, applyTemplate } =
	usePlannerState();

const skippedCount = computed(
	() => Object.values(state.skipped).filter(Boolean).length,
);

const exportDialogOpen = ref(false);

function selectTemplate(id: string) {
	const t = TEMPLATES.find((t) => t.id === id);
	if (t) applyTemplate(t);
}
</script>

<template>
  <header class="sticky top-0 z-20 bg-p-bg border-b border-p-border">
    <div class="max-w-[1020px] mx-auto px-6 py-3 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start max-sm:px-4 max-sm:gap-2">

      <!-- Title -->
      <div class="shrink-0">
        <div class="text-p-lg font-bold text-p-amber tracking-[-0.01em] flex items-center gap-2 leading-[1.3] max-sm:text-p-md">
          <BrandMark :size="13" class="shrink-0" />
          PoE2 Campaign Planner
        </div>
        <div v-if="skippedCount > 0" class="text-p-sm text-p-muted mt-[0.1rem]">
          {{ skippedCount }} {{ skippedCount === 1 ? 'item' : 'items' }} skipped
        </div>
      </div>

      <!-- Actions — three clusters separated by thin dividers -->
      <div class="flex items-center gap-1.5 flex-wrap justify-end max-sm:w-full">

        <!-- Cluster 1: plan configuration + export -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <!-- data-[state=open]: targets the trigger when the dropdown is open -->
            <button class="planner-btn-ghost data-[state=open]:[&_.chevron-dd]:rotate-180">
              Templates
              <svg
                class="chevron-dd w-[10px] h-[6px] transition-transform duration-150 shrink-0"
                viewBox="0 0 10 6" fill="none"
                stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
              >
                <polyline points="1,1 5,5 9,1"/>
              </svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="planner-dropdown" align="end">
            <DropdownMenuItem
              v-for="t in TEMPLATES"
              :key="t.id"
              class="planner-dd-item"
              @click="selectTemplate(t.id)"
            >
              <div class="flex flex-col gap-[0.15rem] px-3 py-[0.55rem] w-full">
                <span class="text-p-sm text-p-text">{{ t.label }}</span>
                <span class="text-p-xs text-p-muted leading-[1.4]">{{ t.description }}</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button class="planner-btn-ghost" @click="exportDialogOpen = true">
          Copy Markdown
        </button>

        <span aria-hidden="true" class="w-px h-[14px] bg-p-subtle self-center mx-0.5 shrink-0 max-sm:hidden" />

        <!-- Cluster 2: view controls -->
        <button class="planner-btn-ghost" @click="expandAll">Expand all</button>
        <button class="planner-btn-ghost" @click="collapseAll">Collapse all</button>

        <span aria-hidden="true" class="w-px h-[14px] bg-p-subtle self-center mx-0.5 shrink-0 max-sm:hidden" />

        <!-- Cluster 3: danger + utility -->
        <button
          class="planner-btn-ghost hover:border-p-error hover:text-p-error"
          @click="resetAll"
        >Reset</button>

        <Tooltip>
          <TooltipTrigger as-child>
            <a
              href="https://github.com/kasekun/poe2drops"
              target="_blank"
              rel="noreferrer noopener"
              class="planner-btn-ghost px-2"
              aria-label="View source on GitHub"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" />
              </svg>
            </a>
          </TooltipTrigger>
          <TooltipContent class="planner-tooltip" side="bottom" :side-offset="6">
            View on GitHub
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  </header>

  <PlannerExportDialog v-model:open="exportDialogOpen" />
</template>
