<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useGuideStore } from "~/composables/useGuideStore";
import {
	createPlannerContext,
	providePlannerContext,
} from "~/composables/usePlannerState";
import { DATA } from "~/data/campaign";
import { normalizePlannerState } from "~/lib/plannerState";

interface GuideResponse {
	id: string;
	name: string;
	version: string;
	currentVersion: string;
	state: unknown;
	updatedAt: string;
	lastViewedAt: string;
}

const route = useRoute();
const guideId = route.params.id as string;

const {
	data: guideData,
	error,
	refresh,
} = await useAsyncData<GuideResponse>(`guide-${guideId}`, () =>
	$fetch<GuideResponse>(`/api/guides/${guideId}`),
);

if (error.value || !guideData.value) {
	throw createError({ statusCode: 404, message: "Guide not found" });
}

const guide = computed(() => guideData.value as GuideResponse);
const normalizedState = normalizePlannerState(guide.value.state);

const draftKey = `poe2-guide-draft-${guideId}`;

// Context with a scoped draft key so in-progress edits survive refresh.
// The watcher only starts when the owner calls hydrateFromStorage() below.
const context = createPlannerContext({
	initialState: normalizedState,
	initialName: guide.value.name,
	persistenceKey: draftKey,
	readonly: true, // start readonly; setReadonly(false) after mount if owner
});
providePlannerContext(context);

const guideStore = useGuideStore();

const mounted = ref(false);
const versionMismatch = computed(
	() => guide.value.version !== guide.value.currentVersion,
);
const versionBannerDismissed = ref(false);

onMounted(() => {
	mounted.value = true;
	guideStore.load();

	// Check if we have an edit token for this guide
	const hasToken = guideStore.hasEditToken(guideId);
	if (hasToken) {
		context.setReadonly(false);
		// Restore any unsaved edits from the last session.
		// hydrateFromStorage also starts the persistence watcher.
		context.hydrateFromStorage?.();
	}

	// Check version mismatch banner dismissal
	try {
		const dismissed = sessionStorage.getItem(
			`guide-version-dismissed-${guideId}`,
		);
		if (dismissed === "1") versionBannerDismissed.value = true;
	} catch {}
});

function dismissVersionBanner() {
	versionBannerDismissed.value = true;
	try {
		sessionStorage.setItem(`guide-version-dismissed-${guideId}`, "1");
	} catch {}
}

function clearDraft() {
	try {
		localStorage.removeItem(draftKey);
		localStorage.removeItem(`${draftKey}-name`);
	} catch {}
}

async function discardLocalEditsAndReload() {
	clearDraft();
	await refresh();
	if (!guideData.value) {
		throw new Error("Guide not found");
	}
	context.replaceState(
		normalizePlannerState(guideData.value.state),
		guideData.value.name,
	);
	context.setReadonly(true);
}

useHead({
	title: computed(() => `${guide.value.name} - PoE2 Campaign Planner`),
});
</script>

<template>
  <div class="bg-p-bg text-p-text font-p text-p-base leading-relaxed min-h-screen">
    <PlannerHeader
      :guide-id="guideId"
      :guide-version="guide.version"
      :on-discard-local-edits="discardLocalEditsAndReload"
    />
    <PlannerGuideBar />

    <!-- Version mismatch banner -->
    <div
      v-if="versionMismatch && !versionBannerDismissed"
      class="max-w-[1020px] mx-auto px-6 pb-2 max-sm:px-4"
    >
      <div class="flex items-start justify-between gap-3 bg-p-surface border border-p-border rounded-[4px] px-4 py-2.5">
        <p class="text-p-xs text-p-muted leading-normal">
          This guide was created for <span class="font-p-mono">{{ guide.version }}</span> - some content may be outdated.
        </p>
        <button
          class="text-p-xs text-p-muted hover:text-p-text2 shrink-0 transition-colors duration-120"
          aria-label="Dismiss version warning"
          @click="dismissVersionBanner"
        >Dismiss</button>
      </div>
    </div>

    <main class="max-w-[1020px] mx-auto px-6 pt-2 pb-24 flex flex-col gap-6 sm:px-4 sm:pt-2 sm:pb-20 sm:gap-4">
      <PlannerActSection
        v-for="act in DATA"
        :key="act.id"
        :act="act"
      />
    </main>
  </div>
</template>
