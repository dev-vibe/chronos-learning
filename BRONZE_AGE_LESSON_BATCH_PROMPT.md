# Bronze Age Lesson Batch Prompt

Use this prompt in a new AI thread to continue the Bronze Age expansion in batches of exactly 3 lessons.

## Current Progress

Completed through item: 3
Next batch: items 4-6

## Full Bronze Age Expansion Queue

1. `proto_elamite_susa` - Proto-Elamite Susa & Early Iranian Cities, c. 3200 BCE, Iran/Elam, `['Literature', 'Politics']`
2. `cycladic_culture` - Cycladic Island Culture, c. 2800 BCE, Aegean Islands, `['Art', 'Exploration']`
3. `caral_norte_chico` - Caral: Andean Cities Without Pottery, c. 2600 BCE, Peru, `['Politics', 'Science']`
4. `ebla_archives` - Ebla Palace Archives, c. 2400 BCE, Syria, `['Literature', 'Politics']`
5. `magan_dilmun_trade` - Magan, Dilmun & Gulf Copper Trade, c. 2300 BCE, Persian Gulf/Oman, `['Exploration', 'Science']`
6. `oxus_civilization` - Oxus Civilization / BMAC, c. 2200 BCE, Central Asia, `['Art', 'Politics']`
7. `el_argar` - El Argar and Iberian Bronze Age, c. 2200 BCE, Iberia, `['Military', 'Politics']`
8. `sintashta_chariots` - Sintashta Chariots and Steppe Warfare, c. 2000 BCE, Eurasian Steppe, `['Military', 'Science']`
9. `bronze_age_trade` - Bronze Age Global Trade Networks, c. 2000 BCE, Eurasia, `['Exploration', 'Politics']`
10. `seima_turbino` - Seima-Turbino Bronze Network, c. 1900 BCE, Siberia/Central Asia, `['Science', 'Exploration']`
11. `erlitou` - Erlitou and Early Chinese Bronze States, c. 1900 BCE, China, `['Politics', 'Art']`
12. `unetice_nebra` - Unetice Culture and the Nebra Sky Disk, c. 1800 BCE, Central Europe, `['Science', 'Religion']`
13. `mari_letters` - Mari and the Palace Letter Network, c. 1800 BCE, Syria/Mesopotamia, `['Literature', 'Politics']`
14. `nuragic_sardinia` - Nuragic Sardinia and Tower Societies, c. 1700 BCE, Sardinia, `['Art', 'Politics']`
15. `kassite_babylon` - Kassite Babylon After Hammurabi, c. 1595 BCE, Babylon, `['Politics', 'Military']`
16. `steppe_metallurgy` - Steppe Metallurgy and Semiyarka, c. 1600 BCE, Kazakhstan, `['Science', 'Exploration']`
17. `mitanni` - Mitanni Horse Kingdom, c. 1500 BCE, Syria/Northern Mesopotamia, `['Military', 'Politics']`
18. `early_vedic_societies` - Early Vedic Societies in South Asia, c. 1500 BCE, South Asia, `['Religion', 'Literature']`
19. `alashiya_cyprus` - Alashiya/Cyprus: Copper Island, c. 1450 BCE, Cyprus, `['Science', 'Exploration']`
20. `canaanite_city_states` - Canaanite City-States and Amarna Letters, c. 1400 BCE, Levant, `['Politics', 'Literature']`
21. `ugarit` - Ugarit and Alphabetic Cuneiform, c. 1400 BCE, Syria, `['Literature', 'Science']`
22. `bronze_age_textiles` - Bronze Age Textile Revolution, c. 1500 BCE, Eurasia, `['Science', 'Art']`
23. `sanxingdui` - Sanxingdui Bronze Culture, c. 1200 BCE, China, `['Art', 'Religion']`
24. `philistines` - Philistines and the Post-Collapse Levant, c. 1175 BCE, Levant, `['Politics', 'Military']`

## Instructions for the Next AI Thread

You are helping build Chronos Learning Terminal, a gamified world-history curriculum for students ages 11-14. Continue the Bronze Age expansion from the current repo state.

Before writing content:
- Inspect `constants.ts` and confirm all 24 queue ids exist as timeline stubs.
- Inspect `data/eras/foundations/near_east_bronze_age.ts`, `data/eras/foundations/europe_bronze_age.ts`, and `data/eras/foundations/americas_africa_early.ts` to see the completed first batch.
- Inspect `types.ts`, `LESSON_CREATION_STARTER_PROMPT.md`, `NODE_RESEARCH_RUNBOOK.md`, and nearby existing lessons.
- Preserve unrelated dirty worktree changes.

Create exactly the next 3 unfinished lessons from the queue:
- Use the `Next batch` marker above to identify the range.
- For the current marker, create items 4-6: `ebla_archives`, `magan_dilmun_trade`, and `oxus_civilization`.
- Do not create later lessons in the same turn.

For each lesson:
- Use the existing `NodeContent` schema.
- Write a vivid 3-4 paragraph summary for ages 11-14.
- Include `funFact`, 2-4 people, 1-3 inventions, 1-3 places, 3-5 direct resource URLs, and a quiz with 7-10 questions.
- Include 4-6 `collectibleCards` with valid indices.
- Use direct `url` fields in resources. Do not use `searchQuery`.
- Add image candidates for collectible-worthy people, inventions, and places, preferring museum, university, public-domain, open-access, or official project sources.
- Weave in recent discoveries where relevant, but keep the lesson centered on the historical node rather than on modern news.

After creating the batch:
- Run `npm.cmd run build`.
- Verify the 3 new lesson ids have `NodeContent`.
- Verify no `searchQuery` appears in the 3 new lessons.
- Verify collectible card indices point to valid entries.
- Update this file's progress markers:
  - `Completed through item: 6`
  - `Next batch: items 7-9`

When later batches finish, keep advancing the two progress lines by 3 items.
