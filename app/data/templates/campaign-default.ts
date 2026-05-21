import { DATA } from "../campaign";
import type { Template } from "./index";

function key(actId: string, areaId: string): string {
	return `${actId}|${areaId}`;
}

export const campaignDefaultLevels: Record<string, string> = Object.fromEntries(
	DATA.flatMap((act) =>
		act.areas.map((area) => [key(act.id, area.id), area.recLevel]),
	),
);

export const campaignDefaultNotes: Record<string, string> = {
	"act-1--island-of-ogham|the-riverbank": "XP is bad here, skip mobs",
	"act-1--island-of-ogham|clearfell": "XP is bad here, skip mobs",
	"act-1--island-of-ogham|the-mud-burrow": "XP is bad here, skip mobs",
	"act-1--island-of-ogham|the-grelwood": "XP is bad here, skip mobs",
	"act-1--island-of-ogham|the-red-vale": "Great XP zone",
	"act-1--island-of-ogham|cemetery-of-the-eternals":
		"Great XP\nAfter finding the keys and opening the gates for Lachlann, immediately restart at checkpoint to skip his long story animation.",
	"act-1--island-of-ogham|tomb-of-the-consort": "Great XP",
	"act-1--island-of-ogham|mausoleum-of-the-praetor": "Skip mobs if at lvl 7",
	"act-1--island-of-ogham|the-hunting-grounds": "Great XP",
	"act-1--island-of-ogham|the-manor-ramparts": "Great XP",
	"act-1--island-of-ogham|ogham-manor":
		"Hit lvl 14 before Count Geonor if you need to use a level 5 skill gem\nTP out instead of waiting ~30s for Count Geonor loot (not great loot)",
	"act-2--the-vastiri-desert-keth|buried-shrines": "Great XP",
	"act-2--the-vastiri-desert-keth|deshar": "Great XP",
	"act-2--the-vastiri-desert-keth|the-spires-of-deshar": "Great XP",
	"act-2--the-vastiri-desert-keth|the-dreadnought": "Great XP",
	"act-2--the-vastiri-desert-keth|dreadnought-vanguard": "Great XP",
	"act-3--the-jungles-machinarium|the-azak-bog":
		"Great XP zone\nGreat farming zone - can reset at checkpoint to farm mobs multiple times",
	"act-3--the-jungles-machinarium|aggorat":
		"Sacrificial hearts drop from ... and are in exactly one enemy, not a drop chance. you must kill that enemy to drop the heart.",
	"act-4--karui-archipelago|shrike-island": "Contains the Matiki quest reward",
	"act-4--karui-archipelago|the-excavation": "Great XP zone",
	"interludes|holten":
		"Can buy cheap Greater Runes from Soul of the Ferryman standing by the docks",
};

export const CAMPAIGN_DEFAULT: Template = {
	id: "campaign-default",
	label: "Campaign Default",
	description:
		"Recommended levels and editorial notes for every zone. Good starting point.",
	notes: campaignDefaultNotes,
	levels: campaignDefaultLevels,
	actNotes: {},
};
