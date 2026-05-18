<script setup lang="ts">
import { ref } from "vue";
import { Github } from "lucide-vue-next";
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
import { useMarkdownExport } from "~/composables/useMarkdownExport";
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
  <header class="page-header">
    <div class="header-inner">
      <div class="title-block">
        <div class="page-title">
          <svg class="title-icon" width="11" height="10" viewBox="0 0 11 10" fill="none"
            stroke="currentColor" stroke-linecap="round" aria-hidden="true">
            <line x1="1.5" y1="2.5" x2="9.5" y2="2.5" stroke-width="1.4"/>
            <line x1="1.5" y1="7.5" x2="9.5" y2="7.5" stroke-width="1.4"/>
            <line x1="0"   y1="5"   x2="11"  y2="5"   stroke-width="2"/>
          </svg>
          PoE2 Campaign Planner
        </div>
        <div class="page-subtitle">Campaign route / pickup planner</div>
      </div>

      <div class="header-actions">
        <!-- Templates dropdown — DropdownMenu handles open state, keyboard nav, outside-click -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="btn templates-trigger">
              Templates
              <svg class="dropdown-chevron" viewBox="0 0 10 6" fill="none"
                stroke="currentColor" stroke-width="1.8" stroke-linecap="round">
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
              <div class="template-item-inner">
                <span class="template-label">{{ t.label }}</span>
                <span class="template-desc">{{ t.description }}</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button class="btn" @click="handleCopy">{{ copyLabel }}</button>
        <button class="btn" @click="expandAll">Expand all</button>
        <button class="btn" @click="collapseAll">Collapse all</button>

        <!-- Hide empty zones toggle -->
        <button
          class="btn btn-toggle"
          :class="{ active: state.hideEmptyZones }"
          @click="state.hideEmptyZones = !state.hideEmptyZones"
          :aria-pressed="state.hideEmptyZones"
        >
          Hide empty
        </button>

        <button class="btn btn-danger" @click="resetAll">Reset</button>

        <!-- GitHub repo link — Tooltip replaces native title attribute -->
        <Tooltip>
          <TooltipTrigger as-child>
            <a
              href="https://github.com/kasekun/poe2drops"
              target="_blank"
              rel="noreferrer noopener"
              class="btn btn-icon"
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

<style scoped>
.page-header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: var(--planner-bg);
  border-bottom: 1px solid var(--planner-border);
  backdrop-filter: blur(10px);
}

.header-inner {
  max-width: 1020px;
  margin: 0 auto;
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.title-block { flex-shrink: 0; }

.page-title {
  font-size: var(--planner-fs-lg);
  font-weight: 700;
  color: var(--planner-amber);
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  line-height: 1.3;
}

.title-icon {
  opacity: 0.65;
  flex-shrink: 0;
}

.page-subtitle {
  font-size: var(--planner-fs-sm);
  color: var(--planner-text-muted);
  margin-top: 0.1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

/* ── Buttons ─────────────────────────── */
.btn {
  background: transparent;
  border: 1px solid var(--planner-border-subtle);
  color: var(--planner-text-muted);
  font-size: var(--planner-fs-sm);
  font-family: var(--planner-font);
  padding: 0.28rem 0.6rem;
  border-radius: 4px;
  cursor: pointer;
  transition: border-color 0.13s, color 0.13s;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  line-height: 1.5;
  text-decoration: none;
}
.btn:hover {
  border-color: var(--planner-border);
  color: var(--planner-text-2);
}
.btn:focus-visible {
  outline: 1px solid var(--planner-amber-dim);
  outline-offset: 2px;
}

.btn-toggle.active {
  border-color: var(--planner-amber-dim);
  color: var(--planner-amber-dim);
}
.btn-toggle.active:hover {
  border-color: var(--planner-amber);
  color: var(--planner-amber);
}

.btn-danger:hover {
  border-color: var(--planner-error);
  color: var(--planner-error);
}

.btn-icon {
  padding: 0.28rem 0.5rem;
}

/* ── Templates trigger ───────────────── */
.dropdown-chevron {
  width: 10px;
  height: 6px;
  transition: transform 0.15s;
  flex-shrink: 0;
}
/* reka-ui sets data-state="open" on the trigger when dropdown is open */
.templates-trigger[data-state="open"] .dropdown-chevron {
  transform: rotate(180deg);
}

/* ── Template items (slotted, scoped CSS reaches these) ── */
.template-item-inner {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  padding: 0.55rem 0.75rem;
  width: 100%;
}

.template-label {
  font-size: var(--planner-fs-sm);
  font-weight: 600;
  color: var(--planner-text);
}

.template-desc {
  font-size: var(--planner-fs-xs);
  color: var(--planner-text-muted);
  line-height: 1.4;
}



/* ── Responsive ──────────────────────── */
@media (max-width: 640px) {
  .header-inner {
    flex-direction: column;
    align-items: flex-start;
    padding: 0.75rem 1rem;
    gap: 0.5rem;
  }
  .header-actions {
    width: 100%;
  }
  .page-title {
    font-size: var(--planner-fs-md);
  }
}

@media (prefers-reduced-motion: reduce) {
  .dropdown-chevron,
  .btn {
    transition: none;
  }
}

</style>
