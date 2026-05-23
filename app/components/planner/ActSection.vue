<script setup lang="ts">
import {
	AlertCircle,
	Check,
	ChevronsDownUp,
	ChevronsUpDown,
	Copy,
	PackageMinus,
} from "lucide-vue-next";
import { computed, nextTick, onMounted, ref, watch } from "vue";
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

const areaById = computed(() => {
	const m = new Map<string, Area>();
	for (const a of props.act.areas) m.set(a.id, a);
	return m;
});

const orderedAreas = computed((): Area[] =>
	orderedAreaIds.value
		.map((id: string) => areaById.value.get(id))
		.filter((a): a is Area => a !== undefined),
);

const ACT_NOTE_MAX = 600;
const REGEX_MAX = 250;

const actNote = computed({
	get() {
		return (state.actNotes[props.act.id] ?? []).join("\n");
	},
	set(v: string) {
		if (readonly.value) return;
		state.actNotes[props.act.id] = v.split("\n");
	},
});

const actNoteLength = computed(() => actNote.value.length);

const actRegex = computed({
	get() {
		return state.actRegex[props.act.id] ?? "";
	},
	set(v: string) {
		if (readonly.value) return;
		state.actRegex[props.act.id] = v;
	},
});

const actRegexLength = computed(() => actRegex.value.length);

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

const actNoteRef = ref<HTMLTextAreaElement | null>(null);

function autoResize(el: HTMLTextAreaElement) {
	el.style.height = "auto";
	el.style.height = `${Math.max(el.scrollHeight, 32)}px`;
}

onMounted(() => {
	requestAnimationFrame(() => {
		if (actNoteRef.value) autoResize(actNoteRef.value);
	});
});

watch(
	() => isCollapsed.value,
	async (collapsed) => {
		if (!collapsed) {
			await nextTick();
			requestAnimationFrame(() => {
				if (actNoteRef.value) autoResize(actNoteRef.value);
			});
		}
	},
);
</script>

<template>
  <div class="border border-[oklch(28%_0.020_63)] rounded-[5px] overflow-hidden">
    <div class="flex items-stretch bg-p-act">
      <button
        class="flex items-center gap-2 px-4 py-3 flex-1 min-w-0 bg-transparent border-0 cursor-pointer text-left text-p-amber text-p-md font-bold tracking-[-0.02em] font-p transition-[background] duration-120 select-none hover:bg-[oklch(19.5%_0.038_63)] focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:-outline-offset-2"
        @click="toggleCollapse"
        :aria-expanded="!isCollapsed"
      >
        <PlannerChevron :collapsed="isCollapsed" class="opacity-70 shrink-0" />
        <span class="truncate">{{ act.title }}</span>
      </button>

      <div
        v-if="!readonly"
        v-show="!isCollapsed"
        class="flex items-center max-sm:items-stretch gap-1 px-3 max-sm:px-2 max-sm:gap-1 shrink-0"
      >
        <button
          class="planner-btn-act flex items-center justify-center gap-1 max-sm:px-2"
          @click="expandActAreas(act.id)"
          aria-label="Expand all zones"
        >
          <ChevronsUpDown :size="11" class="shrink-0" aria-hidden="true" />
          <span class="hidden sm:inline">Expand zones</span>
          <span class="sm:hidden">Expand</span>
        </button>
        <button
          class="planner-btn-act flex items-center justify-center gap-1 max-sm:px-2"
          @click="collapseActAreas(act.id)"
          aria-label="Collapse all zones"
        >
          <ChevronsDownUp :size="11" class="shrink-0" aria-hidden="true" />
          <span class="hidden sm:inline">Collapse zones</span>
          <span class="sm:hidden">Collapse</span>
        </button>
        <button
          class="planner-btn-act flex items-center justify-center gap-1 max-sm:px-2"
          @click="collapseEmptyAreas(act.id)"
          aria-label="Collapse zones with no pickups"
        >
          <PackageMinus :size="11" class="shrink-0" aria-hidden="true" />
          <span class="hidden sm:inline">Collapse empty</span>
          <span class="sm:hidden">Empty</span>
        </button>
      </div>

    </div>
    <div v-show="!isCollapsed" class="bg-p-inset px-4 pt-3 pb-2 flex flex-col gap-3">
      <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
        <div class="flex flex-col gap-1">
          <span class="planner-eyebrow">Act note</span>
          <textarea
            ref="actNoteRef"
            class="planner-textarea"
            placeholder="Notes for this act..."
            :value="actNote"
            :maxlength="ACT_NOTE_MAX"
            :readonly="readonly"
            :class="{ 'cursor-default': readonly }"
            @mousedown="readonly ? $event.preventDefault() : undefined"
            @input="actNote = ($event.target as HTMLTextAreaElement).value; autoResize($event.target as HTMLTextAreaElement)"
            rows="2"
          />
          <span
            v-if="actNoteLength > 0"
            class="text-p-xs text-right tabular-nums transition-colors duration-120"
            :class="
              actNoteLength >= ACT_NOTE_MAX
                ? 'text-p-error'
                : actNoteLength >= ACT_NOTE_MAX - 120
                  ? 'text-p-amber-dim'
                  : 'text-p-muted'
            "
          >{{ actNoteLength }} / {{ ACT_NOTE_MAX }}</span>
        </div>
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
              class="flex-1 min-w-0 bg-transparent border-0 px-3 py-[0.35rem] text-p-text placeholder:text-p-muted placeholder:not-italic outline-none"
              placeholder='e.g., "\d+% i.+mov|ph.*da|\d cfl.+da"'
              :value="actRegex"
              :maxlength="REGEX_MAX"
              :readonly="readonly"
              :class="{ 'cursor-default': readonly }"
              @mousedown="readonly ? $event.preventDefault() : undefined"
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
          <span
            v-if="actRegexLength > 0"
            class="text-p-xs text-right tabular-nums transition-colors duration-120"
            :class="
              actRegexLength >= REGEX_MAX
                ? 'text-p-error'
                : actRegexLength >= REGEX_MAX - 50
                  ? 'text-p-amber-dim'
                  : 'text-p-muted'
            "
          >{{ actRegexLength }} / {{ REGEX_MAX }}</span>
        </div>

      </div>
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
