# Chronos design system

This is the concise implementation guide. The PRD remains authoritative for full product behavior.

## Product personality

Chronos combines a best-in-class learning app, an editorial history publication, and a premium museum companion. It is warm, intelligent, calm, spacious, and intuitively enjoyable for learners around ages 10–14 while remaining visually credible for adults.

Avoid tactical terminal UI, fantasy-game styling, childish mascots, candy colors, dense dashboards, faux-antique clutter, excessive glass effects, and noisy gamification.

## Core palette

Use semantic tokens rather than hard-coded colors. Initial visual targets:

| Token family | Direction |
| --- | --- |
| Canvas | Warm ivory / parchment |
| Primary structure | Deep archive blue |
| Discovery | Ochre / muted gold |
| Evidence and supportive action | Aegean teal / mineral blue |
| Warm category accent | Restrained terracotta |
| Neutral | Limestone, stone, soft slate |

Dark mode uses ink navy and charcoal-blue layered surfaces, warm ivory text, and restrained bronze/gold accents. It is intentionally authored—not a simple inversion.

All final values must meet WCAG 2.2 AA contrast and should be expressed as reusable CSS/design tokens.

## Typography

- Editorial serif: brand, historical lesson titles, selected card titles.
- Contemporary sans-serif: navigation, controls, labels, body copy, captions.
- Long-form body text must remain highly readable at mobile and desktop widths.
- Never use generated image text as application copy.

## Geometry and rhythm

- 8px spacing base with generous whitespace.
- Refined thin borders and low-elevation shadows.
- Rounded geometry is friendly but never bubbly or toy-like.
- Lesson reading column: approximately 720–840px desktop.
- Journey rail: approximately 288–320px desktop.
- No nested-scroll confusion.

## Stable Learn shell

Desktop: narrow global navigation, pinned journey rail, and primary scrolling lesson canvas.

Mobile: compact sticky journey/progress header, full-width lesson content, and full-height journey drawer.

Changing journey type changes authored content and rail entries—not the interaction model.

## Lesson composition

Typical required lesson:

1. Masthead and significance
2. Cinematic hero reconstruction or evidence-led opening
3. Opening hook
4. Five to eight semantic narrative/evidence sections, with contextual comparison only when it has teaching value
5. World Check and one-to-three-prompt Check Your Understanding
6. Explicit completion panel
7. Post-completion next step: continue the current journey, then an optional card or authored exploration when meaningful

A thin sticky treatment and compact text such as “4 of 7 sections explored” show current-lesson progress. Do not add large section checklists. Persist stable section IDs and resume at the last meaningful section rather than an exact scroll pixel.

Do not create a progress-bearing “Connections” or “Follow the idea forward” section whose primary job is navigation. Historical before/elsewhere/reappearance context belongs inside the lesson where it explains the subject and should not be hidden until completion. A related lesson, Story Arc, Idea Trail, or Investigation may be surfaced at a pedagogically meaningful point, but its control is visually separate from the explanation, clearly optional, non-disruptive, and subordinate to the learner's current required action.

## Understanding checks

Use multiple choice, ordering, matching, image hotspots, comparison, concise explanation, or source interpretation. Feedback is immediate and explanatory. Incorrect answers invite retry without punishment. No lives, countdowns, grades, loud failure states, or perfect-score completion gate.

## Hero and visual exploration

Preserve the excitement of legacy lesson posters by decomposing them:

- central reconstruction → cinematic hero;
- map/timeline/process → native responsive modules;
- surviving object → separate museum-neutral Evidence module;
- dense poster → optional Visual Field Guide or printable completion recap.

Generated art contains no titles or explanatory paragraphs. Native UI supplies caption, attribution, depiction label, hotspots, and educational text.

## Historical visual language

| Treatment | Meaning |
| --- | --- |
| Cinematic scene with explicit caption | Evidence-based reconstruction |
| Neutral museum surface | Artifact/site/source evidence |
| Fine blue linework | Map, diagram, explanatory model |
| Warm note surface | Curatorial interpretation |
| Dashed/slate treatment | Uncertainty or contested claim |
| Muted story accent | Myth, legend, or later tradition |

Never let reconstruction appear to be direct evidence.

## Knowledge Cards

Cards are premium collectible historical objects and memory anchors, not playable TCG inventory.

- Historically grounded cinematic or artifact-focused artwork.
- Clear category, class, date, title, and concise significance.
- Classes such as Foundation, Breakthrough, Turning Point, Masterwork, Witness, Enigma, and Legacy.
- No combat stats, power, rarity gems, duplicate cards, currency, booster cues, or escalating gold spectacle.
- Illustration and actual evidence are visibly separated in card detail.

## Approved references

The approved reference images live in `docs/design/references/`:

- `references/north-star-light.png` — original premium editorial direction.
- `references/north-star-dark.png` — authored dark mode.
- `references/north-star-approachable.png` — preferred warmer, slightly younger/friendlier palette direction.
- `references/uruk-learn-integration.png` — target integration of cinematic legacy artwork into the stable Learn shell.
- `references/legacy-uruk-lesson-poster.png` — legacy energy/content-density reference to decompose, not copy as canonical UI.

When references conflict, prioritize clarity, stable interaction, educational usefulness, accessibility, and restrained premium design—in that order.

## Do not

- reproduce generated screenshot microcopy blindly;
- embed screenshots as UI;
- bake lesson copy into artwork;
- add feature-specific navigation patterns;
- turn progress into task-manager chrome;
- add XP, levels, streak pressure, rarity, or random rewards;
- expose raw knowledge-graph complexity to learners;
- add decorative animation that competes with reading.
