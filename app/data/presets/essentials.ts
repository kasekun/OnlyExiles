import { buildPreset } from "./build-preset";
import {
	campaignDefaultLevels,
	campaignDefaultNotes,
} from "./campaign-default";

export const ESSENTIALS = buildPreset({
	id: "essentials",
	label: "Give me the essentials",
	description:
		"Skip league event currency and minor consumables. Keep gems, permanents, and quest rewards.",
	notes: campaignDefaultNotes,
	levels: campaignDefaultLevels,
	actNotes: {},
	acts: {
		"act-1--island-of-ogham": {
			zones: {
				clearfell: {
					skipPickups: [
						"orb-of-transmutation",
					],
				},
				"the-mud-burrow": {
					skipPickups: [
						"orb-of-augmentation",
					],
				},
				"the-grelwood": {
					skipPickups: [
						"orb-of-transmutation",
					],
				},
				"the-red-vale": {
					skipPickups: [
						"uncut-skill-gem-level-2",
					],
				},
				"the-grim-tangle": {
					skipPickups: [
						"uncut-skill-gem-level-3",
					],
				},
				"cemetery-of-the-eternals": {
					skipPickups: [
						"regal-orb",
					],
				},
				"tomb-of-the-consort": {
					skipPickups: [
						"normal-amulet",
					],
				},
				"mausoleum-of-the-praetor": {
					skipPickups: [
						"lesser-rune",
					],
				},
				"the-hunting-grounds": {
					skipPickups: [
						"exalted-orb",
					],
				},
				freythorn: {
					skipPickups: [
						"uncut-support-gem-level-1",
					],
				},
				"ogham-farmlands": {
					skipPickups: [
						"uncut-skill-gem-level-4",
					],
				},
				"ogham-village": {
					skipPickups: [
						"artificer-s-orb",
					],
				},
				"the-manor-ramparts": {
					skipPickups: [
						"uncut-skill-gem-level-5",
					],
				},
				"ogham-manor": {
					skipPickups: [
						"orb-of-alchemy",
					],
				},
			},
		},
		"act-2--the-vastiri-desert-keth": {
			zones: {
				"vastiri-outskirts": {
					skipPickups: [
						"exalted-orb",
					],
				},
				"mawdun-quarry": {
					skipPickups: [
						"uncut-spirit-gem-level-5",
					],
				},
				"mawdun-mine": {
					skipPickups: [
						"uncut-support-gem-level-2",
					],
				},
				"traitor-s-passage": {
					skipPickups: [
						"artificer-s-orb",
					],
				},
				"the-halani-gates": {
					skipPickups: [
						"exalted-orb",
					],
				},
				"mastodon-badlands": {
					skipPickups: [
						"regal-orb",
					],
				},
				"the-bone-pits": {
					skipPickups: [
						"exalted-orb",
					],
				},
				keth: {
					skipPickups: [
						"gemcutter-s-prism",
					],
				},
				"the-lost-city": {
					skipPickups: [
						"orb-of-alchemy",
					],
				},
				"buried-shrines": {
					skipPickups: [
						"lesser-jeweller-s-orb",
					],
				},
				"valley-of-the-titans": {
					skipPickups: [
						"unique-item",
					],
				},
				"titan-grotto": {
					skipPickups: [
						"chance-shard",
					],
				},
				deshar: {
					skipPickups: [
						"lesser-rune",
					],
				},
				"the-spires-of-deshar": {
					skipPickups: [
						"gemcutter-s-prism",
					],
				},
			},
		},
		"act-3--the-jungles-machinarium": {
			zones: {
				"sandswept-marsh": {
					skipPickups: [
						"uncut-support-gem-level-3",
					],
				},
				"jungle-ruins": {
					skipPickups: [
						"orb-of-alchemy",
					],
				},
				"the-venom-crypts": {
					skipPickups: [
						"random-ring",
					],
				},
				"infested-barrens": {
					skipPickups: [
						"exalted-orb",
					],
				},
				"the-azak-bog": {
					skipPickups: [
						"rune",
					],
				},
				"chimeral-wetlands": {
					skipPickups: [
						"uncut-skill-gem-level-9",
					],
				},
				"jiquani-s-machinarium": {
					skipPickups: [
						"artificer-s-orb",
					],
				},
				"jiquani-s-sanctum": {
					skipPickups: [
						"exalted-orb",
					],
				},
				"the-matlan-waterways": {
					skipPickups: [
						"uncut-spirit-gem-level-10",
					],
				},
				"the-drowned-city": {
					skipPickups: [
						"uncut-support-gem-level-3",
					],
				},
				"the-molten-vault": {
					skipPickups: [
						"unique-item",
					],
				},
				"apex-of-filth": {
					skipPickups: [
						"vaal-orb",
					],
				},
				"temple-of-kopec": {
					skipPickups: [
						"uncut-spirit-gem-level-11",
					],
				},
				"utzaal-past": {
					skipPickups: [
						"random-jewel-or-time-lost-jewel",
					],
				},
				aggorat: {
					skipPickups: [
						"uncut-skill-gem-level-11",
					],
				},
				"the-black-chambers-past": {
					skipPickups: [
						"vaal-orb",
					],
				},
			},
		},
		"act-4--karui-archipelago": {
			zones: {
				"journey-s-end": {
					skipPickups: [
						"orb-of-alchemy",
					],
				},
				"isle-of-kin": {
					skipPickups: [
						"gemcutter-s-prism",
					],
				},
				"volcanic-warrens": {
					skipPickups: [
						"uncut-support-gem-lvl-4",
					],
				},
				"whakapanu-island": {
					skipPickups: [
						"artificer-s-orb",
					],
				},
				"singing-caverns": {
					skipPickups: [
						"magic-charm",
					],
				},
				"abandoned-prison": {
					skipPickups: [
						"exalted-orb",
					],
				},
				"solitary-confinement": {
					skipPickups: [
						"rune",
					],
				},
				"kedge-bay": {
					skipPickups: [
						"exalted-orb",
					],
				},
				"shrike-island": {
					skipPickups: [
						"uncut-support-gem-lvl-4",
					],
				},
				"eye-of-hinekora": {
					skipPickups: [
						"chaos-orb",
					],
				},
				"halls-of-the-dead": {
					skipPickups: [
						"random-items",
					],
				},
				arastas: {
					skipPickups: [
						"uncut-skill-gem-level-12",
					],
				},
				"the-excavation": {
					skipPickups: [
						"rare-amulet",
					],
				},
				ngakanu: {
					skipPickups: [
						"greater-jeweller-s-orb-abyssal-depths",
					],
				},
				"heart-of-the-tribe": {
					skipPickups: [
						"uncut-spirit-gem-level-12",
					],
				},
			},
		},
	},
});
