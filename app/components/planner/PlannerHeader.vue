<script setup lang="ts">
import { Github } from "lucide-vue-next";
import { ref } from "vue";
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
import { useMarkdownExport } from "~/composables/useMarkdownExport";
import { usePlannerState } from "~/composables/usePlannerState";
import { TEMPLATES } from "~/data/templates";

const { state, resetAll, expandAll, collapseAll, applyTemplate } =
	usePlannerState();
const { copyMarkdown } = useMarkdownExport();

const copyLabel = ref("Copy Markdown");

async function handleCopy() {
	const ok = await copyMarkdown();
	if (ok) {
		copyLabel.value = "Copied!";
		setTimeout(() => {
			copyLabel.value = "Copy Markdown";
		}, 1500);
	}
}

function selectTemplate(id: string) {
	const t = TEMPLATES.find((t) => t.id === id);
	if (t) applyTemplate(t);
}
</script>

<template>
  <header class="sticky top-0 z-20 bg-p-bg border-b border-p-border backdrop-blur-[10px]">
    <div class="max-w-[1020px] mx-auto px-6 py-3 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start max-sm:px-4 max-sm:gap-2">

      <!-- Title -->
      <div class="shrink-0">
        <div class="text-p-lg font-bold text-p-amber tracking-[-0.01em] flex items-center gap-2 leading-[1.3] max-sm:text-p-md">
          <svg class="opacity-65 shrink-0" width="11" height="10" viewBox="0 0 11 10" fill="none"
            stroke="currentColor" stroke-linecap="round" aria-hidden="true">
            <line x1="1.5" y1="2.5" x2="9.5" y2="2.5" stroke-width="1.4"/>
            <line x1="1.5" y1="7.5" x2="9.5" y2="7.5" stroke-width="1.4"/>
            <line x1="0"   y1="5"   x2="11"  y2="5"   stroke-width="2"/>
          </svg>
          PoE2 Campaign Planner
        </div>
        <div class="text-p-sm text-p-muted mt-[0.1rem]">Campaign route / pickup planner</div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1.5 flex-wrap justify-end max-sm:w-full">

        <!-- Templates dropdown -->
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
                <span class="text-p-sm font-semibold text-p-text">{{ t.label }}</span>
                <span class="text-p-xs text-p-muted leading-[1.4]">{{ t.description }}</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button class="planner-btn-ghost" @click="handleCopy">{{ copyLabel }}</button>
        <button class="planner-btn-ghost" @click="expandAll">Expand all</button>
        <button class="planner-btn-ghost" @click="collapseAll">Collapse all</button>

        <!-- Hide empty zones toggle — amber tint when active -->
        <button
          class="planner-btn-ghost"
          :class="{
            'border-p-amber-dim text-p-amber-dim hover:border-p-amber hover:text-p-amber': state.hideEmptyZones
          }"
          @click="state.hideEmptyZones = !state.hideEmptyZones"
          :aria-pressed="state.hideEmptyZones"
        >
          Hide empty
        </button>

        <!-- Reset — danger color revealed only on hover -->
        <button
          class="planner-btn-ghost hover:border-p-error hover:text-p-error"
          @click="resetAll"
        >Reset</button>

        <!-- GitHub repo link -->
        <Tooltip>
          <TooltipTrigger as-child>
            <a
              href="https://github.com/kasekun/poe2drops"
              target="_blank"
              rel="noreferrer noopener"
              class="planner-btn-ghost px-2"
              aria-label="View source on GitHub"
            >
              <Github :size="14" />
            </a>
          </TooltipTrigger>
          <TooltipContent class="planner-tooltip" side="bottom" :side-offset="6">
            View on GitHub
          </TooltipContent>
        </Tooltip>
      </div>
    </div>
  </header>
</template>
