<script setup lang="ts">
import { ArrowLeft, RefreshCw } from "lucide-vue-next";

interface NuxtError {
	url: string;
	statusCode: number;
	statusMessage: string;
	message: string;
}

const props = defineProps<{
	error: NuxtError;
}>();

const is404 = computed(() => props.error.statusCode === 404);

useHead({
	title: computed(() =>
		is404.value
			? "Guide not found - PoE2 Campaign Planner"
			: "Error - PoE2 Campaign Planner",
	),
});

function goHome() {
	clearError({ redirect: "/" });
}

function retry() {
	clearError({ redirect: props.error.url });
}
</script>

<template>
  <div class="min-h-screen bg-p-bg text-p-text font-p text-p-base flex flex-col">
    <!-- Brand header -->
    <header class="border-b border-p-border">
      <div class="max-w-[1020px] mx-auto px-6 py-2 max-sm:px-4">
        <a
          href="/"
          class="inline-flex items-center gap-2 text-p-lg font-bold text-p-amber tracking-[-0.01em] leading-[1.3] focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-2 rounded-[3px]"
          @click.prevent="goHome"
        >
          <BrandMark :size="13" class="shrink-0" />
          <span class="max-sm:hidden">PoE2 Campaign Planner</span>
          <span class="hidden max-sm:inline">PoE2 Planner</span>
        </a>
      </div>
    </header>

    <!-- Error content -->
    <main class="flex-1 flex items-center justify-center px-6 py-16">
      <div class="max-w-[360px] w-full flex flex-col gap-5">

        <!-- Status code label -->
        <span class="font-p-mono text-p-xs text-p-amber-dim">
          {{ error.statusCode }}
        </span>

        <!-- Headline + body -->
        <div class="flex flex-col gap-2.5">
          <h1 class="text-p-md font-bold text-p-amber tracking-[-0.01em] leading-[1.3]">
            {{ is404 ? 'Guide not found' : 'Something went wrong' }}
          </h1>
          <p class="text-p-sm text-p-muted leading-relaxed">
            <template v-if="is404">
              That guide doesn't exist, or the link may be outdated.
              Check the URL and try again, or head back to start fresh.
            </template>
            <template v-else>
              An unexpected error occurred. Try refreshing the page,
              or go back to the planner.
            </template>
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-2 pt-1">
          <button class="planner-btn-act" @click="goHome">
            <ArrowLeft :size="11" aria-hidden="true" />
            Back to planner
          </button>
          <button
            v-if="!is404"
            class="planner-btn-ghost"
            @click="retry"
          >
            <RefreshCw :size="11" aria-hidden="true" />
            Refresh
          </button>
        </div>

      </div>
    </main>
  </div>
</template>
