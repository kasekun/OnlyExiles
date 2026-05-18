<script setup lang="ts">
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
</script>

<template>
  <TooltipProvider :delay-duration="400">
    <NuxtRouteAnnouncer />
    <NuxtPage />
    <PlannerFloatingActions />
    <Toaster position="bottom-center" :duration="4000" />
  </TooltipProvider>
</template>
