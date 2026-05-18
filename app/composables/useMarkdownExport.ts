import type { PlannerState } from "~/composables/usePlannerState";
import {
	areaKey,
	getOrderedAreas,
	pickKey,
	usePlannerState,
} from "~/composables/usePlannerState";
import { DATA } from "~/data/campaign";

function buildMarkdown(
	state: PlannerState,
	includeEmptyZones: boolean,
): string {
	const lines: string[] = ["# PoE2 Campaign Planner — My Route", ""];

	for (const act of DATA) {
		const actAreas = getOrderedAreas(
			state,
			act.id,
			act.areas.map((a) => a.id),
		);

		const visibleAreas = actAreas.filter((areaId) => {
			const area = act.areas.find((a) => a.id === areaId);
			if (!area) return false;
			if (includeEmptyZones) return true;
			if (area.pickups.length === 0) return false;
			return area.pickups.some(
				(_, i) => !state.skipped[pickKey(act.id, areaId, i)],
			);
		});

		if (visibleAreas.length === 0) continue;

		lines.push(`## ${act.title}`, "");

		const actNote = state.actNotes[act.id];
		if (actNote?.trim()) {
			lines.push(`> ${actNote.trim().replace(/\n/g, "\n> ")}`, "");
		}

		for (const areaId of visibleAreas) {
			const area = act.areas.find((a) => a.id === areaId);
			if (!area) continue;
			const akey = areaKey(act.id, areaId);
			const level = state.levels[akey];
			const note = state.notes[akey];

			const visiblePickups = area.pickups.filter(
				(_, i) => !state.skipped[pickKey(act.id, areaId, i)],
			);

			const levelStr = level && level !== "0" ? ` · Char level: ${level}` : "";
			lines.push(`### ${area.name}${levelStr}`);

			if (note?.trim()) {
				lines.push(`> ${note.trim().replace(/\n/g, "\n> ")}`);
			}

			for (const p of visiblePickups) {
				lines.push(`- ${p.item} (${p.type}: ${p.source})`);
			}

			lines.push("");
		}
	}

	return lines.join("\n").trim();
}

export function useMarkdownExport() {
	const { state } = usePlannerState();

	function getMarkdown(options: { includeEmptyZones: boolean }): string {
		return buildMarkdown(state, options.includeEmptyZones);
	}

	async function copyMarkdown(options: {
		includeEmptyZones: boolean;
	}): Promise<boolean> {
		try {
			await navigator.clipboard.writeText(
				buildMarkdown(state, options.includeEmptyZones),
			);
			return true;
		} catch {
			return false;
		}
	}

	return { getMarkdown, copyMarkdown };
}
