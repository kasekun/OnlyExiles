<script setup lang="ts">
import { GripVertical, Pencil } from "lucide-vue-next";
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

const { state, readonly } = usePlannerState();

const akey = computed(() => areaKey(props.actId, props.area.id));

const isCollapsed = computed(() => !!state.areasCollapsed[akey.value]);
const isSkipped = computed(() => !!state.skippedZones[akey.value]);

function toggleCollapse() {
	state.areasCollapsed[akey.value] = !isCollapsed.value;
}

function toggleZoneSkip() {
	if (readonly.value) return;
	state.skippedZones[akey.value] = !isSkipped.value;
}

// Editable level
const levelEditing = ref(false);
const levelInputRef = ref<HTMLInputElement | null>(null);

const displayLevel = computed(() => state.levels[akey.value] ?? "");

function startEditLevel(e: Event) {
	e.stopPropagation();
	levelEditing.value = true;
	nextTick(() => levelInputRef.value?.select());
}

function commitLevel(e: Event) {
	if (readonly.value) {
		levelEditing.value = false;
		return;
	}
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
		return state.notes[akey.value] ?? "";
	},
	set(v: string) {
		if (readonly.value) return;
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
</script>

<template>
  <div
    class="border rounded-[4px] overflow-hidden bg-p-surface group/area transition-[border-color,opacity] duration-120"
    :class="isSkipped
      ? 'border-p-subtle opacity-50'
      : 'border-p-subtle'"
  >
    <div class="flex items-stretch bg-p-area">

      <!-- Drag handle — hidden in readonly mode -->
      <span
        class="drag-handle flex items-center px-1.5 text-p-muted opacity-0 cursor-grab shrink-0 transition-opacity duration-120 group-hover/area:opacity-100 focus-visible:opacity-100 active:cursor-grabbing"
        :class="{ 'invisible pointer-events-none': readonly }"
        title="Drag to reorder"
      >
        <GripVertical :size="14" />
      </span>

      <!-- Toggle + name + level badge -->
      <div
        class="flex items-center gap-2 py-2 pr-3 pl-1 flex-1 min-w-0 cursor-pointer select-none transition-[background] duration-120 hover:bg-[oklch(21%_0.010_57)] focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:-outline-offset-2"
        @click="toggleCollapse"
        role="button"
        tabindex="0"
        @keydown.enter="toggleCollapse"
        @keydown.space.prevent="toggleCollapse"
        :aria-expanded="!isCollapsed"
      >
        <PlannerChevron :collapsed="isCollapsed" class="text-p-muted opacity-70" />

        <span class="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
          <span
            class="font-p text-p-base font-semibold whitespace-nowrap overflow-hidden text-ellipsis shrink min-w-0 transition-[color,text-decoration] duration-120"
            :class="isSkipped ? 'text-p-skip line-through' : 'text-p-text'"
          >
            {{ area.name }}
          </span>

          <!-- Level badge: editable on click (disabled in readonly) -->
          <span
            v-if="!levelEditing && !isSkipped"
            class="inline-flex items-center shrink-0 group/level"
          >
            <span
              class="inline-flex items-center text-p-xs text-p-text2 bg-p-surface border border-p-border py-[0.07rem] px-[0.35rem] rounded-[3px] whitespace-nowrap tracking-[0.02em] font-p-mono transition-[border-color,color,background-color] duration-120"
              :class="readonly ? 'cursor-default' : 'cursor-pointer hover:text-p-amber hover:border-p-amber-dim hover:bg-p-amber-bg'"
              :title="readonly ? undefined : 'Click to edit recommended level'"
              @click.stop="!readonly && startEditLevel($event)"
            >Target char level:&nbsp;{{ displayLevel }}</span>
            <span
              v-if="!readonly"
              class="flex items-center ml-[0.2rem] opacity-0 group-hover/level:opacity-100 transition-opacity duration-120"
            >
              <span class="block w-px h-[0.6em] bg-p-subtle mx-[0.15rem]" aria-hidden="true" />
              <button
                class="inline-flex items-center justify-center p-[0.12rem] rounded-[2px] text-p-amber-dim hover:text-p-amber transition-colors duration-120 focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:opacity-100"
                @click.stop="startEditLevel"
                aria-label="Edit recommended level"
                tabindex="-1"
              >
                <Pencil :size="10" aria-hidden="true" />
              </button>
            </span>
          </span>
          <span
            v-else-if="levelEditing && !isSkipped"
            class="inline-flex items-center shrink-0 text-p-xs text-p-amber bg-p-amber-bg border border-p-amber-dim py-[0.07rem] pr-[0.2rem] pl-[0.35rem] rounded-[3px] whitespace-nowrap tracking-[0.02em] font-p-mono cursor-default"
            @click.stop
          >Target char level:&nbsp;<input
              ref="levelInputRef"
              class="bg-transparent border-0 text-p-amber font-p-mono text-p-xs w-10 p-0 outline-none"
              type="text"
              :value="displayLevel"
              @blur="commitLevel"
              @keydown="onLevelKeydown"
              size="4"
            /></span>
        </span>
      </div>

      <!-- Zone skip toggle — hidden in readonly mode -->
      <div
        v-if="!readonly"
        class="flex items-center pr-2 shrink-0"
      >
        <button
          class="group/zskip bg-transparent border rounded-[3px] w-[22px] h-[22px] p-0 inline-flex items-center justify-center transition-[border-color,color,background-color] duration-130 focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-2 opacity-0 group-hover/area:opacity-100 focus-visible:opacity-100"
          :class="isSkipped
            ? 'border-p-amber-dim text-p-amber-dim opacity-100!'
            : 'border-p-subtle text-[oklch(36%_0.005_55)] hover:border-p-amber-dim hover:text-p-amber-dim hover:bg-[oklch(76%_0.158_65/0.08)]'"
          :aria-pressed="isSkipped"
          :aria-label="isSkipped ? 'Unskip zone' : 'Skip zone'"
          @click.stop="toggleZoneSkip"
        >
          <!-- Strikethrough icon at rest (not skipped) -->
          <svg
            class="block group-hover/zskip:hidden"
            :class="{ 'hidden': isSkipped }"
            width="11" height="10" viewBox="0 0 11 10" fill="none"
            stroke="currentColor" stroke-linecap="round" aria-hidden="true"
          >
            <line x1="1.5" y1="2.5" x2="9.5" y2="2.5" stroke-width="1.4"/>
            <line x1="1.5" y1="7.5" x2="9.5" y2="7.5" stroke-width="1.4"/>
            <line x1="0"   y1="5"   x2="11"  y2="5"   stroke-width="2"/>
          </svg>
          <!-- X icon on hover or when skipped -->
          <svg
            class="hidden group-hover/zskip:block"
            :class="{ 'block!': isSkipped }"
            width="10" height="10" viewBox="0 0 10 10" fill="none"
            stroke="currentColor" stroke-linecap="round" aria-hidden="true"
          >
            <line x1="2" y1="2" x2="8" y2="8" stroke-width="1.8"/>
            <line x1="8" y1="2" x2="2" y2="8" stroke-width="1.8"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Area body -->
    <div v-show="!isCollapsed && !isSkipped" class="py-3 px-4 flex flex-col gap-4 max-sm:px-3 max-sm:py-2">

      <!-- Notes -->
      <div class="flex flex-col gap-1">
        <span class="planner-eyebrow">Notes</span>
        <textarea
          ref="notesRef"
          class="planner-textarea"
          placeholder="Add notes for this zone..."
          :value="notesValue"
          :readonly="readonly"
          :class="{ 'opacity-60 cursor-default': readonly }"
          @input="onNotesInput"
          rows="1"
        />
      </div>

      <!-- Pickups -->
      <div class="flex flex-col gap-1">
        <span class="planner-eyebrow">Pickups</span>
        <PlannerPickupTable :act-id="actId" :area="area" />
      </div>
    </div>
  </div>
</template>
