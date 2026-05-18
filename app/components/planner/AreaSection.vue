<script setup lang="ts">
import { EyeOff, GripVertical } from "lucide-vue-next";
import { computed, nextTick, onMounted, ref } from "vue";
import {
	areaKey,
	pickKey,
	usePlannerState,
} from "~/composables/usePlannerState";
import type { Area } from "~/data/campaign";

const props = defineProps<{
	actId: string;
	area: Area;
}>();

const { state } = usePlannerState();

const akey = computed(() => areaKey(props.actId, props.area.id));

const isCollapsed = computed(() => !!state.areasCollapsed[akey.value]);

function toggleCollapse() {
	state.areasCollapsed[akey.value] = !isCollapsed.value;
}

// Editable level
const levelEditing = ref(false);
const levelInputRef = ref<HTMLInputElement | null>(null);

const displayLevel = computed(
	() => state.levels[akey.value] ?? props.area.recLevel,
);

function startEditLevel(e: Event) {
	e.stopPropagation();
	levelEditing.value = true;
	nextTick(() => levelInputRef.value?.select());
}

function commitLevel(e: Event) {
	const val = (e.target as HTMLInputElement).value.trim();
	state.levels[akey.value] = val || props.area.recLevel;
	levelEditing.value = false;
}

function onLevelKeydown(e: KeyboardEvent) {
	if (e.key === "Enter") commitLevel(e as unknown as Event);
	if (e.key === "Escape") levelEditing.value = false;
}

// Notes textarea
const notesRef = ref<HTMLTextAreaElement | null>(null);

const notesValue = computed({
	get() {
		return state.notes[akey.value] ?? props.area.notes;
	},
	set(v: string) {
		state.notes[akey.value] = v;
	},
});

function autoResize(el: HTMLTextAreaElement) {
	el.style.height = "auto";
	el.style.height = `${Math.max(el.scrollHeight, 32)}px`;
}

function onNotesInput(e: Event) {
	const el = e.target as HTMLTextAreaElement;
	notesValue.value = el.value;
	autoResize(el);
}

onMounted(() => {
	if (notesRef.value) autoResize(notesRef.value);
});

// Hide-area toggle — stored under a suffixed key to separate from collapse state
const isHidden = computed(
	() => !!state.areasCollapsed[`${akey.value}__hidden`],
);
function toggleHide() {
	state.areasCollapsed[`${akey.value}__hidden`] = !isHidden.value;
}

// shouldShow owns ALL visibility logic so ActSection can render every area
// unconditionally and hidden strips remain accessible even with hideEmptyZones on.
const shouldShow = computed(() => {
	if (isHidden.value) return true; // always render as a strip so user can unhide
	if (state.hideEmptyZones) {
		if (props.area.pickups.length === 0) return false;
		return props.area.pickups.some(
			(_, i) => !state.skipped[pickKey(props.actId, props.area.id, i)],
		);
	}
	return true;
});
</script>

<template>
  <!-- group/area enables hover-reveal of drag handle and hide button -->
  <div
    v-if="shouldShow"
    class="border border-p-subtle rounded-[4px] overflow-hidden bg-p-surface group/area"
  >

    <!-- Compact strip shown when user has hidden this zone -->
    <div v-if="isHidden" class="flex items-center gap-2 py-[0.3rem] pr-2 pl-0 bg-p-area">
      <span
        class="drag-handle flex items-center px-[0.4rem] text-p-muted opacity-0 cursor-grab shrink-0 transition-opacity duration-120 group-hover/area:opacity-100 focus-visible:opacity-100 active:cursor-grabbing"
        title="Drag to reorder"
      >
        <GripVertical :size="14" />
      </span>
      <span class="flex-1 min-w-0 text-p-sm text-p-muted truncate italic">
        {{ area.name }}
      </span>
      <button class="planner-btn-act" @click.stop="toggleHide" title="Show this zone">
        Show zone
      </button>
    </div>

    <!-- Full area when visible -->
    <template v-else>
      <div class="flex items-stretch bg-p-area">

        <!-- Drag handle -->
        <span
          class="drag-handle flex items-center px-[0.4rem] text-p-muted opacity-0 cursor-grab shrink-0 transition-opacity duration-120 group-hover/area:opacity-100 focus-visible:opacity-100 active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical :size="14" />
        </span>

        <!-- Toggle + name + level badge -->
        <div
          class="flex items-center gap-2 py-2 pr-3 pl-1 flex-1 min-w-0 cursor-pointer select-none transition-[background] duration-120 hover:bg-[oklch(21%_0.010_57)] focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-[-2px]"
          @click="toggleCollapse"
          role="button"
          tabindex="0"
          @keydown.enter="toggleCollapse"
          @keydown.space.prevent="toggleCollapse"
          :aria-expanded="!isCollapsed"
        >
          <PlannerChevron :collapsed="isCollapsed" class="text-p-muted opacity-70" />

          <span class="flex items-center gap-[0.45rem] flex-1 min-w-0 overflow-hidden">
            <span class="text-p-base font-semibold text-p-text whitespace-nowrap overflow-hidden text-ellipsis shrink min-w-0">
              {{ area.name }}
            </span>

            <!-- Level badge: editable on click -->
            <span
              v-if="!levelEditing"
              class="inline-flex items-center shrink-0 text-p-xs text-p-amber-dim bg-p-amber-bg border border-p-amber-bd py-[0.07rem] px-[0.38rem] rounded-[3px] whitespace-nowrap tracking-[0.02em] font-p-mono cursor-pointer transition-[border-color,color] duration-120 hover:border-p-amber-dim hover:text-p-amber"
              title="Click to edit recommended level"
              @click.stop="startEditLevel"
            >
              Char&nbsp;level:&nbsp;<span class="font-p-mono">{{ displayLevel }}</span>
            </span>
            <span
              v-else
              class="inline-flex items-center shrink-0 text-p-xs text-p-amber-dim bg-p-amber-bg border border-p-amber-bd py-[0.07rem] pr-[0.2rem] pl-[0.38rem] rounded-[3px] whitespace-nowrap tracking-[0.02em] font-p-mono cursor-default"
              @click.stop
            >
              Char&nbsp;level:&nbsp;<input
                ref="levelInputRef"
                class="bg-transparent border-0 text-p-amber font-p-mono text-p-xs w-14 p-0 outline-none"
                type="text"
                :value="displayLevel"
                @blur="commitLevel"
                @keydown="onLevelKeydown"
                size="4"
              />
            </span>
          </span>
        </div>

        <!-- Hide button: revealed on parent hover or own focus -->
        <button
          class="flex items-center justify-center px-2 bg-transparent border-0 cursor-pointer text-p-muted opacity-0 shrink-0 transition-[opacity,color] duration-120 group-hover/area:opacity-100 hover:text-p-text2 focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-2 focus-visible:opacity-100"
          @click.stop="toggleHide"
          title="Hide this zone"
          aria-label="Hide this zone"
        >
          <EyeOff :size="12" />
        </button>
      </div>

      <!-- Area body -->
      <div v-show="!isCollapsed" class="p-3 px-4 flex flex-col gap-4 max-sm:px-3 max-sm:py-2">

        <!-- Notes -->
        <div>
          <span class="planner-eyebrow mb-1">Notes</span>
          <textarea
            ref="notesRef"
            class="planner-textarea"
            placeholder="Add notes for this zone..."
            :value="notesValue"
            @input="onNotesInput"
            rows="1"
          />
        </div>

        <!-- Pickups -->
        <div>
          <span class="planner-eyebrow mb-1">Pickups</span>
          <PlannerPickupTable :act-id="actId" :area="area" />
        </div>
      </div>
    </template>
  </div>
</template>
