<script setup lang="ts">
import {
	BookMarked,
	Check,
	Copy,
	Eye,
	EyeOff,
	GitFork,
	KeyRound,
	Loader2,
	MoreHorizontal,
	Share2,
	X,
} from "lucide-vue-next";
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
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
import PresetMenuContent from "~/components/planner/PresetMenuContent.vue";
import { useGuideStore } from "~/composables/useGuideStore";
import { useMarkdownExport } from "~/composables/useMarkdownExport";
import {
	areaKey,
	buildDefaultPlannerState,
	pickKey,
	usePlannerState,
} from "~/composables/usePlannerState";
import { DATA } from "~/data/campaign";
import { PRESETS } from "~/data/presets/index";

const props = defineProps<{
	guideId?: string;
	guideVersion?: string;
	onDiscardLocalEdits?: () => Promise<void> | void;
}>();

const router = useRouter();
const context = usePlannerState();
const { state, readonly, guideName } = context;
const guideStore = useGuideStore();
const SCRATCH_STATE_STORAGE_KEY = "poe2-planner-v1";
const SCRATCH_NAME_STORAGE_KEY = "poe2-planner-v1-name";

const mounted = ref(false);
const isMac = ref(false);
onMounted(() => {
	mounted.value = true;
	guideStore.load();
	isMac.value = /Mac/i.test(navigator.userAgent);
	document.addEventListener("keydown", onDocumentKeydown);
});

const skippedPickupCount = computed(() => {
	let n = 0;
	for (const act of DATA) {
		for (const area of act.areas) {
			for (const pickup of area.pickups) {
				if (state.skippedPickups[pickKey(act.id, area.id, pickup.id)]) n++;
			}
		}
	}
	return n;
});

const totalPickupCount = DATA.reduce(
	(sum, act) => sum + act.areas.reduce((s, area) => s + area.pickups.length, 0),
	0,
);

const skippedZoneCount = computed(() => {
	let n = 0;
	for (const act of DATA) {
		for (const area of act.areas) {
			if (state.skippedZones[areaKey(act.id, area.id)]) n++;
		}
	}
	return n;
});

const totalZoneCount = DATA.reduce((sum, act) => sum + act.areas.length, 0);

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

function withTransition(fn: () => void) {
	if (typeof document === "undefined") {
		fn();
		return;
	}
	const doc = document as Document & {
		startViewTransition?: (cb: () => Promise<void>) => unknown;
	};
	if (!doc.startViewTransition) {
		fn();
		return;
	}
	doc.startViewTransition(async () => {
		fn();
		await nextTick();
	});
}

type Panel = "save" | "share" | "passphrase" | null;
const openPanel = ref<Panel>(null);

function setPanel(p: Panel) {
	withTransition(() => {
		openPanel.value = openPanel.value === p ? null : p;
	});
}

function closePanel() {
	withTransition(() => {
		openPanel.value = null;
		passphraseValue.value = "";
		confirmValue.value = "";
		passphraseError.value = "";
		saving.value = "idle";
	});
}

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
		toast("Guide saved");
		closePanel();
		await router.push(`/guide/${id}`);
	} catch (err: unknown) {
		saving.value = "error";
		const msg = (err as { data?: { message?: string } })?.data?.message;
		saveError.value = msg ?? "Something went wrong. Try again.";
	}
}

const updating = ref(false);
const updateState = ref<"idle" | "success">("idle");

async function updateGuide() {
	if (!props.guideId) return;
	updating.value = true;
	try {
		await guideStore.updateGuide(props.guideId, context);
		// Draft successfully pushed to the server — clear the local copy so a
		// fresh reload fetches the canonical server state instead of the draft.
		if (context.persistenceKey) {
			try {
				localStorage.removeItem(context.persistenceKey);
				localStorage.removeItem(`${context.persistenceKey}-name`);
			} catch {}
		}
		updateState.value = "success";
		setTimeout(() => {
			updateState.value = "idle";
		}, 1500); // TODO: make this a real check, db query?
	} catch (err: unknown) {
		const status = (err as { status?: number })?.status;
		if (status === 401) {
			guideStore.expireToken(props.guideId);
			context.setReadonly(true);
			withTransition(() => {
				openPanel.value = "passphrase";
				sessionExpired.value = true;
			});
		} else {
			toast("Update failed - try again.");
		}
	} finally {
		updating.value = false;
	}
}

const shareUrl = computed(() =>
	props.guideId
		? `${typeof window !== "undefined" ? window.location.origin : ""}/guide/${props.guideId}`
		: "",
);

const copyShareState = ref<"idle" | "success" | "error">("idle");

async function copyShareUrl() {
	try {
		await navigator.clipboard.writeText(shareUrl.value);
		copyShareState.value = "success";
		setTimeout(() => {
			copyShareState.value = "idle";
			closePanel();
		}, 1500);
	} catch {
		copyShareState.value = "error";
		setTimeout(() => {
			copyShareState.value = "idle";
		}, 2500);
	}
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
		context.hydrateFromStorage?.();
		sessionExpired.value = false;
		closePanel();
	} catch (err: unknown) {
		const status = (err as { status?: number })?.status;
		if (status === 429) {
			passphraseError.value =
				"Too many failed attempts - try again in 10 minutes";
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

const confirmNewGuide = ref(false);

function requestNewGuide() {
	confirmNewGuide.value = true;
}

function clearScratchPadStorage() {
	try {
		localStorage.removeItem(SCRATCH_STATE_STORAGE_KEY);
		localStorage.removeItem(SCRATCH_NAME_STORAGE_KEY);
	} catch {}
}

function saveScratchPadStorage(name: string) {
	try {
		localStorage.setItem(
			SCRATCH_STATE_STORAGE_KEY,
			JSON.stringify(context.state),
		);
		localStorage.setItem(SCRATCH_NAME_STORAGE_KEY, JSON.stringify(name));
	} catch {}
}

function doStartNewGuide() {
	confirmNewGuide.value = false;
	clearScratchPadStorage();
	if (mode.value === "scratch") {
		context.replaceState(buildDefaultPlannerState(), "");
	} else {
		router.push("/");
	}
}

function doFork() {
	const forkName = `Fork of ${guideDisplayName.value}`;
	saveScratchPadStorage(forkName);
	toast(
		"Loaded into your scratch pad. Save it to get your own shareable link.",
	);
	router.push("/");
}

const primaryBtnEl = ref<HTMLButtonElement | null>(null);
const btnTrackX = ref(0);
const btnTrackY = ref(0);
const btnTracking = ref(false);

let btnMoveFrame: number | undefined;
let pendingBtnEvent: MouseEvent | undefined;

function onPrimaryBtnMove(e: MouseEvent) {
	pendingBtnEvent = e;
	if (btnMoveFrame !== undefined) return;
	btnMoveFrame = requestAnimationFrame(() => {
		btnMoveFrame = undefined;
		const event = pendingBtnEvent;
		if (!event) return;
		const el = primaryBtnEl.value;
		if (!el || el.disabled) return;
		const r = el.getBoundingClientRect();
		btnTrackX.value =
			((event.clientX - r.left - r.width / 2) / (r.width / 2)) * 2.5;
		btnTrackY.value =
			((event.clientY - r.top - r.height / 2) / (r.height / 2)) * 1.5;
		btnTracking.value = true;
	});
}

function onPrimaryBtnLeave() {
	if (btnMoveFrame !== undefined) {
		cancelAnimationFrame(btnMoveFrame);
		btnMoveFrame = undefined;
	}
	pendingBtnEvent = undefined;
	btnTrackX.value = 0;
	btnTrackY.value = 0;
	btnTracking.value = false;
}

const primaryBtnStyle = computed(() => ({
	"--btn-tx": `${btnTrackX.value.toFixed(2)}px`,
	"--btn-ty": `${btnTrackY.value.toFixed(2)}px`,
}));

const btnIconState = computed<"loading" | "success" | "idle">(() => {
	if (updating.value) return "loading";
	if (updateState.value === "success") return "success";
	return "idle";
});

const confirmPresetId = ref<string | null>(null);
const presetToConfirm = computed(
	() => PRESETS.find((preset) => preset.id === confirmPresetId.value) ?? null,
);
const hasRouteCustomizations = computed(
	() =>
		Object.values(state.notes).some((note) => note.some((s) => s.trim())) ||
		Object.values(state.levels).some((level) => level.trim()) ||
		Object.values(state.actNotes).some((note) => note.some((s) => s.trim())) ||
		Object.values(state.actRegex).some((pattern) => pattern.trim()) ||
		Object.values(state.areaOrder).some((order) => order.length > 0) ||
		Object.values(state.skippedPickups).some(Boolean) ||
		Object.values(state.skippedZones).some(Boolean),
);

function selectPreset(id: string) {
	const preset = PRESETS.find((preset) => preset.id === id);
	if (!preset) return;
	if (hasRouteCustomizations.value) {
		confirmPresetId.value = id;
	} else {
		context.applyPreset(preset);
	}
}

function confirmApplyPreset() {
	if (!presetToConfirm.value) return;
	context.applyPreset(presetToConfirm.value);
	confirmPresetId.value = null;
}

const confirmReset = ref(false);

const presetCancelRef = ref<HTMLButtonElement | null>(null);
const newGuideCancelRef = ref<HTMLButtonElement | null>(null);
const resetCancelRef = ref<HTMLButtonElement | null>(null);

// Focus management: delayed to beat Radix's async focus-restore after dropdown close
watch(confirmPresetId, (id) => {
	if (id) setTimeout(() => presetCancelRef.value?.focus(), 50);
});
watch(confirmNewGuide, (open) => {
	if (open) setTimeout(() => newGuideCancelRef.value?.focus(), 50);
});
watch(confirmReset, (open) => {
	if (open) setTimeout(() => resetCancelRef.value?.focus(), 50);
});

function onDocumentKeydown(e: KeyboardEvent) {
	if (
		e.key === "s" &&
		(e.metaKey || e.ctrlKey) &&
		props.guideId &&
		!readonly.value
	) {
		e.preventDefault();
		if (!updating.value) updateGuide();
		return;
	}
	if (e.key !== "Escape") return;
	if (confirmPresetId.value) {
		confirmPresetId.value = null;
		return;
	}
	if (confirmNewGuide.value) {
		confirmNewGuide.value = false;
		return;
	}
	if (confirmReset.value) {
		confirmReset.value = false;
		return;
	}
}

onUnmounted(() => document.removeEventListener("keydown", onDocumentKeydown));

function requestReset() {
	confirmReset.value = true;
}

function doReset() {
	context.resetAll();
	confirmReset.value = false;
}
</script>

<template>
  <Teleport to="body">
    <Transition name="confirm">
      <div
        v-if="confirmPresetId"
        class="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(5%_0.005_55/0.7)]"
        @click.self="confirmPresetId = null"
        @keydown.escape="confirmPresetId = null"
      >
        <div
          class="confirm-dialog bg-p-surface border border-p-border rounded-[5px] p-6 max-w-[420px] w-full mx-4 flex flex-col gap-4"
          role="dialog"
          aria-modal="true"
          aria-label="Apply preset"
          aria-describedby="preset-dialog-desc"
        >
          <p id="preset-dialog-desc" class="text-p-base text-p-text leading-[1.55]">
            Applying <span class="text-p-amber font-semibold">{{ presetToConfirm?.label }}</span> replaces your current route with that preset. Your collapsed sections stay as-is, and you can undo immediately after.
          </p>
          <div class="flex items-center justify-end gap-2">
            <button ref="presetCancelRef" class="planner-btn-ghost" @click="confirmPresetId = null">Cancel</button>
            <button
              class="planner-btn-ghost border-p-error! text-p-error! hover:border-p-error! hover:text-p-error!"
              @click="confirmApplyPreset"
            >Apply</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="confirm">
      <div
        v-if="confirmNewGuide"
        class="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(5%_0.005_55/0.7)]"
        @click.self="confirmNewGuide = false"
        @keydown.escape="confirmNewGuide = false"
      >
        <div
          class="confirm-dialog bg-p-surface border border-p-border rounded-[5px] p-6 max-w-[420px] w-full mx-4 flex flex-col gap-4"
          role="dialog"
          aria-modal="true"
          aria-label="Start new guide"
          aria-describedby="new-guide-dialog-desc"
        >
          <p id="new-guide-dialog-desc" class="text-p-base text-p-text leading-[1.55]">
            Starting a new guide clears your current scratch pad: notes, levels, skips, and loot filter patterns will be lost.
          </p>
          <div class="flex items-center justify-end gap-2">
            <button ref="newGuideCancelRef" class="planner-btn-ghost" @click="confirmNewGuide = false">Cancel</button>
            <button
              class="planner-btn-ghost border-p-error! text-p-error! hover:border-p-error! hover:text-p-error!"
              @click="doStartNewGuide"
            >Start new guide</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="confirm">
      <div
        v-if="confirmReset"
        class="fixed inset-0 z-50 flex items-center justify-center bg-[oklch(5%_0.005_55/0.7)]"
        @click.self="confirmReset = false"
        @keydown.escape="confirmReset = false"
      >
        <div
          class="confirm-dialog bg-p-surface border border-p-border rounded-[5px] p-6 max-w-[420px] w-full mx-4 flex flex-col gap-4"
          role="dialog"
          aria-modal="true"
          aria-label="Reset guide"
          aria-describedby="reset-dialog-desc"
        >
          <p id="reset-dialog-desc" class="text-p-base text-p-text leading-[1.55]">
            Reset clears all notes, recommended levels, pickup skips, zone skips, loot filter patterns, custom zone order, and the guide name. You can undo immediately after.
          </p>
          <div class="flex items-center justify-end gap-2">
            <button ref="resetCancelRef" class="planner-btn-ghost" @click="confirmReset = false">Cancel</button>
            <button
              class="planner-btn-ghost border-p-error! text-p-error! hover:border-p-error! hover:text-p-error!"
              @click="doReset"
            >Reset</button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <header class="sticky top-0 z-20 bg-p-bg border-b border-p-border">
    <div class="flex items-center gap-2 max-w-[1020px] mx-auto px-6 py-2 max-sm:px-4">
      <div class="shrink-0 flex items-center">
        <div class="text-p-amber flex items-center gap-2">
          <BrandMark :size="13" class="shrink-0" />
          <span class="hidden sm:inline text-p-lg font-bold tracking-[-0.01em] leading-[1.3]">PoE2 Planner</span>
        </div>
      </div>

      <div class="flex-1"></div>

      <div class="hidden sm:block">
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="planner-btn-ghost data-[state=open]:[&_.chevron-dd]:rotate-180">
              Presets
              <svg class="chevron-dd w-[10px] h-[6px] transition-transform duration-150 shrink-0" viewBox="0 0 10 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><polyline points="1,1 5,5 9,1"/></svg>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="planner-dropdown min-w-[320px]" align="end">
            <PresetMenuContent
              @select-preset="selectPreset"
              @apply-filter="context.applyFilter"
            />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <DropdownMenu v-if="mounted">
        <DropdownMenuTrigger as-child>
          <button class="planner-btn-ghost px-2 max-sm:px-2.5 max-sm:py-2 flex items-center gap-1" aria-label="My Guides">
            <BookMarked :size="13" aria-hidden="true" />
            <span class="text-p-xs hidden sm:inline">My Guides</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="planner-dropdown min-w-[220px]" align="end">
          <template v-if="guideStore.guides.value.length > 0">
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
            <DropdownMenuSeparator class="bg-p-border mx-1 my-0.5" />
          </template>
          <DropdownMenuItem class="planner-dd-item text-p-sm text-p-muted" @click="requestNewGuide">
            New guide
          </DropdownMenuItem>
          <DropdownMenuSeparator class="bg-p-border mx-1 my-0.5" />
          <div class="px-[0.6rem] py-2 pointer-events-none">
            <p class="text-p-xs text-p-muted leading-normal max-w-[45ch]">Published Guides you've created on this device will appear here, along with Guides that you claim via password.</p>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <button class="planner-btn-ghost px-2 max-sm:px-2.5 max-sm:py-2" aria-label="More actions">
            <MoreHorizontal :size="14" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="planner-dropdown" align="end">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger class="planner-dd-item text-p-sm text-p-text2">
              Presets
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent class="planner-dropdown min-w-[320px]">
              <PresetMenuContent
                @select-preset="selectPreset"
                @apply-filter="context.applyFilter"
              />
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator class="bg-p-border mx-1 my-0.5" />
          <DropdownMenuItem class="planner-dd-item text-p-sm text-p-text2" @click="exportDialogOpen = true">
            Copy Markdown
          </DropdownMenuItem>
          <DropdownMenuSeparator class="bg-p-border mx-1 my-0.5" />
          <DropdownMenuItem class="planner-dd-item text-p-sm text-p-error" @click="requestReset">
            Reset
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <span aria-hidden="true" class="w-px h-[14px] bg-p-subtle self-center mx-0.5 shrink-0" />

      <button
        v-if="mode === 'scratch'"
        ref="primaryBtnEl"
        class="planner-btn-act planner-btn-primary"
        :style="primaryBtnStyle"
        :data-tracking="btnTracking ? 'yes' : undefined"
        @click="setPanel('save')"
        @mousemove="onPrimaryBtnMove"
        @mouseleave="onPrimaryBtnLeave"
      >Save guide</button>
      <button
        v-else-if="mode === 'owner'"
        ref="primaryBtnEl"
        class="planner-btn-act planner-btn-primary"
        :disabled="updating"
        :title="isMac ? 'Update Guide (⌘S)' : 'Update Guide (Ctrl+S)'"
        :style="primaryBtnStyle"
        :data-tracking="btnTracking ? 'yes' : undefined"
        @click="updateGuide"
        @mousemove="onPrimaryBtnMove"
        @mouseleave="onPrimaryBtnLeave"
      >
        <span v-if="btnIconState !== 'idle'" class="btn-icon" aria-hidden="true">
          <svg v-if="btnIconState === 'loading'" class="btn-spinner" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-dasharray="8 14" />
          </svg>
          <svg v-else class="btn-check" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path pathLength="1" d="M1.5,5.5 L4,8 L8.5,2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
        {{ btnIconState === 'loading' ? 'Saving…' : btnIconState === 'success' ? 'Saved' : 'Update guide' }}
      </button>
      <button
        v-else-if="mode === 'viewer'"
        ref="primaryBtnEl"
        class="planner-btn-act planner-btn-primary"
        :style="primaryBtnStyle"
        :data-tracking="btnTracking ? 'yes' : undefined"
        @click="doFork"
        @mousemove="onPrimaryBtnMove"
        @mouseleave="onPrimaryBtnLeave"
      >
        <GitFork :size="11" class="shrink-0 hidden sm:inline" aria-hidden="true" />
        Fork this Guide
      </button>

      <button
        v-if="mode === 'viewer'"
        class="planner-btn-ghost planner-btn-viewer flex items-center gap-1 max-sm:hidden"
        @click="setPanel('passphrase')"
      >
        <KeyRound :size="11" aria-hidden="true" />
        <span class="text-p-xs">Unlock Guide</span>
      </button>
      <button
        v-if="mode === 'viewer'"
        class="planner-btn-ghost planner-btn-viewer px-2 max-sm:px-2.5 max-sm:py-2 hidden max-sm:flex items-center"
        aria-label="Unlock Guide"
        @click="setPanel('passphrase')"
      >
        <KeyRound :size="13" aria-hidden="true" />
        <span class="text-p-xs">Unlock</span>
      </button>

      <button
        v-if="isSaved"
        class="planner-btn-ghost px-2 max-sm:px-2.5 max-sm:py-2"
        :class="{ 'text-p-amber!': openPanel === 'share' }"
        aria-label="Share guide"
        @click="setPanel('share')"
      >
        <Share2 :size="13" aria-hidden="true" />
      </button>
    </div>
    <div
      v-if="(skippedPickupCount > 0 || skippedZoneCount > 0) && openPanel === null"
    >
      <div class="max-w-[1020px] mx-auto px-6 pb-1.5 max-sm:px-4">
        <p class="text-p-xs text-p-text2">
          <template v-if="skippedPickupCount > 0">{{ skippedPickupCount }} {{ skippedPickupCount === 1 ? 'pickup' : 'pickups' }} skipped (of {{ totalPickupCount }})</template><template v-if="skippedPickupCount > 0 && skippedZoneCount > 0">, </template><template v-if="skippedZoneCount > 0">{{ skippedZoneCount }} {{ skippedZoneCount === 1 ? 'zone' : 'zones' }} skipped (of {{ totalZoneCount }})</template>
        </p>
      </div>
    </div>
    <div
      v-if="openPanel === 'save'"
      class="header-panel border-t border-p-border bg-p-inset"
    >
      <div class="max-w-[1020px] mx-auto px-6 py-4 max-sm:px-4">
        <div class="max-w-[420px] ml-auto flex flex-col gap-3 max-sm:max-w-none">
          <p class="text-p-md font-bold text-p-amber tracking-[-0.01em] leading-[1.3]">Save guide</p>
          <p class="text-p-xs text-p-muted leading-normal">Saving publishes your guide and generates a link you can share with others.</p>

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
                @keydown.enter.prevent="publishGuide"
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
              @keydown.enter.prevent="publishGuide"
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
              {{ saving === 'saving' ? 'Saving…' : 'Save & publish' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else-if="openPanel === 'share' && isSaved"
      class="header-panel border-t border-p-border bg-p-inset"
    >
      <div class="max-w-[1020px] mx-auto px-6 py-2.5 max-sm:px-4 max-sm:py-3 flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-stretch max-sm:gap-2">
        <!-- URL bar: middle on desktop (order-2), top on mobile (first in DOM) -->
        <div class="flex items-stretch bg-p-bg border border-p-subtle rounded-[3px] overflow-hidden font-p-mono text-p-sm min-w-0 flex-1 max-w-[460px] max-sm:max-w-none sm:order-2">
          <input
            class="flex-1 min-w-0 bg-transparent border-0 px-3 py-[0.3rem] text-p-text2 outline-none select-all"
            :value="shareUrl"
            readonly
            aria-label="Share URL"
            @focus="($event.target as HTMLInputElement).select()"
          />
          <button
            class="shrink-0 flex items-center justify-center gap-1.5 px-3 border-l border-p-subtle text-p-muted hover:text-p-amber transition-colors duration-130"
            :class="{
              'text-p-amber!': copyShareState === 'success',
              'text-p-error! hover:text-p-error!': copyShareState === 'error',
            }"
            @click="copyShareUrl"
            :aria-label="copyShareState === 'success' ? 'Link copied' : copyShareState === 'error' ? 'Copy failed - try selecting the URL manually' : 'Copy share link'"
          >
            <Check v-if="copyShareState === 'success'" :size="12" aria-hidden="true" />
            <X v-else-if="copyShareState === 'error'" :size="12" aria-hidden="true" />
            <Copy v-else :size="12" aria-hidden="true" />
            <span class="text-p-xs">{{ copyShareState === 'success' ? 'Copied' : copyShareState === 'error' ? 'Copy failed' : 'Copy link' }}</span>
          </button>
        </div>

        <!-- Contents wrapper: flex row on mobile (Copy Markdown left, X right),
             transparent on desktop so children join the parent flex with sm:order-* -->
        <div class="flex items-center justify-between gap-2 sm:contents">
          <button
            class="planner-btn-ghost shrink-0 sm:order-1"
            :class="{
              'border-p-amber-dim! text-p-amber-dim! hover:text-p-amber!': copyMdState === 'success',
              'border-p-error! text-p-error!': copyMdState === 'error',
            }"
            @click="copyMarkdownFromPanel"
          >
            <Check v-if="copyMdState === 'success'" :size="11" aria-hidden="true" />
            <span>{{ copyMdState === 'success' ? 'Markdown copied' : copyMdState === 'error' ? 'Copy failed' : 'Copy Markdown' }}</span>
          </button>

          <button
            class="shrink-0 p-1 max-sm:p-2 text-p-muted hover:text-p-text2 transition-colors duration-130 focus-visible:outline-1 focus-visible:outline-p-amber-dim focus-visible:outline-offset-2 rounded-[3px] sm:order-3"
            aria-label="Close share panel"
            @click="closePanel"
          >
            <X :size="13" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>

    <div
      v-else-if="openPanel === 'passphrase'"
      class="header-panel border-t border-p-border bg-p-inset"
    >
      <div class="max-w-[1020px] mx-auto px-6 py-4 max-sm:px-4">
        <div class="max-w-[420px] ml-auto flex flex-col gap-3 max-sm:max-w-none">
          <p v-if="!sessionExpired" class="text-p-md font-bold text-p-amber tracking-[-0.01em] leading-[1.3]">Unlock editing</p>
          <p v-else class="text-p-xs text-p-amber leading-[1.45]">
            Session expired - enter your passphrase to continue editing.
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
          <div class="flex flex-wrap items-center gap-2">
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

<style scoped>
.planner-btn-primary {
  position: relative;
  overflow: hidden;
  background: oklch(20% 0.056 65);
  border-color: oklch(46% 0.100 65);
  color: var(--planner-amber);
  transform: translate(var(--btn-tx, 0px), var(--btn-ty, 0px));
  transition:
    transform 0.45s cubic-bezier(0.2, 0, 0, 1),
    border-color 0.13s,
    color 0.13s,
    background-color 0.13s;
}

.planner-btn-primary:hover {
  background: oklch(24% 0.068 65);
  border-color: oklch(62% 0.122 65);
  color: var(--planner-amber);
}

.planner-btn-primary[data-tracking] {
  transition:
    transform 0.07s linear,
    border-color 0.13s,
    color 0.13s,
    background-color 0.13s;
}

.planner-btn-primary::before {
  content: "";
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: conic-gradient(
    from 0deg at 50% 50%,
    transparent 0deg,
    oklch(76% 0.158 65 / 0.18) 28deg,
    transparent 56deg,
    transparent 360deg
  );
  animation: btn-shimmer 7s linear infinite;
  pointer-events: none;
}

@keyframes btn-shimmer {
  to {
    transform: rotate(360deg);
  }
}

.btn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 10px;
  height: 10px;
}

.btn-spinner {
  animation: icon-spin 0.65s linear infinite;
}

@keyframes icon-spin {
  to {
    transform: rotate(360deg);
  }
}

.btn-check path {
  stroke-dasharray: 1;
  animation: draw-check 0.32s cubic-bezier(0.2, 0, 0, 1) both;
}

@keyframes draw-check {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.header-panel {
  view-transition-name: header-panel;
}

.confirm-enter-active {
  transition: opacity 160ms;
}
.confirm-leave-active {
  transition: opacity 110ms;
}
.confirm-enter-from,
.confirm-leave-to {
  opacity: 0;
}

.confirm-enter-active .confirm-dialog {
  transition:
    opacity 200ms,
    transform 230ms cubic-bezier(0.2, 0, 0, 1);
}
.confirm-leave-active .confirm-dialog {
  transition:
    opacity 110ms,
    transform 110ms cubic-bezier(0.4, 0, 1, 1);
}
.confirm-enter-from .confirm-dialog {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}
.confirm-leave-to .confirm-dialog {
  opacity: 0;
  transform: scale(0.97) translateY(-4px);
}
</style>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-new(header-panel) {
  animation: header-panel-enter 210ms cubic-bezier(0.2, 0, 0, 1) both;
}

::view-transition-old(header-panel) {
  animation: header-panel-exit 150ms cubic-bezier(0.4, 0, 1, 1) both;
}

@keyframes header-panel-enter {
  from {
    opacity: 0;
    clip-path: inset(0 0 100% 0);
  }
  20% {
    opacity: 1;
  }
  to {
    clip-path: inset(0 0 0% 0);
  }
}

@keyframes header-panel-exit {
  from {
    clip-path: inset(0 0 0% 0);
    opacity: 1;
  }
  to {
    clip-path: inset(0 0 100% 0);
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-image-pair(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
</style>
