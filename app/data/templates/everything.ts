import {
	campaignDefaultLevels,
	campaignDefaultNotes,
} from "./campaign-default";
import type { Template } from "./index";

export const EVERYTHING: Template = {
	id: "everything",
	label: "I want everything",
	description: "Pick up every reward in every zone.",
	skippedPickups: {},
	notes: campaignDefaultNotes,
	levels: campaignDefaultLevels,
	actNotes: {},
};
