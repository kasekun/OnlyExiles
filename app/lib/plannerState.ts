export interface PlannerState {
	actsCollapsed: Record<string, boolean>;
	areasCollapsed: Record<string, boolean>;
	areaOrder: Record<string, string[]>;
	skippedPickups: Record<string, boolean>;
	skippedZones: Record<string, boolean>;
	notes: Record<string, string[]>;
	levels: Record<string, string>;
	actNotes: Record<string, string[]>;
	actRegex: Record<string, string>;
}

export function areaKey(actId: string, areaId: string): string {
	return `${actId}|${areaId}`;
}

export function pickKey(
	actId: string,
	areaId: string,
	pickupId: string,
): string {
	return `${actId}|${areaId}|${pickupId}`;
}

export function buildDefaultPlannerState(): PlannerState {
	return {
		actsCollapsed: {},
		areasCollapsed: {},
		areaOrder: {},
		skippedPickups: {},
		skippedZones: {},
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
 * Normalizes a single note value from storage.
 * Accepts both legacy `string` (split on `\n`) and new `string[]` format.
 * Each line is trimmed.
 */
function normalizeNoteValue(v: unknown): string[] | null {
	if (typeof v === "string") {
		return v.split("\n").map((s) => s.trim());
	}
	if (Array.isArray(v) && v.every((s) => typeof s === "string")) {
		return v.map((s) => s.trim());
	}
	return null;
}

/**
 * Normalizes a notes record, accepting both legacy string values and string arrays.
 */
function filterNotesRecord(v: unknown): Record<string, string[]> {
	if (!v || typeof v !== "object" || Array.isArray(v)) return {};
	const result: Record<string, string[]> = {};
	for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
		const normalized = normalizeNoteValue(val);
		if (normalized !== null) result[k] = normalized;
	}
	return result;
}

/**
 * Safely normalize an unknown input into a valid PlannerState.
 * Discards fields that don't match the expected shape.
 * Notes are stored as string arrays; legacy string values are split on `\n`.
 * String values in levels/actRegex are trimmed.
 * Accepts the legacy `skipped` field as an alias for `skippedPickups`.
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
		// Accept legacy `skipped` field during migration
		skippedPickups: filterBooleanRecord(raw.skippedPickups ?? raw.skipped),
		skippedZones: filterBooleanRecord(raw.skippedZones),
		notes: filterNotesRecord(raw.notes),
		levels: filterStringRecord(raw.levels),
		actNotes: filterNotesRecord(raw.actNotes),
		actRegex: filterStringRecord(raw.actRegex),
	};
}
