<script setup lang="ts">
import { TooltipProvider } from "@/components/ui/tooltip";
</script>

<template>
  <TooltipProvider :delay-duration="400">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <PlannerFloatingActions />
  </TooltipProvider>
</template>
