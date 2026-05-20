<script setup lang="ts">
import {
	AlertCircle,
	Check,
	ChevronsDownUp,
	ChevronsUpDown,
	Copy,
	PackageMinus,
} from "lucide-vue-next";
import { computed, ref } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import {
	getOrderedAreas,
	usePlannerState,
} from "~/composables/usePlannerState";
import type { Act, Area } from "~/data/campaign";

const props = defineProps<{ act: Act }>();

const {
	state,
	readonly,
	expandActAreas,
	collapseActAreas,
	collapseEmptyAreas,
} = usePlannerState();

const isCollapsed = computed(() => !!state.actsCollapsed[props.act.id]);

function toggleCollapse() {
	state.actsCollapsed[props.act.id] = !isCollapsed.value;
}

// Ordered area IDs — custom order from state, falls back to DATA order
const orderedAreaIds = computed({
	get() {
		return getOrderedAreas(
			state,
			props.act.id,
			props.act.areas.map((a) => a.id),
		);
	},
	set(newOrder: string[]) {
		if (readonly.value) return;
		state.areaOrder[props.act.id] = newOrder;
	},
});

const orderedAreas = computed((): Area[] =>
	orderedAreaIds.value
		.map((id: string) => props.act.areas.find((a: Area) => a.id === id))
		.filter((a): a is Area => a !== undefined),
);

// Act note
const actNote = computed({
	get() {
		return state.actNotes[props.act.id] ?? "";
	},
	set(v: string) {
		if (readonly.value) return;
		state.actNotes[props.act.id] = v;
	},
});

const actRegex = computed({
	get() {
		return state.actRegex[props.act.id] ?? "";
	},
	set(v: string) {
		if (readonly.value) return;
		state.actRegex[props.act.id] = v;
	},
});

type CopyState = "idle" | "success" | "error";
const copyRegexState = ref<CopyState>("idle");

async function copyRegex() {
	const val = actRegex.value.trim();
	if (!val) return;
	try {
		await navigator.clipboard.writeText(val);
		copyRegexState.value = "success";
	} catch {
		copyRegexState.value = "error";
	} finally {
		setTimeout(() => {
			copyRegexState.value = "idle";
		}, 1500);
	}
}

function autoResize(el: HTMLTextAreaElement) {
	el.style.height = "auto";
	el.style.height = `${Math.max(el.scrollHeight, 32)}px`;
}
</script>

<template>
  <div class="border border-p-border rounded-[5px] overflow-hidden">

    <!-- Act header -->
    <div class="flex items-stretch bg-p-act">
      <button
        class="flex items-center gap-2 px-4 py-3 flex-1 min-w-0 bg-transparent border-0 cursor-pointer text-left text-p-amber text-p-md font-bold tracking-[-0.01em] font-p transition-[background] duration-120 select-none hover:bg-[oklch(17.5%_0.022_62)] focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:-outline-offset-2"
        @click="toggleCollapse"
        :aria-expanded="!isCollapsed"
      >
        <PlannerChevron :collapsed="isCollapsed" class="opacity-70 shrink-0" />
        <span class="truncate">{{ act.title }}</span>
      </button>

      <div
        v-show="!isCollapsed"
        class="flex items-center gap-1 px-3 max-sm:px-1.5 max-sm:gap-0 shrink-0 border-p-amber-bd"
      >
        <button
          class="planner-btn-act flex items-center gap-1 max-sm:px-2"
          @click="expandActAreas(act.id)"
          aria-label="Expand all zones"
        >
          <ChevronsUpDown :size="12" class="sm:hidden" aria-hidden="true" />
          <span class="max-sm:hidden">Expand zones</span>
        </button>
        <button
          class="planner-btn-act flex items-center gap-1 max-sm:px-2"
          @click="collapseActAreas(act.id)"
          aria-label="Collapse all zones"
        >
          <ChevronsDownUp :size="12" class="sm:hidden" aria-hidden="true" />
          <span class="max-sm:hidden">Collapse zones</span>
        </button>
        <button
          class="planner-btn-act flex items-center gap-1 max-sm:px-2"
          @click="collapseEmptyAreas(act.id)"
          aria-label="Collapse zones with no pickups"
        >
          <PackageMinus :size="12" class="sm:hidden" aria-hidden="true" />
          <span class="max-sm:hidden">Collapse empty</span>
        </button>
      </div>

    </div>

    <!-- Act body -->
    <div v-show="!isCollapsed" class="bg-p-inset px-4 pt-3 pb-2 flex flex-col gap-3">

      <!-- Act-level fields -->
      <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">

        <!-- Free-form note -->
        <div class="flex flex-col gap-1">
          <span class="planner-eyebrow">Act note</span>
          <textarea
            class="planner-textarea"
            placeholder="Notes for this act..."
            :value="actNote"
            :readonly="readonly"
            :class="{ 'opacity-60 cursor-default': readonly }"
            @input="actNote = ($event.target as HTMLTextAreaElement).value; autoResize($event.target as HTMLTextAreaElement)"
            rows="2"
          />
        </div>

        <!-- Loot filter regex -->
        <div class="flex flex-col gap-1">
          <span class="planner-eyebrow">Loot filter regex</span>
          <p class="text-p-xs text-p-muted leading-[1.4]">
            Paste into vendor or stash search to highlight these items (try
            <a href="https://poe2.re" target="_blank" rel="noopener noreferrer" class="underline hover:text-p-amber">https://poe2.re</a>)
          </p>
  
          <div
            class="flex items-stretch bg-p-inset border border-p-subtle rounded-[3px] overflow-hidden font-p-mono text-p-sm"
            :class="{ 'border-p-error': copyRegexState === 'error' }"
          >
            <input
              type="text"
              class="flex-1 min-w-0 bg-transparent border-0 px-3 py-[0.35rem] text-p-text2 placeholder:text-p-muted placeholder:not-italic outline-none"
              :class="{ 'opacity-60 cursor-default': readonly }"
              placeholder='e.g., "\d+% i.+mov|ph.*da|\d cfl.+da"'
              :value="actRegex"
              :readonly="readonly"
              @input="actRegex = ($event.target as HTMLInputElement).value"
              spellcheck="false"
              autocomplete="off"
            />
            <button
              class="shrink-0 flex items-center justify-center w-8 border-l border-p-subtle transition-[color,background-color] duration-130 disabled:opacity-30 disabled:cursor-not-allowed focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:-outline-offset-1"
              :class="{
                'text-p-muted hover:text-p-amber hover:bg-[oklch(76%_0.158_65/0.08)]': copyRegexState === 'idle',
                'text-p-amber': copyRegexState === 'success',
                'text-p-error': copyRegexState === 'error',
              }"
              @click="copyRegex"
              :disabled="!actRegex.trim()"
              :title="!actRegex.trim() ? 'Enter a pattern to copy' : undefined"
              :aria-label="copyRegexState === 'success' ? 'Copied!' : copyRegexState === 'error' ? 'Copy failed' : 'Copy pattern'"
            >
              <Check v-if="copyRegexState === 'success'" :size="13" aria-hidden="true" />
              <AlertCircle v-else-if="copyRegexState === 'error'" :size="13" aria-hidden="true" />
              <Copy v-else :size="13" aria-hidden="true" />
            </button>
          </div>
        </div>

      </div>

      <!-- Draggable areas list -->
      <VueDraggable
        v-model="orderedAreaIds"
        :animation="150"
        :handle="readonly ? undefined : '.drag-handle'"
        ghost-class="drag-ghost"
        class="flex flex-col gap-2"
        tag="div"
      >
        <PlannerZoneSection
          v-for="area in orderedAreas"
          :key="area.id"
          :act-id="act.id"
          :area="area"
        />
      </VueDraggable>
    </div>
  </div>
</template>
