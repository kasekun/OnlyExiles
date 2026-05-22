import { buildPreset } from "./build-preset";

export const CAMPAIGN_DEFAULT = buildPreset({
	id: "campaign-default",
	label: "Campaign Default",
	description:
		"Recommended char levels and helpful notes for zones. A good starting point.",
	actNotes: {},
	acts: {
		"act-1--island-of-ogham": {
			zones: {
				"the-riverbank": {
					level: "1",
					note: "XP is bad here, skip mobs",
				},
				clearfell: {
					level: "1",
					note: "XP is bad here, skip mobs",
				},
				"the-mud-burrow": {
					level: "1",
					note: "XP is bad here, skip mobs",
				},
				"the-grelwood": {
					level: "2",
					note: "XP is bad here, skip mobs",
				},
				"the-red-vale": {
					level: "2",
					note: "Great XP zone",
				},
				"the-grim-tangle": {
					level: "4",
				},
				"cemetery-of-the-eternals": {
					level: "5",
					note: [
						"Great XP",
						"After finding the keys and opening the gates for Lachlann, immediately restart at checkpoint to skip his long story animation.",
					],
				},
				"tomb-of-the-consort": {
					level: "6",
					note: "Great XP",
				},
				"mausoleum-of-the-praetor": {
					level: "7",
					note: "Skip mobs if at lvl 7",
				},
				"the-hunting-grounds": {
					level: "7",
					note: "Great XP",
				},
				freythorn: {
					level: "8",
				},
				"ogham-farmlands": {
					level: "9",
				},
				"ogham-village": {
					level: "10",
				},
				"the-manor-ramparts": {
					level: "11",
					note: "Great XP",
				},
				"ogham-manor": {
					level: "12",
					note: [
						"Hit lvl 14 before Count Geonor if you need to use a level 5 skill gem",
						"TP out instead of waiting ~30s for Count Geonor loot (not great loot)",
					],
				},
			},
		},
		"act-2--the-vastiri-desert-keth": {
			zones: {
				"vastiri-outskirts": {
					level: "13",
				},
				"mawdun-quarry": {
					level: "14",
				},
				"mawdun-mine": {
					level: "15.5",
				},
				"traitor-s-passage": {
					level: "16.5",
				},
				"the-halani-gates": {
					level: "17.5",
				},
				"trial-of-sekhemas": {
					level: "18",
				},
				"mastodon-badlands": {
					level: "18.5",
				},
				"the-bone-pits": {
					level: "19",
				},
				keth: {
					level: "19.5",
				},
				"the-lost-city": {
					level: "20.5",
				},
				"buried-shrines": {
					level: "21.5",
					note: "Great XP",
				},
				"valley-of-the-titans": {
					level: "22.5",
				},
				"titan-grotto": {
					level: "23.5",
				},
				deshar: {
					level: "24",
					note: "Great XP",
				},
				"path-of-mourning": {
					level: "25",
				},
				"the-spires-of-deshar": {
					level: "25",
					note: "Great XP",
				},
				"the-dreadnought": {
					level: "26",
					note: "Great XP",
				},
				"dreadnought-vanguard": {
					level: "27",
					note: "Great XP",
				},
			},
		},
		"act-3--the-jungles-machinarium": {
			zones: {
				"sandswept-marsh": {
					level: "28.5",
				},
				"jungle-ruins": {
					level: "28.5",
				},
				"the-venom-crypts": {
					level: "28.5",
				},
				"infested-barrens": {
					level: "30",
				},
				"the-azak-bog": {
					level: "32",
					note: [
						"Great XP zone",
						"Great farming zone - can reset at checkpoint to farm mobs multiple times",
					],
				},
				"trial-of-chaos": {
					level: "32",
				},
				"chimeral-wetlands": {
					level: "32",
				},
				"jiquani-s-machinarium": {
					level: "32",
				},
				"jiquani-s-sanctum": {
					level: "32",
				},
				"the-drowned-city": {
					level: "36",
				},
				"the-molten-vault": {
					level: "32",
				},
				aggorat: {
					level: "32",
					note: "Sacrificial hearts drop from ... and are in exactly one enemy, not a drop chance. you must kill that enemy to drop the heart.",
				},
			},
		},
		"act-4--karui-archipelago": {
			zones: {
				"journey-s-end": {
					level: "40",
				},
				"isle-of-kin": {
					level: "41",
				},
				"volcanic-warrens": {
					level: "41",
				},
				"whakapanu-island": {
					level: "42",
				},
				"singing-caverns": {
					level: "42",
				},
				"abandoned-prison": {
					level: "42",
				},
				"solitary-confinement": {
					level: "42",
				},
				"shrike-island": {
					level: "43",
					note: "Contains the Matiki quest reward",
				},
				"eye-of-hinekora": {
					level: "44",
				},
				"halls-of-the-dead": {
					level: "44",
				},
				arastas: {
					level: "46",
				},
				"the-excavation": {
					level: "46",
					note: "Great XP zone",
				},
				ngakanu: {
					level: "47",
				},
				"heart-of-the-tribe": {
					level: "47",
				},
			},
		},
		interludes: {
			zones: {
				holten: {
					note: "Can buy cheap Greater Runes from Soul of the Ferryman standing by the docks",
				},
			},
		},
	},
});

// Derived flat maps used by other presets as a baseline.
export const campaignDefaultLevels = CAMPAIGN_DEFAULT.levels ?? {};
export const campaignDefaultNotes = CAMPAIGN_DEFAULT.notes ?? {};
