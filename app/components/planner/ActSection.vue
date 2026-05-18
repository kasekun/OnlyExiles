<script setup lang="ts">
import { computed, ref } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import type { Act } from "~/data/campaign";
import { usePlannerState, areaKey } from "~/composables/usePlannerState";

const props = defineProps<{ act: Act }>();

const { state, expandActAreas, collapseActAreas } = usePlannerState();

const isCollapsed = computed(() => !!state.actsCollapsed[props.act.id]);

function toggleCollapse() {
	state.actsCollapsed[props.act.id] = !isCollapsed.value;
}

// Ordered area IDs — custom order from state, falls back to DATA order
const orderedAreaIds = computed({
	get() {
		const custom = state.areaOrder[props.act.id];
		const defaultIds = props.act.areas.map((a) => a.id);
		if (!custom || custom.length === 0) return defaultIds;
		const customSet = new Set(custom);
		const extra = defaultIds.filter((id) => !customSet.has(id));
		return [...custom, ...extra];
	},
	set(newOrder: string[]) {
		state.areaOrder[props.act.id] = newOrder;
	},
});

const orderedAreas = computed(() =>
	orderedAreaIds.value
		.map((id) => props.act.areas.find((a) => a.id === id))
		.filter((a) => a !== undefined),
);

// Act note
const actNoteOpen = ref(false);

const actNote = computed({
	get() {
		return state.actNotes[props.act.id] ?? "";
	},
	set(v: string) {
		state.actNotes[props.act.id] = v;
	},
});

const actRegex = computed({
	get() {
		return state.actRegex[props.act.id] ?? "";
	},
	set(v: string) {
		state.actRegex[props.act.id] = v;
	},
});

async function copyRegex() {
	const val = actRegex.value.trim();
	if (!val) return;
	await navigator.clipboard.writeText(val).catch(() => {});
}


function autoResize(el: HTMLTextAreaElement) {
	el.style.height = "auto";
	el.style.height = `${Math.max(el.scrollHeight, 32)}px`;
}

function onActNoteInput(e: Event) {
	autoResize(e.target as HTMLTextAreaElement);
}
</script>

<template>
  <div class="act-section" :class="{ collapsed: isCollapsed }">
    <!-- Act header -->
    <div class="act-header">
      <button class="act-toggle" @click="toggleCollapse" :aria-expanded="!isCollapsed">
        <svg class="chevron" viewBox="0 0 12 12" fill="none" stroke="currentColor"
          stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="2,4 6,8 10,4"/>
        </svg>
        <span>{{ act.title }}</span>
      </button>
      <div class="act-btns">
        <button class="act-btn" @click="expandActAreas(act.id)">Expand zones</button>
        <button class="act-btn" @click="collapseActAreas(act.id)">Collapse zones</button>
        <button class="act-btn" @click="actNoteOpen = !actNoteOpen" :aria-pressed="actNoteOpen">
          {{ actNoteOpen ? "Hide note" : "Act note" }}
        </button>
      </div>
    </div>

    <!-- Act body -->
    <div class="act-body">
      <!-- Act note panel -->
      <div v-if="actNoteOpen" class="act-note-panel">
        <div class="act-note-row">
          <div class="act-note-field">
            <span class="slabel">Act note</span>
            <textarea
              class="notes-textarea"
              placeholder="Notes for this act..."
              :value="actNote"
              @input="actNote = ($event.target as HTMLTextAreaElement).value; onActNoteInput($event)"
              rows="2"
            />
          </div>
          <div class="act-regex-field">
            <div class="regex-label-row">
              <span class="slabel">Loot filter regex</span>
              <button class="act-btn copy-regex-btn" @click="copyRegex" :disabled="!actRegex.trim()">
                Copy
              </button>
            </div>
            <code class="regex-codebox">
              <textarea
                class="regex-input"
                placeholder="e.g. ^(Uncut Skill|Exalted Orb)"
                :value="actRegex"
                @input="actRegex = ($event.target as HTMLTextAreaElement).value; onActNoteInput($event)"
                rows="2"
                spellcheck="false"
              />
            </code>
          </div>
        </div>
      </div>

      <!-- Draggable areas list -->
      <VueDraggable
        v-model="orderedAreaIds"
        :animation="150"
        handle=".drag-handle"
        ghost-class="drag-ghost"
        class="areas-list"
        tag="div"
      >
        <PlannerAreaSection
          v-for="area in orderedAreas"
          :key="area.id"
          :act-id="act.id"
          :area="area"
        />
      </VueDraggable>
    </div>
  </div>
</template>

<style scoped>
.act-section {
  border: 1px solid var(--planner-border);
  border-radius: var(--planner-radius);
  overflow: hidden;
}

/* ── Act header ───────────────────────────── */
.act-header {
  display: flex;
  align-items: stretch;
  background: var(--planner-bg-act-hd);
}

.act-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  flex: 1;
  min-width: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
  color: var(--planner-amber);
  font-size: var(--planner-fs-md);
  font-weight: 700;
  letter-spacing: -0.01em;
  font-family: var(--planner-font);
  transition: background 0.12s;
  user-select: none;
}
.act-toggle:hover { background: oklch(17.5% 0.022 62); }
.act-toggle:focus-visible {
  outline: 1px solid var(--planner-amber-dim);
  outline-offset: -2px;
}

.chevron {
  flex-shrink: 0;
  width: 13px;
  height: 13px;
  transition: transform 0.18s cubic-bezier(0.4, 0, 0.2, 1);
  color: inherit;
  opacity: 0.7;
}
.act-section.collapsed .act-toggle .chevron { transform: rotate(-90deg); }

.act-btns {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0 0.75rem;
  flex-shrink: 0;
  border-left: 1px solid var(--planner-amber-bd);
}
.act-section.collapsed .act-btns { display: none; }

.act-btn {
  background: transparent;
  border: 1px solid var(--planner-amber-bd);
  color: var(--planner-amber-dim);
  font-size: var(--planner-fs-xs);
  padding: 0.2rem 0.48rem;
  border-radius: 3px;
  cursor: pointer;
  font-family: var(--planner-font);
  transition: border-color 0.13s, color 0.13s, background 0.13s;
  white-space: nowrap;
}
.act-btn:hover {
  border-color: var(--planner-amber-dim);
  color: var(--planner-amber);
  background: var(--planner-amber-bg);
}
.act-btn:focus-visible {
  outline: 1px solid var(--planner-amber-dim);
  outline-offset: 2px;
}
.act-btn:disabled {
  opacity: 0.4;
  cursor: default;
}

/* ── Act body ─────────────────────────────── */
.act-body {
  background: var(--planner-bg-inset);
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.act-section.collapsed .act-body { display: none; }

/* ── Act note panel ───────────────────────── */
.act-note-panel {
  background: var(--planner-bg-surface);
  border: 1px solid var(--planner-border-subtle);
  border-radius: 4px;
  padding: 0.75rem 1rem;
}

.act-note-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 640px) {
  .act-note-row { grid-template-columns: 1fr; }
}

.act-note-field,
.act-regex-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.regex-label-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.copy-regex-btn {
  font-size: var(--planner-fs-xs);
  padding: 0.1rem 0.38rem;
}

.slabel {
  display: block;
  font-size: var(--planner-fs-xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: oklch(58% 0.007 62);
  margin-bottom: 0.1rem;
}

.notes-textarea,
.regex-input {
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
.notes-textarea:focus,
.regex-input:focus {
  outline: none;
  border-color: var(--planner-border);
}
.notes-textarea::placeholder,
.regex-input::placeholder {
  color: var(--planner-text-muted);
  font-style: italic;
  opacity: 0.5;
}

.regex-codebox {
  display: block;
  background: var(--planner-bg-inset);
  border: 1px solid var(--planner-border-subtle);
  border-radius: 3px;
  overflow: hidden;
}
.regex-input {
  font-family: var(--planner-mono);
  font-size: var(--planner-fs-sm);
  border: none;
  border-radius: 0;
  background: transparent;
}

/* ── Areas list ───────────────────────────── */
.areas-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Drag ghost */
:global(.drag-ghost) {
  opacity: 0.4;
}

@media (prefers-reduced-motion: reduce) {
  .chevron,
  .act-toggle,
  .act-btn,
  .notes-textarea,
  .regex-input {
    transition: none;
  }
}
</style>
