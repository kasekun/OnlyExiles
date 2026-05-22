import {
	campaignDefaultLevels,
	campaignDefaultNotes,
} from "./campaign-default";
import type { Preset } from "./index";

export const EVERYTHING: Preset = {
	id: "everything",
	label: "I want everything",
	description: "Pick up every reward in every zone.",
	notes: campaignDefaultNotes,
	levels: campaignDefaultLevels,
	actNotes: {},
};
