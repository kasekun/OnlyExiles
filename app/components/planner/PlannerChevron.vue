<script setup lang="ts">
defineProps<{ collapsed?: boolean }>();
</script>

<template>
  <svg
    class="chevron shrink-0 w-[13px] h-[13px] transition-transform duration-180 ease-in-out"
    :class="{ '-rotate-90': collapsed }"
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <polyline points="2,4 6,8 10,4" />
  </svg>
</template>
