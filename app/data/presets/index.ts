import {
	buildDefaultPlannerState,
	type PlannerState,
	pickKey,
} from "../../lib/plannerState";
import type { Act, PickupTag } from "../campaign";

export interface Preset {
	id: string;
	label: string;
	description: string;
	/**
	 * Only `true` values are meaningful because presets always reset before
	 * applying. Runtime planner state remains wider so UI toggles can write false.
	 */
	skippedPickups?: Record<string, true>;
	/** Only `true` values are meaningful; presets are full replacement states. */
	skippedZones?: Record<string, true>;
	levels?: Record<string, string>;
	areaOrder?: Record<string, string[]>;
	actRegex?: Record<string, string>;
	notes?: Record<string, string[]>;
	actNotes?: Record<string, string[]>;
}

export type { ActSpec, PresetSpec, ZoneSpec } from "./build-preset";
export { buildPreset } from "./build-preset";

export interface Filter {
	id: string;
	label: string;
	description: string;
	/** Skip any pickup whose tags overlap with skipTags. */
	skipTags?: PickupTag[];
	/** Skip any pickup that has none of the keepOnlyTags. */
	keepOnlyTags?: PickupTag[];
}

export { CAMPAIGN_DEFAULT } from "./campaign-default";
export { ESSENTIALS } from "./essentials";
export { EVERYTHING } from "./everything";
export { SPEEDRUN } from "./speedrun";

import { CAMPAIGN_DEFAULT } from "./campaign-default";
import { ESSENTIALS } from "./essentials";
import { EVERYTHING } from "./everything";
import { SPEEDRUN } from "./speedrun";

/** User-facing presets shown in the Presets dropdown. */
export const PRESETS: Preset[] = [
	CAMPAIGN_DEFAULT,
	EVERYTHING,
	ESSENTIALS,
	SPEEDRUN,
];

/** Additive filters shown in the Filters section of the preset menu. */
export const FILTERS: Filter[] = [
	{
		id: "skip-league-currency",
		label: "Skip league rewards",
		description: "Adds skips for every league-event reward.",
		skipTags: ["league-currency"],
	},
	{
		id: "quest-items-only",
		label: "Quest items only",
		description:
			"Adds skips for everything except permanents, quest items, ascendancy rewards, and passive points.",
		keepOnlyTags: ["quest", "permanent", "ascendancy", "passive-points"],
	},
];

/** Converts a Preset into a full PlannerState. Collapse state is intentionally blank. */
export function buildPresetState(preset: Preset): PlannerState {
	const state = buildDefaultPlannerState();
	if (preset.skippedPickups)
		Object.assign(state.skippedPickups, preset.skippedPickups);
	if (preset.skippedZones)
		Object.assign(state.skippedZones, preset.skippedZones);
	if (preset.levels) Object.assign(state.levels, preset.levels);
	if (preset.areaOrder) Object.assign(state.areaOrder, preset.areaOrder);
	if (preset.actRegex) Object.assign(state.actRegex, preset.actRegex);
	if (preset.notes) Object.assign(state.notes, preset.notes);
	if (preset.actNotes) Object.assign(state.actNotes, preset.actNotes);
	return state;
}

/** Returns a new skippedPickups map with the filter applied additively. */
export function applyFilterToSkips(
	current: Record<string, boolean>,
	filter: Filter,
	data: Act[],
): Record<string, boolean> {
	const next = { ...current };
	const hasAnyTag = (pickupTags: PickupTag[], tags: PickupTag[]): boolean =>
		tags.some((tag) => pickupTags.includes(tag));

	for (const act of data) {
		for (const area of act.areas) {
			for (const pickup of area.pickups) {
				const hasSkippedTag = filter.skipTags
					? hasAnyTag(pickup.tags, filter.skipTags)
					: false;
				const isMissingKeepOnlyTag = filter.keepOnlyTags
					? !hasAnyTag(pickup.tags, filter.keepOnlyTags)
					: false;
				const shouldSkip = hasSkippedTag || isMissingKeepOnlyTag;
				if (shouldSkip) next[pickKey(act.id, area.id, pickup.id)] = true;
			}
		}
	}
	return next;
}

/**
 * Validates presets against campaign data. Returns an array of error strings.
 * Run in dev or as part of the verification pass to catch campaign/preset drift.
 */
export function validatePresets(presets: Preset[], data: Act[]): string[] {
	const errors: string[] = [];
	const actIds = new Set(data.map((a) => a.id));
	const areaIdsByAct = new Map<string, Set<string>>();
	const pickupIdsByArea = new Map<string, Set<string>>();

	for (const act of data) {
		areaIdsByAct.set(act.id, new Set(act.areas.map((a) => a.id)));
		for (const area of act.areas) {
			pickupIdsByArea.set(
				`${act.id}|${area.id}`,
				new Set(area.pickups.map((pickup) => pickup.id)),
			);
		}
	}

	for (const preset of presets) {
		const label = `Preset "${preset.id}"`;

		for (const key of Object.keys(preset.skippedPickups ?? {})) {
			const parts = key.split("|");
			if (parts.length !== 3) {
				errors.push(
					`${label}: skippedPickups key "${key}" must be actId|areaId|pickupId`,
				);
				continue;
			}
			const actId = parts[0] as string;
			const areaId = parts[1] as string;
			const pickupId = parts[2] as string;
			if (!actIds.has(actId)) {
				errors.push(`${label}: skippedPickups unknown actId "${actId}"`);
			} else if (!areaIdsByAct.get(actId)?.has(areaId)) {
				errors.push(
					`${label}: skippedPickups unknown areaId "${areaId}" in "${actId}"`,
				);
			} else {
				const pickupIds = pickupIdsByArea.get(`${actId}|${areaId}`);
				if (!pickupIds?.has(pickupId)) {
					errors.push(
						`${label}: skippedPickups unknown pickupId "${pickupId}" in "${actId}|${areaId}"`,
					);
				}
			}
		}

		for (const key of Object.keys(preset.skippedZones ?? {})) {
			const parts = key.split("|");
			if (parts.length !== 2) {
				errors.push(`${label}: skippedZones key "${key}" must be actId|areaId`);
				continue;
			}
			const actId = parts[0] as string;
			const areaId = parts[1] as string;
			if (!actIds.has(actId)) {
				errors.push(`${label}: skippedZones unknown actId "${actId}"`);
			} else if (!areaIdsByAct.get(actId)?.has(areaId)) {
				errors.push(
					`${label}: skippedZones unknown areaId "${areaId}" in "${actId}"`,
				);
			}
		}

		for (const key of Object.keys(preset.notes ?? {})) {
			const parts = key.split("|");
			if (parts.length !== 2) {
				errors.push(`${label}: notes key "${key}" must be actId|areaId`);
				continue;
			}
			const actId = parts[0] as string;
			const areaId = parts[1] as string;
			if (!actIds.has(actId)) {
				errors.push(`${label}: notes unknown actId "${actId}"`);
			} else if (!areaIdsByAct.get(actId)?.has(areaId)) {
				errors.push(`${label}: notes unknown areaId "${areaId}" in "${actId}"`);
			}
		}

		for (const key of Object.keys(preset.levels ?? {})) {
			const parts = key.split("|");
			if (parts.length !== 2) {
				errors.push(`${label}: levels key "${key}" must be actId|areaId`);
				continue;
			}
			const actId = parts[0] as string;
			const areaId = parts[1] as string;
			if (!actIds.has(actId)) {
				errors.push(`${label}: levels unknown actId "${actId}"`);
			} else if (!areaIdsByAct.get(actId)?.has(areaId)) {
				errors.push(
					`${label}: levels unknown areaId "${areaId}" in "${actId}"`,
				);
			}
		}

		for (const actId of Object.keys(preset.actNotes ?? {})) {
			if (!actIds.has(actId)) {
				errors.push(`${label}: actNotes unknown actId "${actId}"`);
			}
		}

		for (const actId of Object.keys(preset.actRegex ?? {})) {
			if (!actIds.has(actId)) {
				errors.push(`${label}: actRegex unknown actId "${actId}"`);
			}
		}

		for (const [actId, order] of Object.entries(preset.areaOrder ?? {})) {
			if (!actIds.has(actId)) {
				errors.push(`${label}: areaOrder unknown actId "${actId}"`);
				continue;
			}
			const validAreas = areaIdsByAct.get(actId) as Set<string>;
			const seen = new Set<string>();
			for (const areaId of order) {
				if (!validAreas.has(areaId)) {
					errors.push(
						`${label}: areaOrder unknown areaId "${areaId}" in "${actId}"`,
					);
				}
				if (seen.has(areaId)) {
					errors.push(
						`${label}: areaOrder duplicate areaId "${areaId}" in "${actId}"`,
					);
				}
				seen.add(areaId);
			}
		}
	}

	return errors;
}
