import { describe, expect, it } from "bun:test";
import { DATA } from "../app/data/campaign";
import {
	CAMPAIGN_DEFAULT,
	TEMPLATES,
	validateTemplates,
} from "../app/data/templates/index";
import {
	buildDefaultPlannerState,
	normalizePlannerState,
} from "../app/lib/plannerState";

// ---------------------------------------------------------------------------
// buildDefaultPlannerState
// ---------------------------------------------------------------------------

describe("buildDefaultPlannerState", () => {
	it("returns a truly blank state — no notes, levels, skips, or custom order", () => {
		const s = buildDefaultPlannerState();
		expect(s.notes).toEqual({});
		expect(s.levels).toEqual({});
		expect(s.skippedPickups).toEqual({});
		expect(s.skippedZones).toEqual({});
		expect(s.actNotes).toEqual({});
		expect(s.actRegex).toEqual({});
		expect(s.areaOrder).toEqual({});
		expect(s.actsCollapsed).toEqual({});
		expect(s.areasCollapsed).toEqual({});
	});

	it("returns a fresh object on each call", () => {
		const a = buildDefaultPlannerState();
		const b = buildDefaultPlannerState();
		a.notes.x = "y";
		expect(b.notes.x).toBeUndefined();
	});
});

// ---------------------------------------------------------------------------
// normalizePlannerState
// ---------------------------------------------------------------------------

describe("normalizePlannerState", () => {
	it("returns a blank state for null/undefined input", () => {
		expect(normalizePlannerState(null)).toEqual(buildDefaultPlannerState());
		expect(normalizePlannerState(undefined)).toEqual(
			buildDefaultPlannerState(),
		);
		expect(normalizePlannerState("string")).toEqual(buildDefaultPlannerState());
	});

	it("preserves valid fields", () => {
		const result = normalizePlannerState({
			notes: { "act-1|zone-1": "hello" },
			levels: { "act-1|zone-1": "5" },
			skippedPickups: { "act-1|zone-1|0": true },
			skippedZones: { "act-1|zone-1": true },
			actNotes: { "act-1": "act note" },
			actRegex: { "act-1": "some regex" },
		});
		expect(result.notes["act-1|zone-1"]).toBe("hello");
		expect(result.levels["act-1|zone-1"]).toBe("5");
		expect(result.skippedPickups["act-1|zone-1|0"]).toBe(true);
		expect(result.skippedZones["act-1|zone-1"]).toBe(true);
		expect(result.actNotes["act-1"]).toBe("act note");
		expect(result.actRegex["act-1"]).toBe("some regex");
	});

	it("trims whitespace from string fields", () => {
		const result = normalizePlannerState({
			notes: { "act-1|zone-1": "  spaces  " },
			levels: { "act-1|zone-1": " 5 " },
		});
		expect(result.notes["act-1|zone-1"]).toBe("spaces");
		expect(result.levels["act-1|zone-1"]).toBe("5");
	});

	it("discards non-boolean values from boolean record fields", () => {
		const result = normalizePlannerState({
			skippedPickups: { valid: true, bad: "yes", alsobad: 1 },
		});
		expect(result.skippedPickups.valid).toBe(true);
		expect(result.skippedPickups.bad).toBeUndefined();
		expect(result.skippedPickups.alsobad).toBeUndefined();
	});

	it("migrates legacy 'skipped' field to 'skippedPickups'", () => {
		const result = normalizePlannerState({
			skipped: { "act-1|zone-1|0": true },
		});
		expect(result.skippedPickups["act-1|zone-1|0"]).toBe(true);
		expect(
			(result as unknown as Record<string, unknown>).skipped,
		).toBeUndefined();
	});

	it("prefers 'skippedPickups' over legacy 'skipped' when both present", () => {
		const result = normalizePlannerState({
			skippedPickups: { "new-key|0": true },
			skipped: { "old-key|0": true },
		});
		expect(result.skippedPickups["new-key|0"]).toBe(true);
		expect(result.skippedPickups["old-key|0"]).toBeUndefined();
	});

	it("normalizes skippedZones from blank input", () => {
		const result = normalizePlannerState({});
		expect(result.skippedZones).toEqual({});
	});
});

// ---------------------------------------------------------------------------
// Template validation
// ---------------------------------------------------------------------------

describe("validateTemplates", () => {
	it("returns no errors for valid built-in templates against campaign data", () => {
		const errors = validateTemplates(TEMPLATES, DATA);
		expect(errors).toEqual([]);
	});

	it("catches unknown actId in skippedPickups", () => {
		const errors = validateTemplates(
			[
				{
					id: "t",
					label: "T",
					description: "",
					skippedPickups: { "nonexistent-act|zone|0": true },
				},
			],
			DATA,
		);
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0]).toContain("nonexistent-act");
	});

	it("catches out-of-range pickup index", () => {
		const firstAct = DATA[0];
		if (!firstAct) throw new Error("DATA has no acts");
		const firstArea = firstAct.areas[0];
		if (!firstArea) throw new Error("first act has no areas");
		const badIdx = firstArea.pickups.length;
		const errors = validateTemplates(
			[
				{
					id: "t",
					label: "T",
					description: "",
					skippedPickups: {
						[`${firstAct.id}|${firstArea.id}|${badIdx}`]: true,
					},
				},
			],
			DATA,
		);
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0]).toContain("out of range");
	});

	it("catches unknown areaId in skippedZones", () => {
		const firstAct = DATA[0];
		if (!firstAct) throw new Error("DATA has no acts");
		const errors = validateTemplates(
			[
				{
					id: "t",
					label: "T",
					description: "",
					skippedZones: { [`${firstAct.id}|fake-zone`]: true },
				},
			],
			DATA,
		);
		expect(errors.length).toBeGreaterThan(0);
	});

	it("catches duplicate areaIds in areaOrder", () => {
		const firstAct = DATA[0];
		if (!firstAct) throw new Error("DATA has no acts");
		const firstAreaId = firstAct.areas[0]?.id;
		if (!firstAreaId) throw new Error("first act has no areas");
		const errors = validateTemplates(
			[
				{
					id: "t",
					label: "T",
					description: "",
					areaOrder: { [firstAct.id]: [firstAreaId, firstAreaId] },
				},
			],
			DATA,
		);
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0]).toContain("duplicate");
	});
});

// ---------------------------------------------------------------------------
// CAMPAIGN_DEFAULT template structure
// ---------------------------------------------------------------------------

describe("CAMPAIGN_DEFAULT", () => {
	it("has levels for every zone in campaign data", () => {
		for (const act of DATA) {
			for (const area of act.areas) {
				const key = `${act.id}|${area.id}`;
				expect(CAMPAIGN_DEFAULT.levels?.[key]).toBeDefined();
			}
		}
	});

	it("has no skipped pickups or zones by default", () => {
		expect(CAMPAIGN_DEFAULT.skippedPickups ?? {}).toEqual({});
		expect(CAMPAIGN_DEFAULT.skippedZones ?? {}).toEqual({});
	});
});

// ---------------------------------------------------------------------------
// Sparse template application logic
// ---------------------------------------------------------------------------

describe("sparse template patch logic", () => {
	it("absent template fields leave state untouched", () => {
		const state = buildDefaultPlannerState();
		state.notes["act-1|zone-1"] = "user note";
		state.levels["act-1|zone-1"] = "7";

		const patch = { skippedPickups: { "act-1|zone-1|0": true } };
		for (const [k, v] of Object.entries(patch.skippedPickups)) {
			if (v) state.skippedPickups[k] = true;
			else delete state.skippedPickups[k];
		}

		expect(state.notes["act-1|zone-1"]).toBe("user note");
		expect(state.levels["act-1|zone-1"]).toBe("7");
		expect(state.skippedPickups["act-1|zone-1|0"]).toBe(true);
	});

	it("explicit false in skippedPickups clears the skip", () => {
		const state = buildDefaultPlannerState();
		state.skippedPickups["act-1|zone-1|0"] = true;

		const patch: Record<string, boolean> = { "act-1|zone-1|0": false };
		for (const [k, v] of Object.entries(patch)) {
			if (v) state.skippedPickups[k] = true;
			else delete state.skippedPickups[k];
		}

		expect(state.skippedPickups["act-1|zone-1|0"]).toBeUndefined();
	});

	it("reset-all-fields mode clears everything before applying patch", () => {
		const state = buildDefaultPlannerState();
		state.notes["act-1|zone-1"] = "user note";
		state.levels["act-1|zone-1"] = "7";
		state.skippedPickups["act-1|zone-1|0"] = true;
		state.skippedZones["act-1|zone-1"] = true;

		Object.assign(state, {
			skippedPickups: {},
			skippedZones: {},
			levels: {},
			areaOrder: {},
			actRegex: {},
			notes: {},
			actNotes: {},
		});

		const patch = { notes: { "act-1|zone-1": "template note" } };
		for (const [k, v] of Object.entries(patch.notes)) {
			state.notes[k] = v;
		}

		expect(state.notes["act-1|zone-1"]).toBe("template note");
		expect(state.levels["act-1|zone-1"]).toBeUndefined();
		expect(state.skippedPickups["act-1|zone-1|0"]).toBeUndefined();
		expect(state.skippedZones["act-1|zone-1"]).toBeUndefined();
	});
});

// ---------------------------------------------------------------------------
// Reset-to-blank behavior
// ---------------------------------------------------------------------------

describe("reset-to-blank", () => {
	it("Object.assign with fresh defaults blanks a populated state", () => {
		const state = buildDefaultPlannerState();
		state.notes.x = "something";
		state.levels.x = "5";
		state.skippedPickups["x|0"] = true;
		state.skippedZones.x = true;

		Object.assign(state, buildDefaultPlannerState());

		expect(state.notes).toEqual({});
		expect(state.levels).toEqual({});
		expect(state.skippedPickups).toEqual({});
		expect(state.skippedZones).toEqual({});
	});
});

// ---------------------------------------------------------------------------
// Markdown export: skipped-zone filtering
// ---------------------------------------------------------------------------

describe("skipped-zone markdown filtering", () => {
	it("omitSkippedZones removes skipped zones from visible areas", () => {
		const firstAct = DATA[0];
		if (!firstAct) throw new Error("DATA has no acts");
		const firstArea = firstAct.areas[0];
		if (!firstArea) throw new Error("first act has no areas");
		const akey = `${firstAct.id}|${firstArea.id}`;

		const state = buildDefaultPlannerState();
		state.skippedZones[akey] = true;

		const omitSkippedZones = true;
		const visible = firstAct.areas.filter((area) => {
			if (omitSkippedZones && state.skippedZones[`${firstAct.id}|${area.id}`]) {
				return false;
			}
			return true;
		});

		expect(visible.find((a) => a.id === firstArea.id)).toBeUndefined();
	});

	it("skipped zones remain visible when omitSkippedZones is false", () => {
		const firstAct = DATA[0];
		if (!firstAct) throw new Error("DATA has no acts");
		const firstArea = firstAct.areas[0];
		if (!firstArea) throw new Error("first act has no areas");
		const akey = `${firstAct.id}|${firstArea.id}`;

		const state = buildDefaultPlannerState();
		state.skippedZones[akey] = true;

		const omitSkippedZones = false;
		const visible = firstAct.areas.filter((area) => {
			if (omitSkippedZones && state.skippedZones[`${firstAct.id}|${area.id}`]) {
				return false;
			}
			return true;
		});

		expect(visible.find((a) => a.id === firstArea.id)).toBeDefined();
	});
});
