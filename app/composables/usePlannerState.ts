import { reactive, watch } from "vue";
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
	hideEmptyZones: boolean;
}

export function areaKey(actId: string, areaId: string): string {
	return `${actId}|${areaId}`;
}

export function pickKey(actId: string, areaId: string, i: number): string {
	return `${actId}|${areaId}|${i}`;
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
		hideEmptyZones: false,
	};
}

let _state: PlannerState | null = null;

export function usePlannerState() {
	if (!_state) {
		const saved = import.meta.client ? loadFromStorage() : {};
		_state = reactive<PlannerState>({
			...buildDefaultState(),
			...saved,
		});

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
		if (
			!confirm(
				"Reset everything? All notes, skipped items, custom levels, and collapse states will be cleared.",
			)
		)
			return;
		if (import.meta.client) localStorage.removeItem(STORAGE_KEY);
		const fresh = buildDefaultState();
		Object.assign(_state, fresh);
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

	function applyTemplate(template: Template) {
		if (!_state) return;
		if (
			!confirm(
				`Apply "${template.label}"? This will replace your current skip selections.`,
			)
		)
			return;
		_state.skipped = { ...template.skipped };
	}

	return {
		state: _state,
		areaKey,
		pickKey,
		resetAll,
		expandAll,
		collapseAll,
		expandActAreas,
		collapseActAreas,
		applyTemplate,
	};
}
