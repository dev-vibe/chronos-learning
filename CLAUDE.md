# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Chronos Learning Terminal** is a gamified educational timeline app for homeschool students (ages 10-14). It presents world history as a "tactical mission log" with a high-tech terminal aesthetic (dark mode, neon accents, grid layouts). The app covers comprehensive world history from the end of the Ice Age (~12,000 BCE) through modern times.

## Commands

### Development
```bash
npm run dev      # Start development server (Vite)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Architecture Overview

### Core Data Model (The "Skeleton")

The entire history curriculum is defined upfront in `constants.ts`:

- **`ERAS`**: 11 major historical periods with globally-neutral naming (not Eurocentric) and metadata like year ranges, descriptions, and key themes
- **`INITIAL_NODES`**: ~475 timeline events as "stubs" (id, title, year, eraId, region, tags) representing the complete curriculum structure

**Era Structure (11 Total):**
1. Prelude: The Thaw (12,000-4000 BCE) - End of Ice Age
2. Early Cities & Bronze Age (4000-1000 BCE) - First civilizations
3. Classical Antiquity (1000 BCE - 500 CE) - Empires & philosophy
4. New Empires & Golden Ages (500-1000 CE) - Islamic Golden Age, Tang China, Vikings
5. The Connected World (1000-1450 CE) - Mongol Empire, global trade, Black Death
6. Age of Contact (1450-1600 CE) - Columbian Exchange, Gunpowder Empires, Reformation
7. Renaissance & Scientific Revolution (1600-1700 CE) - Scientific Method emerges
8. Age of Reason (1700-1789 CE) - Enlightenment applied to politics, revolutions begin
9. Industry & Revolution (1789-1914 CE) - Industrial Revolution, imperialism
10. The World Wars (1914-1945 CE) - Total war, fascism, nuclear age begins
11. Atomic & Digital Age (1945-Present) - Cold War, computers, globalization

This stub-first approach means:
- The timeline navigation works immediately
- Content can be populated incrementally
- The UI never shows "loading" states for the structure itself

### Static Content System

Content is stored in modular TypeScript files under `data/[era]/[region].ts`:

```
data/
  foundations/
    egypt.ts          → FOUNDATIONS_EGYPT object
    mesopotamia.ts    → FOUNDATIONS_MESOPOTAMIA object
    asia.ts
    europe.ts
    ...
```

Each data file exports a `Record<string, NodeContent>` where:
- **Key**: Node ID (matches stub ID from `constants.ts`)
- **Value**: Full `NodeContent` object with summary, people, inventions, places, resources, quiz

All regional data files are then imported and merged in `staticContent.ts`:

```typescript
export const STATIC_CONTENT: Record<string, NodeContent> = {
  ...FOUNDATIONS_EGYPT,
  ...FOUNDATIONS_MESOPOTAMIA,
  ...FOUNDATIONS_ASIA,
  // etc.
};
```

**Important**: When adding content for a new era:
1. Create data file: `src/data/[era_id]/[region].ts`
2. Export a `Record<string, NodeContent>` object
3. Import and spread it into `staticContent.ts`

### Content Loading Strategy

`App.tsx` uses a hybrid approach:

1. **Static Content First**: When a node is selected, the app checks `STATIC_CONTENT` for existing data
2. **Gemini API Fallback**: If no static content exists, `fetchNodeContent()` generates content via Google's Gemini API (requires API key in `.env.local`)
3. **In-Memory Cache**: Once loaded (static or generated), content is cached in `nodeCache` state

This allows development to proceed with AI-generated content while static content is gradually written.

### Gamification System

Lives in `services/gamification.ts`:

- **Local Storage Persistence**: User profile (XP, level, artifacts, completed nodes) stored in browser's localStorage
- **Level Curve**: `Level = sqrt(XP / 100) + 1` (Lvl 1: 0 XP, Lvl 2: 100 XP, Lvl 3: 400 XP, Lvl 4: 900 XP)
- **Rewards**: Each quiz awards XP and optional artifacts (collectible cards)
- **Progress Tracking**: Completed nodes are marked to show badges in the timeline

The system is intentionally simple (no backend) for offline-first homeschool use.

### UI Component Structure

**App.tsx** (Main Controller)
- Manages split-view layout (sidebar + content)
- Handles mobile/desktop responsive transitions
- Coordinates gamification state

**TimelineSidebar.tsx**
- Renders accordion-style era navigation
- Shows node list with completion badges
- Handles "Era Briefing" mode

**NodeContentDisplay.tsx** (The Content Renderer)
- Loading states with animated UI
- Era Briefing mode (shows era description)
- Node Content mode (renders full historical content)
- Trading Cards UI for people (with role, achievements, and legacy)
- Tech Blueprints UI for inventions (Problem/Solution/Impact format)
- Place cards for locations
- Resource links (videos, podcasts, articles)
- Quiz integration

**QuizModule.tsx**
- Multiple choice questions
- XP and artifact rewards
- Explains correct answers

### Type System (`types.ts`)

Key interfaces:
- `Era`: Historical period metadata
- `TimelineNodeStub`: Lightweight node reference (id, title, year, eraId, region, tags)
- `TimelineNode`: Stub + optional `NodeContent`
- `NodeContent`: Full content object (summary, people, inventions, places, resources, quiz, funFact)
- `HistoricalPerson`: Trading card data with role, description, achievements, and legacy
- `Invention`: Tech blueprint data with problem/solution/impact
- `Place`: Location cards with significance and lore
- `Resource`: External media links (videos, podcasts, articles)
- `Quiz`: Quiz questions with explanations and artifact rewards

### Content Philosophy

Each node should be:
- **Concise but Complete**: Capture the essential story without overwhelming detail
- **Engaging for 11-12 year olds**: Use vivid language, avoid dry academic tone
- **Historically Rigorous**: Cite modern scholarship, acknowledge debates
- **Globally Inclusive**: Cover non-Western civilizations with equal depth
- **Fun Fact Driven**: Include memorable details that stick

## Adding New Historical Content

### Step 1: Find the Node ID
Check `constants.ts` → `INITIAL_NODES` array for the node you want to populate.

Example: `{ id: 'alexander', title: 'Alexander the Great\'s Conquests', year: '334 BCE', eraId: 'classical', region: 'Macedonia/Persia', tags: ['Military', 'Exploration'] }`

### Step 2: Create Data File (if needed)
If no data file exists for that era/region:
```typescript
// src/data/classical/greece.ts
import { NodeContent } from '../../types';

export const CLASSICAL_GREECE: Record<string, NodeContent> = {
  // nodes go here
};
```

### Step 3: Write Content
```typescript
'alexander': {
  summary: "Multi-paragraph historical narrative...",
  funFact: "A memorable detail that kids will remember",
  people: [
    {
      name: "Alexander the Great",
      role: "Macedonian King",
      category: "Military",
      description: "Brief bio...",
      born: "356 BCE",
      died: "323 BCE",
      achievements: ["Conquered Persian Empire", "Founded Alexandria"],
      legacy: "Spread Greek culture across three continents"
    }
  ],
  inventions: [
    {
      name: "Sarissa Pike",
      description: "18-foot Macedonian spear",
      category: "Military",
      problem: "Traditional hoplites had limited reach",
      solution: "Extra-long pike allows phalanx to strike first",
      impact: "Revolutionized ancient warfare"
    }
  ],
  places: [
    {
      name: "Alexandria",
      description: "City founded by Alexander in Egypt",
      location: "Egypt",
      significance: "Became center of Hellenistic learning"
    }
  ],
  resources: [
    {
      title: "Alexander the Great Documentary",
      type: "Video",
      searchQuery: "Alexander the Great BBC documentary",
      isCore: true,
      description: "Visual overview of conquests"
    }
  ],
  quiz: {
    title: "Alexander's Empire",
    questions: [
      {
        id: "alex_q1",
        text: "Which empire did Alexander defeat?",
        options: ["Roman", "Persian", "Chinese", "Aztec"],
        correctIndex: 1,
        explanation: "Alexander conquered the vast Persian Empire led by Darius III."
      }
    ],
    rewardArtifact: {
      id: "alexander_drachma",
      name: "Alexander's Silver Drachma",
      description: "Coin with Alexander's profile",
      rarity: "Rare"
    }
  }
}
```

### Step 4: Register in staticContent.ts
```typescript
import { CLASSICAL_GREECE } from './data/classical/greece';

export const STATIC_CONTENT: Record<string, NodeContent> = {
  ...FOUNDATIONS_EGYPT,
  ...CLASSICAL_GREECE, // Add this line
  // etc.
};
```

## Content Research Workflow

When researching a new node:
1. **Web search** for authoritative sources (university sites, museum content, peer-reviewed summaries)
2. **Find engaging videos**: Look for documentaries, museum curator talks, educational channels (Crash Course, History Hit, PBS)
3. **Find podcasts**: History podcasts for kids/teens (The History Podcast, Stuff You Missed in History Class)
4. **Identify key figures**: 2-4 people directly involved (leaders, inventors, artists, everyday people)
5. **Identify key inventions/technologies**: Actual innovations with Problem→Solution→Impact structure
6. **Identify key places**: Physical locations central to the story
7. **Draft quiz**: 3-5 multiple choice questions testing core concepts

## Resource Search Queries

Each `Resource` object has a `searchQuery` field. These are meant to be:
- Specific enough to find quality content
- Generic enough to work across search engines/platforms
- Kid-appropriate (avoid queries that might return violent/inappropriate content)

Good examples:
- `"Alexander the Great for kids documentary"`
- `"ancient Greek philosophy explained"`
- `"how cuneiform writing works"`

Bad examples:
- `"Alexander"` (too vague)
- `"brutal ancient warfare"` (inappropriate tone)

## Styling & UI Conventions

### Color Palette
- **Background**: Black (#000000) and dark grays (#09090b, #0c0c0e)
- **Primary Accent**: Amber (#f59e0b, #fbbf24) for active states, highlights
- **Secondary Accents**: Blue for era briefings, emerald for success states
- **Text**: Stone colors (#stone-200, #stone-300, #stone-400)
- **Borders**: Subtle stone-800 with glow effects on hover

### Typography
- **Headings**: `font-display` (system font stack with bold weights)
- **Body**: `font-sans` (default Tailwind sans-serif stack)
- **Code/Tactical UI**: `font-mono` with uppercase + tracking-widest

### UI Patterns
- **Grid Overlays**: Low-opacity grid backgrounds for "terminal" aesthetic
- **Tactical Cards**: Rounded borders, subtle shadows, hover glow effects
- **Icons**: Lucide React icons throughout
- **Animations**: Subtle fades, slides, and spins (avoid excessive motion)

## API Keys

The app can use Google's Gemini API for dynamic content generation:

1. Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create `.env.local`:
   ```
   VITE_GEMINI_API_KEY=your_key_here
   ```
3. Restart dev server

The `geminiService.ts` generates content that matches the `NodeContent` schema when static data doesn't exist.

## Educational Goals

This is a **homeschool curriculum tool**, not just a history app. Design decisions prioritize:

1. **Comprehensive Global Coverage**: Cover major events from all regions—China, India, Africa, Americas, Middle East, Europe—not just Western history
2. **Narrative Coherence**: Each node tells a story with causes and consequences
3. **Understanding Context**: Explain what happened in different civilizations and why, including their motivations, innovations, and impact
4. **Age-Appropriate Complexity**: Handle difficult topics (slavery, genocide) honestly but without graphic details
5. **Intrinsic Motivation**: Gamification should enhance learning, not replace it

## Future Expansion

The current codebase has populated:
- `prelude` era - Prelude: The Thaw (12,000-4000 BCE, ~1 node)
- `foundations` era - Early Cities & Bronze Age (4000-1000 BCE, ~40 nodes)

Remaining eras need content:
- `classical` - Classical Antiquity (1000 BCE - 500 CE, ~40 nodes)
- `early_medieval` - New Empires & Golden Ages (500-1000 CE, ~22 nodes)
- `high_medieval` - The Connected World (1000-1450 CE, ~30 nodes)
- `contact` - Age of Contact (1450-1600 CE, ~22 nodes)
- `renaissance` - Renaissance & Scientific Revolution (1600-1700 CE, ~16 nodes)
- `enlightenment` - Age of Reason (1700-1789 CE, ~25 nodes)
- `industry` - Industry & Revolution (1789-1914 CE, ~47 nodes)
- `global_conflict` - The World Wars (1914-1945 CE, ~30 nodes)
- `modern` - Atomic & Digital Age (1945-Present, ~43 nodes)

The stub structure in `constants.ts` defines the full curriculum (~475 nodes total). Content creation is the primary remaining work.
