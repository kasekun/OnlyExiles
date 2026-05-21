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
import { DATA } from "~/data/campaign";
import type { Template } from "~/data/templates";
import type { PlannerState } from "~/lib/plannerState";
import {
	areaKey,
	buildDefaultPlannerState,
	normalizePlannerState,
	pickKey,
} from "~/lib/plannerState";

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
	applyTemplate(
		template: Template,
		options?: { resetAllFields?: boolean },
	): void;
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

	function resetAll() {
		if (readonlyRef.value) return;
		const snapshot = JSON.parse(JSON.stringify(state)) as PlannerState;
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
					(_, i) => !!state.skippedPickups[pickKey(actId, area.id, i)],
				);
			if (isZoneSkipped || allPickupsSkipped) {
				state.areasCollapsed[ak] = true;
			}
		});
	}

	function applyTemplate(
		template: Template,
		options?: { resetAllFields?: boolean },
	) {
		if (readonlyRef.value) return;

		// Snapshot all template-owned fields so Undo fully restores pre-apply state.
		const snapshot = {
			skippedPickups: { ...state.skippedPickups },
			skippedZones: { ...state.skippedZones },
			levels: { ...state.levels },
			areaOrder: JSON.parse(JSON.stringify(state.areaOrder)) as Record<
				string,
				string[]
			>,
			actRegex: { ...state.actRegex },
			notes: { ...state.notes },
			actNotes: { ...state.actNotes },
		};

		if (options?.resetAllFields) {
			state.skippedPickups = {};
			state.skippedZones = {};
			state.levels = {};
			state.areaOrder = {};
			state.actRegex = {};
			state.notes = {};
			state.actNotes = {};
		}

		// Sparse patch: only fields the template explicitly provides are written.
		if (template.skippedPickups !== undefined) {
			for (const [k, v] of Object.entries(template.skippedPickups)) {
				if (v) {
					state.skippedPickups[k] = true;
				} else {
					delete state.skippedPickups[k];
				}
			}
		}
		if (template.skippedZones !== undefined) {
			for (const [k, v] of Object.entries(template.skippedZones)) {
				if (v) {
					state.skippedZones[k] = true;
				} else {
					delete state.skippedZones[k];
				}
			}
		}
		if (template.levels !== undefined) {
			for (const [k, v] of Object.entries(template.levels)) {
				state.levels[k] = v;
			}
		}
		if (template.areaOrder !== undefined) {
			for (const [actId, order] of Object.entries(template.areaOrder)) {
				state.areaOrder[actId] = order;
			}
		}
		if (template.actRegex !== undefined) {
			for (const [k, v] of Object.entries(template.actRegex)) {
				state.actRegex[k] = v;
			}
		}
		if (template.notes !== undefined) {
			for (const [k, v] of Object.entries(template.notes)) {
				state.notes[k] = v;
			}
		}
		if (template.actNotes !== undefined) {
			for (const [k, v] of Object.entries(template.actNotes)) {
				state.actNotes[k] = v;
			}
		}

		toast(`Applied "${template.label}".`, {
			action: {
				label: "Undo",
				onClick: () => {
					state.skippedPickups = snapshot.skippedPickups;
					state.skippedZones = snapshot.skippedZones;
					state.levels = snapshot.levels;
					state.areaOrder = snapshot.areaOrder;
					state.actRegex = snapshot.actRegex;
					state.notes = snapshot.notes;
					state.actNotes = snapshot.actNotes;
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
		applyTemplate,
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
