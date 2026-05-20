import { type Ref, ref } from "vue";
import type { PlannerContext } from "~/composables/usePlannerState";
import { normalizePlannerState } from "~/composables/usePlannerState";

export interface GuideEntry {
	id: string;
	name: string;
	updatedAt: string;
}

const GUIDES_KEY = "poe2-guides";

function editTokenKey(id: string): string {
	return `poe2-edit-${id}`;
}

function readGuides(): GuideEntry[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(GUIDES_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter(
			(e) =>
				typeof e?.id === "string" &&
				typeof e?.name === "string" &&
				typeof e?.updatedAt === "string",
		);
	} catch {
		return [];
	}
}

function writeGuides(entries: GuideEntry[]): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(GUIDES_KEY, JSON.stringify(entries));
	} catch {}
}

function upsertGuide(entry: GuideEntry): void {
	const existing = readGuides().filter((e) => e.id !== entry.id);
	writeGuides([entry, ...existing]);
}

function readEditToken(id: string): string | null {
	if (typeof window === "undefined") return null;
	try {
		return localStorage.getItem(editTokenKey(id));
	} catch {
		return null;
	}
}

function writeEditToken(id: string, token: string): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.setItem(editTokenKey(id), token);
	} catch {}
}

function removeEditToken(id: string): void {
	if (typeof window === "undefined") return;
	try {
		localStorage.removeItem(editTokenKey(id));
	} catch {}
}

export function useGuideStore() {
	const guides: Ref<GuideEntry[]> = ref([]);
	const loaded = ref(false);

	function load() {
		guides.value = readGuides();
		loaded.value = true;
	}

	function hasEditToken(id: string): boolean {
		return readEditToken(id) !== null;
	}

	function getEditToken(id: string): string | null {
		return readEditToken(id);
	}

	async function saveGuide(
		context: PlannerContext,
		passphrase: string,
	): Promise<{ id: string }> {
		const name = context.guideName.value.trim() || "Untitled guide";
		const res = await $fetch<{ id: string; editToken: string }>("/api/guides", {
			method: "POST",
			body: {
				name,
				passphrase,
				state: context.state,
			},
		});

		writeEditToken(res.id, res.editToken);
		upsertGuide({ id: res.id, name, updatedAt: new Date().toISOString() });
		guides.value = readGuides();

		return { id: res.id };
	}

	async function updateGuide(
		id: string,
		context: PlannerContext,
	): Promise<void> {
		const token = readEditToken(id);
		if (!token) throw new Error("No edit token");

		const name = context.guideName.value.trim() || "Untitled guide";
		await $fetch(`/api/guides/${id}`, {
			method: "PATCH",
			headers: { Authorization: `Bearer ${token}` },
			body: { name, state: context.state },
		});

		upsertGuide({ id, name, updatedAt: new Date().toISOString() });
		guides.value = readGuides();
	}

	async function claimEditRights(
		id: string,
		passphrase: string,
		guideName: string,
	): Promise<void> {
		const res = await $fetch<{ editToken: string }>(`/api/guides/${id}/auth`, {
			method: "POST",
			body: { passphrase },
		});

		writeEditToken(id, res.editToken);
		upsertGuide({ id, name: guideName, updatedAt: new Date().toISOString() });
		guides.value = readGuides();
	}

	function expireToken(id: string): void {
		removeEditToken(id);
	}

	function forkGuide(
		scratchContext: PlannerContext,
		guideState: PlannerContext["state"],
		originalName: string,
	): void {
		const normalized = normalizePlannerState(guideState);
		scratchContext.replaceState(normalized, `Fork of ${originalName}`);
		if (scratchContext.persistenceKey && typeof window !== "undefined") {
			try {
				localStorage.setItem(
					scratchContext.persistenceKey,
					JSON.stringify(normalized),
				);
				localStorage.setItem(
					`${scratchContext.persistenceKey}-name`,
					JSON.stringify(`Fork of ${originalName}`),
				);
			} catch {}
		}
	}

	return {
		guides,
		loaded,
		load,
		hasEditToken,
		getEditToken,
		saveGuide,
		updateGuide,
		claimEditRights,
		expireToken,
		forkGuide,
	};
}
