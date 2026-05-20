<script setup lang="ts">
import { useWindowSize } from "@vueuse/core";
import {
	BookMarked,
	Check,
	Copy,
	ExternalLink,
	Eye,
	EyeOff,
	GitFork,
	KeyRound,
	Loader2,
	MoreHorizontal,
	Share2,
	X,
} from "lucide-vue-next";
import { computed, onMounted, ref } from "vue";
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
import { useGuideStore } from "~/composables/useGuideStore";
import { useMarkdownExport } from "~/composables/useMarkdownExport";
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

const { width: windowWidth } = useWindowSize();
// Templates button is hidden below 480px; overflow menu shows it instead
const showTemplatesInOverflow = computed(
	() => mounted.value && windowWidth.value < 480,
);

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
			closePanel();
		}, 1500);
	} catch {}
}

const { copyMarkdown } = useMarkdownExport();
const copyMdState = ref<"idle" | "success" | "error">("idle");

async function copyMarkdownFromPanel() {
	const ok = await copyMarkdown({
		includeEmptyZones: true,
		version: props.guideVersion,
	});
	copyMdState.value = ok ? "success" : "error";
	setTimeout(
		() => {
			copyMdState.value = "idle";
		},
		ok ? 1500 : 2500,
	);
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

// ── Reset confirmation ────────────────────────────────────────────────────

const confirmReset = ref(false);

function requestReset() {
	confirmReset.value = true;
}

function doReset() {
	context.resetAll();
	confirmReset.value = false;
}
</script>

<template>
  <!-- Confirmation dialogs -->
  <Teleport to="body">
    <!-- Template confirmation -->
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

    <!-- Reset confirmation -->
    <div
      v-else-if="confirmReset"
      class="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(5%_0.005_55/0.7)]"
      @click.self="confirmReset = false"
    >
      <div class="bg-p-surface border border-p-border rounded-[5px] p-6 max-w-[400px] w-full mx-4 flex flex-col gap-4">
        <p class="text-p-base text-p-text leading-[1.55]">
          Reset will clear all skipped items, notes, and the guide name. This cannot be undone.
        </p>
        <div class="flex items-center justify-end gap-2">
          <button class="planner-btn-ghost" @click="confirmReset = false">Cancel</button>
          <button
            class="planner-btn-ghost border-p-error! text-p-error! hover:border-p-error! hover:text-p-error!"
            @click="doReset"
          >Reset anyway</button>
        </div>
      </div>
    </div>
  </Teleport>

  <header class="sticky top-0 z-20 bg-p-bg border-b border-p-border">

    <!-- ── Shared toolbar (all breakpoints) ─────────────────────────────── -->
    <div class="flex items-center gap-2 max-w-[1020px] mx-auto px-6 py-2 max-sm:px-4">

      <!-- Brand -->
      <div class="shrink-0 flex items-center gap-2">
        <div class="text-p-lg font-bold text-p-amber tracking-[-0.01em] flex items-center gap-2 leading-[1.3]">
          <BrandMark :size="13" class="shrink-0" />
          <span class="max-sm:hidden">PoE2 Campaign Planner</span>
          <span class="hidden max-sm:inline">PoE2 Planner</span>
        </div>
        <span v-if="skippedCount === 1" class="text-p-xs text-p-muted max-sm:hidden">· {{ skippedCount }} pickup skipped</span>
        <span v-else-if="skippedCount > 1" class="text-p-xs text-p-muted max-sm:hidden">· {{ skippedCount }} pickups skipped</span>
 
      </div>

      <div class="flex-1"></div>

      <!-- My Guides -->
      <DropdownMenu v-if="mounted">
        <DropdownMenuTrigger as-child>
          <button class="planner-btn-ghost" aria-label="My Guides">
            <BookMarked :size="13" aria-hidden="true" />
            <span class="max-[480px]:hidden">My Guides</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="planner-dropdown" align="end">
          <template v-if="guideStore.guides.value.length === 0">
            <div class="px-[0.6rem] py-2 text-p-sm text-p-muted italic">No saved guides yet</div>
          </template>
          <template v-else>
            <DropdownMenuItem
              v-for="g in guideStore.guides.value"
              :key="g.id"
              class="planner-dd-item text-p-sm text-p-text"
              @click="router.push(`/guide/${g.id}`)"
            >
              <span
                class="w-1.5 h-1.5 rounded-full shrink-0"
                :class="g.id === guideId ? 'bg-p-amber' : 'bg-transparent border border-p-subtle'"
                aria-hidden="true"
              />
              <span class="truncate max-w-[22ch]">{{ g.name }}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator class="bg-p-subtle mx-1 my-0.5" />
          </template>
          <DropdownMenuItem class="planner-dd-item text-p-sm text-p-muted" @click="router.push('/')">
            New guide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Templates (hidden below 480px — shows in overflow instead) -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button class="planner-btn-ghost max-[480px]:hidden data-[state=open]:[&_.chevron-dd]:rotate-180">
            Templates
            <svg class="chevron-dd w-[10px] h-[6px] transition-transform duration-150 shrink-0" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="1,1 5,5 9,1"/></svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="planner-dropdown min-w-[280px]" align="end">
          <DropdownMenuItem
            v-for="t in TEMPLATES"
            :key="t.id"
            class="planner-dd-item items-start"
            @click="selectTemplate(t.id)"
          >
            <div class="flex flex-col gap-[0.2rem] py-[0.2rem] min-w-0">
              <span class="text-p-sm text-p-text leading-snug">{{ t.label }}</span>
              <span class="text-p-xs text-p-muted leading-[1.45]">{{ t.description }}</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <!-- Overflow: always Copy Markdown + Reset; Templates added for narrow viewports -->
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button class="planner-btn-ghost px-2" aria-label="More actions">
            <MoreHorizontal :size="14" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="planner-dropdown" align="end">
          <!-- Templates (mobile-only, gated by JS breakpoint so it actually hides) -->
          <template v-if="showTemplatesInOverflow">
            <DropdownMenuSub>
              <DropdownMenuSubTrigger class="planner-dd-item text-p-sm text-p-text2">
                Templates
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent class="planner-dropdown min-w-[280px]">
                <DropdownMenuItem
                  v-for="t in TEMPLATES"
                  :key="t.id"
                  class="planner-dd-item items-start"
                  @click="selectTemplate(t.id)"
                >
                  <div class="flex flex-col gap-[0.2rem] py-[0.2rem] min-w-0">
                    <span class="text-p-sm text-p-text leading-snug">{{ t.label }}</span>
                    <span class="text-p-xs text-p-muted leading-[1.45]">{{ t.description }}</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator class="bg-p-subtle mx-1 my-0.5" />
          </template>
          <DropdownMenuItem class="planner-dd-item text-p-sm text-p-text2" @click="exportDialogOpen = true">
            Copy Markdown
          </DropdownMenuItem>
          <DropdownMenuSeparator class="bg-p-subtle mx-1 my-0.5" />
          <DropdownMenuItem class="planner-dd-item text-p-sm text-p-error" @click="requestReset">
            Reset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
        <span class="max-sm:hidden">Fork this guide</span>
        <span class="hidden max-sm:inline">Fork</span>
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
        class="planner-btn-ghost flex items-center gap-1 max-sm:hidden"
        @click="setPanel('passphrase')"
      >
        <KeyRound :size="11" aria-hidden="true" />
        <span class="text-p-xs">Enter passphrase to edit</span>
      </button>
      <button
        v-if="mode === 'viewer'"
        class="planner-btn-ghost px-2 hidden max-sm:flex items-center"
        aria-label="Enter passphrase to edit"
        @click="setPanel('passphrase')"
      >
        <KeyRound :size="13" aria-hidden="true" />
      </button>
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

          <div class="flex items-center justify-end gap-2 mt-1">
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
      <div class="max-w-[1020px] mx-auto px-6 py-2.5 max-sm:px-4 flex items-center justify-between gap-3">

        <!-- Copy Markdown -->
        <button
          class="planner-btn-ghost shrink-0"
          :class="{
            'border-p-amber-dim! text-p-amber-dim! hover:text-p-amber!': copyMdState === 'success',
            'border-p-error! text-p-error!': copyMdState === 'error',
          }"
          @click="copyMarkdownFromPanel"
        >
          <Check v-if="copyMdState === 'success'" :size="11" aria-hidden="true" />
          <span>{{ copyMdState === 'success' ? 'Markdown copied' : copyMdState === 'error' ? 'Copy failed' : 'Copy Markdown' }}</span>
        </button>

        <!-- Link bar -->
        <div class="flex items-stretch bg-p-bg border border-p-subtle rounded-[3px] overflow-hidden font-p-mono text-p-sm min-w-0 flex-1 max-w-[460px]">
          <input
            class="flex-1 min-w-0 bg-transparent border-0 px-3 py-[0.3rem] text-p-text2 outline-none select-all"
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
            <span class="text-p-xs">{{ copyShareState === 'success' ? 'Copied' : 'Copy link' }}</span>
          </button>
        </div>

        <!-- Close -->
        <button
          class="shrink-0 p-1 text-p-muted hover:text-p-text2 transition-colors duration-130 focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-2 rounded-[3px]"
          aria-label="Close share panel"
          @click="closePanel"
        >
          <X :size="13" aria-hidden="true" />
        </button>
      </div>
    </div>

    <!-- Passphrase / claim panel -->
    <div
      v-else-if="openPanel === 'passphrase'"
      class="border-t border-p-border bg-p-inset"
    >
      <div class="max-w-[1020px] mx-auto px-6 py-4 max-sm:px-4">
        <div class="max-w-[420px] ml-auto flex flex-col gap-3 max-sm:max-w-none">
          <p v-if="!sessionExpired" class="text-p-md font-bold text-p-amber tracking-[-0.01em] leading-[1.3]">Unlock editing</p>
          <p v-else class="text-p-xs text-p-amber leading-[1.45]">
            Session expired — enter your passphrase to continue editing.
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
