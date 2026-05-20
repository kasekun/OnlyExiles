<script setup lang="ts">
import {
	BookMarked,
	Check,
	Copy,
	ExternalLink,
	Eye,
	EyeOff,
	GitFork,
	KeyRound,
	Link2,
	Loader2,
	MoreHorizontal,
	Share2,
} from "lucide-vue-next";
import { computed, nextTick, onMounted, ref } from "vue";
import { toast } from "vue-sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGuideStore } from "~/composables/useGuideStore";
import { usePlannerState } from "~/composables/usePlannerState";
import { TEMPLATES } from "~/data/templates";

const props = defineProps<{
	guideId?: string;
	guideVersion?: string;
	onDiscardLocalEdits?: () => Promise<void> | void;
}>();

const router = useRouter();
const context = usePlannerState();
const { state, readonly, guideName } = context;
const guideStore = useGuideStore();

const mounted = ref(false);
onMounted(() => {
	mounted.value = true;
	guideStore.load();
});

// ── Computed state ──────────────────────────────────────────────────────────

const skippedCount = computed(
	() => Object.values(state.skipped).filter(Boolean).length,
);

const mode = computed(() => {
	if (!props.guideId) return "scratch" as const;
	if (readonly.value) return "viewer" as const;
	return "owner" as const;
});

const isSaved = computed(() => !!props.guideId);

const guideDisplayName = computed(
	() => guideName.value.trim() || "Untitled guide",
);

const exportDialogOpen = ref(false);

// ── Guide name editing ───────────────────────────────────────────────────────

const nameInputRef = ref<HTMLInputElement | null>(null);
const nameFocused = ref(false);

function focusName() {
	if (readonly.value) return;
	nameFocused.value = true;
	nextTick(() => nameInputRef.value?.select());
}

function commitName(e: Event) {
	const val = (e.target as HTMLInputElement).value.trim();
	guideName.value = val;
	nameFocused.value = false;
}

function onNameKeydown(e: KeyboardEvent) {
	if (e.key === "Enter") (e.target as HTMLInputElement).blur();
	if (e.key === "Escape") {
		nameFocused.value = false;
		nameInputRef.value?.blur();
	}
}

// ── Panel state ──────────────────────────────────────────────────────────────

type Panel = "save" | "share" | "passphrase" | null;
const openPanel = ref<Panel>(null);

function setPanel(p: Panel) {
	openPanel.value = openPanel.value === p ? null : p;
}

function closePanel() {
	openPanel.value = null;
	passphraseValue.value = "";
	confirmValue.value = "";
	passphraseError.value = "";
	saving.value = "idle";
}

// ── Save panel ───────────────────────────────────────────────────────────────

const passphraseValue = ref("");
const confirmValue = ref("");
const showPassphrase = ref(false);
const saving = ref<"idle" | "saving" | "error">("idle");
const saveError = ref("");

async function publishGuide() {
	if (passphraseValue.value.length < 8) {
		saveError.value = "Passphrase must be at least 8 characters.";
		return;
	}
	if (passphraseValue.value !== confirmValue.value) {
		saveError.value = "Passphrases do not match.";
		return;
	}
	saving.value = "saving";
	saveError.value = "";
	try {
		const { id } = await guideStore.saveGuide(context, passphraseValue.value);
		toast("Guide published");
		closePanel();
		await router.push(`/guide/${id}`);
	} catch (err: unknown) {
		saving.value = "error";
		const msg = (err as { data?: { message?: string } })?.data?.message;
		saveError.value = msg ?? "Something went wrong. Try again.";
	}
}

// ── Update guide ─────────────────────────────────────────────────────────────

const updating = ref(false);

async function updateGuide() {
	if (!props.guideId) return;
	updating.value = true;
	try {
		await guideStore.updateGuide(props.guideId, context);
		toast("Guide updated");
	} catch (err: unknown) {
		const status = (err as { status?: number })?.status;
		if (status === 401) {
			guideStore.expireToken(props.guideId);
			context.setReadonly(true);
			openPanel.value = "passphrase";
			sessionExpired.value = true;
		} else {
			toast("Update failed — try again.");
		}
	} finally {
		updating.value = false;
	}
}

// ── Share panel ───────────────────────────────────────────────────────────────

const shareUrl = computed(() =>
	props.guideId
		? `${typeof window !== "undefined" ? window.location.origin : ""}/guide/${props.guideId}`
		: "",
);

const copyShareState = ref<"idle" | "success">("idle");

async function copyShareUrl() {
	try {
		await navigator.clipboard.writeText(shareUrl.value);
		copyShareState.value = "success";
		setTimeout(() => {
			copyShareState.value = "idle";
		}, 1500);
	} catch {}
}

// ── Passphrase / claim panel ─────────────────────────────────────────────────

const passphraseError = ref("");
const sessionExpired = ref(false);
const claiming = ref(false);
const discardingLocalEdits = ref(false);

async function claimEditRights() {
	if (!props.guideId) return;
	claiming.value = true;
	passphraseError.value = "";
	try {
		await guideStore.claimEditRights(
			props.guideId,
			passphraseValue.value,
			guideDisplayName.value,
		);
		context.setReadonly(false);
		sessionExpired.value = false;
		closePanel();
	} catch (err: unknown) {
		const status = (err as { status?: number })?.status;
		if (status === 429) {
			passphraseError.value =
				"Too many failed attempts — try again in 10 minutes";
		} else if (status === 401) {
			passphraseError.value = "Incorrect passphrase";
		} else {
			passphraseError.value = "Something went wrong. Try again.";
		}
	} finally {
		claiming.value = false;
	}
}

async function discardLocalEditsAndReload() {
	if (!props.onDiscardLocalEdits) {
		closePanel();
		return;
	}
	discardingLocalEdits.value = true;
	passphraseError.value = "";
	try {
		await props.onDiscardLocalEdits();
		sessionExpired.value = false;
		closePanel();
	} catch {
		passphraseError.value = "Could not reload the guide. Try again.";
	} finally {
		discardingLocalEdits.value = false;
	}
}

// ── Fork ─────────────────────────────────────────────────────────────────────

function doFork() {
	const forkName = `Fork of ${guideDisplayName.value}`;
	try {
		localStorage.setItem("poe2-planner-v1", JSON.stringify(context.state));
		localStorage.setItem("poe2-planner-v1-name", JSON.stringify(forkName));
	} catch {}
	toast("Loaded into your scratch pad — save to publish your own copy");
	router.push("/");
}

// ── Template selection ───────────────────────────────────────────────────────

const confirmTemplateId = ref<string | null>(null);
const templateToConfirm = computed(
	() => TEMPLATES.find((t) => t.id === confirmTemplateId.value) ?? null,
);

function selectTemplate(id: string) {
	const t = TEMPLATES.find((t) => t.id === id);
	if (!t) return;
	const hasNotes = t.notes !== undefined;
	const hasUserNotes = Object.values(state.notes).some((n) => n.trim());
	if (hasNotes && hasUserNotes) {
		confirmTemplateId.value = id;
	} else {
		context.applyTemplate(t);
	}
}

function confirmApplyTemplate() {
	if (!templateToConfirm.value) return;
	context.applyTemplate(templateToConfirm.value);
	confirmTemplateId.value = null;
}
</script>

<template>
  <!-- Template confirmation dialog -->
  <Teleport to="body">
    <div
      v-if="confirmTemplateId"
      class="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(5%_0.005_55/0.7)]"
      @click.self="confirmTemplateId = null"
    >
      <div class="bg-p-surface border border-p-border rounded-[5px] p-6 max-w-[400px] w-full mx-4 flex flex-col gap-4">
        <p class="text-p-base text-p-text leading-[1.55]">
          Applying <span class="text-p-amber font-semibold">{{ templateToConfirm?.label }}</span> will reset all notes and skipped items. This cannot be undone.
        </p>
        <div class="flex items-center justify-end gap-2">
          <button class="planner-btn-ghost" @click="confirmTemplateId = null">Cancel</button>
          <button
            class="planner-btn-ghost border-p-error! text-p-error! hover:border-p-error! hover:text-p-error!"
            @click="confirmApplyTemplate"
          >Apply anyway</button>
        </div>
      </div>
    </div>
  </Teleport>

  <header class="sticky top-0 z-20 bg-p-bg border-b border-p-border">

    <!-- ── Desktop row (≥900px) ──────────────────────────────────────────── -->
    <div class="hidden min-[900px]:flex items-center gap-3 max-w-[1020px] mx-auto px-6 py-2.5">

      <!-- Brand cluster -->
      <div class="shrink-0">
        <div class="text-p-lg font-bold text-p-amber tracking-[-0.01em] flex items-center gap-2 leading-[1.3]">
          <BrandMark :size="13" class="shrink-0" />
          PoE2 Campaign Planner
        </div>
        <div v-if="skippedCount > 0" class="text-p-xs text-p-muted mt-[0.1rem]">
          {{ skippedCount }} {{ skippedCount === 1 ? 'item' : 'items' }} skipped
        </div>
      </div>

      <!-- Guide name — centered ghost input -->
      <div class="flex-1 flex justify-center px-4">
        <div
          class="relative max-w-[min(32ch,34vw)] w-full"
          :class="{ 'max-w-[min(46ch,42vw)]': nameFocused }"
          style="transition: max-width 180ms cubic-bezier(0.4,0,0.2,1)"
        >
          <input
            v-if="!readonly"
            ref="nameInputRef"
            class="w-full bg-transparent border border-transparent rounded-[3px] px-2 py-[0.2rem] text-p-base text-p-text2 placeholder:text-p-muted outline-none transition-[border-color,background-color] duration-150 focus:bg-p-inset focus:border-p-border text-center truncate"
            :value="guideName"
            placeholder="Untitled guide"
            maxlength="255"
            spellcheck="false"
            autocomplete="off"
            @focus="nameFocused = true"
            @blur="commitName; nameFocused = false"
            @keydown="onNameKeydown"
            @change="commitName"
          />
          <span
            v-else
            class="block w-full text-center text-p-base text-p-text2 truncate px-2 py-[0.2rem]"
          >{{ guideDisplayName }}</span>
        </div>
      </div>

      <!-- Right toolbar -->
      <div class="flex items-center gap-1 shrink-0">

        <!-- My Guides -->
        <DropdownMenu v-if="mounted">
          <DropdownMenuTrigger as-child>
            <button class="planner-btn-ghost px-2" aria-label="My Guides">
              <BookMarked :size="13" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="planner-dropdown" align="end">
            <template v-if="guideStore.guides.value.length === 0">
              <div class="px-3 py-2.5 text-p-sm text-p-muted italic">No saved guides yet</div>
            </template>
            <template v-else>
              <DropdownMenuItem
                v-for="g in guideStore.guides.value"
                :key="g.id"
                class="planner-dd-item"
                @click="router.push(`/guide/${g.id}`)"
              >
                <div class="flex items-center gap-2 px-3 py-[0.45rem]">
                  <span
                    class="w-1.5 h-1.5 rounded-full shrink-0"
                    :class="g.id === guideId ? 'bg-p-amber' : 'bg-transparent'"
                    aria-hidden="true"
                  />
                  <span class="text-p-sm text-p-text truncate max-w-[18ch]">{{ g.name }}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator class="bg-p-subtle" />
            </template>
            <DropdownMenuItem class="planner-dd-item" @click="router.push('/')">
              <div class="px-3 py-[0.45rem] text-p-sm text-p-text2">New guide</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <!-- Templates -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="planner-btn-ghost data-[state=open]:[&_.chevron-dd]:rotate-180">
              Templates
              <svg class="chevron-dd w-[10px] h-[6px] transition-transform duration-150 shrink-0" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="1,1 5,5 9,1"/></svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="planner-dropdown" align="end">
            <DropdownMenuItem v-for="t in TEMPLATES" :key="t.id" class="planner-dd-item" @click="selectTemplate(t.id)">
              <div class="flex flex-col gap-[0.15rem] px-3 py-[0.55rem] w-full">
                <span class="text-p-sm text-p-text">{{ t.label }}</span>
                <span class="text-p-xs text-p-muted leading-[1.4]">{{ t.description }}</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button class="planner-btn-ghost" @click="exportDialogOpen = true">Copy Markdown</button>

        <span aria-hidden="true" class="w-px h-[14px] bg-p-subtle self-center mx-0.5 shrink-0" />

        <button class="planner-btn-ghost" @click="context.expandAll()">Expand all</button>
        <button class="planner-btn-ghost" @click="context.collapseAll()">Collapse all</button>

        <span aria-hidden="true" class="w-px h-[14px] bg-p-subtle self-center mx-0.5 shrink-0" />

        <button
          class="planner-btn-ghost hover:border-p-error hover:text-p-error"
          @click="context.resetAll()"
        >Reset</button>

        <Tooltip>
          <TooltipTrigger as-child>
            <a href="https://github.com/kasekun/poe2drops" target="_blank" rel="noreferrer noopener" class="planner-btn-ghost px-2" aria-label="View source on GitHub">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z" />
              </svg>
            </a>
          </TooltipTrigger>
          <TooltipContent class="planner-tooltip" side="bottom" :side-offset="6">View on GitHub</TooltipContent>
        </Tooltip>

        <span aria-hidden="true" class="w-px h-[14px] bg-p-subtle self-center mx-0.5 shrink-0" />

        <!-- Primary action -->
        <button
          v-if="mode === 'scratch'"
          class="planner-btn-act"
          @click="setPanel('save')"
        >Save guide</button>
        <button
          v-else-if="mode === 'owner'"
          class="planner-btn-act"
          :disabled="updating"
          @click="updateGuide"
        >
          <Loader2 v-if="updating" :size="11" class="animate-spin" aria-hidden="true" />
          {{ updating ? 'Saving…' : 'Update guide' }}
        </button>
        <button
          v-else-if="mode === 'viewer'"
          class="planner-btn-act"
          @click="doFork"
        >
          <GitFork :size="11" aria-hidden="true" />
          Fork this guide
        </button>

        <!-- Share icon (shown after save) -->
        <button
          v-if="isSaved"
          class="planner-btn-ghost px-2"
          :class="{ 'text-p-amber!': openPanel === 'share' }"
          aria-label="Share guide"
          @click="setPanel('share')"
        >
          <Share2 :size="13" aria-hidden="true" />
        </button>

        <!-- Claim edit rights (viewer mode) -->
        <button
          v-if="mode === 'viewer'"
          class="planner-btn-ghost flex items-center gap-1"
          @click="setPanel('passphrase')"
        >
          <KeyRound :size="11" aria-hidden="true" />
          <span class="text-p-xs">Enter passphrase to edit</span>
        </button>
      </div>
    </div>

    <!-- ── Tablet row 1 (640–899px) ──────────────────────────────────────── -->
    <div class="hidden min-[640px]:flex min-[900px]:hidden items-center justify-between gap-2 max-w-[1020px] mx-auto px-4 py-2">
      <div class="text-p-md font-bold text-p-amber tracking-[-0.01em] flex items-center gap-2 leading-[1.3] shrink-0">
        <BrandMark :size="12" class="shrink-0" />
        PoE2 Campaign Planner
      </div>
      <div class="flex items-center gap-1.5">
        <!-- Primary action -->
        <button v-if="mode === 'scratch'" class="planner-btn-act" @click="setPanel('save')">Save guide</button>
        <button v-else-if="mode === 'owner'" class="planner-btn-act" :disabled="updating" @click="updateGuide">
          <Loader2 v-if="updating" :size="11" class="animate-spin" aria-hidden="true" />
          {{ updating ? 'Saving…' : 'Update guide' }}
        </button>
        <button v-else-if="mode === 'viewer'" class="planner-btn-act flex items-center gap-1" @click="doFork">
          <GitFork :size="11" aria-hidden="true" />Fork this guide
        </button>
        <!-- More overflow -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="planner-btn-ghost px-2" aria-label="More actions">
              <MoreHorizontal :size="14" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="planner-dropdown min-w-[180px]" align="end">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger class="planner-dd-item px-3 py-[0.45rem] text-p-sm text-p-text">Templates</DropdownMenuSubTrigger>
              <DropdownMenuSubContent class="planner-dropdown">
                <DropdownMenuItem v-for="t in TEMPLATES" :key="t.id" class="planner-dd-item" @click="selectTemplate(t.id)">
                  <div class="flex flex-col gap-[0.1rem] px-3 py-[0.45rem]">
                    <span class="text-p-sm text-p-text">{{ t.label }}</span>
                    <span class="text-p-xs text-p-muted">{{ t.description }}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem class="planner-dd-item px-3 py-[0.45rem] text-p-sm text-p-text" @click="exportDialogOpen = true">Copy Markdown</DropdownMenuItem>
            <DropdownMenuItem class="planner-dd-item px-3 py-[0.45rem] text-p-sm text-p-text" @click="context.expandAll()">Expand all</DropdownMenuItem>
            <DropdownMenuItem class="planner-dd-item px-3 py-[0.45rem] text-p-sm text-p-text" @click="context.collapseAll()">Collapse all</DropdownMenuItem>
            <DropdownMenuSeparator class="bg-p-subtle" />
            <DropdownMenuItem class="planner-dd-item px-3 py-[0.45rem] text-p-sm text-p-error hover:text-p-error!" @click="context.resetAll()">Reset</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
    <!-- Tablet row 2 -->
    <div class="hidden min-[640px]:flex min-[900px]:hidden items-center gap-2 max-w-[1020px] mx-auto px-4 pb-2">
      <input
        v-if="!readonly"
        class="flex-1 min-w-0 bg-transparent border border-transparent rounded-[3px] px-2 py-[0.2rem] text-p-base text-p-text2 placeholder:text-p-muted outline-none transition-[border-color,background-color] duration-150 focus:bg-p-inset focus:border-p-border"
        :value="guideName"
        placeholder="Untitled guide"
        maxlength="255"
        spellcheck="false"
        autocomplete="off"
        @change="commitName"
        @keydown="onNameKeydown"
      />
      <span v-else class="flex-1 min-w-0 text-p-base text-p-text2 truncate px-2 py-[0.2rem]">{{ guideDisplayName }}</span>
      <div class="flex items-center gap-1 shrink-0">
        <button v-if="isSaved" class="planner-btn-ghost px-2" aria-label="Share" @click="setPanel('share')">
          <Share2 :size="13" aria-hidden="true" />
        </button>
        <DropdownMenu v-if="mounted">
          <DropdownMenuTrigger as-child>
            <button class="planner-btn-ghost px-2" aria-label="My Guides">
              <BookMarked :size="13" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="planner-dropdown" align="end">
            <template v-if="guideStore.guides.value.length === 0">
              <div class="px-3 py-2.5 text-p-sm text-p-muted italic">No saved guides yet</div>
            </template>
            <template v-else>
              <DropdownMenuItem
                v-for="g in guideStore.guides.value"
                :key="g.id"
                class="planner-dd-item"
                @click="router.push(`/guide/${g.id}`)"
              >
                <div class="flex items-center gap-2 px-3 py-[0.45rem]">
                  <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="g.id === guideId ? 'bg-p-amber' : 'bg-transparent'" aria-hidden="true" />
                  <span class="text-p-sm text-p-text truncate max-w-[18ch]">{{ g.name }}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator class="bg-p-subtle" />
            </template>
            <DropdownMenuItem class="planner-dd-item" @click="router.push('/')">
              <div class="px-3 py-[0.45rem] text-p-sm text-p-text2">New guide</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>

    <!-- ── Mobile rows (<640px) ──────────────────────────────────────────── -->
    <div class="flex flex-col min-[640px]:hidden">
      <!-- Row 1 -->
      <div class="flex items-center justify-between px-4 py-2">
        <div class="flex items-center gap-2">
          <div class="text-p-md font-bold text-p-amber tracking-[-0.01em] flex items-center gap-2 leading-[1.3]">
            <BrandMark :size="12" class="shrink-0" />
            <span>PoE2 Planner</span>
          </div>
          <span v-if="skippedCount > 0" class="text-p-xs text-p-muted">· {{ skippedCount }} skipped</span>
        </div>
        <!-- More button -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="planner-btn-ghost px-2" aria-label="More actions">
              <MoreHorizontal :size="14" aria-hidden="true" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="planner-dropdown min-w-[180px]" align="end">
            <DropdownMenuSub v-if="mounted">
              <DropdownMenuSubTrigger class="planner-dd-item px-3 py-[0.45rem] text-p-sm text-p-text flex items-center gap-2">
                <BookMarked :size="12" aria-hidden="true" />My Guides
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent class="planner-dropdown">
                <template v-if="guideStore.guides.value.length === 0">
                  <div class="px-3 py-2.5 text-p-sm text-p-muted italic">No saved guides yet</div>
                </template>
                <template v-else>
                  <DropdownMenuItem
                    v-for="g in guideStore.guides.value"
                    :key="g.id"
                    class="planner-dd-item"
                    @click="router.push(`/guide/${g.id}`)"
                  >
                    <div class="flex items-center gap-2 px-3 py-[0.45rem]">
                      <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="g.id === guideId ? 'bg-p-amber' : 'bg-transparent'" aria-hidden="true" />
                      <span class="text-p-sm text-p-text truncate max-w-[18ch]">{{ g.name }}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator class="bg-p-subtle" />
                </template>
                <DropdownMenuItem class="planner-dd-item" @click="router.push('/')">
                  <div class="px-3 py-[0.45rem] text-p-sm text-p-text2">New guide</div>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger class="planner-dd-item px-3 py-[0.45rem] text-p-sm text-p-text">Templates</DropdownMenuSubTrigger>
              <DropdownMenuSubContent class="planner-dropdown">
                <DropdownMenuItem v-for="t in TEMPLATES" :key="t.id" class="planner-dd-item" @click="selectTemplate(t.id)">
                  <div class="flex flex-col gap-[0.1rem] px-3 py-[0.45rem]">
                    <span class="text-p-sm text-p-text">{{ t.label }}</span>
                    <span class="text-p-xs text-p-muted">{{ t.description }}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem class="planner-dd-item px-3 py-[0.45rem] text-p-sm text-p-text" @click="exportDialogOpen = true">Copy Markdown</DropdownMenuItem>
            <DropdownMenuItem class="planner-dd-item px-3 py-[0.45rem] text-p-sm text-p-text" @click="context.expandAll()">Expand all</DropdownMenuItem>
            <DropdownMenuItem class="planner-dd-item px-3 py-[0.45rem] text-p-sm text-p-text" @click="context.collapseAll()">Collapse all</DropdownMenuItem>
            <DropdownMenuSeparator class="bg-p-subtle" />
            <DropdownMenuItem class="planner-dd-item px-3 py-[0.45rem] text-p-sm text-p-error" @click="context.resetAll()">Reset</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <!-- Row 2: guide name -->
      <div class="px-4 pb-1.5">
        <input
          v-if="!readonly"
          class="w-full bg-transparent border border-transparent rounded-[3px] px-2 py-1 text-p-base text-p-text2 placeholder:text-p-muted outline-none transition-[border-color,background-color] duration-150 focus:bg-p-inset focus:border-p-border"
          :value="guideName"
          placeholder="Untitled guide"
          maxlength="255"
          spellcheck="false"
          autocomplete="off"
          @change="commitName"
          @keydown="onNameKeydown"
        />
        <span v-else class="block text-p-base text-p-text2 truncate px-2 py-1">{{ guideDisplayName }}</span>
      </div>
      <!-- Row 3: primary action -->
      <div class="flex items-center gap-2 px-4 pb-2.5">
        <button v-if="mode === 'scratch'" class="planner-btn-act flex-1 justify-center" @click="setPanel('save')">Save guide</button>
        <button v-else-if="mode === 'owner'" class="planner-btn-act flex-1 justify-center" :disabled="updating" @click="updateGuide">
          {{ updating ? 'Saving…' : 'Update guide' }}
        </button>
        <button v-else-if="mode === 'viewer'" class="planner-btn-act flex-1 justify-center flex items-center gap-1" @click="doFork">
          <GitFork :size="11" aria-hidden="true" />Fork this guide
        </button>
        <button v-if="isSaved" class="planner-btn-ghost px-2 shrink-0" aria-label="Share" @click="setPanel('share')">
          <Share2 :size="13" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- ── Inline panels ─────────────────────────────────────────────────── -->

    <!-- Save panel -->
    <div
      v-if="openPanel === 'save'"
      class="border-t border-p-border bg-p-inset"
    >
      <div class="max-w-[1020px] mx-auto px-6 py-4 max-sm:px-4">
        <div class="max-w-[420px] ml-auto flex flex-col gap-3 max-sm:max-w-none">
          <p class="text-p-md font-bold text-p-amber tracking-[-0.01em] leading-[1.3]">Publish guide</p>

          <div class="flex flex-col gap-1">
            <label class="planner-eyebrow" for="save-guide-name">Guide name</label>
            <input
              id="save-guide-name"
              class="planner-input"
              :value="guideName || 'Untitled guide'"
              placeholder="Untitled guide"
              maxlength="255"
              spellcheck="false"
              @input="guideName = ($event.target as HTMLInputElement).value"
            />
          </div>

          <div class="flex flex-col gap-1">
            <label class="planner-eyebrow" for="save-passphrase">Passphrase</label>
            <div class="relative">
              <input
                id="save-passphrase"
                class="planner-input pr-9"
                :type="showPassphrase ? 'text' : 'password'"
                v-model="passphraseValue"
                placeholder="At least 8 characters"
                autocomplete="new-password"
              />
              <button
                class="absolute right-2 top-1/2 -translate-y-1/2 text-p-muted hover:text-p-text2 transition-colors duration-120"
                :aria-label="showPassphrase ? 'Hide passphrase' : 'Show passphrase'"
                @click="showPassphrase = !showPassphrase"
                type="button"
              >
                <EyeOff v-if="showPassphrase" :size="13" aria-hidden="true" />
                <Eye v-else :size="13" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-1">
            <label class="planner-eyebrow" for="save-confirm">Confirm passphrase</label>
            <input
              id="save-confirm"
              class="planner-input"
              :type="showPassphrase ? 'text' : 'password'"
              v-model="confirmValue"
              placeholder="Repeat passphrase"
              autocomplete="new-password"
            />
          </div>

          <p class="text-p-xs text-p-muted leading-[1.45]">Forget this and you lose the ability to edit. There is no recovery.</p>

          <p v-if="saveError" class="text-p-xs text-p-error">{{ saveError }}</p>

          <div class="flex items-center justify-end gap-2">
            <button class="planner-btn-ghost" @click="closePanel">Cancel</button>
            <button
              class="planner-btn-act"
              :disabled="saving === 'saving'"
              @click="publishGuide"
            >
              <Loader2 v-if="saving === 'saving'" :size="11" class="animate-spin" aria-hidden="true" />
              {{ saving === 'saving' ? 'Publishing…' : 'Publish guide' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Share panel -->
    <div
      v-else-if="openPanel === 'share' && isSaved"
      class="border-t border-p-border bg-p-inset"
    >
      <div class="max-w-[1020px] mx-auto px-6 py-4 max-sm:px-4">
        <div class="max-w-[420px] ml-auto flex flex-col gap-3 max-sm:max-w-none">
          <p class="text-p-xs text-p-muted font-bold uppercase tracking-[0.09em]">Share link</p>
          <div class="flex items-stretch bg-p-inset border border-p-subtle rounded-[3px] overflow-hidden font-p-mono text-p-sm">
            <input
              class="flex-1 min-w-0 bg-transparent border-0 px-3 py-[0.35rem] text-p-text2 outline-none select-all"
              :value="shareUrl"
              readonly
              aria-label="Share URL"
              @focus="($event.target as HTMLInputElement).select()"
            />
            <button
              class="shrink-0 flex items-center justify-center gap-1.5 px-3 border-l border-p-subtle text-p-muted hover:text-p-amber transition-colors duration-130"
              :class="{ 'text-p-amber!': copyShareState === 'success' }"
              @click="copyShareUrl"
              aria-label="Copy share link"
            >
              <Check v-if="copyShareState === 'success'" :size="12" aria-hidden="true" />
              <Copy v-else :size="12" aria-hidden="true" />
              <span class="text-p-xs">{{ copyShareState === 'success' ? 'Copied' : 'Copy' }}</span>
            </button>
            <a
              :href="shareUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="shrink-0 flex items-center justify-center px-2 border-l border-p-subtle text-p-muted hover:text-p-text2 transition-colors duration-130"
              aria-label="Open guide in new tab"
            >
              <ExternalLink :size="12" aria-hidden="true" />
            </a>
          </div>
          <div class="flex justify-end">
            <button class="planner-btn-ghost text-p-xs" @click="closePanel">Done</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Passphrase / claim panel -->
    <div
      v-else-if="openPanel === 'passphrase'"
      class="border-t border-p-border bg-p-inset"
    >
      <div class="max-w-[1020px] mx-auto px-6 py-4 max-sm:px-4">
        <div class="max-w-[420px] ml-auto flex flex-col gap-3 max-sm:max-w-none">
          <p v-if="sessionExpired" class="text-p-xs text-p-amber leading-[1.45]">
            Session expired — enter the passphrase to continue editing.
          </p>
          <div class="flex flex-col gap-1">
            <label class="planner-eyebrow" for="claim-passphrase">Passphrase</label>
            <input
              id="claim-passphrase"
              class="planner-input"
              :type="showPassphrase ? 'text' : 'password'"
              v-model="passphraseValue"
              placeholder="At least 8 characters"
              autocomplete="current-password"
              @keydown.enter="claimEditRights"
            />
          </div>
          <p v-if="passphraseError" class="text-p-xs text-p-error">{{ passphraseError }}</p>
          <div class="flex items-center justify-between gap-2">
            <button
              v-if="sessionExpired"
              class="planner-btn-ghost text-p-xs text-p-muted"
              :disabled="discardingLocalEdits"
              @click="discardLocalEditsAndReload"
            >
              <Loader2 v-if="discardingLocalEdits" :size="11" class="animate-spin" aria-hidden="true" />
              {{ discardingLocalEdits ? 'Reloading…' : 'Discard local edits and reload' }}
            </button>
            <div class="flex items-center gap-2 ml-auto">
              <button class="planner-btn-ghost" @click="closePanel">Cancel</button>
              <button
                class="planner-btn-act"
                :disabled="claiming"
                @click="claimEditRights"
              >
                <Loader2 v-if="claiming" :size="11" class="animate-spin" aria-hidden="true" />
                {{ claiming ? 'Checking…' : 'Claim edit rights' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

  <PlannerExportDialog v-model:open="exportDialogOpen" :version="guideVersion" />
</template>
