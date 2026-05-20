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
import { CAMPAIGN_DEFAULT, type Template } from "~/data/templates";
import type { PlannerState } from "~/lib/plannerState";
import {
	buildDefaultPlannerState,
	normalizePlannerState,
} from "~/lib/plannerState";

export type { PlannerState };
export { buildDefaultPlannerState, normalizePlannerState };

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
	applyTemplate(template: Template): void;
}

const PLANNER_CONTEXT_KEY: InjectionKey<PlannerContext> =
	Symbol("plannerContext");

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

function hydrateDefaults(
	state: PlannerState,
	templateNotes?: Record<string, string>,
): void {
	for (const act of DATA) {
		for (const area of act.areas) {
			const key = areaKey(act.id, area.id);
			if (!(key in state.notes)) {
				state.notes[key] = templateNotes?.[key] ?? "";
			}
			if (!(key in state.levels)) {
				state.levels[key] = area.recLevel;
			}
		}
	}
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

	hydrateDefaults(state, CAMPAIGN_DEFAULT.notes);

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
				hydrateDefaults(state, CAMPAIGN_DEFAULT.notes);
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
		hydrateDefaults(state, CAMPAIGN_DEFAULT.notes);
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
		hydrateDefaults(state, CAMPAIGN_DEFAULT.notes);
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
			const isEmpty =
				area.pickups.length === 0 ||
				area.pickups.every(
					(_, i) => !!state.skipped[pickKey(actId, area.id, i)],
				);
			if (isEmpty) {
				state.areasCollapsed[areaKey(actId, area.id)] = true;
			}
		});
	}

	function applyTemplate(template: Template) {
		if (readonlyRef.value) return;
		const previousSkipped = { ...state.skipped };
		const previousNotes = { ...state.notes };
		const previousActNotes = { ...state.actNotes };

		state.skipped = { ...template.skipped };

		if (template.notes !== undefined) {
			for (const act of DATA) {
				for (const area of act.areas) {
					const key = areaKey(act.id, area.id);
					state.notes[key] = template.notes[key] ?? "";
				}
			}
		}
		if (template.actNotes !== undefined) {
			for (const act of DATA) {
				state.actNotes[act.id] = template.actNotes[act.id] ?? "";
			}
		}

		toast(`Applied "${template.label}".`, {
			action: {
				label: "Undo",
				onClick: () => {
					state.skipped = previousSkipped;
					state.notes = previousNotes;
					state.actNotes = previousActNotes;
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
