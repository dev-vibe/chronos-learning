# Content Organization

Content is organized by **era** (chronological) and **unit** (thematic/conceptual).

## Structure

```
data/eras/
  prelude/              (12,000 - 4000 BCE: End of Ice Age)
    climate_transition.ts
  
  foundations/          (4000 - 1000 BCE: Bronze Age, First Cities)
    agriculture.ts              # Farming revolution, domestication
    mesopotamia_cities.ts       # Sumer, Uruk, cuneiform, ziggurats
    egypt_kingdoms.ts           # Pyramids, pharaohs, hieroglyphs
    levant_bronze_age.ts        # Phoenicians, early monotheism, trade
    asia_early_civilizations.ts # Indus Valley, Shang Dynasty
    europe_bronze_age.ts        # Stonehenge, Bronze Age Europe
    americas_africa_early.ts    # Olmec, Kerma, early migrations
  
  classical/            (1000 BCE - 500 CE: Empires, Philosophy)
    greece_golden_age.ts        # Athens, democracy, Olympics, theater
    rome_republic_empire.ts     # Republic, Caesar, Pax Romana
    persian_empires.ts          # Cyrus, Darius, Zoroastrianism
    judaism_diaspora.ts         # David, Solomon, exile, diaspora
    americas_classical.ts       # Maya, Teotihuacan
```

## Philosophy

### Why era folders?
- Matches the app's core `ERAS` structure in `constants.ts`
- Students navigate by era in the UI
- Clear chronological boundaries

### Why thematic unit files?
- **Avoids the "Greece vs Rome" trap**: content grouped by concept, not arbitrary geography
- **Flexible**: a unit can span regions if the theme demands (e.g., "Silk Road trade")
- **Pedagogical**: units represent learning arcs ("The Bronze Age Collapse", "The Axial Age")
- **Scalable**: add units without restructuring folders

### What about tags?
Tags (`Military`, `Philosophy`, `Science`, etc.) remain for **cross-era discovery**. Units are for **authoring/teaching flow**.

## Adding Content

1. Pick the era folder (`prelude`, `foundations`, `classical`, etc.)
2. Create or edit a unit file (e.g., `new_unit.ts`)
3. Export a `Record<nodeId, NodeContent>`
4. Done—content auto-loads into the app

No central registry needed. Reorganize freely.
