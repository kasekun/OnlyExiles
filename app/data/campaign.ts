export interface Pickup {
	item: string;
	type: "Drop" | "Hand-In";
	source: string;
}

export interface Area {
	id: string;
	name: string;
	recLevel: string;
	notes: string;
	pickups: Pickup[];
}

export interface Act {
	id: string;
	title: string;
	areas: Area[];
}

export const DATA: Act[] = [
	{
		id: "act-1-locations-island-of-ogham",
		title: "Act 1 Locations: Island of Ogham",
		areas: [
			{
				id: "the-riverbank",
				name: "The Riverbank",
				recLevel: "1",
				notes: "XP is bad here, skip mobs",
				pickups: [
					{
						item: "Class specific skill gem",
						type: "Drop",
						source: "unskippable chest",
					},
				],
			},
			{
				id: "clearfell",
				name: "Clearfell",
				recLevel: "1",
				notes: "XP is bad here, skip mobs",
				pickups: [
					{
						item: "Permanent +10% Cold Resistance",
						type: "Drop",
						source: "Kill Beira of the Rotten Pack",
					},
					{
						item: "Uncut Skill Gem (Lvl 1)",
						type: "Drop",
						source: "Open the Mysterious Campsite Chest / Abandoned Stash",
					},
					{
						item: "Orb of Transmutation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-mud-burrow",
				name: "The Mud Burrow",
				recLevel: "1",
				notes: "XP is bad here, skip mobs",
				pickups: [
					{
						item: "Uncut Skill Gem (Lvl 2)",
						type: "Drop",
						source: "Kill The Devourer",
					},
					{
						item: "Uncut Support Gem",
						type: "Hand-In",
						source: "Talk to the NPC after Mud Burrow boss quest completion",
					},
					{
						item: "Orb of Augmentation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-grelwood",
				name: "The Grelwood",
				recLevel: "2",
				notes: "XP is bad here, skip mobs",
				pickups: [
					{
						item: "Uncut Skill Gem (Lvl 2)",
						type: "Drop",
						source: "Kill The Brambleghast",
					},
					{
						item: "Uncut Support Gem + Medium Life/Mana Flasks",
						type: "Drop",
						source: "Kill Areagne and loot her Witch Hut cauldron",
					},
					{
						item: "Orb of Transmutation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-red-vale",
				name: "The Red Vale",
				recLevel: "2",
				notes: "Great XP zone",
				pickups: [
					{
						item: "Weapon upgrade (Lvl 5)",
						type: "Drop",
						source: "Refined Arms lootable",
					},
					{
						item: "Uncut Skill Gem (Lvl 3)",
						type: "Drop",
						source: "Kill The Rust King",
					},
					{
						item: "Uncut Skill Gem (Level 2)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-grim-tangle",
				name: "The Grim Tangle",
				recLevel: "4",
				notes: "",
				pickups: [
					{
						item: "Uncut Support Gem",
						type: "Drop",
						source: "Kill The Rotten Druid",
					},
					{
						item: "Uncut Skill Gem (Level 3)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "cemetery-of-the-eternals",
				name: "Cemetery of the Eternals",
				recLevel: "5",
				notes:
					"Great XP\nAfter finding the keys and opening the gates for Lachlann, immediately restart at checkpoint to skip his long story animation.",
				pickups: [
					{
						item: "Iron Ring or Lazuli Ring",
						type: "Drop",
						source: "Ancient Ruins Sarcophagus",
					},
					{
						item: "Uncut Skill Gem (Lvl 3) + Uncut Support Gem",
						type: "Drop",
						source: "Kill Count Lachlann",
					},
					{
						item: "Regal Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "tomb-of-the-consort",
				name: "Tomb of the Consort",
				recLevel: "6",
				notes: "Great XP",
				pickups: [
					{
						item: "Uncut Support Gem (Lvl 1)",
						type: "Drop",
						source: "Open the Haunted Treasure",
					},
					{
						item: "Normal Amulet",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "mausoleum-of-the-praetor",
				name: "Mausoleum of the Praetor",
				recLevel: "7",
				notes: "Skip mobs if at lvl 7",
				pickups: [
					{
						item: "Gold + a Rare item",
						type: "Drop",
						source: "Open the Forgotten Riches chest",
					},
					{
						item: "Lesser Rune",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-hunting-grounds",
				name: "The Hunting Grounds",
				recLevel: "7",
				notes: "Great XP",
				pickups: [
					{
						item: "2 Weapon Set Passive Skill Points",
						type: "Drop",
						source: "Kill The Crowbell",
					},
					{
						item: "Uncut Skill Gem (Lvl 4)",
						type: "Drop",
						source: "Complete the Ritual Site encounter",
					},
					{
						item: "Uncut Support Gem (Lvl 1)",
						type: "Drop",
						source: "Complete the Dryadic Ritual",
					},
					{
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "freythorn",
				name: "Freythorn",
				recLevel: "8",
				notes: "",
				pickups: [
					{
						item: "Permanent +30 to Maximum Spirit + Uncut Spirit Gem (Lvl 4)",
						type: "Drop",
						source:
							"Summon and kill The King in the Mists by completing Ritual encounters",
					},
					{
						item: "Elemental Charm",
						type: "Hand-In",
						source: "Complete Ominous Altars and speak to Finn in town",
					},
					{
						item: "Uncut Support Gem (Level 1)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "ogham-farmlands",
				name: "Ogham Farmlands",
				recLevel: "9",
				notes: "",
				pickups: [
					{
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source: "Find Una's Lute in her hut and hand it in to her",
					},
					{
						item: "Uncut Skill Gem (Lvl 4)",
						type: "Drop",
						source: "Crop circle - kill Vargir the Feral Mutt",
					},
					{
						item: "Uncut Skill Gem (Level 4)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "ogham-village",
				name: "Ogham Village",
				recLevel: "10",
				notes: "",
				pickups: [
					{
						item: "Salvage Bench Unlock",
						type: "Hand-In",
						source: "Find Smithing Tools and return them to Renly",
					},
					{
						item: "Artificer's Orb + Lesser Blank Rune",
						type: "Drop",
						source: "Blacksmith's Chest (near Smithing tools)",
					},
					{
						item: "Uncut Support Gem",
						type: "Drop",
						source: "Kill The Executioner",
					},
					{
						item: "Uncut Skill Gem (Lvl 5)",
						type: "Hand-In",
						source: "Save Leitis and speak to her in town",
					},
					{
						item: "Artificer's Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-manor-ramparts",
				name: "The Manor Ramparts",
				recLevel: "11",
				notes: "Great XP",
				pickups: [
					{
						item: "Uncut Support Gem",
						type: "Drop",
						source: "Complete The Gallows encounter",
					},
					{
						item: "Uncut Skill Gem (Level 5)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "ogham-manor",
				name: "Ogham Manor",
				recLevel: "12",
				notes:
					"Hit lvl 14 before Count Geonor if you need to use a level 5 skill gem\nTP out instead of waiting ~30s for Count Geonor loot (not great loot)",
				pickups: [
					{
						item: "Permanent +20 to Maximum Life",
						type: "Drop",
						source: "Activate the Psalm of Madness and kill Candlemass",
					},
					{
						item: "Orb of Alchemy",
						type: "Drop",
						source: "League event",
					},
				],
			},
		],
	},
	{
		id: "act-2-locations-the-vastiri-desert-keth",
		title: "Act 2 Locations: The Vastiri Desert / Keth",
		areas: [
			{
				id: "vastiri-outskirts",
				name: "Vastiri Outskirts",
				recLevel: "13",
				notes: "",
				pickups: [
					{
						item: "Uncut Support Gem (Lvl 2)",
						type: "Drop",
						source: "Devastated camp yellow chest",
					},
					{
						item: "Uncut Skill Gem (Lvl 5)",
						type: "Hand-In",
						source: "Kill Rathbreaker and speak to Zarka in town",
					},
					{
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "mawdun-quarry",
				name: "Mawdun Quarry",
				recLevel: "14",
				notes: "",
				pickups: [
					{
						item: "Artificer's Orb",
						type: "Drop",
						source: "Open the Faridun War Cache",
					},
					{
						item: "Uncut Spirit Gem (Level 5)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "mawdun-mine",
				name: "Mawdun Mine",
				recLevel: "15.5",
				notes: "",
				pickups: [
					{
						item: "Uncut Support Gem (Level 2)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "traitor-s-passage",
				name: "Traitor's Passage",
				recLevel: "16.5",
				notes: "",
				pickups: [
					{
						item: "Ascendancy Trial Key (Djinn Barya)",
						type: "Drop",
						source: "Kill Balbala",
					},
					{
						item: "Uncut Skill Gem (Lvl 6)",
						type: "Drop",
						source: "Open the Bell Chest",
					},
					{
						item: "Artificer's Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-halani-gates",
				name: "The Halani Gates",
				recLevel: "17.5",
				notes: "",
				pickups: [
					{
						item: "Uncut Skill Gem (Lvl 7)",
						type: "Hand-In",
						source: "Speak to Zarka after chasing Jamanra",
					},
					{
						item: "Uncut Skill Gem (Lvl 6)",
						type: "Drop",
						source: "Kill L'im the Impaler",
					},
					{
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "mastodon-badlands",
				name: "Mastodon Badlands",
				recLevel: "18.5",
				notes: "",
				pickups: [
					{
						item: "Uncut Support Gem (Lvl 2)",
						type: "Drop",
						source: "Open the Effigy",
					},
					{
						item: "Regal Orb, Abyss Currency",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-bone-pits",
				name: "The Bone Pits",
				recLevel: "19",
				notes: "",
				pickups: [
					{
						item: "Uncut Support Gem (Lvl 2)",
						type: "Hand-In",
						source: "Kill Iktab + Ekbab speak to Zarka",
					},
					{
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "keth",
				name: "Keth",
				recLevel: "19.5",
				notes: "",
				pickups: [
					{
						item: "2 Weapon Set Passive Skill Points",
						type: "Drop",
						source: "Kill Kabala, Constrictor Queen",
					},
					{
						item: "Magic Amulet",
						type: "Drop",
						source: "Open the Abandoned Prayer",
					},
					{
						item: "Gemcutter's Prism",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-lost-city",
				name: "The Lost City",
				recLevel: "20.5",
				notes: "",
				pickups: [
					{
						item: "Jewel",
						type: "Drop",
						source: "Kill beetle - The Ninth Treasure of Keth",
					},
					{
						item: "Uncut Spirit Gem (Lvl 6/7)",
						type: "Drop",
						source: "Loot the Golden Tomb",
					},
					{
						item: "Orb of Alchemy",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "buried-shrines",
				name: "Buried Shrines",
				recLevel: "21.5",
				notes: "Great XP",
				pickups: [
					{
						item: "Uncut Support Gem",
						type: "Drop",
						source: "Open the Suspicious Sarcophagus",
					},
					{
						item: "Magic Ruby, Sapphire or Topaz Ring",
						type: "Drop",
						source: "Choose an Offering at the Elemental Shrine",
					},
					{
						item: "Uncut Support Gem (Lvl 2)",
						type: "Hand-In",
						source: "Obtain The Essence of Water, speak to Zarka",
					},
					{
						item: "Lesser Jeweller's Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "valley-of-the-titans",
				name: "Valley of the Titans",
				recLevel: "22.5",
				notes: "",
				pickups: [
					{
						item: "Permanent +1 Charm Slot and Choice of Buff",
						type: "Hand-In",
						source:
							'Deliver the Sun and Kabala Clan Relics to the Altar ("Ancient Vows" quest)',
					},
					{
						item: "Unique Item, Abyss Currency",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "titan-grotto",
				name: "Titan Grotto",
				recLevel: "23.5",
				notes: "",
				pickups: [
					{
						item: "Uncut Support Gem (Lvl 2)",
						type: "Hand-In",
						source: "Kill Zalmarath for Flame Ruby, speak to Zarka",
					},
					{
						item: "Lesser Rune",
						type: "Drop",
						source: "Find the Titan's Sword",
					},
					{
						item: "Chance Shard",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "deshar",
				name: "Deshar",
				recLevel: "24",
				notes: "Great XP",
				pickups: [
					{
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source: "Locate Final Letter and deliver to Shambrin",
					},
					{
						item: "Artificer's Orb",
						type: "Drop",
						source: "Find the Unremembered Skeleton",
					},
					{
						item: "Lesser Rune",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "path-of-mourning",
				name: "Path of Mourning",
				recLevel: "25",
				notes: "",
				pickups: [
					{
						item: "Uncut Support Gem (Lvl 2)",
						type: "Drop",
						source: "Open the Hushed Urn",
					},
				],
			},
			{
				id: "the-spires-of-deshar",
				name: "The Spires of Deshar",
				recLevel: "25",
				notes: "Great XP",
				pickups: [
					{
						item: "Permanent +10% Lightning Resistance",
						type: "Drop",
						source: "Click on the Sisters of Garukhan Shrine",
					},
					{
						item: "Gemcutter's Prism",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-dreadnought",
				name: "The Dreadnought",
				recLevel: "26",
				notes: "Great XP",
				pickups: [],
			},
			{
				id: "dreadnought-vanguard",
				name: "Dreadnought Vanguard",
				recLevel: "27",
				notes: "Great XP",
				pickups: [],
			},
		],
	},
	{
		id: "act-3-locations-the-jungles-machinarium",
		title: "Act 3 Locations: The Jungles / Machinarium",
		areas: [
			{
				id: "sandswept-marsh",
				name: "Sandswept Marsh",
				recLevel: "28.5",
				notes: "",
				pickups: [
					{
						item: "Uncut Skill Gem (Lvl 9)",
						type: "Drop",
						source: "Foul Ritual - kill Rootdredge",
					},
					{
						item: "Magic Ring",
						type: "Drop",
						source: "Hanging tree - loot corpses",
					},
					{
						item: "Lesser Jeweller's Orb",
						type: "Drop",
						source: "Basket at the Orok Campfire [first run only]",
					},
					{
						item: "Uncut Support Gem (Level 3)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "jungle-ruins",
				name: "Jungle Ruins",
				recLevel: "28.5",
				notes: "",
				pickups: [
					{
						item: "2 Weapon Set Passive Skill Points",
						type: "Drop",
						source: "Kill Mighty Silverfist",
					},
					{
						item: "Rare Belt",
						type: "Hand-In",
						source: "Interact with Jungle Grave and speak to Servi",
					},
					{
						item: "Orb of Alchemy",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-venom-crypts",
				name: "The Venom Crypts",
				recLevel: "28.5",
				notes: "",
				pickups: [
					{
						item: "Permanent Buff Choice + Artificer's Orb",
						type: "Hand-In",
						source: "Find the Venom Vial and deliver it to Servi",
					},
					{
						item: "Magic Ring, Abyss Currency",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "infested-barrens",
				name: "Infested Barrens",
				recLevel: "30",
				notes: "",
				pickups: [
					{
						item: "Uncut Support Gem",
						type: "Drop",
						source: "Clear the Cave Location encounter",
					},
					{
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-azak-bog",
				name: "The Azak Bog",
				recLevel: "32",
				notes:
					"Great XP zone\nGreat farming zone - can reset at checkpoint to farm mobs multiple times",
				pickups: [
					{
						item: "Permanent +30 Maximum Spirit + Uncut Spirit Gem (Lvl 10)",
						type: "Drop",
						source: "Kill Ignagduk, The Bog Witch",
					},
					{
						item: "Charm (Thawing, Staunching, Antidote, Dousing, or Grounding)",
						type: "Hand-In",
						source: "Return Ignagduk's Ghastly Spear to Servi",
					},
					{
						item: "Rune",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "chimeral-wetlands",
				name: "Chimeral Wetlands",
				recLevel: "32",
				notes: "",
				pickups: [
					{
						item: "Uncut Skill Gem (Lvl 9) + Inscribed Ultimatum",
						type: "Drop",
						source: "Kill Xyclucian",
					},
					{
						item: "2 Ascendancy Points",
						type: "Drop",
						source: "Complete the Trial of Chaos",
					},
					{
						item: "Magic Amulet",
						type: "Drop",
						source: "Kill the Rare Monster at the Toxic Bloom",
					},
					{
						item: "Uncut Skill Gem (Level 9)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "jiquani-s-machinarium",
				name: "Jiquani's Machinarium",
				recLevel: "32",
				notes: "",
				pickups: [
					{
						item: "Permanent +10% Fire Resistance",
						type: "Drop",
						source: "Kill Blackjaw, The Remnant",
					},
					{
						item: "Artificer's Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "jiquani-s-sanctum",
				name: "Jiquani's Sanctum",
				recLevel: "32",
				notes: "",
				pickups: [
					{
						item: 'Free "Vaal Orb" usage',
						type: "Drop",
						source: "Interact with the Vaal Pedestal in the zone",
					},
					{
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-matlan-waterways",
				name: "The Matlan Waterways",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Rare Weapon",
						type: "Drop",
						source: "Kill the rare enemy at Narag's Hut",
					},
					{
						item: "Uncut Spirit Gem (Level 10)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-drowned-city",
				name: "The Drowned City",
				recLevel: "36",
				notes: "",
				pickups: [
					{
						item: "Uncut Support Gem (Level 3)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-molten-vault",
				name: "The Molten Vault",
				recLevel: "32",
				notes: "",
				pickups: [
					{
						item: "Reforging Bench Unlock + Uncut Skill Gem (Lvl 10) + Artificer's Orb",
						type: "Hand-In",
						source:
							"Kill Mektul, The Forgemaster, and speak to Oswald back in town",
					},
					{
						item: "Unique Item",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "apex-of-filth",
				name: "Apex of Filth",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Life and Mana Flask",
						type: "Hand-In",
						source:
							"Place Red, Green, and Blue Mushrooms into Cauldron Keeper's cauldron",
					},
					{
						item: "Vaal Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "temple-of-kopec",
				name: "Temple of Kopec",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Uncut Spirit Gem (Level 11)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "utzaal-past",
				name: "Utzaal (Past)",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Inscribed Ultimatum",
						type: "Drop",
						source: "Interact with the Chaos Statue",
					},
					{
						item: "Golden Idols",
						type: "Drop",
						source: "Interact with Peculiar Fortunes",
					},
					{
						item: "Random Jewel or Time-Lost Jewel",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "aggorat",
				name: "Aggorat",
				recLevel: "32",
				notes:
					"Sacrificial hearts drop from ... and are in exactly one enemy, not a drop chance. you must kill that enemy to drop the heart.",
				pickups: [
					{
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source:
							"Farm a Sacrificial Heart (here or in Utzaal) and complete the Blood Sacrifice at the altar",
					},
					{
						item: "Uncut Skill Gem (Level 11)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-black-chambers-past",
				name: "The Black Chambers (Past)",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Vaal Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
		],
	},
	{
		id: "act-4-locations-karui-archipelago",
		title: "Act 4 Locations: Karui Archipelago",
		areas: [
			{
				id: "journey-s-end",
				name: "Journey's End",
				recLevel: "40",
				notes: "",
				pickups: [
					{
						item: "2 Weapon Set Passive Skill Points + Uncut Skill Gem (Lvl 13)",
						type: "Hand-In",
						source: "Kill Omniphobia, return to Captain Hartlin",
					},
					{
						item: "Orb of Alchemy",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "isle-of-kin",
				name: "Isle of Kin",
				recLevel: "41",
				notes: "",
				pickups: [
					{
						item: "Blank Greater Rune",
						type: "Drop",
						source: "Kill The Blind Beast",
					},
					{
						item: "Uncut Skill Gem (Lvl 11/12)",
						type: "Drop",
						source: "Beast Pen",
					},
					{
						item: "Uncut Support Gem (Lvl 4)",
						type: "Drop",
						source: "Beast Pen",
					},
					{
						item: "Lesser Jeweller's Orb",
						type: "Drop",
						source: "Fossilised Formation",
					},
					{
						item: "Sulphite Infusion Buff",
						type: "Drop",
						source: "Voltaxic Spire",
					},
					{
						item: "Torn Map Piece",
						type: "Drop",
						source: "Flayed Sailor",
					},
					{
						item: "Gemcutter's Prism",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "volcanic-warrens",
				name: "Volcanic Warrens",
				recLevel: "41",
				notes: "",
				pickups: [
					{
						item: "Magic or Rare Ring",
						type: "Drop",
						source: "Kill rare golems in Volcanic Nest Secret",
					},
					{
						item: "Uncut Support Gem (Lvl 4)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "whakapanu-island",
				name: "Whakapanu Island",
				recLevel: "42",
				notes: "",
				pickups: [
					{
						item: "Uncut Support Gem (Lvl 4)",
						type: "Drop",
						source: "Kill rare crab in Crabshell Cavern",
					},
					{
						item: "Torn Map Piece",
						type: "Drop",
						source: "Petrified Pirate",
					},
					{
						item: "Choice of Uncut Skill Gem (Lvl 11), Spirit Gem (Lvl 11), or Support Gem (Lvl 4)",
						type: "Hand-In",
						source: "Return Shark Fin (from Great White One) to Kaimana",
					},
					{
						item: "Artificer's Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "singing-caverns",
				name: "Singing Caverns",
				recLevel: "42",
				notes: "",
				pickups: [
					{
						item: "Rare Pearlescent Amulet",
						type: "Hand-In",
						source: "Return Humming Pearl (from Beckoning Clam) to Rog",
					},
					{
						item: "Magic Charm",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "abandoned-prison",
				name: "Abandoned Prison",
				recLevel: "42",
				notes: "",
				pickups: [
					{
						item: "Permanent +30% Life/Mana Flask Recovery",
						type: "Drop",
						source: "Interact with the Goddess of Justice statue",
					},
					{
						item: "Room full of gear",
						type: "Drop",
						source: "Unlock The Armoury",
					},
					{
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "solitary-confinement",
				name: "Solitary Confinement",
				recLevel: "42",
				notes: "",
				pickups: [
					{
						item: "Rune",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "kedge-bay",
				name: "Kedge Bay",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Torn Map Piece",
						type: "Drop",
						source: "Open Dead Man's Chest",
					},
					{
						item: "Lesser Jeweller's Orb",
						type: "Drop",
						source: "Open chest in Abandoned Ship",
					},
					{
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "shrike-island",
				name: "Shrike Island",
				recLevel: "43",
				notes: "Contains the Matiki quest reward",
				pickups: [
					{
						item: "Torn Map Piece",
						type: "Drop",
						source: "Interact with Corpse Nest",
					},
					{
						item: "Plunder's Point (Expedition mechanic) Unlock",
						type: "Hand-In",
						source: "Return all four Torn Map Pieces to Makoru",
					},
					{
						item: "Uncut Support Gem (Lvl 4)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "eye-of-hinekora",
				name: "Eye of Hinekora",
				recLevel: "44",
				notes: "",
				pickups: [
					{
						item: "Permanent +5% Maximum Mana",
						type: "Drop",
						source: "Pay Respects at the Silent Hall (Navali's Rest)",
					},
					{
						item: "Chaos Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "halls-of-the-dead",
				name: "Halls of the Dead",
				recLevel: "44",
				notes: "",
				pickups: [
					{
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source: "Defeat Yama the White and speak to Navali",
					},
					{
						item: "3x Permanent Attributes or Resistances",
						type: "Drop",
						source:
							"Complete the 3 Ancestral Tattoo trials (Tawhoa, Tasalio, Ngamahu)",
					},
					{
						item: "Random Items*",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "arastas",
				name: "Arastas",
				recLevel: "46",
				notes: "",
				pickups: [
					{
						item: "3 Regal Orbs",
						type: "Drop",
						source: "Morning bell in the Town Square",
					},
					{
						item: "3 Exalted Orbs",
						type: "Drop",
						source: "Evening bell at the Cliffside",
					},
					{
						item: "Uncut Skill Gem (Level 12)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-excavation",
				name: "The Excavation",
				recLevel: "46",
				notes: "Great XP zone",
				pickups: [
					{
						item: "Rare Amulet",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "ngakanu",
				name: "Ngakanu",
				recLevel: "47",
				notes: "",
				pickups: [
					{
						item: "Greater Jeweller's Orb, Abyssal Depths",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "heart-of-the-tribe",
				name: "Heart of the Tribe",
				recLevel: "47",
				notes: "",
				pickups: [
					{
						item: "Random loot",
						type: "Drop",
						source: "Open the Meeting House",
					},
					{
						item: "Uncut Spirit Gem (Level 12)",
						type: "Drop",
						source: "League event",
					},
				],
			},
		],
	},
	{
		id: "interlude-locations",
		title: "Interlude Locations",
		areas: [
			{
				id: "scorched-farmlands",
				name: "Scorched Farmlands",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Uncut Support Gem (Level 4)",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "stones-of-serle",
				name: "Stones of Serle",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Exalted Orb, Abyss Currency",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-blackwood",
				name: "The Blackwood",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Random Omen",
						type: "Drop",
						source: "Interact with Omen Altars",
					},
					{
						item: "Greater Orb of Transmutation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "holten",
				name: "Holten",
				recLevel: "0",
				notes:
					"Can buy cheap Greater Runes from Soul of the Ferryman standing by the docks",
				pickups: [
					{
						item: "Armourer's Scrap, magic and rare loot",
						type: "Drop",
						source: "Defeat Sigbert and Godwin at the Psalm of Blood",
					},
					{
						item: "Greater Rune",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "wolvenhold",
				name: "Wolvenhold",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source: "Defeat Oswin, consume Warden's Ledger",
					},
					{
						item: "Greater Orb of Augmentation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "holten-estate",
				name: "Holten Estate",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Artificer's Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-khari-crossing",
				name: "The Khari Crossing",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source: "Defeat Akthi and Anundr, speak to Risu",
					},
					{
						item: "Permanent +5% Maximum Life",
						type: "Drop",
						source: "Interact with the Molten Shrine in the zone",
					},
					{
						item: "Gemcutter's Prism",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "pools-of-khatal",
				name: "Pools of Khatal",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Orb of Alchemy",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "sel-khari-sanctuary",
				name: "Sel Khari Sanctuary",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "2 out of 3 reward: Rare Ring, Rare Amulet, Rare Jewel",
						type: "Drop",
						source:
							"Place Yoon's Barya and Rangeen's Barya into opposing altars",
					},
					{
						item: "Orb of Chance",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-galai-gates",
				name: "The Galai Gates",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Greater Orb of Augmentation, Abyss Currency",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "qimah",
				name: "Qimah",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Choice of 1 of 7 Buffs",
						type: "Drop",
						source: "Interact with Orbala's Pillar in Qimah",
					},
					{
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "qimah-reservoir",
				name: "Qimah Reservoir",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Random currency item",
						type: "Hand-In",
						source: "Fill Sacred Wells with Vial of Sacred Water",
					},
					{
						item: "Greater Orb of Transmutation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "ashen-forest",
				name: "Ashen Forest",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Uncut Skill Gem (Lvl 14)",
						type: "Drop",
						source: "Interact with the Ancient Monument",
					},
					{
						item: "Rare Belt",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "kriar-village",
				name: "Kriar Village",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Permanent +40 Maximum Spirit + Uncut Spirit Gem (Lvl 14)",
						type: "Drop",
						source: "Kill Lythara, The Wayward Spear in Kriar Village",
					},
					{
						item: "Greater Rune, Abyss Currency",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "glacial-tarn",
				name: "Glacial Tarn",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Greater Orb of Augmentation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "howling-caves",
				name: "Howling Caves",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "2 Weapon Set Passive Skill Points",
						type: "Hand-In",
						source:
							"Kill The Abominable Yeti in the Howling Caves, speak to Hilda",
					},
					{
						item: "Chaos Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "kriar-peaks",
				name: "Kriar Peaks",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Choose Unique Item",
						type: "Hand-In",
						source: "Talk to Elder Madox in Kriar Peaks",
					},
					{
						item: "Greater Orb of Transmutation",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "etched-ravine",
				name: "Etched Ravine",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Exalted Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "the-cuachic-vault",
				name: "The Cuachic Vault",
				recLevel: "0",
				notes: "",
				pickups: [
					{
						item: "Vaal Orb",
						type: "Drop",
						source: "League event",
					},
				],
			},
			{
				id: "interlude-finale-kingsmarch-hub",
				name: "Interlude Finale (Kingsmarch Hub)",
				recLevel: "0",
				notes: "",
				pickups: [
					{
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
