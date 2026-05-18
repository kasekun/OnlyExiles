<script setup lang="ts">
import { onMounted } from "vue";
import { usePlausible } from "~/composables/usePlausible";
import { DATA } from "~/data/campaign";

const { trackPageview } = usePlausible();
const router = useRouter();

onMounted(() => {
	trackPageview();
});

router.afterEach(() => {
	trackPageview();
});
</script>

<template>
  <div class="bg-p-bg text-p-text font-p text-p-base leading-relaxed min-h-screen">
    <PlannerHeader />
    <main class="max-w-[1020px] mx-auto px-6 pt-6 pb-24 flex flex-col gap-6 sm:px-4 sm:pt-4 sm:pb-20 sm:gap-4">
      <PlannerActSection
        v-for="act in DATA"
        :key="act.id"
        :act="act"
      />
    </main>
  </div>
</template>
