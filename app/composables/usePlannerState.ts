import { reactive, watch } from "vue";
import { toast } from "vue-sonner";
import { DATA } from "~/data/campaign";
import type { Template } from "~/data/templates";

export interface PlannerState {
	actsCollapsed: Record<string, boolean>;
	areasCollapsed: Record<string, boolean>;
	areaOrder: Record<string, string[]>; // actId → ordered area IDs
	skipped: Record<string, boolean>; // pickKey → boolean
	notes: Record<string, string>; // areaKey → user note
	levels: Record<string, string>; // areaKey → custom level string
	actNotes: Record<string, string>; // actId → freetext note
	actRegex: Record<string, string>; // actId → regex string
}

export function areaKey(actId: string, areaId: string): string {
	return `${actId}|${areaId}`;
}

export function pickKey(actId: string, areaId: string, i: number): string {
	return `${actId}|${areaId}|${i}`;
}

export function getOrderedAreas(
	state: Pick<PlannerState, "areaOrder">,
	actId: string,
	defaultOrder: string[],
): string[] {
	const custom = state.areaOrder[actId];
	if (!custom || custom.length === 0) return defaultOrder;
	const customSet = new Set(custom);
	const extra = defaultOrder.filter((id) => !customSet.has(id));
	return [...custom, ...extra];
}

const STORAGE_KEY = "poe2-planner-v1";

function loadFromStorage(): Partial<PlannerState> {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (raw) return JSON.parse(raw) as Partial<PlannerState>;
	} catch {}
	return {};
}

function buildDefaultState(): PlannerState {
	return {
		actsCollapsed: {},
		areasCollapsed: {},
		areaOrder: {},
		skipped: {},
		notes: {},
		levels: {},
		actNotes: {},
		actRegex: {},
	};
}

// Seed state with campaign defaults for any keys not already persisted.
// This makes state the single source of truth for both the UI and the export,
// so neither needs to fall back to campaign.ts at read-time.
function hydrateDefaults(state: PlannerState): void {
	for (const act of DATA) {
		for (const area of act.areas) {
			const key = areaKey(act.id, area.id);
			if (!(key in state.notes)) {
				state.notes[key] = area.notes;
			}
			if (!(key in state.levels)) {
				state.levels[key] = area.recLevel;
			}
		}
	}
}

let _state: PlannerState | null = null;

export function usePlannerState() {
	if (!_state) {
		const saved = import.meta.client ? loadFromStorage() : {};
		_state = reactive<PlannerState>({
			...buildDefaultState(),
			...saved,
		});

		hydrateDefaults(_state);

		if (import.meta.client) {
			watch(
				() => JSON.stringify(_state),
				(json) => {
					try {
						localStorage.setItem(STORAGE_KEY, json);
					} catch {}
				},
				{ deep: true },
			);
		}
	}

	function resetAll() {
		if (!_state) return;
		const snapshot = JSON.parse(JSON.stringify(_state)) as PlannerState;
		if (import.meta.client) localStorage.removeItem(STORAGE_KEY);
		Object.assign(_state, buildDefaultState());
		toast("Route reset.", {
			action: {
				label: "Undo",
				onClick: () => {
					if (!_state) return;
					Object.assign(_state, snapshot);
				},
			},
		});
	}

	function expandAll() {
		if (!_state) return;
		const s = _state;
		DATA.forEach((act) => {
			s.actsCollapsed[act.id] = false;
			act.areas.forEach((area) => {
				s.areasCollapsed[areaKey(act.id, area.id)] = false;
			});
		});
	}

	function collapseAll() {
		if (!_state) return;
		const s = _state;
		DATA.forEach((act) => {
			s.actsCollapsed[act.id] = true;
			act.areas.forEach((area) => {
				s.areasCollapsed[areaKey(act.id, area.id)] = true;
			});
		});
	}

	function expandActAreas(actId: string) {
		if (!_state) return;
		const s = _state;
		const act = DATA.find((a) => a.id === actId);
		if (!act) return;
		act.areas.forEach((area) => {
			s.areasCollapsed[areaKey(actId, area.id)] = false;
		});
	}

	function collapseActAreas(actId: string) {
		if (!_state) return;
		const s = _state;
		const act = DATA.find((a) => a.id === actId);
		if (!act) return;
		act.areas.forEach((area) => {
			s.areasCollapsed[areaKey(actId, area.id)] = true;
		});
	}

	function collapseEmptyAreas(actId: string) {
		if (!_state) return;
		const s = _state;
		const act = DATA.find((a) => a.id === actId);
		if (!act) return;
		act.areas.forEach((area) => {
			const isEmpty =
				area.pickups.length === 0 ||
				area.pickups.every((_, i) => !!s.skipped[pickKey(actId, area.id, i)]);
			if (isEmpty) {
				s.areasCollapsed[areaKey(actId, area.id)] = true;
			}
		});
	}

	function applyTemplate(template: Template) {
		if (!_state) return;
		const previousSkipped = { ..._state.skipped };
		_state.skipped = { ...template.skipped };
		toast(`Applied "${template.label}".`, {
			action: {
				label: "Undo",
				onClick: () => {
					if (!_state) return;
					_state.skipped = previousSkipped;
				},
			},
		});
	}

	return {
		state: _state,
		areaKey,
		getOrderedAreas,
		pickKey,
		resetAll,
		expandAll,
		collapseAll,
		expandActAreas,
		collapseActAreas,
		collapseEmptyAreas,
		applyTemplate,
	};
}
