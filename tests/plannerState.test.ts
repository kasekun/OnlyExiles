import { describe, expect, it } from "bun:test";
import { buildMarkdown } from "../app/composables/useMarkdownExport";
import { DATA, validateCampaignData } from "../app/data/campaign";
import {
	applyFilterToSkips,
	buildPresetState,
	CAMPAIGN_DEFAULT,
	FILTERS,
	PRESETS,
	validatePresets,
} from "../app/data/templates/index";
import {
	areaKey,
	buildDefaultPlannerState,
	normalizePlannerState,
	pickKey,
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
// Campaign and preset validation
// ---------------------------------------------------------------------------

describe("validateCampaignData", () => {
	it("campaign data has no duplicate pickup IDs, empty IDs, or untagged pickups", () => {
		expect(validateCampaignData(DATA)).toEqual([]);
	});
});

describe("validatePresets", () => {
	it("returns no errors for valid built-in presets against campaign data", () => {
		const errors = validatePresets(PRESETS, DATA);
		expect(errors).toEqual([]);
	});

	it("catches unknown actId in skippedPickups", () => {
		const errors = validatePresets(
			[
				{
					id: "t",
					label: "T",
					description: "",
					skippedPickups: { "nonexistent-act|zone|pickup": true },
				},
			],
			DATA,
		);
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0]).toContain("nonexistent-act");
	});

	it("catches unknown pickup id", () => {
		const firstAct = DATA[0];
		if (!firstAct) throw new Error("DATA has no acts");
		const firstArea = firstAct.areas[0];
		if (!firstArea) throw new Error("first act has no areas");
		const errors = validatePresets(
			[
				{
					id: "t",
					label: "T",
					description: "",
					skippedPickups: {
						[`${firstAct.id}|${firstArea.id}|missing-pickup`]: true,
					},
				},
			],
			DATA,
		);
		expect(errors.length).toBeGreaterThan(0);
		expect(errors[0]).toContain("unknown pickupId");
	});

	it("catches unknown areaId in skippedZones", () => {
		const firstAct = DATA[0];
		if (!firstAct) throw new Error("DATA has no acts");
		const errors = validatePresets(
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
		const errors = validatePresets(
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
// CAMPAIGN_DEFAULT preset structure
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
// buildPresetState
// ---------------------------------------------------------------------------

describe("buildPresetState", () => {
	it("starts absent preset-owned fields as blank objects", () => {
		const state = buildPresetState({
			id: "blank",
			label: "Blank",
			description: "",
		});
		expect(state.skippedPickups).toEqual({});
		expect(state.skippedZones).toEqual({});
		expect(state.levels).toEqual({});
		expect(state.areaOrder).toEqual({});
		expect(state.actRegex).toEqual({});
		expect(state.notes).toEqual({});
		expect(state.actNotes).toEqual({});
	});

	it("applies preset fields into a full planner state", () => {
		const state = buildPresetState({
			id: "custom",
			label: "Custom",
			description: "",
			skippedPickups: { "act|area|pickup": true },
			skippedZones: { "act|area": true },
			levels: { "act|area": "12" },
			areaOrder: { act: ["area"] },
			actRegex: { act: "regex" },
			notes: { "act|area": "note" },
			actNotes: { act: "act note" },
		});
		expect(state.skippedPickups["act|area|pickup"]).toBe(true);
		expect(state.skippedZones["act|area"]).toBe(true);
		expect(state.levels["act|area"]).toBe("12");
		expect(state.areaOrder.act).toEqual(["area"]);
		expect(state.actRegex.act).toBe("regex");
		expect(state.notes["act|area"]).toBe("note");
		expect(state.actNotes.act).toBe("act note");
	});

	it("leaves collapse state blank for the composable to restore", () => {
		const state = buildPresetState(CAMPAIGN_DEFAULT);
		expect(state.actsCollapsed).toEqual({});
		expect(state.areasCollapsed).toEqual({});
	});
});

// ---------------------------------------------------------------------------
// applyFilterToSkips
// ---------------------------------------------------------------------------

describe("applyFilterToSkips", () => {
	it("skipTags marks matching pickups and preserves existing manual skips", () => {
		const firstAct = DATA[0];
		const firstArea = firstAct?.areas[0];
		const firstPickup = firstArea?.pickups[0];
		if (!firstAct || !firstArea || !firstPickup)
			throw new Error("missing data");
		const manualKey = pickKey(firstAct.id, firstArea.id, firstPickup.id);
		const filter = FILTERS.find((f) => f.id === "skip-league-currency");
		if (!filter) throw new Error("missing filter");

		const next = applyFilterToSkips({ [manualKey]: true }, filter, DATA);

		expect(next[manualKey]).toBe(true);
		for (const act of DATA) {
			for (const area of act.areas) {
				for (const pickup of area.pickups) {
					const key = pickKey(act.id, area.id, pickup.id);
					if (pickup.tags.includes("league-currency")) {
						expect(next[key]).toBe(true);
					} else if (key !== manualKey) {
						expect(next[key]).toBeUndefined();
					}
				}
			}
		}
	});

	it("keepOnlyTags marks non-matching pickups additively", () => {
		const firstAct = DATA[0];
		const firstArea = firstAct?.areas[0];
		const firstPickup = firstArea?.pickups[0];
		if (!firstAct || !firstArea || !firstPickup)
			throw new Error("missing data");
		const manualKey = pickKey(firstAct.id, firstArea.id, firstPickup.id);

		const next = applyFilterToSkips(
			{ [manualKey]: true },
			{
				id: "permanent-only",
				label: "Permanent only",
				description: "",
				keepOnlyTags: ["permanent"],
			},
			DATA,
		);

		for (const act of DATA) {
			for (const area of act.areas) {
				for (const pickup of area.pickups) {
					const key = pickKey(act.id, area.id, pickup.id);
					if (!pickup.tags.includes("permanent") || key === manualKey) {
						expect(next[key]).toBe(true);
					} else {
						expect(next[key]).toBeUndefined();
					}
				}
			}
		}
	});

	it("is idempotent when the same filter is applied twice", () => {
		const filter = FILTERS.find((f) => f.id === "skip-league-currency");
		if (!filter) throw new Error("missing filter");
		const once = applyFilterToSkips({}, filter, DATA);
		const twice = applyFilterToSkips(once, filter, DATA);
		expect(twice).toEqual(once);
	});
});

// ---------------------------------------------------------------------------
// Markdown export
// ---------------------------------------------------------------------------

describe("buildMarkdown", () => {
	it("omits skipped zones when requested", () => {
		const firstAct = DATA[0];
		if (!firstAct) throw new Error("DATA has no acts");
		const firstArea = firstAct.areas[0];
		if (!firstArea) throw new Error("first act has no areas");
		const state = buildDefaultPlannerState();
		state.skippedZones[areaKey(firstAct.id, firstArea.id)] = true;

		const markdown = buildMarkdown(state, "Test guide", true, true);

		expect(markdown).not.toContain(`### ${firstArea.name}`);
	});

	it("keeps skipped zones visible when omission is disabled", () => {
		const firstAct = DATA[0];
		if (!firstAct) throw new Error("DATA has no acts");
		const firstArea = firstAct.areas[0];
		if (!firstArea) throw new Error("first act has no areas");
		const state = buildDefaultPlannerState();
		state.skippedZones[areaKey(firstAct.id, firstArea.id)] = true;

		const markdown = buildMarkdown(state, "Test guide", true, false);

		expect(markdown).toContain(`### ${firstArea.name}`);
	});

	it("omits skipped pickups by stable pickup ID", () => {
		const firstAct = DATA[0];
		const firstArea = firstAct?.areas[0];
		const firstPickup = firstArea?.pickups[0];
		if (!firstAct || !firstArea || !firstPickup)
			throw new Error("missing data");
		const state = buildDefaultPlannerState();
		state.skippedPickups[pickKey(firstAct.id, firstArea.id, firstPickup.id)] =
			true;

		const markdown = buildMarkdown(state, "Test guide", true, false);

		expect(markdown).not.toContain(firstPickup.item);
	});
});
