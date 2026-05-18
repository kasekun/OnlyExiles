<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from "vue";
import { EyeOff, GripVertical } from "lucide-vue-next";
import type { Area } from "~/data/campaign";
import { usePlannerState, areaKey, pickKey } from "~/composables/usePlannerState";

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
  <div v-if="shouldShow" class="area-section" :class="{ collapsed: isCollapsed }">

    <!-- Compact strip shown when user has hidden this zone -->
    <div v-if="isHidden" class="area-hidden-strip">
      <span class="drag-handle" title="Drag to reorder">
        <GripVertical :size="14" />
      </span>
      <span class="area-hidden-name">{{ area.name }}</span>
      <button class="area-restore-btn" @click.stop="toggleHide" title="Show this zone">
        Show zone
      </button>
    </div>

    <!-- Full area when visible -->
    <template v-else>
      <div class="area-header">
        <!-- Drag handle -->
        <span class="drag-handle" title="Drag to reorder">
          <GripVertical :size="14" />
        </span>

        <!-- Toggle + name + level badge -->
        <div class="area-toggle" @click="toggleCollapse" role="button" tabindex="0"
          @keydown.enter="toggleCollapse" @keydown.space.prevent="toggleCollapse"
          :aria-expanded="!isCollapsed"
        >
          <svg class="chevron" viewBox="0 0 12 12" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="2,4 6,8 10,4"/>
          </svg>
          <span class="area-name-group">
            <span class="area-name">{{ area.name }}</span>
            <!-- Level badge: editable on click -->
            <span
              v-if="!levelEditing"
              class="rec-lv"
              title="Click to edit recommended level"
              @click.stop="startEditLevel"
            >
              Char&nbsp;level:&nbsp;<span class="rec-lv-number">{{ displayLevel }}</span>
            </span>
            <span v-else class="rec-lv rec-lv-editing" @click.stop>
              Char&nbsp;level:&nbsp;<input
                ref="levelInputRef"
                class="level-input"
                type="text"
                :value="displayLevel"
                @blur="commitLevel"
                @keydown="onLevelKeydown"
                size="4"
              />
            </span>
          </span>
        </div>

        <!-- Hide toggle: revealed on header hover -->
        <button
          class="area-hide-btn"
          @click.stop="toggleHide"
          title="Hide this zone"
          aria-label="Hide this zone"
        >
          <EyeOff :size="12" />
        </button>
      </div>

      <div class="area-body">
        <!-- Notes -->
        <div>
          <span class="slabel">Notes</span>
          <textarea
            ref="notesRef"
            class="notes-textarea"
            placeholder="Add notes for this zone..."
            :value="notesValue"
            @input="onNotesInput"
            rows="1"
          />
        </div>

        <!-- Pickups -->
        <div>
          <span class="slabel">Pickups</span>
          <PlannerPickupTable :act-id="actId" :area="area" />
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.area-section {
  border: 1px solid var(--planner-border-subtle);
  border-radius: 4px;
  overflow: hidden;
  background: var(--planner-bg-surface);
}

/* ── Area header ────────────────────────────── */
.area-header {
  display: flex;
  align-items: stretch;
  background: var(--planner-bg-area-hd);
}

.drag-handle {
  display: flex;
  align-items: center;
  padding: 0 0.4rem;
  color: var(--planner-text-muted);
  opacity: 0;
  cursor: grab;
  flex-shrink: 0;
  transition: opacity 0.12s;
}
.area-section:hover .drag-handle,
.drag-handle:focus-visible {
  opacity: 1;
}
.drag-handle:active { cursor: grabbing; }

.area-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem 0.5rem 0.25rem;
  flex: 1;
  min-width: 0;
  cursor: pointer;
  user-select: none;
  transition: background 0.12s;
}
.area-toggle:hover { background: oklch(21% 0.010 57); }
.area-toggle:focus-visible {
  outline: 1px solid var(--planner-amber-dim);
  outline-offset: -2px;
}

.chevron {
  flex-shrink: 0;
  width: 13px;
  height: 13px;
  transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--planner-text-muted);
  opacity: 0.7;
}
.area-section.collapsed .area-toggle .chevron { transform: rotate(-90deg); }

.area-name-group {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex: 1;
  min-width: 0;
  overflow: hidden;
}

.area-name {
  font-size: var(--planner-fs-base);
  font-weight: 600;
  color: var(--planner-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex-shrink: 1;
  min-width: 0;
}

.rec-lv {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  font-size: var(--planner-fs-xs);
  color: var(--planner-amber-dim);
  background: var(--planner-amber-bg);
  border: 1px solid var(--planner-amber-bd);
  padding: 0.07rem 0.38rem;
  border-radius: 3px;
  white-space: nowrap;
  letter-spacing: 0.02em;
  font-family: var(--planner-mono);
  cursor: pointer;
  transition: border-color 0.12s, color 0.12s;
}
.rec-lv:hover {
  border-color: var(--planner-amber-dim);
  color: var(--planner-amber);
}
.rec-lv-editing {
  cursor: default;
  padding-right: 0.2rem;
}

.rec-lv-number {
  font-family: var(--planner-mono);
}

.level-input {
  background: transparent;
  border: none;
  color: var(--planner-amber);
  font-family: var(--planner-mono);
  font-size: var(--planner-fs-xs);
  width: 3.5rem;
  padding: 0;
  outline: none;
}

/* ── Hide button (revealed on header hover) ─────── */
.area-hide-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.5rem;
  background: transparent;
  border: none;
  cursor: pointer;
  color: var(--planner-text-muted);
  opacity: 0;
  flex-shrink: 0;
  transition: opacity 0.12s, color 0.12s;
}
.area-section:hover .area-hide-btn {
  opacity: 1;
}
.area-hide-btn:hover {
  color: var(--planner-text-2);
}
.area-hide-btn:focus-visible {
  outline: 1px solid var(--planner-amber-dim);
  outline-offset: 2px;
  opacity: 1;
}

/* ── Hidden zone strip ──────────────────────────── */
.area-hidden-strip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.5rem 0.3rem 0;
  background: var(--planner-bg-area-hd);
}

.area-hidden-name {
  flex: 1;
  min-width: 0;
  font-size: var(--planner-fs-sm);
  color: var(--planner-text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-style: italic;
}

.area-restore-btn {
  flex-shrink: 0;
  background: transparent;
  border: 1px solid var(--planner-amber-bd);
  color: var(--planner-amber-dim);
  font-size: var(--planner-fs-xs);
  font-family: var(--planner-font);
  padding: 0.15rem 0.45rem;
  border-radius: 3px;
  cursor: pointer;
  transition: border-color 0.13s, color 0.13s, background 0.13s;
  white-space: nowrap;
}
.area-restore-btn:hover {
  border-color: var(--planner-amber-dim);
  color: var(--planner-amber);
  background: var(--planner-amber-bg);
}
.area-restore-btn:focus-visible {
  outline: 1px solid var(--planner-amber-dim);
  outline-offset: 2px;
}

/* ── Area body ──────────────────────────────── */
.area-body {
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.area-section.collapsed .area-body { display: none; }

/* ── Eyebrow label ──────────────────────────── */
.slabel {
  display: block;
  font-size: var(--planner-fs-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: oklch(58% 0.007 62);
  margin-bottom: 0.25rem;
}

/* ── Notes textarea ─────────────────────────── */
.notes-textarea {
  width: 100%;
  background: var(--planner-bg-inset);
  border: 1px solid var(--planner-border-subtle);
  border-radius: 3px;
  color: var(--planner-text);
  font-size: var(--planner-fs-base);
  font-family: var(--planner-font);
  line-height: 1.6;
  padding: 0.25rem 0.5rem;
  resize: none;
  overflow: hidden;
  min-height: 2rem;
  transition: border-color 0.12s;
  display: block;
}
.notes-textarea:focus {
  outline: none;
  border-color: var(--planner-border);
}
.notes-textarea::placeholder {
  color: var(--planner-text-muted);
  font-style: italic;
  opacity: 0.5;
}

@media (max-width: 640px) {
  .area-body { padding: 0.5rem 0.75rem; }
}

@media (prefers-reduced-motion: reduce) {
  .chevron,
  .area-toggle,
  .rec-lv,
  .notes-textarea,
  .drag-handle,
  .area-hide-btn,
  .area-restore-btn {
    transition: none;
  }
}
</style>
