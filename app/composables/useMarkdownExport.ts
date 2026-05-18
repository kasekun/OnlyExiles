import { DATA } from "~/data/campaign";
import {
	usePlannerState,
	areaKey,
	pickKey,
} from "~/composables/usePlannerState";

function buildMarkdown(): string {
	const { state } = usePlannerState();
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
			if (!state.hideEmptyZones) return true;
			const allSkipped = area.pickups.every(
				(_, i) => !!state.skipped[pickKey(act.id, areaId, i)],
			);
			return !allSkipped;
		});

		if (visibleAreas.length === 0) continue;

		lines.push(`## ${act.title}`, "");

		for (const areaId of visibleAreas) {
			const area = act.areas.find((a) => a.id === areaId);
			if (!area) continue;
			const akey = areaKey(act.id, areaId);
			const level = state.levels[akey] ?? area.recLevel;
			const note = state.notes[akey] ?? area.notes;

			const visiblePickups = area.pickups.filter(
				(_, i) => !state.skipped[pickKey(act.id, areaId, i)],
			);

			if (state.hideEmptyZones && visiblePickups.length === 0) continue;

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

function getOrderedAreas(
	state: { areaOrder: Record<string, string[]> },
	actId: string,
	defaultOrder: string[],
): string[] {
	const custom = state.areaOrder[actId];
	if (!custom || custom.length === 0) return defaultOrder;
	const customSet = new Set(custom);
	const extra = defaultOrder.filter((id) => !customSet.has(id));
	return [...custom, ...extra];
}

export function useMarkdownExport() {
	async function copyMarkdown(): Promise<boolean> {
		try {
			const text = buildMarkdown();
			await navigator.clipboard.writeText(text);
			return true;
		} catch {
			return false;
		}
	}

	return { copyMarkdown };
}
