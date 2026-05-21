import {
	type InjectionKey,
	inject,
	provide,
	type Ref,
	reactive,
	ref,
	watch,
} from "vue";
import { toast } from "vue-sonner";
import { DATA } from "../data/campaign";
import {
	applyFilterToSkips,
	buildPresetState,
	type Filter,
	type Preset,
} from "../data/templates";
import type { PlannerState } from "../lib/plannerState";
import {
	areaKey,
	buildDefaultPlannerState,
	normalizePlannerState,
	pickKey,
} from "../lib/plannerState";

export type { PlannerState };
export { areaKey, buildDefaultPlannerState, normalizePlannerState, pickKey };

export interface PlannerContext {
	state: PlannerState;
	readonly: Ref<boolean>;
	guideName: Ref<string>;
	persistenceKey?: string;
	setReadonly(value: boolean): void;
	hydrateFromStorage?(): void;
	replaceState(next: PlannerState, name?: string): void;
	resetAll(): void;
	expandAll(): void;
	collapseAll(): void;
	expandActAreas(actId: string): void;
	collapseActAreas(actId: string): void;
	collapseEmptyAreas(actId: string): void;
	applyPreset(preset: Preset): void;
	applyFilter(filter: Filter): void;
}

const PLANNER_CONTEXT_KEY: InjectionKey<PlannerContext> =
	Symbol("plannerContext");

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

export function createPlannerContext(options: {
	initialState?: Partial<PlannerState>;
	persistenceKey?: string;
	readonly?: boolean;
	initialName?: string;
}): PlannerContext {
	const normalizedInitial = normalizePlannerState(options.initialState ?? {});
	const state = reactive<PlannerState>(normalizedInitial);
	const readonlyRef = ref(options.readonly ?? false);
	const guideName = ref(options.initialName ?? "");

	let watcherStarted = false;

	function startPersistenceWatcher() {
		if (watcherStarted || !options.persistenceKey) return;
		watcherStarted = true;
		watch(
			() => JSON.stringify(state),
			(json) => {
				try {
					localStorage.setItem(options.persistenceKey ?? "", json);
				} catch {}
			},
			{ deep: true },
		);
		watch(guideName, (name) => {
			try {
				localStorage.setItem(
					`${options.persistenceKey ?? ""}-name`,
					JSON.stringify(name),
				);
			} catch {}
		});
	}

	function hydrateFromStorage() {
		if (!options.persistenceKey || typeof window === "undefined") return;
		try {
			const raw = localStorage.getItem(options.persistenceKey);
			if (raw) {
				const parsed = normalizePlannerState(JSON.parse(raw));
				Object.assign(state, parsed);
			}
			const nameRaw = localStorage.getItem(`${options.persistenceKey}-name`);
			if (nameRaw) {
				const parsed = JSON.parse(nameRaw);
				if (typeof parsed === "string" && parsed.trim()) {
					guideName.value = parsed.trim();
				}
			}
		} catch {}
		startPersistenceWatcher();
	}

	function setReadonly(value: boolean) {
		readonlyRef.value = value;
	}

	function replaceState(next: PlannerState, name?: string) {
		const normalized = normalizePlannerState(next);
		Object.assign(state, normalized);
		if (name !== undefined) guideName.value = name;
	}

	function cloneStateSnapshot(): PlannerState {
		return JSON.parse(JSON.stringify(state)) as PlannerState;
	}

	function resetAll() {
		if (readonlyRef.value) return;
		const snapshot = cloneStateSnapshot();
		const prevName = guideName.value;
		if (options.persistenceKey && typeof window !== "undefined") {
			try {
				localStorage.removeItem(options.persistenceKey);
				localStorage.removeItem(`${options.persistenceKey}-name`);
			} catch {}
		}
		Object.assign(state, buildDefaultPlannerState());
		guideName.value = "";
		toast("Route reset.", {
			action: {
				label: "Undo",
				onClick: () => {
					Object.assign(state, snapshot);
					guideName.value = prevName;
				},
			},
		});
	}

	function expandAll() {
		if (readonlyRef.value) return;
		DATA.forEach((act) => {
			state.actsCollapsed[act.id] = false;
			act.areas.forEach((area) => {
				state.areasCollapsed[areaKey(act.id, area.id)] = false;
			});
		});
	}

	function collapseAll() {
		if (readonlyRef.value) return;
		DATA.forEach((act) => {
			state.actsCollapsed[act.id] = true;
			act.areas.forEach((area) => {
				state.areasCollapsed[areaKey(act.id, area.id)] = true;
			});
		});
	}

	function expandActAreas(actId: string) {
		if (readonlyRef.value) return;
		const act = DATA.find((a) => a.id === actId);
		if (!act) return;
		act.areas.forEach((area) => {
			state.areasCollapsed[areaKey(actId, area.id)] = false;
		});
	}

	function collapseActAreas(actId: string) {
		if (readonlyRef.value) return;
		const act = DATA.find((a) => a.id === actId);
		if (!act) return;
		act.areas.forEach((area) => {
			state.areasCollapsed[areaKey(actId, area.id)] = true;
		});
	}

	function collapseEmptyAreas(actId: string) {
		if (readonlyRef.value) return;
		const act = DATA.find((a) => a.id === actId);
		if (!act) return;
		act.areas.forEach((area) => {
			const ak = areaKey(actId, area.id);
			const isZoneSkipped = !!state.skippedZones[ak];
			const allPickupsSkipped =
				area.pickups.length === 0 ||
				area.pickups.every(
					(p) => !!state.skippedPickups[pickKey(actId, area.id, p.id)],
				);
			if (isZoneSkipped || allPickupsSkipped) {
				state.areasCollapsed[ak] = true;
			}
		});
	}

	function applyPreset(preset: Preset) {
		if (readonlyRef.value) return;
		const snapshot = cloneStateSnapshot();
		const actsCollapsed = { ...state.actsCollapsed };
		const areasCollapsed = { ...state.areasCollapsed };
		replaceState(buildPresetState(preset));
		Object.assign(state.actsCollapsed, actsCollapsed);
		Object.assign(state.areasCollapsed, areasCollapsed);
		toast(`Applied "${preset.label}".`, {
			action: {
				label: "Undo",
				onClick: () => replaceState(snapshot),
			},
		});
	}

	function applyFilter(filter: Filter) {
		if (readonlyRef.value) return;
		const snapshot = { ...state.skippedPickups };
		state.skippedPickups = applyFilterToSkips(
			state.skippedPickups,
			filter,
			DATA,
		);
		toast(`Applied "${filter.label}".`, {
			action: {
				label: "Undo",
				onClick: () => {
					state.skippedPickups = snapshot;
				},
			},
		});
	}

	return {
		state,
		readonly: readonlyRef,
		guideName,
		persistenceKey: options.persistenceKey,
		setReadonly,
		hydrateFromStorage,
		replaceState,
		resetAll,
		expandAll,
		collapseAll,
		expandActAreas,
		collapseActAreas,
		collapseEmptyAreas,
		applyPreset,
		applyFilter,
	};
}

export function providePlannerContext(context: PlannerContext): void {
	provide(PLANNER_CONTEXT_KEY, context);
}

export function usePlannerState(): PlannerContext {
	const context = inject(PLANNER_CONTEXT_KEY);
	if (!context) {
		throw new Error(
			"[PlannerContext] No planner context provided. Wrap the route in a component that calls providePlannerContext().",
		);
	}
	return context;
}
