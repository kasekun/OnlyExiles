<script setup lang="ts">
import { ArrowRight, CheckCircle2 } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
</script>

<template>
  <main class="min-h-svh bg-background text-foreground">
    <NuxtRouteAnnouncer />

    <section class="mx-auto flex min-h-svh w-full max-w-5xl flex-col justify-center px-6 py-16 sm:px-8">
      <div class="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div class="space-y-8">
          <p class="text-sm font-medium uppercase tracking-[0.28em] text-muted-foreground">
            Poe2Drops
          </p>

          <div class="space-y-5">
            <h1 class="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
              Stack is live for smarter Path of Exile 2 drop planning.
            </h1>
            <p class="max-w-2xl text-lg leading-8 text-muted-foreground">
              Nuxt, Tailwind CSS, and shadcn-vue are ready. The next pass can turn the seed data into
              route planning, reward notes, and shareable farming checklists.
            </p>
          </div>

          <div class="flex flex-col gap-3 sm:flex-row">
            <Button size="lg">
              Start the planner slice
              <ArrowRight class="size-4" />
            </Button>
            <Button variant="outline" size="lg" as-child>
              <a href="https://nuxt.com/docs/getting-started/deployment" target="_blank" rel="noreferrer">
                Deployment docs
              </a>
            </Button>
          </div>
        </div>

        <Card class="border-border/70 bg-card">
          <CardHeader>
            <CardDescription>Bring-up status</CardDescription>
            <CardTitle>Deployable hello world</CardTitle>
          </CardHeader>
          <CardContent>
            <ul class="space-y-4 text-sm text-muted-foreground">
              <li class="flex gap-3">
                <CheckCircle2 class="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Nuxt app shell is running from the repository root.</span>
              </li>
              <li class="flex gap-3">
                <CheckCircle2 class="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Tailwind CSS and shadcn-vue tokens are wired into the UI.</span>
              </li>
              <li class="flex gap-3">
                <CheckCircle2 class="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Bun scripts are ready for local preview and Vercel builds.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </section>
  </main>
</template>
