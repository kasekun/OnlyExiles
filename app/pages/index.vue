<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import {
	createPlannerContext,
	providePlannerContext,
} from "~/composables/usePlannerState";
import { usePlausible } from "~/composables/usePlausible";
import { DATA } from "~/data/campaign";

const { trackPageview } = usePlausible();
const router = useRouter();
const unregisterAfterEach = router.afterEach(() => {
	trackPageview();
});

const context = createPlannerContext({
	persistenceKey: "poe2-planner-v1",
	applyDefaultView: true,
});
providePlannerContext(context);

const mounted = ref(false);
onMounted(() => {
	mounted.value = true;
	context.hydrateFromStorage?.();
	trackPageview();
});

onUnmounted(() => {
	unregisterAfterEach();
});
</script>

<template>
  <div class="bg-p-bg text-p-text font-p text-p-base leading-relaxed min-h-screen">
    <PlannerHeader />
    <PlannerGuideBar />
    <main class="max-w-[1020px] mx-auto px-6 pt-2 pb-24 flex flex-col gap-6 sm:px-4 sm:pt-2 sm:pb-20 sm:gap-4">
      <template v-if="!mounted">
        <div class="text-p-xs text-p-muted py-2 opacity-60">Loading saved route…</div>
      </template>
      <PlannerActSection
        v-for="act in DATA"
        :key="act.id"
        :act="act"
      />
    </main>
  </div>
</template>
