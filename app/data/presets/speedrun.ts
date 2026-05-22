import { buildPreset } from "./build-preset";
import {
	campaignDefaultLevels,
	campaignDefaultNotes,
} from "./campaign-default";

export const SPEEDRUN = buildPreset({
	id: "speedrun",
	label: "I want to go fast",
	description: "Only quest-blocking rewards and powerful permanents.",
	notes: campaignDefaultNotes,
	levels: campaignDefaultLevels,
	actNotes: {},
	acts: {
		"act-1--island-of-ogham": {
			zones: {
				clearfell: {
					skipPickups: [
						"uncut-skill-gem-lvl-1",
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
						"uncut-skill-gem-lvl-2",
						"uncut-support-gem-plus-medium-life-mana-flasks",
						"orb-of-transmutation",
					],
				},
				"the-red-vale": {
					skipPickups: [
						"weapon-upgrade-lvl-5",
						"uncut-skill-gem-level-2",
					],
				},
				"the-grim-tangle": {
					skipPickups: [
						"uncut-support-gem",
						"uncut-skill-gem-level-3",
					],
				},
				"cemetery-of-the-eternals": {
					skipPickups: [
						"iron-ring-or-lazuli-ring",
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
						"gold-plus-a-rare-item",
						"lesser-rune",
					],
				},
				"the-hunting-grounds": {
					skipPickups: [
						"uncut-skill-gem-lvl-4",
						"uncut-support-gem-lvl-1",
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
						"uncut-skill-gem-lvl-4",
						"uncut-skill-gem-level-4",
					],
				},
				"ogham-village": {
					skipPickups: [
						"artificer-s-orb-plus-lesser-blank-rune",
						"uncut-support-gem",
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
						"uncut-support-gem-lvl-2",
						"exalted-orb",
					],
				},
				"mawdun-quarry": {
					skipPickups: [
						"artificer-s-orb",
						"uncut-spirit-gem-level-5",
					],
				},
				"mawdun-mine": {
					skipPickups: [
						"uncut-support-gem-level-2",
					],
				},
				"the-halani-gates": {
					skipPickups: [
						"uncut-skill-gem-lvl-6",
						"exalted-orb",
					],
				},
				"mastodon-badlands": {
					skipPickups: [
						"uncut-support-gem-lvl-2",
						"regal-orb-plus-abyss-currency",
					],
				},
				"the-bone-pits": {
					skipPickups: [
						"exalted-orb",
					],
				},
				keth: {
					skipPickups: [
						"magic-amulet",
						"gemcutter-s-prism",
					],
				},
				"the-lost-city": {
					skipPickups: [
						"jewel",
						"orb-of-alchemy",
					],
				},
				"buried-shrines": {
					skipPickups: [
						"uncut-support-gem",
						"magic-ruby-sapphire-or-topaz-ring",
						"lesser-jeweller-s-orb",
					],
				},
				"valley-of-the-titans": {
					skipPickups: [
						"unique-item-plus-abyss-currency",
					],
				},
				"titan-grotto": {
					skipPickups: [
						"lesser-rune",
						"chance-shard",
					],
				},
				deshar: {
					skipPickups: [
						"artificer-s-orb",
						"lesser-rune",
					],
				},
				"path-of-mourning": {
					skipPickups: [
						"uncut-support-gem-lvl-2",
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
						"uncut-skill-gem-lvl-9",
						"magic-ring",
						"lesser-jeweller-s-orb",
						"uncut-support-gem-level-3",
					],
				},
				"jungle-ruins": {
					skipPickups: [
						"2-weapon-set-passive-skill-points",
						"orb-of-alchemy",
					],
				},
				"infested-barrens": {
					skipPickups: [
						"uncut-support-gem",
						"exalted-orb",
					],
				},
				"chimeral-wetlands": {
					skipPickups: [
						"uncut-skill-gem-lvl-9-plus-inscribed-ultimatum",
						"magic-amulet",
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
						"rare-weapon",
						"uncut-spirit-gem-level-10",
					],
				},
				"the-drowned-city": {
					skipPickups: [
						"uncut-support-gem-level-3",
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
						"inscribed-ultimatum",
						"golden-idols",
						"random-jewel-or-time-lost-jewel",
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
				"isle-of-kin": {
					skipPickups: [
						"uncut-skill-gem-lvl-11-12",
						"uncut-support-gem-lvl-4",
						"lesser-jeweller-s-orb",
						"sulphite-infusion-buff",
						"torn-map-piece",
						"gemcutter-s-prism",
					],
				},
				"volcanic-warrens": {
					skipPickups: [
						"rare-ring-ruby-or-topaz",
						"uncut-support-gem-lvl-4",
					],
				},
				"whakapanu-island": {
					skipPickups: [
						"uncut-support-gem-lvl-4",
						"torn-map-piece",
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
						"torn-map-piece",
						"lesser-jeweller-s-orb",
						"exalted-orb",
					],
				},
				"shrike-island": {
					skipPickups: [
						"torn-map-piece",
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
						"3-regal-orbs",
						"3-exalted-orbs",
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
						"random-loot",
						"uncut-spirit-gem-level-12",
					],
				},
			},
		},
	},
});
