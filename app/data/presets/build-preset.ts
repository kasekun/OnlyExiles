import type { Preset } from "./index";

export interface ZoneSpec {
	skip?: true;
	note?: string;
	level?: string;
	skipPickups?: string[];
}

export interface ActSpec {
	note?: string;
	regex?: string;
	order?: string[];
	zones?: Record<string, ZoneSpec>;
}

export interface PresetSpec
	extends Pick<Preset, "id" | "label" | "description"> {
	acts?: Record<string, ActSpec>;
	levels?: Record<string, string>;
	notes?: Record<string, string>;
	actNotes?: Record<string, string>;
}

function hasEntries(record: Record<string, unknown>): boolean {
	return Object.keys(record).length > 0;
}

export function buildPreset(spec: PresetSpec): Preset {
	const skippedPickups: Record<string, true> = {};
	const skippedZones: Record<string, true> = {};
	const notes: Record<string, string> = { ...(spec.notes ?? {}) };
	const levels: Record<string, string> = { ...(spec.levels ?? {}) };
	const actNotes: Record<string, string> = { ...(spec.actNotes ?? {}) };
	const actRegexByAct: Record<string, string> = {};
	const areaOrderByAct: Record<string, string[]> = {};

	for (const [actId, actSpec] of Object.entries(spec.acts ?? {})) {
		if (actSpec.note !== undefined) actNotes[actId] = actSpec.note;
		if (actSpec.regex !== undefined) actRegexByAct[actId] = actSpec.regex;
		if (actSpec.order !== undefined) areaOrderByAct[actId] = [...actSpec.order];

		for (const [zoneId, zoneSpec] of Object.entries(actSpec.zones ?? {})) {
			const zoneKey = `${actId}|${zoneId}`;
			if (zoneSpec.skip) skippedZones[zoneKey] = true;
			if (zoneSpec.note !== undefined) notes[zoneKey] = zoneSpec.note;
			if (zoneSpec.level !== undefined) levels[zoneKey] = zoneSpec.level;
			for (const pickupId of zoneSpec.skipPickups ?? []) {
				skippedPickups[`${zoneKey}|${pickupId}`] = true;
			}
		}
	}

	return {
		id: spec.id,
		label: spec.label,
		description: spec.description,
		...(hasEntries(skippedPickups) && { skippedPickups }),
		...(hasEntries(skippedZones) && { skippedZones }),
		...(hasEntries(notes) && { notes }),
		...(hasEntries(levels) && { levels }),
		...(hasEntries(actNotes) && { actNotes }),
		...(hasEntries(actRegexByAct) && { actRegex: actRegexByAct }),
		...(hasEntries(areaOrderByAct) && { areaOrder: areaOrderByAct }),
	};
}
