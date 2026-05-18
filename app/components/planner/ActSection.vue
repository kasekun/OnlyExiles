<script setup lang="ts">
import { computed, ref } from "vue";
import { VueDraggable } from "vue-draggable-plus";
import { usePlannerState } from "~/composables/usePlannerState";
import type { Act } from "~/data/campaign";

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
  <div class="border border-p-border rounded-[5px] overflow-hidden">

    <!-- Act header -->
    <div class="flex items-stretch bg-p-act">
      <button
        class="flex items-center gap-2 px-4 py-3 flex-1 min-w-0 bg-transparent border-0 cursor-pointer text-left text-p-amber text-p-md font-bold tracking-[-0.01em] font-p transition-[background] duration-120 select-none hover:bg-[oklch(17.5%_0.022_62)] focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-[-2px]"
        @click="toggleCollapse"
        :aria-expanded="!isCollapsed"
      >
        <PlannerChevron :collapsed="isCollapsed" class="opacity-70" />
        <span>{{ act.title }}</span>
      </button>

      <div
        v-show="!isCollapsed"
        class="flex items-center gap-1 px-3 shrink-0 border-l border-p-amber-bd"
      >
        <button class="planner-btn-act" @click="expandActAreas(act.id)">Expand zones</button>
        <button class="planner-btn-act" @click="collapseActAreas(act.id)">Collapse zones</button>
        <button class="planner-btn-act" @click="actNoteOpen = !actNoteOpen" :aria-pressed="actNoteOpen">
          {{ actNoteOpen ? "Hide note" : "Act note" }}
        </button>
      </div>
    </div>

    <!-- Act body -->
    <div v-show="!isCollapsed" class="bg-p-inset p-2 flex flex-col gap-2">

      <!-- Act note panel -->
      <div v-if="actNoteOpen" class="bg-p-surface border border-p-subtle rounded-[4px] p-3 px-4">
        <div class="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
          <div class="flex flex-col gap-1">
            <span class="planner-eyebrow">Act note</span>
            <textarea
              class="planner-textarea"
              placeholder="Notes for this act..."
              :value="actNote"
              @input="actNote = ($event.target as HTMLTextAreaElement).value; onActNoteInput($event)"
              rows="2"
            />
          </div>
          <div class="flex flex-col gap-1">
            <div class="flex items-center justify-between">
              <span class="planner-eyebrow">Loot filter regex</span>
              <button
                class="planner-btn-act py-[0.1rem] px-[0.38rem]"
                @click="copyRegex"
                :disabled="!actRegex.trim()"
              >
                Copy
              </button>
            </div>
            <code class="block bg-p-inset border border-p-subtle rounded-[3px] overflow-hidden">
              <textarea
                class="planner-textarea font-p-mono text-p-sm border-0 rounded-none bg-transparent min-h-0"
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
        class="flex flex-col gap-2"
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
