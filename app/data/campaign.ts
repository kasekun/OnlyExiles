export type PickupTag =
	| "league-currency"
	| "permanent"
	| "skill-gem"
	| "support-gem"
	| "spirit-gem"
	| "passive-points"
	| "quest"
	| "ascendancy"
	| "consumable"
	| "equipment"
	| "crafting";

export interface Pickup {
	id: string;
	item: string;
	type: "Drop" | "Hand-In";
	source: string;
	tags: PickupTag[];
}

export interface Area {
	id: string;
	name: string;
	notes?: string;
	pickups: Pickup[];
}

export interface Act {
	id: string;
	title: string;
	areas: Area[];
}

export const DATA: Act[] = [
	{
		id: "act-1--island-of-ogham",
		title: "Act 1: Island of Ogham",
		areas: [
			{
				id: "the-riverbank",
				name: "The Riverbank",
				pickups: [
					{
						id: "class-specific-skill-gem",
						tags: ["skill-gem"],
						item: "Class specific skill gem",
						type: "Drop",
						source: "unskippable chest",
					},
					{
						id: "uncut-skill-gem-lvl-1",
						tags: ["skill-gem"],
						item: "Uncut Skill Gem (Lvl 1)",
						type: "Hand-In",
						source: "Kill the Miller, talk to Renly",
					},
				],
			},
			{
				id: "clearfell",
				name: "Clearfell",
				pickups: [
					{
						id: "permanent-plus-10-percent-cold-resistance",
						tags: ["permanent"],
						item: "Permanent +10% Cold Resistance",
						type: "Drop",
						source: "Kill Beira of the Rotten Pack",
					},
					{
						id: "uncut-skill-gem-lvl-1",
						tags: ["skill-gem"],
						item: "Uncut Skill Gem (Lvl 1)",
						type: "Drop",
						source: "Open the Mysterious Campsite Chest / Abandoned Stash",
					},
					{
						id: "orb-of-transmutation",
						tags: ["league-currency", "crafting"],
						item: "Orb of Transmutation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-mud-burrow",
				name: "The Mud Burrow",
				pickups: [
					{
						id: "uncut-skill-gem-lvl-2",
						tags: ["skill-gem"],
						item: "Uncut Skill Gem (Lvl 2)",
						type: "Drop",
						source: "Kill The Devourer",
					},
					{
						id: "uncut-support-gem",
						tags: ["support-gem", "quest"],
						item: "Uncut Support Gem",
						type: "Hand-In",
						source: "Talk to the NPC after Mud Burrow boss quest completion",
					},
					{
						id: "orb-of-augmentation",
						tags: ["league-currency", "crafting"],
						item: "Orb of Augmentation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-grelwood",
				name: "The Grelwood",
				pickups: [
					{
						id: "uncut-skill-gem-lvl-2",
						tags: ["skill-gem"],
						item: "Uncut Skill Gem (Lvl 2)",
						type: "Drop",
						source: "Kill The Brambleghast",
					},
					{
						id: "uncut-support-gem-plus-medium-life-mana-flasks",
						tags: ["support-gem", "consumable"],
						item: "Uncut Support Gem + Medium Life/Mana Flasks",
						type: "Drop",
						source: "Kill Areagne and loot her Witch Hut cauldron",
					},
					{
						id: "orb-of-transmutation",
						tags: ["league-currency", "crafting"],
						item: "Orb of Transmutation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-red-vale",
				name: "The Red Vale",
				pickups: [
					{
						id: "weapon-upgrade-lvl-5",
						tags: ["equipment"],
						item: "Weapon upgrade (Lvl 5)",
						type: "Drop",
						source: "Refined Arms lootable",
					},
					{
						id: "uncut-skill-gem-lvl-3",
						tags: ["skill-gem"],
						item: "Uncut Skill Gem (Lvl 3)",
						type: "Drop",
						source: "Kill The Rust King",
					},
					{
						id: "uncut-skill-gem-level-2",
						tags: ["league-currency", "skill-gem"],
						item: "Uncut Skill Gem (Lvl 2)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-grim-tangle",
				name: "The Grim Tangle",
				pickups: [
					{
						id: "uncut-support-gem",
						tags: ["support-gem"],
						item: "Uncut Support Gem",
						type: "Drop",
						source: "Kill The Rotten Druid",
					},
					{
						id: "uncut-skill-gem-level-3",
						tags: ["league-currency", "skill-gem"],
						item: "Uncut Skill Gem (Lvl 3)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "cemetery-of-the-eternals",
				name: "Cemetery of the Eternals",
				pickups: [
					{
						id: "iron-ring-or-lazuli-ring",
						tags: ["equipment"],
						item: "Iron Ring or Lazuli Ring",
						type: "Drop",
						source: "Ancient Ruins Sarcophagus",
					},
					{
						id: "uncut-skill-gem-lvl-3-plus-uncut-support-gem",
						tags: ["skill-gem", "support-gem"],
						item: "Uncut Skill Gem (Lvl 3) + Uncut Support Gem",
						type: "Drop",
						source: "Kill Count Lachlann",
					},
					{
						id: "regal-orb",
						tags: ["league-currency", "crafting"],
						item: "Regal Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "tomb-of-the-consort",
				name: "Tomb of the Consort",
				pickups: [
					{
						id: "uncut-support-gem-lvl-1",
						tags: ["support-gem"],
						item: "Uncut Support Gem (Lvl 1)",
						type: "Drop",
						source: "Open the Haunted Treasure",
					},
					{
						id: "normal-amulet",
						tags: ["league-currency", "equipment"],
						item: "Normal Amulet",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "mausoleum-of-the-praetor",
				name: "Mausoleum of the Praetor",
				pickups: [
					{
						id: "gold-plus-a-rare-item",
						tags: ["equipment", "crafting"],
						item: "Gold + a Rare item",
						type: "Drop",
						source: "Open the Forgotten Riches chest",
					},
					{
						id: "lesser-rune",
						tags: ["league-currency", "equipment"],
						item: "Lesser Rune",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-hunting-grounds",
				name: "The Hunting Grounds",
				pickups: [
					{
						id: "2-weapon-set-passive-skill-points",
						tags: ["passive-points", "equipment"],
						item: "2 Weapon Set Passive Skill Points",
						type: "Drop",
						source: "Kill The Crowbell",
					},
					{
						id: "uncut-skill-gem-lvl-4",
						tags: ["skill-gem", "quest"],
						item: "Uncut Skill Gem (Lvl 4)",
						type: "Drop",
						source: "Complete the Ritual Site encounter",
					},
					{
						id: "uncut-support-gem-lvl-1",
						tags: ["support-gem", "quest"],
						item: "Uncut Support Gem (Lvl 1)",
						type: "Drop",
						source: "Complete the Dryadic Ritual",
					},
					{
						id: "exalted-orb",
						tags: ["league-currency", "crafting"],
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "freythorn",
				name: "Freythorn",
				pickups: [
					{
						id: "permanent-plus-30-to-maximum-spirit-plus-uncut-spirit-gem-lvl-4",
						tags: ["permanent", "spirit-gem"],
						item: "Permanent +30 to Maximum Spirit + Uncut Spirit Gem (Lvl 4)",
						type: "Drop",
						source:
							"Summon and kill The King in the Mists by completing Ritual encounters",
					},
					{
						id: "elemental-charm",
						tags: ["consumable", "quest"],
						item: "Elemental Charm",
						type: "Hand-In",
						source: "Complete Ominous Altars and speak to Finn in town",
					},
					{
						id: "uncut-support-gem-level-1",
						tags: ["league-currency", "support-gem"],
						item: "Uncut Support Gem (Lvl 1)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "ogham-farmlands",
				name: "Ogham Farmlands",
				pickups: [
					{
						id: "2-weapon-set-passive-skill-points",
						tags: ["passive-points", "equipment", "quest"],
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source: "Find Una's Lute in her hut and hand it in to her",
					},
					{
						id: "uncut-skill-gem-lvl-4",
						tags: ["skill-gem"],
						item: "Uncut Skill Gem (Lvl 4)",
						type: "Drop",
						source: "Crop circle - kill Vargir the Feral Mutt",
					},
					{
						id: "uncut-skill-gem-level-4",
						tags: ["league-currency", "skill-gem"],
						item: "Uncut Skill Gem (Lvl 4)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "ogham-village",
				name: "Ogham Village",
				pickups: [
					{
						id: "salvage-bench-unlock",
						tags: ["quest"],
						item: "Salvage Bench Unlock",
						type: "Hand-In",
						source: "Find Smithing Tools and return them to Renly",
					},
					{
						id: "artificer-s-orb-plus-lesser-blank-rune",
						tags: ["equipment", "crafting"],
						item: "Artificer's Orb + Lesser Blank Rune",
						type: "Drop",
						source: "Blacksmith's Chest (near Smithing tools)",
					},
					{
						id: "uncut-support-gem",
						tags: ["support-gem"],
						item: "Uncut Support Gem",
						type: "Drop",
						source: "Kill The Executioner",
					},
					{
						id: "uncut-skill-gem-lvl-5",
						tags: ["skill-gem", "quest"],
						item: "Uncut Skill Gem (Lvl 5)",
						type: "Hand-In",
						source: "Save Leitis and speak to her in town",
					},
					{
						id: "artificer-s-orb",
						tags: ["league-currency", "crafting"],
						item: "Artificer's Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-manor-ramparts",
				name: "The Manor Ramparts",
				pickups: [
					{
						id: "uncut-support-gem",
						tags: ["support-gem", "quest"],
						item: "Uncut Support Gem",
						type: "Drop",
						source: "Complete The Gallows encounter",
					},
					{
						id: "uncut-skill-gem-level-5",
						tags: ["league-currency", "skill-gem"],
						item: "Uncut Skill Gem (Lvl 5)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "ogham-manor",
				name: "Ogham Manor",
				pickups: [
					{
						id: "permanent-plus-20-to-maximum-life",
						tags: ["permanent"],
						item: "Permanent +20 to Maximum Life",
						type: "Drop",
						source: "Activate the Psalm of Madness and kill Candlemass",
					},
					{
						id: "orb-of-alchemy",
						tags: ["league-currency", "crafting"],
						item: "Orb of Alchemy",
						type: "Drop",
						source: "League event",
					},
				],
			},
		],
	},
	{
		id: "act-2--the-vastiri-desert-keth",
		title: "Act 2: The Vastiri Desert / Keth",
		areas: [
			{
				id: "vastiri-outskirts",
				name: "Vastiri Outskirts",
				pickups: [
					{
						id: "uncut-support-gem-lvl-2",
						tags: ["support-gem"],
						item: "Uncut Support Gem (Lvl 2)",
						type: "Drop",
						source: "Devastated camp yellow chest",
					},
					{
						id: "uncut-skill-gem-lvl-5",
						tags: ["skill-gem", "quest"],
						item: "Uncut Skill Gem (Lvl 5)",
						type: "Hand-In",
						source: "Kill Rathbreaker and speak to Zarka in town",
					},
					{
						id: "exalted-orb",
						tags: ["league-currency", "crafting"],
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "mawdun-quarry",
				name: "Mawdun Quarry",
				pickups: [
					{
						id: "artificer-s-orb",
						tags: ["crafting"],
						item: "Artificer's Orb",
						type: "Drop",
						source: "Open the Faridun War Cache",
					},
					{
						id: "uncut-spirit-gem-level-5",
						tags: ["league-currency", "spirit-gem"],
						item: "Uncut Spirit Gem (Lvl 5)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "mawdun-mine",
				name: "Mawdun Mine",
				pickups: [
					{
						id: "uncut-support-gem-level-2",
						tags: ["league-currency", "support-gem"],
						item: "Uncut Support Gem (Lvl 2)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "traitor-s-passage",
				name: "Traitor's Passage",
				pickups: [
					{
						id: "ascendancy-trial-key-djinn-barya",
						tags: ["ascendancy"],
						item: "Ascendancy Trial Key (Djinn Barya)",
						type: "Drop",
						source: "Kill Balbala",
					},
					{
						id: "uncut-skill-gem-lvl-6",
						tags: ["skill-gem"],
						item: "Uncut Skill Gem (Lvl 6)",
						type: "Drop",
						source: "Open the Bell Chest",
					},
					{
						id: "artificer-s-orb",
						tags: ["league-currency", "crafting"],
						item: "Artificer's Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-halani-gates",
				name: "The Halani Gates",
				pickups: [
					{
						id: "uncut-skill-gem-lvl-7",
						tags: ["skill-gem", "quest"],
						item: "Uncut Skill Gem (Lvl 7)",
						type: "Hand-In",
						source: "Speak to Zarka after chasing Jamanra",
					},
					{
						id: "uncut-skill-gem-lvl-6",
						tags: ["skill-gem"],
						item: "Uncut Skill Gem (Lvl 6)",
						type: "Drop",
						source: "Kill L'im the Impaler",
					},
					{
						id: "exalted-orb",
						tags: ["league-currency", "crafting"],
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "trial-of-sekhemas",
				name: "Trial of Sekhemas",
				pickups: [
					{
						id: "first-two-ascendancy-points",
						tags: ["ascendancy", "quest"],
						item: "First two Ascendancy points",
						type: "Hand-In",
						source: "Complete the Trial",
					},
				],
			},
			{
				id: "mastodon-badlands",
				name: "Mastodon Badlands",
				pickups: [
					{
						id: "uncut-support-gem-lvl-2",
						tags: ["support-gem"],
						item: "Uncut Support Gem (Lvl 2)",
						type: "Drop",
						source: "Open the Effigy",
					},
					{
						id: "regal-orb-plus-abyss-currency",
						tags: ["league-currency", "crafting"],
						item: "Regal Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-bone-pits",
				name: "The Bone Pits",
				pickups: [
					{
						id: "uncut-support-gem-lvl-2",
						tags: ["support-gem", "quest"],
						item: "Uncut Support Gem (Lvl 2)",
						type: "Hand-In",
						source: "Kill Iktab + Ekbab speak to Zarka",
					},
					{
						id: "exalted-orb",
						tags: ["league-currency", "crafting"],
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "keth",
				name: "Keth",
				pickups: [
					{
						id: "2-weapon-set-passive-skill-points",
						tags: ["passive-points", "equipment"],
						item: "2 Weapon Set Passive Skill Points",
						type: "Drop",
						source: "Kill Kabala, Constrictor Queen",
					},
					{
						id: "magic-amulet",
						tags: ["equipment"],
						item: "Magic Amulet",
						type: "Drop",
						source: "Open the Abandoned Prayer",
					},
					{
						id: "gemcutter-s-prism",
						tags: ["league-currency"],
						item: "Gemcutter's Prism",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-lost-city",
				name: "The Lost City",
				pickups: [
					{
						id: "jewel",
						tags: ["quest"],
						item: "Jewel",
						type: "Drop",
						source: "Kill beetle - The Ninth Treasure of Keth",
					},
					{
						id: "uncut-spirit-gem-lvl-6-7",
						tags: ["spirit-gem"],
						item: "Uncut Spirit Gem (Lvl 6/7)",
						type: "Drop",
						source: "Loot the Golden Tomb",
					},
					{
						id: "orb-of-alchemy",
						tags: ["league-currency", "crafting"],
						item: "Orb of Alchemy",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "buried-shrines",
				name: "Buried Shrines",
				pickups: [
					{
						id: "uncut-support-gem",
						tags: ["support-gem"],
						item: "Uncut Support Gem",
						type: "Drop",
						source: "Open the Suspicious Sarcophagus",
					},
					{
						id: "magic-ruby-sapphire-or-topaz-ring",
						tags: ["equipment"],
						item: "Magic Ruby, Sapphire or Topaz Ring",
						type: "Drop",
						source: "Choose an Offering at the Elemental Shrine",
					},
					{
						id: "uncut-support-gem-lvl-2",
						tags: ["support-gem", "quest"],
						item: "Uncut Support Gem (Lvl 2)",
						type: "Hand-In",
						source: "Obtain The Essence of Water, speak to Zarka",
					},
					{
						id: "lesser-jeweller-s-orb",
						tags: ["league-currency", "crafting"],
						item: "Lesser Jeweller's Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "valley-of-the-titans",
				name: "Valley of the Titans",
				pickups: [
					{
						id: "permanent-plus-1-charm-slot-and-choice-of-buff",
						tags: ["permanent", "consumable", "quest"],
						item: "Permanent +1 Charm Slot and Choice of Buff",
						type: "Hand-In",
						source:
							'Deliver the Sun and Kabala Clan Relics to the Altar ("Ancient Vows" quest)',
					},
					{
						id: "unique-item-plus-abyss-currency",
						tags: ["league-currency", "equipment", "crafting"],
						item: "Unique Item",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "titan-grotto",
				name: "Titan Grotto",
				pickups: [
					{
						id: "uncut-support-gem-lvl-2",
						tags: ["support-gem", "quest"],
						item: "Uncut Support Gem (Lvl 2)",
						type: "Hand-In",
						source: "Kill Zalmarath for Flame Ruby, speak to Zarka",
					},
					{
						id: "lesser-rune",
						tags: ["equipment", "quest"],
						item: "Lesser Rune",
						type: "Drop",
						source: "Find the Titan's Sword",
					},
					{
						id: "chance-shard",
						tags: ["league-currency", "crafting"],
						item: "Chance Shard",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "deshar",
				name: "Deshar",
				pickups: [
					{
						id: "2-weapon-set-passive-skill-points",
						tags: ["passive-points", "equipment", "quest"],
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source: "Locate Final Letter and deliver to Shambrin",
					},
					{
						id: "artificer-s-orb",
						tags: ["crafting", "quest"],
						item: "Artificer's Orb",
						type: "Drop",
						source: "Find the Unremembered Skeleton",
					},
					{
						id: "lesser-rune",
						tags: ["league-currency", "equipment"],
						item: "Lesser Rune",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "path-of-mourning",
				name: "Path of Mourning",
				pickups: [
					{
						id: "uncut-support-gem-lvl-2",
						tags: ["support-gem"],
						item: "Uncut Support Gem (Lvl 2)",
						type: "Drop",
						source: "Open the Hushed Urn",
					},
				],
			},
			{
				id: "the-spires-of-deshar",
				name: "The Spires of Deshar",
				pickups: [
					{
						id: "permanent-plus-10-percent-lightning-resistance",
						tags: ["permanent"],
						item: "Permanent +10% Lightning Resistance",
						type: "Drop",
						source: "Click on the Sisters of Garukhan Shrine",
					},
					{
						id: "gemcutter-s-prism",
						tags: ["league-currency"],
						item: "Gemcutter's Prism",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-dreadnought",
				name: "The Dreadnought",
				pickups: [],
			},
			{
				id: "dreadnought-vanguard",
				name: "Dreadnought Vanguard",
				pickups: [],
			},
		],
	},
	{
		id: "act-3--the-jungles-machinarium",
		title: "Act 3: The Jungles / Machinarium",
		areas: [
			{
				id: "sandswept-marsh",
				name: "Sandswept Marsh",
				pickups: [
					{
						id: "uncut-skill-gem-lvl-9",
						tags: ["skill-gem"],
						item: "Uncut Skill Gem (Lvl 9)",
						type: "Drop",
						source: "Foul Ritual - kill Rootdredge",
					},
					{
						id: "magic-ring",
						tags: ["equipment"],
						item: "Magic Ring",
						type: "Drop",
						source: "Hanging tree - loot corpses",
					},
					{
						id: "lesser-jeweller-s-orb",
						tags: ["crafting"],
						item: "Lesser Jeweller's Orb",
						type: "Drop",
						source: "Basket at the Orok Campfire [first run only]",
					},
					{
						id: "uncut-support-gem-level-3",
						tags: ["league-currency", "support-gem"],
						item: "Uncut Support Gem (Lvl 3)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "jungle-ruins",
				name: "Jungle Ruins",
				pickups: [
					{
						id: "2-weapon-set-passive-skill-points",
						tags: ["passive-points", "equipment"],
						item: "2 Weapon Set Passive Skill Points",
						type: "Drop",
						source: "Kill Mighty Silverfist",
					},
					{
						id: "rare-belt",
						tags: ["quest"],
						item: "Rare Belt",
						type: "Hand-In",
						source: "Interact with Jungle Grave and speak to Servi",
					},
					{
						id: "orb-of-alchemy",
						tags: ["league-currency", "crafting"],
						item: "Orb of Alchemy",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-venom-crypts",
				name: "The Venom Crypts",
				pickups: [
					{
						id: "uncut-support-gem-level-3",
						tags: ["skill-gem"],
						item: "Uncut Support Gem (Lvl 3)",
						type: "Drop",
						source: "Rare Sarcophagus",
					},
					{
						id: "random-ring",
						tags: ["league-currency", "equipment", "crafting"],
						item: "Random Ring",
						type: "Drop",
						source: "League event",
					},
					{
						id: "permanent-buff-choice-plus-artificer-s-orb",
						tags: ["permanent", "crafting", "quest"],
						item: "Permanent Buff Choice + Artificer's Orb",
						type: "Hand-In",
						source: "Find the Venom Vial and deliver it to Servi",
					},
				],
			},
			{
				id: "infested-barrens",
				name: "Infested Barrens",
				pickups: [
					{
						id: "uncut-support-gem",
						tags: ["support-gem"],
						item: "Uncut Support Gem",
						type: "Drop",
						source: "Clear the Cave Location encounter",
					},
					{
						id: "exalted-orb",
						tags: ["league-currency", "crafting"],
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-azak-bog",
				name: "The Azak Bog",
				pickups: [
					{
						id: "permanent-plus-30-maximum-spirit-plus-uncut-spirit-gem-lvl-10",
						tags: ["permanent", "spirit-gem"],
						item: "Permanent +30 Maximum Spirit + Uncut Spirit Gem (Lvl 10)",
						type: "Drop",
						source: "Kill Ignagduk, The Bog Witch",
					},
					{
						id: "charm-thawing-staunching-antidote-dousing-or-grounding",
						tags: ["consumable", "quest"],
						item: "Charm (Thawing, Staunching, Antidote, Dousing, or Grounding)",
						type: "Hand-In",
						source: "Return Ignagduk's Ghastly Spear to Servi",
					},
					{
						id: "rune",
						tags: ["league-currency", "equipment"],
						item: "Rune",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "trial-of-chaos",
				name: "Trial of Chaos",
				pickups: [
					{
						id: "first-four-ascendancy-points",
						tags: ["ascendancy", "quest"],
						item: "First four Ascendancy points",
						type: "Hand-In",
						source: "Complete the Trial",
					},
				],
			},
			{
				id: "chimeral-wetlands",
				name: "Chimeral Wetlands",
				pickups: [
					{
						id: "uncut-skill-gem-lvl-9-plus-inscribed-ultimatum",
						tags: ["skill-gem"],
						item: "Uncut Skill Gem (Lvl 9) + Inscribed Ultimatum",
						type: "Drop",
						source: "Kill Xyclucian",
					},
					{
						id: "2-ascendancy-points",
						tags: ["ascendancy", "quest"],
						item: "2 Ascendancy Points",
						type: "Drop",
						source: "Complete the Trial of Chaos",
					},
					{
						id: "magic-amulet",
						tags: ["equipment"],
						item: "Magic Amulet",
						type: "Drop",
						source: "Kill the Rare Monster at the Toxic Bloom",
					},
					{
						id: "uncut-skill-gem-level-9",
						tags: ["league-currency", "skill-gem"],
						item: "Uncut Skill Gem (Lvl 9)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "jiquani-s-machinarium",
				name: "Jiquani's Machinarium",
				pickups: [
					{
						id: "permanent-plus-10-percent-fire-resistance",
						tags: ["permanent"],
						item: "Permanent +10% Fire Resistance",
						type: "Drop",
						source: "Kill Blackjaw, The Remnant",
					},
					{
						id: "artificer-s-orb",
						tags: ["league-currency", "crafting"],
						item: "Artificer's Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "jiquani-s-sanctum",
				name: "Jiquani's Sanctum",
				pickups: [
					{
						id: "free-vaal-orb-usage",
						tags: ["crafting"],
						item: 'Free "Vaal Orb" usage',
						type: "Drop",
						source: "Interact with the Vaal Pedestal in the zone",
					},
					{
						id: "exalted-orb",
						tags: ["league-currency", "crafting"],
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-matlan-waterways",
				name: "The Matlan Waterways",
				pickups: [
					{
						id: "rare-weapon",
						tags: ["equipment"],
						item: "Rare Weapon",
						type: "Drop",
						source: "Kill the rare enemy at Narag's Hut",
					},
					{
						id: "uncut-spirit-gem-level-10",
						tags: ["league-currency", "spirit-gem"],
						item: "Uncut Spirit Gem (Lvl 10)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-drowned-city",
				name: "The Drowned City",
				pickups: [
					{
						id: "uncut-support-gem-level-3",
						tags: ["league-currency", "support-gem"],
						item: "Uncut Support Gem (Lvl 3)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-molten-vault",
				name: "The Molten Vault",
				pickups: [
					{
						id: "reforging-bench-unlock-plus-uncut-skill-gem-lvl-10-plus-artificer-s-orb",
						tags: ["skill-gem", "crafting", "quest"],
						item: "Reforging Bench Unlock + Uncut Skill Gem (Lvl 10) + Artificer's Orb",
						type: "Hand-In",
						source:
							"Kill Mektul, The Forgemaster, and speak to Oswald back in town",
					},
					{
						id: "unique-item",
						tags: ["league-currency", "equipment"],
						item: "Unique Item",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "apex-of-filth",
				name: "Apex of Filth",
				pickups: [
					{
						id: "life-and-mana-flask",
						tags: ["consumable", "quest"],
						item: "Life and Mana Flask",
						type: "Hand-In",
						source:
							"Place Red, Green, and Blue Mushrooms into Cauldron Keeper's cauldron",
					},
					{
						id: "vaal-orb",
						tags: ["league-currency", "crafting"],
						item: "Vaal Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "temple-of-kopec",
				name: "Temple of Kopec",
				pickups: [
					{
						id: "uncut-spirit-gem-level-11",
						tags: ["league-currency", "spirit-gem"],
						item: "Uncut Spirit Gem (Lvl 11)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "utzaal-past",
				name: "Utzaal (Past)",
				pickups: [
					{
						id: "inscribed-ultimatum",
						tags: ["quest"],
						item: "Inscribed Ultimatum",
						type: "Drop",
						source: "Interact with the Chaos Statue",
					},
					{
						id: "golden-idols",
						tags: ["crafting"],
						item: "Golden Idols",
						type: "Drop",
						source: "Interact with Peculiar Fortunes",
					},
					{
						id: "random-jewel-or-time-lost-jewel",
						tags: ["league-currency"],
						item: "Random Jewel or Time-Lost Jewel",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "aggorat",
				name: "Aggorat",
				pickups: [
					{
						id: "2-weapon-set-passive-skill-points",
						tags: ["passive-points", "equipment", "quest"],
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source:
							"Farm a Sacrificial Heart (here or in Utzaal) and complete the Blood Sacrifice at the altar",
					},
					{
						id: "uncut-skill-gem-level-11",
						tags: ["league-currency", "skill-gem"],
						item: "Uncut Skill Gem (Lvl 11)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-black-chambers-past",
				name: "The Black Chambers (Past)",
				pickups: [
					{
						id: "vaal-orb",
						tags: ["league-currency", "crafting"],
						item: "Vaal Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
		],
	},
	{
		id: "act-4--karui-archipelago",
		title: "Act 4: Karui Archipelago",
		areas: [
			{
				id: "journey-s-end",
				name: "Journey's End",
				pickups: [
					{
						id: "2-weapon-set-passive-skill-points-plus-uncut-skill-gem-lvl-13",
						tags: ["passive-points", "skill-gem", "equipment", "quest"],
						item: "2 Weapon Set Passive Skill Points + Uncut Skill Gem (Lvl 13)",
						type: "Hand-In",
						source: "Kill Omniphobia, return to Captain Hartlin",
					},
					{
						id: "orb-of-alchemy",
						tags: ["league-currency", "crafting"],
						item: "Orb of Alchemy",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "isle-of-kin",
				name: "Isle of Kin",
				pickups: [
					{
						id: "blank-greater-rune",
						tags: ["equipment"],
						item: "Blank Greater Rune",
						type: "Drop",
						source: "Kill The Blind Beast",
					},
					{
						id: "uncut-skill-gem-lvl-11-12",
						tags: ["skill-gem"],
						item: "Uncut Skill Gem (Lvl 11/12)",
						type: "Drop",
						source: "Beast Pen",
					},
					{
						id: "uncut-support-gem-lvl-4",
						tags: ["support-gem"],
						item: "Uncut Support Gem (Lvl 4)",
						type: "Drop",
						source: "Beast Pen",
					},
					{
						id: "lesser-jeweller-s-orb",
						tags: ["crafting"],
						item: "Lesser Jeweller's Orb",
						type: "Drop",
						source: "Fossilised Formation",
					},
					{
						id: "sulphite-infusion-buff",
						tags: ["quest"],
						item: "Sulphite Infusion Buff",
						type: "Drop",
						source: "Voltaxic Spire",
					},
					{
						id: "torn-map-piece",
						tags: ["quest"],
						item: "Torn Map Piece",
						type: "Drop",
						source: "Flayed Sailor",
					},
					{
						id: "gemcutter-s-prism",
						tags: ["league-currency"],
						item: "Gemcutter's Prism",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "volcanic-warrens",
				name: "Volcanic Warrens",
				pickups: [
					{
						id: "rare-ring-ruby-or-topaz",
						tags: ["equipment"],
						item: "Rare Ring (Ruby or Topaz)",
						type: "Drop",
						source: "Kill rare golems in Volcanic Nest Secret",
					},
					{
						id: "uncut-support-gem-lvl-4",
						tags: ["league-currency", "support-gem"],
						item: "Uncut Support Gem (Lvl 4)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "whakapanu-island",
				name: "Whakapanu Island",
				pickups: [
					{
						id: "uncut-support-gem-lvl-4",
						tags: ["support-gem"],
						item: "Uncut Support Gem (Lvl 4)",
						type: "Drop",
						source: "Kill rare crab in Crabshell Cavern",
					},
					{
						id: "torn-map-piece",
						tags: ["quest"],
						item: "Torn Map Piece",
						type: "Drop",
						source: "Petrified Pirate",
					},
					{
						id: "choice-of-uncut-skill-gem-lvl-11-spirit-gem-lvl-11-or-support-gem-lvl-4",
						tags: ["skill-gem", "support-gem", "spirit-gem", "quest"],
						item: "Choice of Uncut Skill Gem (Lvl 11), Spirit Gem (Lvl 11), or Support Gem (Lvl 4)",
						type: "Hand-In",
						source: "Return Shark Fin (from Great White One) to Kaimana",
					},
					{
						id: "artificer-s-orb",
						tags: ["league-currency", "crafting"],
						item: "Artificer's Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "singing-caverns",
				name: "Singing Caverns",
				pickups: [
					{
						id: "rare-pearlescent-amulet",
						tags: ["equipment", "quest"],
						item: "Rare Pearlescent Amulet",
						type: "Hand-In",
						source: "Return Humming Pearl (from Beckoning Clam) to Rog",
					},
					{
						id: "magic-charm",
						tags: ["league-currency", "consumable"],
						item: "Magic Charm",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "abandoned-prison",
				name: "Abandoned Prison",
				pickups: [
					{
						id: "permanent-plus-30-percent-life-mana-flask-recovery",
						tags: ["permanent", "consumable"],
						item: "Permanent +30% Life/Mana Flask Recovery",
						type: "Drop",
						source: "Interact with the Goddess of Justice statue",
					},
					{
						id: "room-full-of-gear",
						tags: ["quest"],
						item: "Room full of gear",
						type: "Drop",
						source: "Unlock The Armoury",
					},
					{
						id: "exalted-orb",
						tags: ["league-currency", "crafting"],
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "solitary-confinement",
				name: "Solitary Confinement",
				pickups: [
					{
						id: "rune",
						tags: ["league-currency", "equipment"],
						item: "Rune",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "kedge-bay",
				name: "Kedge Bay",
				pickups: [
					{
						id: "torn-map-piece",
						tags: ["quest"],
						item: "Torn Map Piece",
						type: "Drop",
						source: "Open Dead Man's Chest",
					},
					{
						id: "lesser-jeweller-s-orb",
						tags: ["crafting"],
						item: "Lesser Jeweller's Orb",
						type: "Drop",
						source: "Open chest in Abandoned Ship",
					},
					{
						id: "exalted-orb",
						tags: ["league-currency", "crafting"],
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "shrike-island",
				name: "Shrike Island",
				pickups: [
					{
						id: "torn-map-piece",
						tags: ["quest"],
						item: "Torn Map Piece",
						type: "Drop",
						source: "Interact with Corpse Nest",
					},
					{
						id: "plunder-s-point-expedition-mechanic-unlock",
						tags: ["quest"],
						item: "Plunder's Point (Expedition mechanic) Unlock",
						type: "Hand-In",
						source: "Return all four Torn Map Pieces to Makoru",
					},
					{
						id: "uncut-support-gem-lvl-4",
						tags: ["league-currency", "support-gem"],
						item: "Uncut Support Gem (Lvl 4)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "eye-of-hinekora",
				name: "Eye of Hinekora",
				pickups: [
					{
						id: "permanent-plus-5-percent-maximum-mana",
						tags: ["permanent"],
						item: "Permanent +5% Maximum Mana",
						type: "Drop",
						source: "Pay Respects at the Silent Hall (Navali's Rest)",
					},
					{
						id: "chaos-orb",
						tags: ["league-currency", "crafting"],
						item: "Chaos Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "halls-of-the-dead",
				name: "Halls of the Dead",
				pickups: [
					{
						id: "2-weapon-set-passive-skill-points",
						tags: ["passive-points", "equipment", "quest"],
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source: "Defeat Yama the White and speak to Navali",
					},
					{
						id: "3x-permanent-attributes-or-resistances",
						tags: ["permanent", "quest"],
						item: "3x Permanent Attributes or Resistances",
						type: "Drop",
						source:
							"Complete the 3 Ancestral Tattoo trials (Tawhoa, Tasalio, Ngamahu)",
					},
					{
						id: "random-items",
						tags: ["league-currency"],
						item: "Random Items*",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "arastas",
				name: "Arastas",
				pickups: [
					{
						id: "3-regal-orbs",
						tags: ["crafting"],
						item: "3 Regal Orbs",
						type: "Drop",
						source: "Morning bell in the Town Square",
					},
					{
						id: "3-exalted-orbs",
						tags: ["crafting"],
						item: "3 Exalted Orbs",
						type: "Drop",
						source: "Evening bell at the Cliffside",
					},
					{
						id: "uncut-skill-gem-level-12",
						tags: ["league-currency", "skill-gem"],
						item: "Uncut Skill Gem (Lvl 12)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-excavation",
				name: "The Excavation",
				pickups: [
					{
						id: "rare-amulet",
						tags: ["league-currency", "equipment"],
						item: "Rare Amulet",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "ngakanu",
				name: "Ngakanu",
				pickups: [
					{
						id: "greater-jeweller-s-orb-abyssal-depths",
						tags: ["league-currency", "crafting"],
						item: "Greater Jeweller's Orb, Abyssal Depths",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "heart-of-the-tribe",
				name: "Heart of the Tribe",
				pickups: [
					{
						id: "random-loot",
						tags: ["quest"],
						item: "Random loot",
						type: "Drop",
						source: "Open the Meeting House",
					},
					{
						id: "uncut-spirit-gem-level-12",
						tags: ["league-currency", "spirit-gem"],
						item: "Uncut Spirit Gem (Lvl 12)",
						type: "Drop",
						source: "League event",
					},
				],
			},
		],
	},
	{
		id: "interludes",
		title: "Interludes",
		areas: [
			{
				id: "scorched-farmlands",
				name: "Scorched Farmlands",
				pickups: [
					{
						id: "uncut-support-gem-level-4",
						tags: ["league-currency", "support-gem"],
						item: "Uncut Support Gem (Lvl 4)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "stones-of-serle",
				name: "Stones of Serle",
				pickups: [
					{
						id: "exalted-orb-plus-abyss-currency",
						tags: ["league-currency", "crafting"],
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-blackwood",
				name: "The Blackwood",
				pickups: [
					{
						id: "random-omen",
						tags: ["quest"],
						item: "Random Omen",
						type: "Drop",
						source: "Interact with Omen Altars",
					},
					{
						id: "greater-orb-of-transmutation",
						tags: ["league-currency", "crafting"],
						item: "Greater Orb of Transmutation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "holten",
				name: "Holten",
				pickups: [
					{
						id: "armourer-s-scrap-magic-and-rare-loot",
						tags: ["crafting"],
						item: "Armourer's Scrap, magic and rare loot",
						type: "Drop",
						source: "Defeat Sigbert and Godwin at the Psalm of Blood",
					},
					{
						id: "greater-rune",
						tags: ["league-currency", "equipment"],
						item: "Greater Rune",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "wolvenhold",
				name: "Wolvenhold",
				pickups: [
					{
						id: "2-weapon-set-passive-skill-points",
						tags: ["passive-points", "equipment", "quest"],
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source: "Defeat Oswin, consume Warden's Ledger",
					},
					{
						id: "greater-orb-of-augmentation",
						tags: ["league-currency", "crafting"],
						item: "Greater Orb of Augmentation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "holten-estate",
				name: "Holten Estate",
				pickups: [
					{
						id: "artificer-s-orb",
						tags: ["league-currency", "crafting"],
						item: "Artificer's Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-khari-crossing",
				name: "The Khari Crossing",
				pickups: [
					{
						id: "2-weapon-set-passive-skill-points",
						tags: ["passive-points", "equipment", "quest"],
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source: "Defeat Akthi and Anundr, speak to Risu",
					},
					{
						id: "permanent-plus-5-percent-maximum-life",
						tags: ["permanent"],
						item: "Permanent +5% Maximum Life",
						type: "Drop",
						source: "Interact with the Molten Shrine in the zone",
					},
					{
						id: "gemcutter-s-prism",
						tags: ["league-currency"],
						item: "Gemcutter's Prism",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "pools-of-khatal",
				name: "Pools of Khatal",
				pickups: [
					{
						id: "orb-of-alchemy",
						tags: ["league-currency", "crafting"],
						item: "Orb of Alchemy",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "sel-khari-sanctuary",
				name: "Sel Khari Sanctuary",
				pickups: [
					{
						id: "2-out-of-3-reward-rare-ring-rare-amulet-rare-jewel",
						tags: ["equipment"],
						item: "2 out of 3 reward: Rare Ring, Rare Amulet, Rare Jewel",
						type: "Drop",
						source:
							"Place Yoon's Barya and Rangeen's Barya into opposing altars",
					},
					{
						id: "orb-of-chance",
						tags: ["league-currency", "crafting"],
						item: "Orb of Chance",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-galai-gates",
				name: "The Galai Gates",
				pickups: [
					{
						id: "greater-orb-of-augmentation-plus-abyss-currency",
						tags: ["league-currency", "crafting"],
						item: "Greater Orb of Augmentation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "qimah",
				name: "Qimah",
				pickups: [
					{
						id: "choice-of-1-of-7-buffs",
						tags: ["quest"],
						item: "Choice of 1 of 7 Buffs",
						type: "Drop",
						source: "Interact with Orbala's Pillar in Qimah",
					},
					{
						id: "exalted-orb",
						tags: ["league-currency", "crafting"],
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "qimah-reservoir",
				name: "Qimah Reservoir",
				pickups: [
					{
						id: "random-currency-item",
						tags: ["crafting", "quest"],
						item: "Random currency item",
						type: "Hand-In",
						source: "Fill Sacred Wells with Vial of Sacred Water",
					},
					{
						id: "greater-orb-of-transmutation",
						tags: ["league-currency", "crafting"],
						item: "Greater Orb of Transmutation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "ashen-forest",
				name: "Ashen Forest",
				pickups: [
					{
						id: "uncut-skill-gem-lvl-14",
						tags: ["skill-gem"],
						item: "Uncut Skill Gem (Lvl 14)",
						type: "Drop",
						source: "Interact with the Ancient Monument",
					},
					{
						id: "rare-belt",
						tags: ["league-currency"],
						item: "Rare Belt",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "kriar-village",
				name: "Kriar Village",
				pickups: [
					{
						id: "permanent-plus-40-maximum-spirit-plus-uncut-spirit-gem-lvl-14",
						tags: ["permanent", "spirit-gem"],
						item: "Permanent +40 Maximum Spirit + Uncut Spirit Gem (Lvl 14)",
						type: "Drop",
						source: "Kill Lythara, The Wayward Spear in Kriar Village",
					},
					{
						id: "greater-rune-plus-abyss-currency",
						tags: ["league-currency", "equipment", "crafting"],
						item: "Greater Rune",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "glacial-tarn",
				name: "Glacial Tarn",
				pickups: [
					{
						id: "greater-orb-of-augmentation",
						tags: ["league-currency", "crafting"],
						item: "Greater Orb of Augmentation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "howling-caves",
				name: "Howling Caves",
				pickups: [
					{
						id: "2-weapon-set-passive-skill-points",
						tags: ["passive-points", "equipment", "quest"],
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source:
							"Kill The Abominable Yeti in the Howling Caves, speak to Hilda",
					},
					{
						id: "chaos-orb",
						tags: ["league-currency", "crafting"],
						item: "Chaos Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "kriar-peaks",
				name: "Kriar Peaks",
				pickups: [
					{
						id: "choose-unique-item",
						tags: ["equipment", "quest"],
						item: "Choose Unique Item",
						type: "Hand-In",
						source: "Talk to Elder Madox in Kriar Peaks",
					},
					{
						id: "greater-orb-of-transmutation",
						tags: ["league-currency", "crafting"],
						item: "Greater Orb of Transmutation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "etched-ravine",
				name: "Etched Ravine",
				pickups: [
					{
						id: "exalted-orb",
						tags: ["league-currency", "crafting"],
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-cuachic-vault",
				name: "The Cuachic Vault",
				pickups: [
					{
						id: "vaal-orb",
						tags: ["league-currency", "crafting"],
						item: "Vaal Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "interlude-finale-kingsmarch-hub",
				name: "Interlude Finale (Kingsmarch Hub)",
				pickups: [
					{
						id: "2-weapon-set-passive-skill-points",
						tags: ["passive-points", "equipment", "quest"],
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source:
							'Speak to The Hooded One after finishing the Interlude Acts to complete "Siege of Oriath"',
					},
				],
			},
		],
	},
];

export function validateCampaignData(data: Act[]): string[] {
	const errors: string[] = [];
	for (const act of data) {
		for (const area of act.areas) {
			const seen = new Set<string>();
			for (const pickup of area.pickups) {
				if (!pickup.id) {
					errors.push(
						`${act.id}|${area.id}: pickup has empty id (item: "${pickup.item}")`,
					);
				} else if (seen.has(pickup.id)) {
					errors.push(
						`${act.id}|${area.id}: duplicate pickup id "${pickup.id}"`,
					);
				} else {
					seen.add(pickup.id);
				}
				if (pickup.tags.length === 0) {
					errors.push(
						`${act.id}|${area.id}|${pickup.id}: pickup has no tags (item: "${pickup.item}")`,
					);
				}
			}
		}
	}
	return errors;
}
