<script setup lang="ts">
import { onMounted } from "vue";
import { DATA } from "~/data/campaign";
import { usePlausible } from "~/composables/usePlausible";

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
  <div class="planner-root">
    <PlannerHeader />
    <main class="planner-main">
      <PlannerActSection
        v-for="act in DATA"
        :key="act.id"
        :act="act"
      />
    </main>
  </div>
</template>

<style scoped>
.planner-root {
  background: var(--planner-bg);
  color: var(--planner-text);
  font-family: var(--planner-font);
  font-size: var(--planner-fs-base);
  line-height: 1.6;
  min-height: 100vh;
}

.planner-main {
  max-width: 1020px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem 6rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

@media (max-width: 640px) {
  .planner-main {
    padding: 1rem 1rem 5rem;
    gap: 1rem;
  }
}
</style>
