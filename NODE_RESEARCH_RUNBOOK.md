# Node Research & Content Creation Runbook

This document provides step-by-step instructions for researching and creating content for timeline nodes in Chronos Learning Terminal.

## Table of Contents
1. [Data Model Overview](#data-model-overview)
2. [Research Process](#research-process)
3. [Content Guidelines](#content-guidelines)
4. [File Organization](#file-organization)
5. [Quality Checklist](#quality-checklist)

---

## Data Model Overview

Each timeline node requires a `NodeContent` object with the following structure:

```typescript
interface NodeContent {
  summary: string;           // 3-4 paragraph historical narrative
  funFact: string;          // Memorable detail for 11-12 year olds
  people: HistoricalPerson[]; // 2-4 key figures (trading card format)
  inventions: Invention[];    // 1-3 innovations (tech blueprint format)
  places: Place[];           // 1-3 locations (place card format)
  resources: Resource[];     // 3-4 external learning resources
  quiz?: Quiz;              // 3-5 questions with artifact reward
}
```

### HistoricalPerson (Trading Card)
```typescript
{
  name: string;              // Full name
  role: string;              // Brief title (e.g., "King of Persia")
  category: string;          // Philosopher | Leader | Scientist | Warrior | etc.
  description: string;       // 2-3 sentence biography
  born?: string;             // Birth year/date
  died?: string;             // Death year/date
  achievements?: string[];   // 3-5 bullet points
  legacy?: string;           // 1-2 sentences on lasting impact
  imageUrl?: string;         // "/images/{era}/{name}.jpg"
}
```

### Invention (Tech Blueprint)
```typescript
{
  name: string;              // Innovation name
  description: string;       // Brief explanation
  category: string;          // Science | Military | Government | Art | etc.
  problem: string;           // What challenge existed?
  solution: string;          // How did this innovation solve it?
  impact: string;            // What changed as a result?
  date?: string;             // When invented (optional)
  imageUrl?: string;         // "/images/inventions/{name}.jpg"
}
```

### Place (Location Card)
```typescript
{
  name: string;              // Location name
  description: string;       // What was this place?
  location: string;          // Geographic location
  significance: string;      // Why it mattered historically
  lore?: string;             // Interesting stories/details
  imageUrl?: string;         // "/images/places/{name}.jpg"
}
```

### Resource (External Learning)
```typescript
{
  title: string;             // Resource title
  type: string;              // Video | Podcast | Article | Activity
  url: string;               // REQUIRED: Direct URL (see URL guidelines below)
  isCore: boolean;           // true = essential, false = supplementary
  description?: string;      // Brief description of content
}
```

**CRITICAL URL GUIDELINES:**
- **YouTube videos**: MUST append `?rel=0` to limit related video suggestions
  - Format: `https://www.youtube.com/watch?v=VIDEO_ID?rel=0`
  - For search results: `https://www.youtube.com/results?search_query=your+search+terms`
- **Articles**: Use authoritative sources (museums, universities, educational sites)
- **Never use `searchQuery` field** - it's legacy only, always use `url`

### Quiz (Gamification)
```typescript
{
  title: string;             // Quiz title
  questions: QuizQuestion[]; // 3-5 multiple choice questions
  rewardArtifact?: {        // Optional collectible reward
    id: string;
    name: string;
    description: string;
    rarity: "Common" | "Rare" | "Epic" | "Legendary"
  }
}

interface QuizQuestion {
  id: string;                // Unique ID (e.g., "cyrus_q1")
  text: string;              // Question text
  options: string[];         // 4 answer choices
  correctIndex: number;      // 0-3, which option is correct
  explanation: string;       // Why this answer is correct (teaches!)
}
```

---

## Research Process

### Step 1: Identify the Node
- Check `constants.ts` → `INITIAL_NODES` array
- Find the node stub with: `id`, `title`, `year`, `eraId`, `region`, `tags`
- Example: `{ id: 'alexander', title: 'Alexander the Great's Conquests', year: '334 BCE', eraId: 'classical', region: 'Macedonia/Persia', tags: ['Military', 'Exploration'] }`

### Step 2: Background Research (30-45 minutes)
**Goal**: Understand the historical context and find quality sources

1. **Web Search** for overview:
   - Wikipedia (for quick overview, but don't copy directly)
   - University history department pages
   - Museum websites (British Museum, Met, Smithsonian, etc.)
   - Educational sites (Khan Academy, Crash Course, History.com)

2. **Identify Key Questions**:
   - What happened? (events, timeline)
   - Who were the main people involved?
   - What technologies/innovations emerged?
   - Where did this take place? (geography matters!)
   - Why does this matter? (impact, legacy, connections)
   - What would 11-12 year olds find cool/interesting?

3. **Find Primary Sources** (if available):
   - Ancient texts, inscriptions, archaeological findings
   - These make great "fun facts" and add authenticity

### Step 3: Gather Resource Links (15 minutes)
**Goal**: Find 3-4 quality external resources

1. **Videos** (aim for 2):
   - Search YouTube: `"{topic} for kids"`, `"{topic} documentary"`, `"{topic} explained"`
   - Look for channels: Crash Course, Oversimplified, History Hit, PBS, BBC
   - Check video length (10-20 min ideal for students)
   - **IMPORTANT**: Add `?rel=0` to all YouTube URLs
   - Note actual video IDs when possible, or use search result URLs

2. **Articles** (aim for 1-2):
   - Educational sites, museum virtual exhibits, university pages
   - Avoid ad-heavy clickbait sites
   - Check reading level (ages 10-14 appropriate)

3. **Podcasts** (optional):
   - History podcasts for teens: "Stuff You Missed in History Class", "The History Podcast"

### Step 4: Content Creation (60-90 minutes)

#### A. Write the Summary (3-4 paragraphs)
**Goal**: Tell an engaging story that captures causes, events, and consequences

**Paragraph 1**: Set the stage
- What was the world like before this event?
- What problem/situation existed?
- Hook the reader with vivid details or a dramatic moment

**Paragraph 2-3**: The main event
- What happened? (narrative, not just facts)
- Who did what and why?
- Include dramatic moments, human details, interesting facts
- Use active voice, vivid language

**Paragraph 4**: Impact and legacy
- What changed as a result?
- Why do we still care about this 500/1000/2000+ years later?
- Connect to modern world when possible

**Style Guidelines**:
- Write for ages 11-12 (7th grade reading level)
- Use active voice: "Cyrus conquered Babylon" not "Babylon was conquered"
- Include vivid details: smells, sounds, emotions, drama
- Avoid dry academic tone: "This was significant because..." ❌
- Instead: "This changed everything. Here's why..." ✅
- Use parenthetical asides to explain terms: "satrapies (provinces)"
- Aim for 400-600 words total

#### B. Create Fun Fact
**Goal**: One memorable detail kids will remember and share

**Good Fun Facts**:
- Surprising details ("Athletes competed naked!")
- Clever wordplay or linguistic connections
- "First/oldest/largest" superlatives
- Gross/weird/funny details (kids love these!)
- Modern connections ("Our word 'paper' comes from 'papyrus'")

**Bad Fun Facts**:
- Generic statements anyone could guess
- Boring statistics
- Repeating info from summary

#### C. Identify People (2-4 Trading Cards min)
**Goal**: Key historical figures with rich detail

**Who to Include**:
- Primary actors (kings, generals, inventors)
- Supporting cast (advisors, opponents, family members)
- "Everyday people" when relevant (workers, scribes, common folk)
- Both heroes AND villains/opponents (nuance!)

**For Each Person**:
1. Name and role (brief title)
2. Category (Leader, Scientist, Warrior, etc.)
3. Description: 2-3 sentences about who they were
4. Born/died dates (if known)
5. Achievements: 3-5 bullet points (concrete accomplishments)
6. Legacy: 1-2 sentences on lasting impact

**Style**: Write like a trading card - punchy, exciting, highlighting their "stats"

#### D. Identify Inventions (1-3 Tech Blueprints min)
**Goal**: Actual innovations using Problem→Solution→Impact framework

**What Counts as an Invention**:
- Literal technologies (tools, weapons, materials)
- Political/social innovations (democracy, legal codes, administrative systems)
- Cultural innovations (writing systems, artistic movements, religious practices)

**For Each Invention**:
1. Name and brief description
2. Category (Science, Military, Government, Art, Religion, etc.)
3. **Problem**: What challenge existed before?
4. **Solution**: How did this innovation address it?
5. **Impact**: What changed as a result?

**Avoid**:
- Vague abstractions ("the concept of justice") - be specific!
- Things that aren't actually inventions (just events)

#### E. Identify Places (1-3 Location Cards min)
**Goal**: Physical locations central to the story

**What to Include**:
- Cities, buildings, temples, battlefields
- Places where key events occurred
- Locations that still exist today (creates tangible connection)

**For Each Place**:
1. Name and brief description
2. Location (geographic specificity helps)
3. Significance: Why it mattered historically
4. Lore: Interesting stories, legends, archaeological details

#### F. Create Quiz (3-5 Questions min)
**Goal**: Test comprehension while teaching

**Question Types**:
1. **Factual**: "What did X do?" (test basic knowledge)
2. **Conceptual**: "Why was X important?" (test understanding)
3. **Analytical**: "What makes X different from Y?" (test deeper thinking)

**For Each Question**:
- Write clear question text
- Provide 4 answer options (one correct, three plausible distractors)
- Indicate correct answer index (0-3)
- **MOST IMPORTANT**: Write explanation that teaches why the answer is correct

**Explanation Guidelines**:
- Don't just repeat the answer
- Add context, connections, or additional details
- This is a teaching moment - make it count!

**Artifact Reward**:
- Create a thematic collectible related to the node
- Name it something evocative
- Rarity: Common (basic), Rare (notable), Epic (significant), Legendary (world-changing)

---

## File Organization

### Step 1: Determine File Location
```
data/eras/{era_id}/{region_or_theme}.ts
```

**Era IDs**:
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

**Region/Theme Examples**:
- Geographic/region bundles (this repo’s current style): `egypt_kingdoms.ts`, `mesopotamia_cities.ts`, `levant_bronze_age.ts`, `europe_bronze_age.ts`, `asia_early_civilizations.ts`, `americas_africa_early.ts`
- Thematic bundles (this repo’s current style): `agriculture.ts`, `climate_transition.ts` (or any file that groups related nodes)

### Step 2: File Structure
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
  },
  'another_node_id': {
    // ...
  }
};
```

### Step 3: Register in staticContent.ts
```typescript
// IMPORTANT (this repo): no manual registration is needed.
// `staticContent.ts` eagerly loads `./data/**/*.ts` via `import.meta.glob` and merges
// any exports shaped like `Record<string, NodeContent>`.
```

---

## Quality Checklist

Before submitting content, verify:

### Content Quality
- [ ] Summary is 3-4 paragraphs, 400-600 words
- [ ] Summary tells a story (not just lists facts)
- [ ] Summary is engaging for ages 11-12
- [ ] Fun fact is memorable and surprising
- [ ] 2-4 people with complete trading card info
- [ ] 1-3 inventions with Problem→Solution→Impact
- [ ] 1-3 places with significance and lore
- [ ] 3-4 resources (at least 2 videos, 1-2 articles)
- [ ] 3-5 quiz questions with teaching explanations

### Technical Accuracy
- [ ] All YouTube URLs include `?rel=0` parameter
- [ ] No `searchQuery` fields used (use `url` instead)
- [ ] Resource URLs are real and accessible
- [ ] Node ID matches stub in `constants.ts`
- [ ] Content lives under `data/` and is exported as a `Record<string, NodeContent>` so `staticContent.ts` can auto-load it
- [ ] TypeScript compiles without errors

### Educational Value
- [ ] Content is historically accurate
- [ ] Multiple perspectives included (not just "winners")
- [ ] Global coverage (not Eurocentric)
- [ ] Age-appropriate (no graphic violence/content)
- [ ] Difficult topics handled honestly but sensitively
- [ ] Quiz explanations teach, not just confirm answers

### Writing Style
- [ ] Active voice used throughout
- [ ] Vivid, engaging language
- [ ] Technical terms explained in context
- [ ] No emojis (unless explicitly requested)
- [ ] Reading level appropriate for 7th grade
- [ ] Avoids academic jargon and dry tone

---

## Common Mistakes to Avoid

1. **Eurocentric Bias**: Ensure non-Western civilizations get equal depth
2. **"Just the Facts"**: Tell stories, don't write encyclopedia entries
3. **Presentism**: Don't judge ancient people by modern standards (but do note ethical issues)
4. **Skipping Context**: Always explain WHY events mattered, not just WHAT happened
5. **Weak Fun Facts**: Make them actually fun and memorable!
6. **Teaching Without Teaching**: Quiz explanations should add value, not repeat answers
7. **URL Errors**: Always use `url` field with real URLs, never `searchQuery`
8. **Missing `?rel=0`**: YouTube videos without this parameter will show inappropriate suggestions
9. **Overcomplication**: Keep it simple - you're writing for 11-12 year olds, not PhD candidates
10. **Missing the Human Element**: Include emotions, motivations, drama - history is human!
11. **No woke bullshit!!!**: I cannot stress this enough. Be based and reasonable, no culture war takes

---

## Example: Complete Node

Use this as the reference “good outcome” for structure, writing voice, and completeness:

- **Node id**: `bronze_age_begins` (stub lives in `constants.ts`)
- **Content file**: `data/eras/foundations/agriculture.ts` → `bronze_age_begins`

Full example (verbatim — yes, it’s long on purpose so the “research AI” sees the expected amount of content):

```typescript
'bronze_age_begins': {
  summary:
    "Around 3300 BCE in the Near East, humans were already skilled metalworkers. For over a thousand years, they'd been smelting copper—heating certain greenish rocks in hot ovens until pure reddish metal dripped out. Copper was amazing: it could be melted and poured into molds, hammered into sheets, or shaped into hooks, pins, and simple tools. But it had a fatal weakness—it was soft. A copper axe blade would dull quickly. A copper sword would bend in battle. Copper was beautiful and useful, but it couldn't compete with good stone tools for serious work.\n\n" +
    "Then came the breakthrough, probably by accident. A metalworker somewhere—maybe in Anatolia (Turkey), maybe in Mesopotamia (Iraq), maybe in Iran—smelted copper ore that naturally contained traces of tin or arsenic. The result was harder, tougher, and kept a sharp edge much longer. Once smiths realized they could deliberately mix about 10% tin with 90% copper to create bronze, everything changed. Bronze tools cut through wood like butter. Bronze plow blades dug deeper into soil, boosting crop yields. Bronze weapons—swords, daggers, spearheads, arrowheads—gave armies equipped with them a devastating advantage. Bronze also had a lower melting point than copper, making it easier to cast into complex shapes. Suddenly, kings, priests, and wealthy merchants wanted bronze everything: tools, weapons, ritual objects, jewelry, and elaborate decorations.\n\n" +
    "But there was a catch—a huge one that would shape the next 2,000 years of human history. Copper and tin are almost never found in the same place. Copper deposits were scattered across the Near East, Anatolia, Cyprus, and the Sinai Peninsula. Tin was even rarer, found mainly in distant mountains in Anatolia, Afghanistan, and possibly Central Asia. To make bronze, you needed long-distance trade networks. Miners in remote mountains extracted ore. Merchants loaded it onto donkeys or ships and hauled it hundreds or thousands of miles. Cities controlled trade routes, taxed metal shipments, and employed specialist smiths who guarded their bronze-making secrets. A farmer's bronze plow in Egypt might contain copper from Cyprus and tin from Afghanistan—places he'd never heard of. The Bronze Age wasn't just about a better metal; it was about the first truly interconnected, globalized economy. When those trade routes collapsed around 1200 BCE—due to wars, droughts, and invasions—the whole Bronze Age system came crashing down.",
  funFact:
    "Bronze was so valuable in the early Bronze Age that it was often recycled obsessively. Broken tools and weapons were melted down and recast. Archaeologists joke that the same atoms of bronze might have been a dagger in 2000 BCE, a cooking pot in 1500 BCE, and a statue in 1000 BCE.",
  people: [
    {
      name: "The Master Smith",
      role: "Bronze Metalworker",
      category: "Scientist",
      description:
        "Elite craftspeople who controlled the secrets of bronze-making: the right ratio of copper to tin, the correct furnace temperature (over 1000°C), and how to pour molten metal into intricate molds. Smiths were so valuable that kings kept them close, sometimes even marking them with special tattoos so they couldn't run away to rival kingdoms.",
      achievements: [
        "Perfected the copper-tin alloy ratio (typically 90% copper, 10% tin)",
        "Developed lost-wax casting for complex sculptures and ritual objects",
        "Created standardized bronze ingots for trade (like ancient currency)"
      ],
      legacy: "Bronze smiths were among the first true specialists—craftspeople who didn't farm but were supported by society because their skills were irreplaceable.",
      imageUrl: "/images/foundations/bronze_smith.jpg"
    },
    {
      name: "The Tin Trader",
      role: "Long-Distance Merchant",
      category: "Explorer",
      description:
        "Merchants who organized caravans of donkeys and camels to haul tin from distant mountains (Afghanistan, Central Asia, Anatolia) to bronze-hungry cities in Mesopotamia and Egypt. These were dangerous journeys through deserts, mountains, and territories controlled by bandits or rival kingdoms. Successful tin traders became wealthy and powerful.",
      achievements: [
        "Established trade routes spanning thousands of miles",
        "Negotiated safe passage through multiple kingdoms and territories",
        "Created early forms of credit and contracts for long-distance trade"
      ],
      legacy: "Tin traders created the first truly international trade networks, proving that valuable commodities could connect civilizations across vast distances.",
      imageUrl: "/images/foundations/tin_trader.jpg"
    },
    {
      name: "The Bronze-Armed Warrior",
      role: "Elite Soldier",
      category: "Military",
      description:
        "Soldiers equipped with bronze weapons and armor had an overwhelming advantage over those with stone or copper weapons. Bronze swords didn't shatter, bronze-tipped spears pierced leather armor, and bronze helmets protected against blows. Only wealthy kingdoms could afford to equip entire armies with bronze, creating a military aristocracy.",
      legacy: "Bronze weapons created the first true warrior elites and made large-scale organized warfare deadlier than ever before.",
      imageUrl: "/images/foundations/bronze_warrior.jpg"
    }
  ],
  inventions: [
    {
      name: "Bronze Alloy (Copper + Tin)",
      description: "Deliberate mixing of 90% copper with 10% tin to create a metal superior to either alone",
      category: "Science",
      date: "c. 3300 BCE",
      imageUrl: "/images/inventions/bronze_ingot.jpg",
      problem:
        "Pure copper is soft—it bends easily, dulls quickly, and can't hold a sharp edge. Copper tools are prettier than stone tools, but not much more effective. Stone axes often outperform copper axes. For a metal to truly replace stone, it needs to be significantly harder and more durable.",
      solution:
        "Metalworkers discovered (probably by accident at first) that adding a small amount of tin to molten copper creates an alloy called bronze. The tin atoms disrupt the copper's crystal structure, making it much harder. Bronze holds a sharp edge, resists bending, and can be remelted and recast repeatedly. The ideal ratio is about 10% tin, though smiths experimented with 5-15% depending on whether they wanted hardness (weapons) or workability (tools).",
      impact:
        "Bronze tools revolutionized agriculture (better plows = more food = larger populations), construction (bronze chisels carved stone monuments), and especially warfare (bronze weapons were so superior that armies without them stood little chance). Bronze also created economic interdependence: no region had everything it needed, so trade became essential. This interconnected economy lasted 2,000 years until it collapsed catastrophically around 1200 BCE."
    },
    {
      name: "Lost-Wax Casting",
      description: "Advanced technique for creating detailed bronze sculptures and complex shapes",
      category: "Art",
      date: "c. 3000 BCE",
      imageUrl: "/images/inventions/lost_wax_casting.jpg",
      problem:
        "Simple open molds can create flat objects, but how do you cast a three-dimensional statue with intricate details—like a god's face, or fingers holding a weapon? Hammering bronze by hand limits what shapes are possible.",
      solution:
        "Sculptors carve a model in wax with all the fine details they want. They cover the wax model in clay, leaving a small hole. When heated, the wax melts and drains out (hence 'lost wax'), leaving a hollow clay mold with the exact shape of the original. Pour molten bronze in, let it cool, break open the clay, and you have a perfect bronze replica. Each mold is single-use, but the results are stunning.",
      impact:
        "Lost-wax casting enabled Bronze Age artists to create masterpieces: elaborate statues of gods and kings, intricate jewelry, ceremonial vessels, and ritual objects. It turned bronze from a utilitarian material into an artistic medium. Many Bronze Age sculptures we admire today were made this way."
    },
    {
      name: "Bronze Ingot Standardization",
      description: "Standardized shapes and weights for bronze, making it easier to trade",
      category: "Politics",
      date: "c. 2000 BCE",
      imageUrl: "/images/inventions/bronze_ingot.jpg",
      problem:
        "Bronze is valuable, but raw bronze is hard to transport and trade. How do you know you're getting a fair deal? How do merchants and kings keep track of bronze being shipped across hundreds of miles?",
      solution:
        "Bronze was cast into standardized shapes—most famously, the 'oxhide ingot' shaped like a stretched animal hide with four handles for carrying. These ingots had consistent weights (typically 20-30kg), making them easy to trade, stack on ships, and account for in palace records. They functioned like large-denomination currency.",
      impact:
        "Standardized ingots facilitated long-distance trade and helped create a Bronze Age 'common market.' Shipwrecks from this era (like the Uluburun wreck off Turkey, c. 1300 BCE) are loaded with dozens of identical oxhide ingots—evidence of a sophisticated trade system spanning the Mediterranean."
    }
  ],
  places: [
    {
      name: "Kestel Mine & Göltepe, Turkey",
      description:
        "One of the world's oldest known tin mines, located in the Taurus Mountains of central Anatolia (Turkey). Active around 3000 BCE, this mine supplied tin to early Bronze Age civilizations in Mesopotamia. The nearby site of Göltepe shows evidence of tin processing and smelting.",
      location: "Taurus Mountains, central Turkey (near modern Niğde Province)",
      significance:
        "Kestel is crucial because tin sources are so rare. For centuries, archaeologists wondered where Bronze Age civilizations got their tin. Kestel proved that Anatolia had accessible tin deposits, helping explain how the Bronze Age started in the Near East. Control of tin mines like this gave kingdoms immense power—without tin, you can't make bronze, and without bronze, you can't compete.",
      imageUrl: "/images/places/kestel_mine.jpg"
    },
    {
      name: "The Uluburun Shipwreck Site",
      description:
        "A Bronze Age merchant ship that sank off the coast of Turkey around 1300 BCE. Discovered in 1982 and excavated over 11 years, it contained an astonishing cargo: 10 tons of copper ingots, 1 ton of tin ingots, luxury goods (ivory, glass, ebony, gold, jewelry), weapons, pottery from multiple civilizations, and even an Egyptian scarab of Queen Nefertiti.",
      location: "Mediterranean Sea off the coast of Kaş, southwestern Turkey (50 meters underwater)",
      significance:
        "The Uluburun shipwreck is like a time capsule showing how interconnected the Bronze Age world was. The copper was from Cyprus, the tin likely from Afghanistan or Anatolia, the pottery from Cyprus and Canaan, the ivory from Africa or Syria, the glass from Egypt. One ship carried goods from at least seven different civilizations. It proves that the Bronze Age wasn't isolated city-states—it was a genuinely globalized trade network. When that network collapsed around 1200 BCE, it triggered a dark age.",
      imageUrl: "/images/places/uluburun_wreck.jpg"
    }
  ],
  resources: [
    {
      title: "The Bronze Age | What Was the Bronze Age",
      type: "Video",
      url: "https://www.youtube.com/watch?v=PYqHA5C82Xs&rel=0",
      isCore: true,
      description:
        "Comprehensive video explaining the Bronze Age period (c. 3000-1000 BCE), how bronze alloy was discovered, its advantages over copper, the rise of trade networks, and why bronze revolutionized warfare, agriculture, and craftsmanship."
    },
    {
      title: "The Bronze Age Collapse - Fall of Civilizations Podcast",
      type: "Podcast",
      url: "https://podcasts.apple.com/us/podcast/2-the-bronze-age-collapse-mediterranean-apocalypse/id1449884495?i=1000428254681",
      isCore: true,
      description:
        "65-minute podcast exploring Bronze Age civilizations at their height—their trade networks, technology, and interconnected economies—and what caused their dramatic collapse around 1200 BCE. Shows why bronze was so crucial to ancient societies."
    },
    {
      title: "Ingots and Bronze Age Copper Trade - Penn Museum",
      type: "Article",
      url: "https://www.penn.museum/sites/expedition/ingots-and-the-bronze-age-copper-trade-in-the-mediterranean/",
      isCore: false,
      description:
        "Scholarly article examining copper ingots found across the Mediterranean, how they reveal Bronze Age trade networks spanning thousands of miles, and the logistics of transporting heavy metals across ancient seas."
    },
    {
      title: "Uluburun Shipwreck - World History Encyclopedia",
      type: "Article",
      url: "https://www.worldhistory.org/Uluburun_Shipwreck/",
      isCore: false,
      description:
        "Documentary about the incredible underwater archaeology of the Uluburun wreck and what it reveals about Bronze Age trade."
    }
  ],
  quiz: {
    title: "Metallurgy Mastery Protocol",
    description: "Prove your understanding of the Bronze Age revolution to unlock the artifact.",
    questions: [
      {
        id: "bronze_q1",
        text: "What is bronze made from?",
        options: [
          "Pure copper heated to very high temperatures",
          "Copper mixed with about 10% tin",
          "Iron mixed with carbon",
          "Gold mixed with silver"
        ],
        correctIndex: 1,
        explanation:
          "Bronze is an alloy of approximately 90% copper and 10% tin. The tin makes the copper much harder and better at holding a sharp edge. Different ratios were used for different purposes—more tin for weapons, less for tools."
      },
      {
        id: "bronze_q2",
        text: "Why was the Bronze Age so dependent on long-distance trade?",
        options: [
          "Bronze was too heavy to produce locally",
          "Copper and tin deposits are almost never found in the same place",
          "Only one civilization knew how to make bronze",
          "Kings wanted exotic decorations"
        ],
        correctIndex: 1,
        explanation:
          "Copper deposits and tin deposits are rarely found together. Tin was especially rare, found mainly in Anatolia, Afghanistan, and Central Asia. To make bronze, you needed trade networks spanning hundreds or thousands of miles. This created the first truly globalized economy."
      },
      {
        id: "bronze_q3",
        text: "What major advantage did bronze have over copper?",
        options: [
          "It was easier to find in nature",
          "It was much harder and held a sharp edge longer",
          "It was lighter and easier to carry",
          "It looked more impressive"
        ],
        correctIndex: 1,
        explanation:
          "Bronze is significantly harder than pure copper and keeps a sharp edge much longer. This made bronze tools far more effective than copper tools, and bronze weapons dominated battlefields. A bronze sword could cut through copper armor easily."
      },
      {
        id: "bronze_q4",
        text: "What were 'oxhide ingots'?",
        options: [
          "Bronze shields shaped like animal hides",
          "Standardized bronze blocks shaped like stretched hides, used for trade",
          "Leather bags for carrying tin",
          "Ceremonial objects used in rituals"
        ],
        correctIndex: 1,
        explanation:
          "Oxhide ingots were standardized bronze blocks weighing 20-30kg, shaped like stretched animal hides with four handles. They made bronze easier to transport, trade, and account for—functioning almost like large-denomination currency."
      },
      {
        id: "bronze_q5",
        text: "What technique allowed Bronze Age artists to create detailed sculptures?",
        options: [
          "Hammering thin bronze sheets",
          "Carving cooled bronze with chisels",
          "Lost-wax casting",
          "Stone molds"
        ],
        correctIndex: 2,
        explanation:
          "Lost-wax casting involved making a wax model, covering it in clay, melting out the wax, and pouring bronze into the hollow mold. This allowed incredibly detailed three-dimensional sculptures and objects. Each mold was single-use, but the results were stunning."
      },
      {
        id: "bronze_q6",
        text: "Why did control of tin mines give kingdoms enormous power?",
        options: [
          "Tin was used to make coins",
          "Without tin, you couldn't make bronze weapons and tools",
          "Tin was needed for food preservation",
          "Tin mines produced gold as a byproduct"
        ],
        correctIndex: 1,
        explanation:
          "Tin was essential for making bronze, and tin deposits were extremely rare. Kingdoms that controlled tin mines or tin trade routes had a monopoly on bronze production. Without access to tin, your civilization couldn't make modern weapons or tools—you were stuck in the Stone Age while your neighbors had bronze."
      },
      {
        id: "bronze_q7",
        text: "What does the Uluburun shipwreck tell us about the Bronze Age?",
        options: [
          "Ships were very small and primitive",
          "Trade was limited to nearby regions",
          "The Bronze Age was a highly interconnected, globalized economy",
          "Bronze was only used by wealthy elites"
        ],
        correctIndex: 2,
        explanation:
          "The Uluburun shipwreck (c. 1300 BCE) contained goods from at least seven different civilizations: Cypriot copper, Afghan or Anatolian tin, Egyptian gold, African ivory, Canaanite pottery, and more. One ship carried materials that had traveled thousands of miles. This proves the Bronze Age had a sophisticated, interconnected trade network spanning the known world."
      }
    ],
    rewardArtifact: {
      id: "bronze_dagger",
      name: "Royal Bronze Dagger",
      description:
        "A perfectly balanced bronze dagger with a decorated hilt, sharp enough to pierce leather armor. This weapon represents the military revolution that bronze technology brought to the ancient world.",
      rarity: "Rare",
      imageUrl: "/images/artifacts/bronze_dagger.jpg"
    }
  }
},
```

Key features:
- Engaging narrative summary that explains the “metal recipe” *and* the trade-network consequences
- Memorable fun fact that’s actually sticky for kids
- People cards that include “roles” beyond famous kings (smiths, merchants, soldiers)
- Inventions written as **Problem → Solution → Impact**
- Places that physically anchor the story (mines, shipwrecks) + why they matter
- Resources with real `url` values (YouTube includes `rel=0`)
- Quiz explanations that teach (not just confirm)

---

## Research Time Estimates

- **Quick Node** (well-documented topic): 90-120 minutes
- **Standard Node** (moderate research): 120-180 minutes
- **Complex Node** (requires deep research): 180-240 minutes

Budget your time accordingly and don't rush - quality matters!

---

## Questions or Issues?

If you encounter problems:
1. Check existing completed nodes for reference
2. Verify data model in `types.ts`
3. Review CLAUDE.md for project-specific guidance
4. When in doubt, prioritize educational value and engaging storytelling
