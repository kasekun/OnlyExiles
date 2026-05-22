<script setup lang="ts">
import { Eye } from "lucide-vue-next";
import { computed, ref } from "vue";
import { usePlannerState } from "~/composables/usePlannerState";

const context = usePlannerState();
const { readonly, guideName } = context;

const guideDisplayName = computed(
	() => guideName.value.trim() || "Untitled guide",
);

const nameInputRef = ref<HTMLInputElement | null>(null);
const nameFocused = ref(false);

function commitName(e: Event) {
	const val = (e.target as HTMLInputElement).value.trim();
	guideName.value = val;
	nameFocused.value = false;
}

function onNameKeydown(e: KeyboardEvent) {
	if (e.key === "Enter") (e.target as HTMLInputElement).blur();
	if (e.key === "Escape") {
		nameFocused.value = false;
		nameInputRef.value?.blur();
	}
}
</script>

<template>
  <div class="max-w-[1020px] mx-auto px-6 flex items-center gap-4 py-3 max-sm:px-4 max-sm:py-2">
    <!-- Guide name: editable when owner, static when viewer -->
    <div class="flex-1 min-w-0">
      <input
        v-if="!readonly"
        ref="nameInputRef"
        class="w-full bg-transparent border border-transparent rounded-[3px] px-2 py-[0.18rem] text-p-lg font-semibold text-p-text tracking-[-0.01em] placeholder:text-p-muted outline-none transition-[border-color,background-color] duration-150 hover:border-p-subtle focus:bg-p-inset focus:border-p-border truncate"
        :value="guideName"
        placeholder="Untitled guide"
        maxlength="255"
        spellcheck="false"
        autocomplete="off"
        @focus="nameFocused = true"
        @blur="commitName; nameFocused = false"
        @keydown="onNameKeydown"
        @change="commitName"
      />
      <span
        v-else
        class="block text-p-lg font-semibold text-p-text tracking-[-0.01em] truncate px-2 py-[0.18rem]"
      >{{ guideDisplayName }}</span>
    </div>

    <!-- View-only badge -->
    <div
      v-if="readonly"
      class="shrink-0 inline-flex items-center gap-[0.3rem] px-[0.45rem] py-[0.18rem] rounded-[3px] border border-p-blue-bd bg-p-blue-bg text-p-blue text-p-xs select-none"
      aria-label="You are viewing this guide in read-only mode"
    >
      <Eye :size="10" aria-hidden="true" class="shrink-0 opacity-70" />
      <span>Viewing</span>
    </div>

    <!-- Expand / Collapse -->
    <div class="flex items-center shrink-0">
      <button
        class="px-2 py-1 rounded-[3px] text-p-xs text-p-muted hover:text-p-text2 transition-colors duration-120 focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-2"
        @click="context.expandAll()"
      >Expand all</button>
      <span aria-hidden="true" class="text-p-subtle text-p-xs select-none px-0.5">|</span>
      <button
        class="px-2 py-1 rounded-[3px] text-p-xs text-p-muted hover:text-p-text2 transition-colors duration-120 focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-2"
        @click="context.collapseAll()"
      >Collapse all</button>
    </div>
  </div>
</template>
