import type { Act } from "../campaign";

export interface Template {
	id: string;
	label: string;
	description: string;
	/** Sparse: absent = no change. Explicit false clears a skip. */
	skippedPickups?: Record<string, boolean>;
	/** Sparse: absent = no change. Explicit false clears a zone skip. */
	skippedZones?: Record<string, boolean>;
	/** Sparse: absent = no change. Explicit empty string clears a level. */
	levels?: Record<string, string>;
	/** Sparse: absent = no change. Replaces order only for the listed act IDs. */
	areaOrder?: Record<string, string[]>;
	/** Sparse: absent = no change. Explicit empty string clears a regex. */
	actRegex?: Record<string, string>;
	/** Sparse: absent = no change. Explicit empty string clears a note. */
	notes?: Record<string, string>;
	/** Sparse: absent = no change. Explicit empty string clears an act note. */
	actNotes?: Record<string, string>;
}

export { CAMPAIGN_DEFAULT } from "./campaign-default";
export { ESSENTIALS } from "./essentials";
export { EVERYTHING } from "./everything";
export { SPEEDRUN } from "./speedrun";

import { CAMPAIGN_DEFAULT } from "./campaign-default";
import { ESSENTIALS } from "./essentials";
import { EVERYTHING } from "./everything";
import { SPEEDRUN } from "./speedrun";

/** User-facing templates shown in the Templates dropdown. */
export const TEMPLATES: Template[] = [
	CAMPAIGN_DEFAULT,
	EVERYTHING,
	ESSENTIALS,
	SPEEDRUN,
];

/**
 * Validates templates against campaign data. Returns an array of error strings.
 * Run in dev or as part of the verification pass to catch campaign/template drift.
 */
export function validateTemplates(
	templates: Template[],
	data: Act[],
): string[] {
	const errors: string[] = [];
	const actIds = new Set(data.map((a) => a.id));
	const areaIdsByAct = new Map<string, Set<string>>();
	const pickupCountByArea = new Map<string, number>();

	for (const act of data) {
		areaIdsByAct.set(act.id, new Set(act.areas.map((a) => a.id)));
		for (const area of act.areas) {
			pickupCountByArea.set(`${act.id}|${area.id}`, area.pickups.length);
		}
	}

	for (const t of templates) {
		const label = `Template "${t.id}"`;

		for (const key of Object.keys(t.skippedPickups ?? {})) {
			const parts = key.split("|");
			if (parts.length !== 3) {
				errors.push(
					`${label}: skippedPickups key "${key}" must be actId|areaId|index`,
				);
				continue;
			}
			const actId = parts[0] as string;
			const areaId = parts[1] as string;
			const idxStr = parts[2] as string;
			if (!actIds.has(actId)) {
				errors.push(`${label}: skippedPickups unknown actId "${actId}"`);
			} else if (!areaIdsByAct.get(actId)?.has(areaId)) {
				errors.push(
					`${label}: skippedPickups unknown areaId "${areaId}" in "${actId}"`,
				);
			} else {
				const count = pickupCountByArea.get(`${actId}|${areaId}`) ?? 0;
				const idx = parseInt(idxStr, 10);
				if (Number.isNaN(idx) || idx < 0 || idx >= count) {
					errors.push(
						`${label}: skippedPickups index ${idxStr} out of range for "${actId}|${areaId}" (0–${count - 1})`,
					);
				}
			}
		}

		for (const key of Object.keys(t.skippedZones ?? {})) {
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

		for (const key of Object.keys(t.notes ?? {})) {
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

		for (const key of Object.keys(t.levels ?? {})) {
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

		for (const actId of Object.keys(t.actNotes ?? {})) {
			if (!actIds.has(actId)) {
				errors.push(`${label}: actNotes unknown actId "${actId}"`);
			}
		}

		for (const actId of Object.keys(t.actRegex ?? {})) {
			if (!actIds.has(actId)) {
				errors.push(`${label}: actRegex unknown actId "${actId}"`);
			}
		}

		for (const [actId, order] of Object.entries(t.areaOrder ?? {})) {
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
