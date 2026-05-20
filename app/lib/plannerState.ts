export interface PlannerState {
	actsCollapsed: Record<string, boolean>;
	areasCollapsed: Record<string, boolean>;
	areaOrder: Record<string, string[]>;
	skipped: Record<string, boolean>;
	notes: Record<string, string>;
	levels: Record<string, string>;
	actNotes: Record<string, string>;
	actRegex: Record<string, string>;
}

export function buildDefaultPlannerState(): PlannerState {
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

function isStringRecord(v: unknown): v is Record<string, string> {
	if (!v || typeof v !== "object" || Array.isArray(v)) return false;
	return Object.entries(v).every(
		([k, val]) => typeof k === "string" && typeof val === "string",
	);
}

function isStringArrayRecord(v: unknown): v is Record<string, string[]> {
	if (!v || typeof v !== "object" || Array.isArray(v)) return false;
	return Object.entries(v).every(
		([k, val]) =>
			typeof k === "string" &&
			Array.isArray(val) &&
			val.every((s) => typeof s === "string"),
	);
}

function filterBooleanRecord(v: unknown): Record<string, boolean> {
	if (!v || typeof v !== "object" || Array.isArray(v)) return {};
	return Object.fromEntries(
		Object.entries(v).filter(([, val]) => typeof val === "boolean"),
	);
}

function filterStringRecord(v: unknown): Record<string, string> {
	if (!isStringRecord(v)) return {};
	return Object.fromEntries(
		Object.entries(v).map(([k, val]) => [k, val.trim()]),
	);
}

function filterStringArrayRecord(v: unknown): Record<string, string[]> {
	if (!isStringArrayRecord(v)) return {};
	return v;
}

/**
 * Safely normalize an unknown input into a valid PlannerState.
 * Discards any fields that are not the expected shape.
 * String values in notes/levels/actNotes/actRegex are trimmed.
 */
export function normalizePlannerState(input: unknown): PlannerState {
	const defaults = buildDefaultPlannerState();
	if (!input || typeof input !== "object" || Array.isArray(input)) {
		return defaults;
	}
	const raw = input as Record<string, unknown>;
	return {
		actsCollapsed: filterBooleanRecord(raw.actsCollapsed),
		areasCollapsed: filterBooleanRecord(raw.areasCollapsed),
		areaOrder: filterStringArrayRecord(raw.areaOrder),
		skipped: filterBooleanRecord(raw.skipped),
		notes: filterStringRecord(raw.notes),
		levels: filterStringRecord(raw.levels),
		actNotes: filterStringRecord(raw.actNotes),
		actRegex: filterStringRecord(raw.actRegex),
	};
}
