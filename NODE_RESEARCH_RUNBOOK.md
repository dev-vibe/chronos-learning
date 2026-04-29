# Node Research & Content Creation Runbook

This runbook is for creating Chronos Learning timeline nodes: compact, visual, story-rich history lessons for preteens ages 11-13.

The goal is not "school report, but shorter." The goal is a lesson a kid can remember two weeks later because it gave them a vivid object, a strange problem, a real person, a place they can picture, and a clean explanation of why the moment mattered.

## Table of Contents

1. [Mission](#mission)
2. [Data Model](#data-model)
3. [Research Standard](#research-standard)
4. [Wonder Without Nonsense](#wonder-without-nonsense)
5. [Content Recipe](#content-recipe)
6. [Project Coverage Priorities](#project-coverage-priorities)
7. [Image Sourcing](#image-sourcing)
8. [File Organization](#file-organization)
9. [Quality Checklist](#quality-checklist)
10. [Example Node Standard](#example-node-standard)

---

## Mission

Chronos should make history feel like a live investigation.

Every node should answer four questions:

- **What happened?** Give the actual event, discovery, invention, conflict, artwork, system, or turning point.
- **Why did it happen then?** Explain the pressures: climate, geography, technology, trade, faith, ambition, disease, food, money, fear, curiosity.
- **What changed afterward?** Show the consequence chain, not just "it was important."
- **What will stick?** Give the learner a memorable object, scene, phrase, or puzzle.

### Audience

Write for curious 11-13 year olds who are smart enough for complexity but allergic to textbook fog.

They tend to remember:

- A specific artifact: "a 4,500-year-old mosaic box from Ur."
- A strange constraint: "tin and copper almost never occur in the same place."
- A human decision: "Hatshepsut sent ships to Punt instead of launching another war."
- A mystery with boundaries: "We know the site is real; we do not know exactly what every ritual meant."
- A modern connection: "LiDAR lets archaeologists erase tree cover digitally, revealing cities hidden under jungle."

They tend to forget:

- Lists of rulers.
- Generic claims that something "changed the world."
- Abstract values with no physical example.
- "Some people say..." speculation with no evidence ranking.

### Voice

Use a confident field-report style: clear, concrete, sometimes dramatic, but not breathless. The app already has a "learning terminal" feel, so the writing can use words like "signal," "archive," "field note," and "evidence," but the history itself should stay human.

Good:

> A pyramid was not just a tomb. It was a national project: stonecutters, boat crews, scribes, rope makers, bakers, brewers, doctors, and surveyors all working in sync beside the Nile.

Weak:

> The pyramids were significant because they demonstrated advanced civilization and had a major impact on Egyptian culture.

---

## Data Model

Each timeline node requires a `NodeContent` object.

```typescript
interface NodeContent {
  summary: string;
  funFact: string;
  people: HistoricalPerson[];
  inventions: Invention[];
  places: Place[];
  resources: Resource[];
  quiz?: Quiz;
}
```

### HistoricalPerson Card

Use people cards like trading cards. The "person" can be a named individual, a known role, or a representative worker if the node needs ordinary people.

```typescript
{
  name: string;
  role: string;
  category: 'Philosopher' | 'Leader' | 'Scientist' | 'Villain' | 'Hero' |
    'Artist' | 'Other' | 'Military' | 'Explorer' | 'Worker' | 'Priest' |
    'Commoner' | 'Warrior' | 'Athlete' | 'Mythical' | 'Poet';
  description: string;
  imageUrl?: string;
  imageFit?: 'cover' | 'contain';
  born?: string;
  died?: string;
  nationality?: string;
  achievements?: string[];
  legacy?: string;
}
```

Card rules:

- Include 2-4 people per node only when the lesson has real historical actors or historically grounded roles.
- Mix famous decision-makers with builders, scribes, traders, artists, engineers, sailors, farmers, witnesses, or opponents when those people or roles truly belong to the historical moment.
- If no named person is known, use a role card only when the role is historically grounded and central to the lesson, like "The Seal Carver," "A Palace Scribe," or "The Dog Handler."
- Do not create modern researcher/source-author cards. Modern scholars belong in resources, research notes, or the field report.
- Do not force a people section. If there are no known historical players or grounded historical roles, use `people: []` and let the UI omit the section.
- Do not invent a "representative" player just to fill space. If the role would not feel like a real participant in the lesson, leave it out.
- Avoid fake certainty. Use "unknown" or omit dates when unknown.
- For mythical or semi-legendary figures, set `category: 'Mythical'` and explain what is historical, legendary, or debated.

### Invention Card

Use these as "tech blueprint" cards, not a list of objects.

```typescript
{
  name: string;
  description: string;
  category: string;
  imageUrl?: string;
  imageFit?: 'cover' | 'contain';
  problem?: string;
  solution?: string;
  impact?: string;
  date?: string;
}
```

What counts as an invention:

- Tools, materials, weapons, vehicles, food systems, maps, writing systems, medicines.
- Social technologies: law codes, money, bureaucracy, postal roads, exams, universities, insurance.
- Methods: LiDAR survey, radiocarbon dating, stratigraphy, double-entry bookkeeping.
- Use invention cards only for historical technologies, systems, or methods in the lesson's period. Modern research methods may appear only when the node is about a modern discovery.
- Do not turn a hypothesis, research model, or source author's reconstruction into an invention card unless the lesson clearly marks it as a model and it is not used as a reward card.

Every invention card should use:

- **Problem:** What limitation existed?
- **Solution:** What did people do differently?
- **Impact:** What became possible, easier, faster, bigger, safer, or more dangerous?

### Place Card

Places anchor the story physically.

```typescript
{
  name: string;
  description: string;
  imageUrl?: string;
  imageFit?: 'cover' | 'contain';
  significance?: string;
  location?: string;
  lore?: string;
}
```

Place rules:

- Include 1-3 places per node only when the lesson has real places worth anchoring.
- Place card names must be actual locations by name, not artifacts, peoples, object categories, or research claims.
- Prefer specific sites over giant regions: "Hawara, Fayum, Egypt" beats "Egypt."
- Use coordinates-style specificity when useful: "near modern Sanliurfa, southeastern Turkey."
- `lore` is for strange but grounded details: excavation drama, inscriptions, mistaken identities, shipwreck cargo, hidden rooms, old legends, or what archaeologists still cannot explain.
- If the evidence is an artifact, name the place where it was found, not the artifact itself. Example: use "Bronocice" as the place card, and describe the Bronocice pot inside it.

### Resource Card

```typescript
{
  title: string;
  type: 'Video' | 'Podcast' | 'Article' | 'Activity';
  url: string;
  isCore: boolean;
  description?: string;
}
```

Resource rules:

- Include 3-4 resources.
- At least 2 should be core resources.
- For every node, actively look for at least one strong video. If no video passes the quality bar, do not force one; use an article, activity, or podcast and note the gap in research notes.
- Prefer museums, universities, peer-reviewed/open access articles, official archives, public broadcasters, and specialist educators.
- For YouTube, use direct video URLs and append `&rel=0` if the URL already has `?v=`, or `?rel=0` if it has no query string.
- Never use the legacy `searchQuery` field for new content.
- Avoid ad-heavy, sensational, partisan, or AI-content-farm sources.

### Video Source Priority

Good videos are especially valuable for this project because many learners will remember a moving map, artifact close-up, reconstruction, or vivid narrator before they remember a paragraph. Treat video search as part of every lesson, not an optional polish step.

Use this priority order.

#### Tier 1: Best Core Video Candidates

These are usually safe to check first:

- **Crash Course World History / US History / Big History:** Excellent high-energy overviews. Existing lessons already use it for the Agricultural Revolution, Persian Empire, Indus Valley, and Bronze Age Collapse. Caveat: it is fast and sometimes assumes background knowledge, so use it as an overview or reinforcement, not the only source.
- **PBS NOVA:** Strong for archaeology, engineering, genetics, climate, ancient technology, and scientific discovery. Existing lessons use NOVA for dog domestication and the Great Pyramid.
- **Khan Academy / Smarthistory:** Clear, classroom-safe explainers for art, archaeology, religion, world history, and primary objects. Good core option when Crash Course is too frantic.
- **TED-Ed:** Short, polished animated lessons. Best for big concepts, myths, inventions, philosophy, and science-adjacent history.
- **Official museum and archive channels:** British Museum, The Met, Smithsonian, Louvre, Getty, Penn Museum, Field Museum, Ashmolean, National Museum of African American History and Culture, Library of Congress, National Archives.
- **Public broadcasters and education divisions:** BBC, BBC Teach, PBS LearningMedia, NPR-style education videos, DW Documentary when age-appropriate.

#### Tier 2: Good Deep-Dive Candidates

These can be excellent, but they are often longer or more advanced:

- **Fall of Civilizations:** Superb long-form storytelling for collapses and ancient worlds. Use as a podcast/deep dive, usually not the only core resource for 11-13 year olds.
- **Tides of History:** Strong narrative context for prehistory, antiquity, and systems change. Often best as an advanced resource.
- **BBC In Our Time:** Expert audio discussions. Great for researcher background and advanced learners, but usually too dense as the first student-facing source.
- **History Hit:** Often expert-led and visually rich, especially for ancient and medieval topics. Check whether the specific video is free, not paywalled, and age-appropriate.
- **National Geographic:** Strong visuals and exploration framing. Check paywalls and rights; use as a resource link when accessible.

#### Tier 3: Use Selectively

These can work well for engagement, maps, or military/event explanation, but must be watched carefully before marking `isCore: true`:

- **Overly Sarcastic Productions:** Engaging for myths, literature, and broad history, but comedic tone can blur nuance. Best for supplementary use after vetting.
- **Extra History / Extra Credits:** Accessible narrative series, but sometimes dramatized or simplified. Check against authority sources.
- **Kings and Generals, Invicta, Historia Civilis:** Useful for animated maps, battles, and political systems. Watch for violence level, complexity, sponsor segments, and whether the framing fits preteens.
- **Oversimplified:** Memorable and funny, but often too meme-heavy or simplified for a core learning source. Use rarely and only when the episode is accurate, age-appropriate, and paired with stronger sources.

#### Avoid For Student Resources

- Conspiracy archaeology or "forbidden history" channels.
- Content whose main hook is aliens, hidden civilizations, "mainstream historians hate this," or impossible ancient technology.
- Reaction videos, uncredited AI documentaries, faceless narration channels, and content-farm channels.
- Videos with graphic violence, profanity-heavy comedy, sexualized thumbnails, or hostile political framing.
- Videos that are mostly vibes, stock footage, or unsourced claims.

### Video Search Workflow

For each node, run searches in this order:

1. Exact topic + trusted source:
   - `"Gobekli Tepe" "Khan Academy"`
   - `"Hatshepsut" "PBS NOVA"`
   - `"Cyrus the Great" "Crash Course"`
   - `"Maya LiDAR" "National Geographic"`
2. Topic + format:
   - `"Hammurabi code explained students"`
   - `"Indus Valley civilization for middle school"`
   - `"Bronze Age collapse documentary kids"`
3. Site or channel search:
   - `site:youtube.com "Crash Course World History" "Persian Empire"`
   - `site:pbs.org NOVA "Great Pyramid"`
   - `site:khanacademy.org "Pyramids of Giza"`
4. If direct videos are weak, look for museum videos:
   - `British Museum [artifact] video`
   - `Met Museum [artist/artifact] video`
   - `Smithsonian [topic] video`

When you find a candidate, watch or skim enough to verify:

- The first 60 seconds are appropriate and not clickbait.
- The main explanation agrees with authoritative sources.
- It has useful visuals: maps, artifacts, site footage, animation, or primary-source closeups.
- It is short enough for the role: 5-15 minutes ideal for core, 15-30 acceptable, 30+ usually deep dive.
- The narrator's pace works for 11-13 year olds, or the description can warn that it is fast/advanced.
- Sponsor reads, jokes, or side tangents do not overwhelm the lesson.
- The title and thumbnail are school-safe.

### Video Resource Placement

Use `isCore: true` for a video only when it directly supports the node's main story and is suitable for the target learner.

Good resource set:

```typescript
resources: [
  {
    title: "The Agricultural Revolution - Crash Course World History #1",
    type: "Video",
    url: "https://www.youtube.com/watch?v=Yocja_N5s1I&rel=0",
    isCore: true,
    description: "Fast, funny 11-minute overview of farming, domestication, and the trade-offs of settled life. Best watched after reading the field report or at 0.75 speed."
  },
  {
    title: "Catalhoyuk Research Project - Site Overview",
    type: "Article",
    url: "https://www.catalhoyuk.com/",
    isCore: true,
    description: "Official excavation project source for the settlement's layout, art, burials, and current research questions."
  },
  {
    title: "The Neolithic Revolution - National Geographic",
    type: "Article",
    url: "https://www.nationalgeographic.com/culture/article/neolithic-agricultural-revolution",
    isCore: false,
    description: "Visual overview of how agriculture changed food, settlement, inequality, and population growth."
  }
]
```

Bad resource set:

```typescript
resources: [
  {
    title: "Ancient Mystery PROVES Lost Super Civilization",
    type: "Video",
    url: "https://www.youtube.com/watch?v=...",
    isCore: true,
    description: "Exciting video about what they do not teach in school."
  }
]
```

For advanced videos or podcasts, include a description that tells learners how to use it:

- "Watch minutes 4-13 for the pyramid worker village."
- "Long deep dive; best for learners who want the full collapse story."
- "Advanced audio discussion; useful after the lesson, not before."

### Quiz

```typescript
{
  title: string;
  description?: string;
  questions: QuizQuestion[];
  collectibleCards?: CollectibleCardRef[];
}
```

Quiz rules:

- Include 3-5 questions for most nodes.
- Use one factual question, one cause/effect question, one interpretation question, and one image/artifact/location question when possible.
- Explanations should teach one extra detail, not merely say "Correct."
- Unlock cards from the lesson content, usually 3-5 cards.
- Reward cards should default to historical figures and inventions/technologies only. Do not unlock modern researchers, contrived placeholders, or vague artifacts.
- Location reward cards are opt-in. Ask the user before adding any location reward card, even if the location is strong; the user may manually approve exceptional locations such as Giza during creation.
- Reward cards must come from real displayed content and should feel collectible. Use fewer cards rather than padding with weak entries.

---

## Research Standard

Use a three-layer source stack.

### Layer 1: Orientation

Use fast overview sources to understand the shape of the topic:

- Encyclopaedia Britannica
- World History Encyclopedia
- Khan Academy
- museum overview pages
- Wikipedia only as a map to better sources, not as final authority

### Layer 2: Authority

Use at least two authority sources for the factual core:

- museum collection pages: Met, British Museum, Louvre, Smithsonian, Penn Museum, Field Museum
- university or excavation project pages
- peer-reviewed articles, preferably open access
- official heritage bodies: UNESCO, National Park Service, Historic England, Turkish Ministry of Culture, Egyptian Ministry of Tourism and Antiquities
- primary sources in translation: inscriptions, letters, law codes, chronicles, oral histories, speeches

### Layer 3: Teaching Assets

Find material that makes the node visual and memorable:

- open-license artifact photos
- maps
- site photos
- short videos
- reconstructions from reputable institutions
- interactive maps or museum activities

### Required Research Notes

Before writing, create a private research note with:

- Node ID, title, date, era, region, and tags from `constants.ts`.
- 5-8 bullet timeline of what happened.
- 3 source URLs with one-line notes.
- 1-3 video candidates checked, with a note on why the winner was chosen or why no video passed.
- 3 potential card images with source page and license.
- 3 "sticky details" a kid might repeat later.
- 1 evidence warning: what is debated, uncertain, or often exaggerated?

These notes do not need to ship in code, but the finished node should clearly reflect them.

---

## Wonder Without Nonsense

This project should absolutely include discoveries that make students feel the human story is bigger, older, stranger, and more inventive than they assumed. But it must not blur the line between evidence and internet mythology.

Use this evidence ladder.

### Green: Use Confidently

Evidence is well established by multiple credible sources.

Examples:

- The Younger Dryas was a real, abrupt return to colder conditions after warming had begun.
- Gobekli Tepe is a very early monumental ritual site built by hunter-gatherer or transitional communities before large settled cities.
- Ancient Egyptian stone vessels are real and often show astonishing craftsmanship.
- LiDAR has revealed previously unknown or underestimated ancient urban landscapes in Maya and Amazonian regions.

### Yellow: Use With Care

Evidence is real, but interpretation is debated.

Examples:

- Younger Dryas causes: meltwater routing, ocean circulation shifts, and impact hypotheses are discussed; do not present one debated cause as settled.
- Gobekli Tepe meaning: "temple," "ritual center," and "feasting site" are interpretations; avoid claiming we know the full belief system.
- Hawara labyrinth: ancient authors described a vast structure; archaeology has found remains, but modern claims about huge intact underground chambers need careful sourcing.
- Egyptian stone vases: precise stoneworking is impressive; specific claims about lost high technology require evidence, not vibes.

### Red: Do Not Present As Fact

These can be mentioned only as misconceptions if the node is explicitly teaching evidence literacy.

- Aliens built ancient monuments.
- Atlantis or a lost global super-civilization is proven.
- Ancient people "could not have" made difficult artifacts.
- A single discovery "proves everything historians know is wrong."
- Viral claims based only on YouTube, TikTok, anonymous maps, or unsourced diagrams.

### How To Write Story-Changing Discoveries

Use this frame:

1. **The old assumption:** What did many people used to think?
2. **The discovery:** What was found, when, where, and by whom?
3. **The evidence:** What physical data changed the picture?
4. **The new picture:** What do historians or archaeologists now think?
5. **The open question:** What is still unknown?

Example:

> Gobekli Tepe did not prove that aliens or a lost empire built civilization. It did something more interesting: it showed that hunter-gatherer communities could organize huge stone-building projects before farming villages became cities. That flips a simple old story - "first farming, then temples" - into a better question: what if shared rituals helped pull people into larger communities?

### Language To Prefer

- "This complicates the old story..."
- "Archaeologists now think..."
- "The evidence suggests..."
- "One leading explanation is..."
- "Still debated..."
- "No one has found evidence for..."

### Language To Avoid

- "Historians are hiding..."
- "Scientists cannot explain..."
- "This proves everything is wrong..."
- "Mainstream archaeology refuses to admit..."
- "Impossible with ancient tools..."

---

## Content Recipe

### Step 1: Identify The Node

Check `constants.ts` and copy:

- `id`
- `title`
- `year`
- `eraId`
- `region`
- `tags`

Example:

```typescript
{ id: 'maya_lidar', title: 'LiDAR Reveals Hidden Maya Cities', year: '2018 CE', eraId: 'modern', region: 'Mesoamerica', tags: ['Science', 'Exploration'] }
```

### Step 2: Pick The Core Story Shape

Every node should have one primary shape:

- **Breakthrough:** A tool, method, or idea unlocks a new possibility.
- **Collision:** Two systems meet: armies, religions, trade worlds, empires, diseases, technologies.
- **Mystery:** Evidence exists, but meaning or cause is partly unresolved.
- **System:** A new way of organizing people changes daily life.
- **Collapse:** A complex world fails under pressure.
- **Voice:** A person, text, artwork, or speech changes what people can imagine.

Write the node around that shape. Do not try to make every node an all-purpose encyclopedia entry.

### Step 3: Build The Memory Hook

Pick one "anchor object" before drafting.

Examples:

- Younger Dryas: a sudden cold snap written into ice cores and lake sediments.
- Gobekli Tepe: T-shaped stone pillars carved with animals.
- Uruk: clay tablets that began as receipts.
- Egypt stone vases: hard stone vessels with tiny openings and smooth interiors.
- Hawara: a ruined pyramid complex tied to ancient reports of a vast labyrinth.
- Bronze Age trade: oxhide copper ingots from a shipwreck.
- Maya LiDAR: laser maps that reveal roads and platforms beneath forest.

The anchor object should appear in the summary, at least one card, and ideally one quiz question.

### Step 4: Write The Summary

Target 400-650 words, usually 3-5 paragraphs.

Paragraph pattern:

1. **Hook and world before:** Put the learner in a scene. What would they see, hear, carry, fear, or need?
2. **Pressure:** What problem was building?
3. **Action/discovery/change:** What happened? Who made decisions? What tool or event mattered?
4. **Consequence:** What changed immediately?
5. **Legacy/open question:** Why it matters now, and what historians still debate.

Style rules:

- Use active voice.
- Explain technical terms in context.
- Keep sentences varied but not tangled.
- Prefer concrete nouns over abstractions.
- Include dates, but do not make the paragraph a date parade.
- Let hard topics be honest without becoming graphic.
- Avoid modern political dunking, culture-war framing, or moral performance. Teach the event clearly and fairly.

### Step 5: Write The Fun Fact

The fun fact should be a "tell your friend" detail.

Good types:

- Strange artifact detail.
- Unexpected scale.
- A word origin.
- A record: oldest, largest, first known, deepest, fastest, longest.
- A discovery story.
- A surprising daily-life detail.

Bad types:

- "This was very important."
- A statistic with no image.
- Repeating the first sentence of the summary.
- Speculation disguised as a reveal.

### Step 6: Create Cards

Minimum:

- 2 people
- 1 invention
- 1 place

Preferred:

- 3 people
- 2 inventions
- 2 places

For nodes with no obvious named people, use role cards:

- The Ice-Core Scientist
- The Natufian Forager
- The Quarry Worker
- The Palace Scribe
- The Caravan Broker
- The Ship's Pilot
- The LiDAR Mapper

### Step 7: Create Resources

Use 3-4 resources:

- 1 accessible video whenever a strong one exists
- 1 authoritative article or museum page
- 1 deeper article, podcast, or activity
- 1 optional "advanced" source when the node is complex

For discoveries and archaeology, include at least one source that shows the evidence directly: artifact page, site page, excavation report, scan map, open access article, or museum collection record.

Video rule: search for a good video for every lesson. Start with the priority list above, then widen only if those fail. A fast but reliable overview like Crash Course can be core if paired with an authority source; a beautiful but speculative video should not be used at all.

### Step 8: Create Quiz

Question mix:

- **Recall:** What was discovered/invented/done?
- **Cause:** Why did it happen?
- **Evidence:** What artifact/site/source tells us this?
- **Impact:** What changed afterward?
- **Boundary:** What is still debated or what should we not claim?

Use plausible distractors. Bad distractors teach nothing.

### Step 9: Advance Demo Progress

After the lesson is fully fleshed out, buildable, and marked complete in `CONTENT_TODO.md`, bump the demo profile progress constant:

```typescript
export const DEMO_PROFILE_COMPLETED_THROUGH_NODE_ID = 'node_id_here';
```

Location: `services/gamification.ts`.

This one constant controls the default demo learner state:

- completed nodes through that point in chronological order
- XP, using `100 XP` per completed node
- level, based on fully completed eras
- default collectible rewards/artifacts, derived from every completed lesson through that node that defines `quiz.collectibleCards`

Only set it to the latest lesson that should count as already finished. The app will open the next unlocked unfinished lesson automatically, and the demo user's artifacts/cards should include all collectible rewards from previous completed lessons.

---

## Project Coverage Priorities

Chronos already covers a broad timeline in `constants.ts`. Make it stronger by ensuring each era has a balanced mix of power, daily life, ideas, technology, art, trade, and discovery.

### Prelude and Foundations

This is where the project can shine. Students often get a thin "cavemen to farming" story; Chronos should show deep human intelligence before empires.

High-value angles:

- Younger Dryas and climate shocks.
- Gobekli Tepe and early monumental ritual life.
- Natufian communities, Jericho, Catalhoyuk, and the messy transition to farming.
- Domestication as partnership and control: dogs, sheep/goats, cattle, horses.
- Egyptian stoneworking, hieroglyphs, state formation, pyramids, and logistics.
- Mesopotamian accounting, cities, temples, beer, seals, and contracts.
- Indus urban planning, drains, weights, undeciphered script.
- Bronze Age trade as a connected world, not isolated kingdoms.
- Nubia/Kerma, Olmec centers, Shang oracle bones, and Bantu migrations.

Add "discovery lens" where appropriate:

- Ancient DNA.
- Ice cores and lake sediments.
- Ground-penetrating radar and magnetometry.
- Underwater archaeology.
- LiDAR.
- Experimental archaeology: how people test ancient tools without assuming ancient people were helpless.

### Classical Antiquity

Avoid making this just Greece and Rome.

Balance:

- Mediterranean: Greece, Rome, Persia, Judea, Egypt.
- South Asia: Buddha, Mauryan Empire, Ashoka, Gupta math/science.
- East Asia: Confucius, Qin/Han statecraft, Silk Road, paper.
- Africa: Meroe, Aksum if added later, Nile and Red Sea trade.
- Americas: Chavin, Teotihuacan, Maya science and city-building.

### Medieval World

Make the medieval era feel connected and inventive.

Priority arcs:

- Baghdad, translation, algebra, medicine, astronomy.
- Tang/Song China: exams, printing, gunpowder, paper money.
- Indian Ocean trade and Swahili Coast.
- West African gold/salt networks and Mali.
- Vikings as raiders, traders, settlers, navigators.
- Byzantine, Islamic, and Latin Christian worlds interacting.
- Angkor, Khmer water systems, and Southeast Asian statecraft.
- Polynesian navigation.

### Contact, Renaissance, Enlightenment, Industry

Handle exploration and empire with both adventure and consequence.

Priority arcs:

- Navigation technologies and why ocean routes became possible.
- Indigenous societies before and after contact.
- Disease, trade, conquest, resistance, and exchange.
- Printing, scientific instruments, public debate, salons, coffeehouses.
- Revolutions as systems under pressure, not just heroic speeches.
- Industrialization as energy transition: coal, steam, factories, cities, labor, pollution.

### Global Conflict and Modern

Students need clarity without despair.

Priority arcs:

- World War causes as systems, alliances, technology, nationalism, empire.
- Home fronts, codebreaking, medicine, logistics, propaganda.
- Holocaust and genocides: truthful, age-aware, non-graphic, humanizing.
- Decolonization and civil rights.
- Cold War as competing systems plus nuclear danger.
- Computing, internet, genetics, climate science, space exploration, AI.
- Recent archaeology: Maya LiDAR, Amazon LiDAR, ancient DNA.

---

## Image Sourcing

Images are not decoration. They are memory anchors.

### App Rules

- Local assets go under `public/images/...` and use paths like `/images/foundations/gobekli_tepe.jpg`.
- External URLs work, but local assets are preferred for reliability.
- Card image layout is controlled by the content data's `imageFit` prop. Do not patch shared card components just to fix one lesson's image cropping.
- Default to `imageFit: 'cover'` when you want a full-bleed card image that fills the available width and light cropping is acceptable.
- Use `imageFit: 'contain'` for tall artifacts, inscriptions, maps, tablets, and full-object museum photos.
- Use `imageFit: 'cover'` for landscapes, site photos, portraits, and reconstructions.
- If the edges of the real object, artifact, diagram, or inscription are getting cut off, switch that node's card image to `imageFit: 'contain'`.
- Do not use Google thumbnail URLs, `encrypted-tbn0`, hotlinked blog images, Pinterest, random CDN copies, or AI-generated "historical photos" unless the node is explicitly using generated illustration.
- For living people and modern events, use reputable sources and respect rights. If no open image exists, use a symbolic object/place image instead.

### License Preference

Prefer:

1. Public domain museum images.
2. CC0 images.
3. CC BY images.
4. CC BY-SA images, with attribution.
5. Official non-commercial images only if this app's usage allows it.

Avoid:

- "All rights reserved" images.
- Editorial photos from news sites unless licensed.
- Museum images marked "usage conditions apply" unless terms are checked.

### Source Ledger

When adding image assets, also add or update an image source note. If this repo does not yet have one, create `public/images/SOURCES.md`.

Use this format:

```markdown
## /images/foundations/gobekli_tepe.jpg

- Source page: https://commons.wikimedia.org/wiki/File:G%C3%B6bekli_Tepe.jpg
- Creator: Rolfcosar
- License: CC BY-SA 3.0 / GFDL
- Changes: cropped to 16:9, resized to 1400px wide
- Used in: younger_dryas_reset, neolithic_revolution
```

### Exact Starter Photo Sources

These are good candidates for current and near-future cards. Check each license page before downloading, then save locally and record attribution.

| Topic / Card Use | Source Page | Suggested Local Path | Fit | Notes |
|---|---|---|---|---|
| Gobekli Tepe site panorama | https://commons.wikimedia.org/wiki/File:G%C3%B6bekli_Tepe.jpg | `/images/places/gobekli_tepe_panorama.jpg` | cover | CC BY-SA/GFDL. Strong visual for early monumental ritual. |
| Gobekli Tepe closer site photo | https://commons.wikimedia.org/wiki/File:G%C3%B6bekli_Tepe_(1).jpg | `/images/places/gobekli_tepe_enclosure.jpg` | cover | CC license on Commons page. Good card crop. |
| Hawara labyrinth ruins, Petrie photo | https://commons.wikimedia.org/wiki/File:Hawara-labyrinthe-photo.jpg | `/images/places/hawara_labyrinth_ruins.jpg` | contain | Public domain. Use for Hawara/labyrinth claims with careful wording. |
| Predynastic Egyptian stone vessel | https://www.metmuseum.org/art/collection/search/547462 | `/images/inventions/predynastic_stone_vessel.jpg` | contain | Met Open Access, public domain. Good for Egyptian stoneworking node or card. |
| Predynastic open-mouth jar | https://www.metmuseum.org/art/collection/search/568267 | `/images/inventions/predynastic_open_mouth_jar.jpg` | contain | Met public domain. Useful when discussing early craft, not "impossible tech." |
| Vessel lid shaped like turtle | https://www.metmuseum.org/art/collection/search/544113 | `/images/inventions/egyptian_turtle_vessel_lid.jpg` | contain | Memorable object for craft/detail. |
| Narmer Palette, both sides | https://commons.wikimedia.org/wiki/File:Narmer_Palette.jpg | `/images/inventions/narmer_palette.jpg` | contain | Public domain reproduction. Use for Narmer/unification. |
| Narmer detail | https://commons.wikimedia.org/wiki/File:King_Narmer.jpg | `/images/foundations/king_narmer_detail.jpg` | cover | Good person-card crop. Verify page license before use. |
| Standard of Ur | https://commons.wikimedia.org/wiki/File:Standard_of_ur.jpg | `/images/places/standard_of_ur.jpg` | contain | Lower-res but usable. British Museum official image is NC; Commons version has freer terms. |
| Standard of Ur, Peace side | https://commons.wikimedia.org/wiki/File:Standard_of_Ur_-_Peace.jpg | `/images/inventions/standard_of_ur_peace.jpg` | contain | Higher-res crop, good for daily life/trade contrast. |
| Hammurabi stele photo | https://commons.wikimedia.org/wiki/File:Law_of_Hammurabi_Stele_(Copy)_(28704241385).jpg | `/images/inventions/hammurabi_stele.jpg` | contain | CC0 photo of a copy; note that it is a copy if used. |
| Catalhoyuk site | https://commons.wikimedia.org/wiki/File:%C3%87atalh%C3%B6y%C3%BCk,_7400_BC,_Konya,_Turkey_-_UNESCO_World_Heritage_Site,_11.jpg | `/images/places/catalhoyuk_site.jpg` | cover | CC BY-SA 4.0. Strong for early settlement cards. |
| Catalhoyuk interior/bull horns | https://commons.wikimedia.org/wiki/File:%C3%87atalh%C3%B6y%C3%BCk_view_7.jpg | `/images/places/catalhoyuk_bull_horns.jpg` | cover | CC BY 2.0. Memorable but verify caption/context. |
| Uluburun shipwreck gallery | https://commons.wikimedia.org/wiki/Shipwreck_from_Uluburun | `/images/places/uluburun_shipwreck.jpg` | cover | Gallery page with multiple files; choose a specific file and record its license. |
| Maya LiDAR 2018 article | https://www.nationalgeographic.com/history/article/maya-laser-lidar-guatemala-pacunam | research only | cover | Good research/resource link; images are not open by default. |
| Amazon LiDAR open article | https://www.nature.com/articles/s41586-022-04780-4 | research only | contain | Open access article. Check figure rights before using images. |

### When Exact Photos Are Missing

Use the best honest substitute:

- Unknown person -> artifact, statue, coin, inscription, or site.
- Everyday role -> tool, workshop, wall painting, seal, reconstruction from a museum.
- Abstract system -> map, document, token, road, shipwreck cargo, account tablet.
- Myth/legend -> manuscript, later artwork, archaeological site, or "mythic memory" object with clear label.

Do not invent photorealistic images of real historical individuals unless the app has decided to use generated art consistently and labels it as illustration.

---

## File Organization

### Content Location

```text
data/eras/{era_id}/{region_or_theme}.ts
```

Era IDs:

- `prelude` - The Thaw (12,000-4000 BCE)
- `foundations` - Early Cities & Bronze Age (4000-1000 BCE)
- `classical` - Classical Antiquity (1000 BCE - 500 CE)
- `early_medieval` - New Empires & Golden Ages (500-1000 CE)
- `high_medieval` - The Connected World (1000-1450 CE)
- `contact` - Age of Contact (1450-1600 CE)
- `renaissance` - Renaissance & Scientific Revolution (1600-1700 CE)
- `enlightenment` - Age of Reason (1700-1789 CE)
- `industry` - Industry & Revolution (1789-1914 CE)
- `global_conflict` - The World Wars (1914-1945 CE)
- `modern` - Atomic & Digital Age (1945-Present)

Current content style:

- Geographic bundles: `egypt_kingdoms.ts`, `mesopotamia_cities.ts`, `levant_bronze_age.ts`, `europe_bronze_age.ts`, `asia_early_civilizations.ts`, `americas_africa_early.ts`.
- Thematic bundles: `agriculture.ts`, `climate_transition.ts`, or any file that groups related nodes into a learning arc.

### File Structure

```typescript
import { NodeContent } from '../../../types';

export const FOUNDATIONS_GENERAL: Record<string, NodeContent> = {
  'node_id': {
    summary: "...",
    funFact: "...",
    people: [...],
    inventions: [...],
    places: [...],
    resources: [...],
    quiz: {...}
  }
};
```

### Registration

No manual registration is needed.

`staticContent.ts` eagerly loads `./data/**/*.ts` via `import.meta.glob` and merges exports shaped like `Record<string, NodeContent>`.

---

## Quality Checklist

Before submitting content, verify:

### Historical Quality

- [ ] The node has at least two authoritative sources behind it.
- [ ] Claims are evidence-ranked: settled, debated, or speculative.
- [ ] No conspiracy framing, "impossible ancient tech," or "historians are hiding this" language.
- [ ] Important uncertainty is named plainly.
- [ ] Multiple perspectives are included when the event affected different groups.
- [ ] Religion and myth are handled respectfully and clearly.
- [ ] Violence, slavery, genocide, disease, and oppression are age-appropriate but not sanitized into meaninglessness.

### Learning Quality

- [ ] Summary is 400-650 words unless the node is intentionally short.
- [ ] Summary tells a story, not a list.
- [ ] A concrete memory anchor appears in the summary.
- [ ] Fun fact is surprising and specific.
- [ ] Cards include human stakes, not only rulers.
- [ ] People cards are real historical actors or grounded historical roles, not modern researchers or filler personas.
- [ ] Inventions use Problem -> Solution -> Impact.
- [ ] Invention cards are historical technologies/systems from the lesson, not modern research models unless the node itself is modern.
- [ ] Places are specific, visually imaginable, and named as locations rather than artifacts or object categories.
- [ ] Empty `people`, `places`, or `inventions` arrays are acceptable when the section would otherwise be forced.
- [ ] Collectible reward cards are historical figures or technologies/inventions that feel worth collecting.
- [ ] Location reward cards were not added unless the user explicitly approved them during creation.
- [ ] A good student-facing video was searched for; if included, it was watched or skimmed for accuracy, pacing, visuals, and age fit.
- [ ] Quiz explanations teach something new.

### Technical Quality

- [ ] Node ID exactly matches `constants.ts`.
- [ ] Content exports as `Record<string, NodeContent>`.
- [ ] New files live under `data/eras/{era_id}/`.
- [ ] New local images live under `public/images/...`.
- [ ] `imageFit` is chosen intentionally in the content data for new card images.
- [ ] Collectible card flows still respect that `imageFit` choice.
- [ ] `imageFit: 'cover'` is used for full-width / full-bleed card presentation unless preserving the whole object matters more.
- [ ] `imageFit: 'contain'` is used where object cropping would ruin the card.
- [ ] Resource URLs are direct, real, and accessible.
- [ ] YouTube URLs include `rel=0`.
- [ ] No new `searchQuery` fields.
- [ ] TypeScript compiles.

### Image Quality

- [ ] Image source page and license are recorded.
- [ ] Image is not a Google thumbnail or random hotlink.
- [ ] The image actually shows the thing claimed.
- [ ] If edges are getting cut off, the fix is the node's `imageFit` value, not a lesson-specific layout hack.
- [ ] Cropping works in the card and the detail overlay.
- [ ] Public domain/CC attribution is preserved in `SOURCES.md`.

---

## Common Mistakes To Avoid

1. **Thin timeline writing:** "Then this happened, then that happened." Find the pressure and consequence.
2. **Eurocentric default:** Greece and Rome matter, but so do Persia, India, China, Africa, the Americas, Southeast Asia, Oceania, and the Islamic world.
3. **Famous-man tunnel vision:** Include builders, farmers, scribes, traders, scientists, artists, workers, and witnesses.
4. **Mystery inflation:** A real mystery is interesting enough. Do not pad it with unsupported claims.
5. **Ancient-people condescension:** Never imply people in the past were too primitive to build, measure, organize, navigate, or experiment.
6. **Modern moral flattening:** Be honest about harm and injustice without turning every node into a present-day argument.
7. **Generic fun facts:** If a kid would not repeat it, rewrite it.
8. **Weak resources:** Do not send students to clickbait when museums and universities have better material.
9. **Bad image provenance:** Do not use image URLs you cannot trace.
10. **Quiz-as-trivia:** The quiz should reinforce the big idea, not ask random dates.

---

## Example Node Standard

Use `bronze_age_begins` in `data/eras/foundations/agriculture.ts` as the current structure model:

- It has a story arc: soft copper -> bronze breakthrough -> long-distance trade dependency.
- It explains why the invention mattered economically, not just technologically.
- It uses role cards, not only famous rulers.
- It turns inventions into problem/solution/impact cards.
- It anchors the story in physical places and artifacts.
- It uses a quiz to teach consequences and evidence.

When improving future nodes, aim for the same density but with stronger sourcing, cleaner image provenance, and a sharper evidence boundary for discoveries that are exciting but debated.

---

## Research Time Estimates

- **Quick node:** 90-120 minutes. Well-documented, clear images, little controversy.
- **Standard node:** 2-3 hours. Several sources, cards, resources, and quiz.
- **Complex node:** 3-5 hours. Debated evidence, sensitive topic, weak image availability, or major global consequences.
- **Discovery node:** 3-6 hours. Requires extra care on evidence boundaries, image rights, and current scholarship.

Quality matters more than speed. A single excellent node can teach a whole pattern of history.

---

## When In Doubt

1. Check existing completed nodes for structure.
2. Verify types in `types.ts`.
3. Check `constants.ts` for exact node IDs.
4. Prefer evidence over drama, but do not drain the wonder out of real discoveries.
5. Ask: "What object, place, or decision will the learner remember?"
