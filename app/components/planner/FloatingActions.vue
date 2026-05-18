<script setup lang="ts">
import { SquareArrowOutUpRight } from "lucide-vue-next";

const REPO = "https://github.com/kasekun/poe2drops";
</script>

<template>
  <div class="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-[0.625rem] max-sm:bottom-4 max-sm:right-4">

    <!-- Utility links: quiet pair -->
    <div class="flex flex-col items-end gap-1">
      <a
        :href="`${REPO}/issues/new`"
        target="_blank"
        rel="noreferrer noopener"
        class="inline-flex items-center gap-[0.35rem] h-7 px-[0.6rem] bg-p-surface text-p-muted text-p-xs font-p leading-none whitespace-nowrap no-underline border border-p-subtle rounded-lg transition-[border-color,color] duration-130 hover:border-p-border hover:text-p-text2 focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-[3px]"
      >
        See an error? Raise an issue
        <SquareArrowOutUpRight :size="11" aria-hidden="true" />
      </a>

      <a
        :href="`${REPO}/edit/main/app/data/campaign.ts`"
        target="_blank"
        rel="noreferrer noopener"
        class="inline-flex items-center gap-[0.35rem] h-7 px-[0.6rem] bg-p-surface text-p-muted text-p-xs font-p leading-none whitespace-nowrap no-underline border border-p-subtle rounded-lg transition-[border-color,color] duration-130 hover:border-p-border hover:text-p-text2 focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-[3px]"
      >
        Fix an error, raise a PR
        <SquareArrowOutUpRight :size="11" aria-hidden="true" />
      </a>
    </div>

    <!-- BMC: warmer, more prominent anchor -->
    <a
      href="https://www.buymeacoffee.com/jesseswan"
      target="_blank"
      rel="noreferrer noopener"
      class="inline-flex items-center gap-[0.4rem] h-8 pl-1.5 pr-[0.625rem] bg-p-area text-p-text2 text-p-xs font-p font-medium leading-none whitespace-nowrap no-underline border border-p-border rounded-lg transition-[border-color,color] duration-130 hover:border-p-amber-dim hover:text-p-text focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-[3px]"
      aria-label="Buy me a coffee — support this project"
    >
      <img
        src="/bmc-logo.svg"
        class="h-6 w-6 rounded-[4px] shrink-0 block bg-[#ffdd00] p-[2px] object-contain"
        width="24"
        height="24"
        alt=""
        aria-hidden="true"
      />
      Buy me a coffee
      <SquareArrowOutUpRight :size="11" class="text-p-muted shrink-0" aria-hidden="true" />
    </a>
  </div>
</template>
