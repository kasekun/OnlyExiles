<script setup lang="ts">
import { computed, ref } from "vue";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useMarkdownExport } from "~/composables/useMarkdownExport";

const props = defineProps<{ open: boolean; version?: string }>();
const emit = defineEmits<{ "update:open": [value: boolean] }>();

const includeEmpty = ref(true);
const omitSkipped = ref(false);
type CopyState = "idle" | "success" | "error";
const copyState = ref<CopyState>("idle");

const { getMarkdown, copyMarkdown } = useMarkdownExport();

const preview = computed(() =>
	getMarkdown({
		includeEmptyZones: includeEmpty.value,
		omitSkippedZones: omitSkipped.value,
		version: props.version,
	}),
);

async function handleCopy() {
	const ok = await copyMarkdown({
		includeEmptyZones: includeEmpty.value,
		omitSkippedZones: omitSkipped.value,
		version: props.version,
	});
	copyState.value = ok ? "success" : "error";
	setTimeout(
		() => {
			copyState.value = "idle";
			if (ok) emit("update:open", false);
		},
		ok ? 900 : 2000,
	);
}
</script>

<template>
  <Dialog :open="open" @update:open="emit('update:open', $event)">
    <DialogContent class="planner-dialog sm:max-w-[640px]" :show-close-button="false">

      <DialogTitle class="text-p-md font-bold text-p-amber tracking-[-0.01em] leading-[1.3]">
        Export Markdown
      </DialogTitle>

      <!-- Live preview -->
      <pre class="planner-export-preview">{{ preview }}</pre>

      <!-- Options -->
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2.5">
          <Checkbox
            id="include-empty"
            :checked="includeEmpty"
            @update:checked="includeEmpty = !!$event"
            class="planner-checkbox"
          />
          <label
            for="include-empty"
            class="text-p-sm text-p-text cursor-pointer select-none leading-[1.4]"
          >
            Include zones with no pickups
          </label>
        </div>
        <div class="flex items-center gap-2.5">
          <Checkbox
            id="omit-skipped"
            :checked="omitSkipped"
            @update:checked="omitSkipped = !!$event"
            class="planner-checkbox"
          />
          <label
            for="omit-skipped"
            class="text-p-sm text-p-text cursor-pointer select-none leading-[1.4]"
          >
            Omit skipped zones from export
          </label>
        </div>
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-end gap-1.5 pt-1">
        <button
          class="planner-btn-ghost"
          @click="emit('update:open', false)"
        >
          Cancel
        </button>
        <button
          class="planner-btn-ghost"
          :class="{
            'border-p-error text-p-error hover:border-p-error hover:text-p-error': copyState === 'error',
            'border-p-amber-dim text-p-amber-dim hover:border-p-amber hover:text-p-amber': copyState === 'success',
          }"
          @click="handleCopy"
        >
          {{ copyState === 'success' ? 'Copied!' : copyState === 'error' ? 'Copy failed' : 'Copy to clipboard' }}
        </button>
      </div>

    </DialogContent>
  </Dialog>
</template>
