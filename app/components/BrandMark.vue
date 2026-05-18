<!--
  BrandMark — the app's logo mark.

  Three horizontal bars forming a stylized E without a spine. The middle arm
  is intentionally shorter (~64% of the outer arms), following classical E
  proportions and distinguishing it from a generic hamburger icon. Equal stroke
  weights keep the mark clean and scalable.

  Usage:
    <BrandMark />              — inherits currentColor
    <BrandMark :size="14" />   — override rendered size
    <BrandMark class="..." />  — pass Tailwind/custom classes
-->
<script setup lang="ts">
interface Props {
	size?: number;
	class?: string;
}

const props = withDefaults(defineProps<Props>(), {
	size: 11,
});
</script>

<template>
  <svg
    :width="props.size"
    :height="Math.round(props.size * 10 / 11)"
    viewBox="0 0 11 10"
    fill="none"
    stroke="currentColor"
    stroke-linecap="round"
    aria-hidden="true"
    :class="props.class"
  >
    <!-- Top arm — full width -->
    <line x1="0.8" y1="2.5" x2="10.2" y2="2.5" stroke-width="1.55"/>
    <!-- Middle arm — shorter (~64%), classic E proportion -->
    <line x1="0.8" y1="5"   x2="6.2"  y2="5"   stroke-width="1.55"/>
    <!-- Bottom arm — full width -->
    <line x1="0.8" y1="7.5" x2="10.2" y2="7.5" stroke-width="1.55"/>
  </svg>
</template>
