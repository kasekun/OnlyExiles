import { DATA } from "../data/campaign";
import type { PlannerState } from "./usePlannerState";
import {
	areaKey,
	getOrderedAreas,
	pickKey,
	usePlannerState,
} from "./usePlannerState";

export function buildMarkdown(
	state: PlannerState,
	guideName: string,
	includeEmptyZones: boolean,
	omitSkippedZones: boolean,
	version?: string,
): string {
	const title = guideName.trim() || "Untitled guide";
	const lines: string[] = [`# ${title} - PoE2 Campaign Route`, ""];

	for (const act of DATA) {
		const actAreas = getOrderedAreas(
			state,
			act.id,
			act.areas.map((a) => a.id),
		);

		const visibleAreas = actAreas.filter((areaId) => {
			const area = act.areas.find((a) => a.id === areaId);
			if (!area) return false;
			// Skipped zones are filtered first when the option is enabled
			if (omitSkippedZones && state.skippedZones[areaKey(act.id, areaId)]) {
				return false;
			}
			if (includeEmptyZones) return true;
			if (area.pickups.length === 0) return false;
			return area.pickups.some(
				(p) => !state.skippedPickups[pickKey(act.id, areaId, p.id)],
			);
		});

		if (visibleAreas.length === 0) continue;

		lines.push(`## ${act.title}`, "");

		const actNote = state.actNotes[act.id];
		const actNoteLines = actNote?.map((s) => s.trim()).filter((s) => s);
		if (actNoteLines?.length) {
			lines.push(`> ${actNoteLines.join("\n> ")}`, "");
		}

		for (const areaId of visibleAreas) {
			const area = act.areas.find((a) => a.id === areaId);
			if (!area) continue;
			const akey = areaKey(act.id, areaId);
			const level = state.levels[akey];
			const note = state.notes[akey];
			const noteLines = note?.map((s) => s.trim()).filter((s) => s);

			const visiblePickups = area.pickups.filter(
				(p) => !state.skippedPickups[pickKey(act.id, areaId, p.id)],
			);

			const levelStr = level && level !== "0" ? ` · Char level: ${level}` : "";
			lines.push(`### ${area.name}${levelStr}`);

			if (noteLines?.length) {
				lines.push(`> ${noteLines.join("\n> ")}`);
			}

			for (const p of visiblePickups) {
				lines.push(`- ${p.item} (${p.type}: ${p.source})`);
			}

			lines.push("");
		}
	}

	const body = lines.join("\n").trim();

	if (version) {
		return `${body}\n\n---\n*Guide version: ${version}*`;
	}
	return body;
}

export function useMarkdownExport() {
	const { state, guideName } = usePlannerState();

	function getMarkdown(options: {
		includeEmptyZones: boolean;
		omitSkippedZones?: boolean;
		version?: string;
	}): string {
		return buildMarkdown(
			state,
			guideName.value,
			options.includeEmptyZones,
			options.omitSkippedZones ?? false,
			options.version,
		);
	}

	async function copyMarkdown(options: {
		includeEmptyZones: boolean;
		omitSkippedZones?: boolean;
		version?: string;
	}): Promise<boolean> {
		try {
			await navigator.clipboard.writeText(getMarkdown(options));
			return true;
		} catch {
			return false;
		}
	}

	return { getMarkdown, copyMarkdown };
}
