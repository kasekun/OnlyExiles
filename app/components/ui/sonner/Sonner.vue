<script lang="ts" setup>
import type { ToasterProps } from "vue-sonner";
import { Toaster as Sonner } from "vue-sonner";
import { cn } from "@/lib/utils";

const props = defineProps<ToasterProps>();

const toastOptions = {
	classes: {
		toast: "planner-toast",
		description: "planner-toast-description",
		actionButton: "planner-toast-action",
		cancelButton: "planner-toast-cancel",
		closeButton: "planner-toast-close",
	},
	...props.toastOptions,
};
</script>

<template>
  <Sonner
    :class="cn('toaster group', props.class)"
    :style="{
      '--normal-bg': 'var(--planner-bg-surface)',
      '--normal-text': 'var(--planner-text)',
      '--normal-border': 'var(--planner-border)',
      '--border-radius': '4px',
      ...props.style,
    }"
    :id="props.id"
    :invert="props.invert"
    :theme="props.theme"
    :position="props.position"
    :close-button-position="props.closeButtonPosition"
    :hotkey="props.hotkey"
    :rich-colors="props.richColors"
    :expand="props.expand"
    :duration="props.duration"
    :gap="props.gap"
    :visible-toasts="props.visibleToasts"
    :close-button="props.closeButton"
    :offset="props.offset"
    :mobile-offset="props.mobileOffset"
    :dir="props.dir"
    :swipe-directions="props.swipeDirections"
    :icons="props.icons"
    :container-aria-label="props.containerAriaLabel"
    :toast-options="toastOptions"
  />
</template>
