# Chronos design system

This is the concise implementation guide. The PRD remains authoritative for full product behavior.

## Product personality

Chronos combines a best-in-class learning app, an editorial history publication, and a premium museum companion. It is warm, intelligent, calm, spacious, and intuitively enjoyable for learners around ages 11–15 while remaining visually credible for adults.

Use roughly age 12–13 as the initial drafting reference, subject to actual learner observation. Primarily support homeschooling; parent account controls and linked-child progress remain separate from the learner shell.

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

1. Masthead, significance and compact time/place orientation from reviewed geography and authored chronology
2. Cinematic hero reconstruction or evidence-led opening
3. Opening hook
4. Five to eight semantic narrative/evidence sections, with contextual comparison only when it has teaching value
5. World Check and one-to-three-prompt Check Your Understanding
6. Explicit completion panel
7. Post-completion next step: continue the current journey, then an optional card or authored exploration when meaningful

### Lesson section headings

Learner-facing hierarchy is: masthead → section `h2` → optional module `h3` only when the module needs its own local cue.
The `h2` names the subject or teaching job in ordinary words. It is not a metaphor, riddle, or punchline.
Do not render section `purpose` above the `h2`. Teal uppercase eyebrows are reserved for true labels (depiction mode, card class, artifact type), not authoring stage directions.

A thin sticky treatment and compact text such as “4 of 7 sections explored” show current-lesson progress. Do not add large section checklists. Persist stable section IDs only to record which sections were explored. Reopening a lesson always starts at the top; do not add within-lesson resume controls, automatic scrolling, or scroll-position restoration.

Do not create a progress-bearing “Connections” or “Follow the idea forward” section whose primary job is navigation. Historical before/elsewhere/reappearance context belongs inside the lesson where it explains the subject and should not be hidden until completion. A related lesson, Story Arc, Idea Trail, or Investigation may be surfaced at a pedagogically meaningful point, but its control is visually separate from the explanation, clearly optional, non-disruptive, and subordinate to the learner's current required action.

## Understanding checks

Use multiple choice, ordering, matching, image hotspots, comparison, concise explanation, or source interpretation. Explanations use write → “Compare your thinking” → clearly labeled authored example/explanation → optional revision. Do not reveal feedback automatically at a character threshold or present an example as personalized evaluation. Preserve drafts and progress. Optional authored hints point to evidence; choices may have specific explanatory feedback. Sincere attempts are sufficient; completion does not certify mastery. No lives, countdowns, grades, loud failure states, or perfect-score completion gate.

### Guess before reading

A lesson may open with one ungraded question the learner answers before the rest of the lesson appears ([Stage 9](../content/lesson-creation-runbook.md#guess-before-reading)). It uses the same fixed prompt surface as the checks, with no extra label or slogan around it:

- **Box.** The question in the prompt's serif, a short text box (two lines, resizable) whose placeholder is the optional sentence starter, and a plain secondary **Save my guess** button. A guess needs a few words, under the same sincere-attempt rule as written answers; a too-short guess gets a calm “Write a few words, then save your guess.” No right or wrong, no score, no feedback beyond **Saved**.
- **Locked.** Until a guess is saved, nothing after it is on the page: no later sections, checks or completion panel. Below the box sits a quiet dashed panel, **Answer to keep reading**, in muted text. Jumping to a hidden section (journey drawer, People, places and words) brings the learner to the guess instead.
- **Saved.** The box becomes the saved-answer surface (check, **Saved**, the guess, **Edit my guess**) and the rest of the lesson appears below with no animation. Focus moves to the saved guess, where the button was, so the page does not jump, and a polite status tells screen readers the rest of the lesson is open.
- **Reopening.** A saved guess shows read-only (editable like a written answer) and the whole lesson is open. The lesson still opens at the top; nothing scrolls or takes focus on its own. A lesson finished before it had a guess shows no guess box.
- **Payoff.** Just after the paragraph that answers the question, a warm note surface with a gold rule shows **You guessed:** and the learner's words in the reading serif.
- **Review.** Parents see it first, in a dashed box headed **Guess before reading · not graded**, above **Written answers** and never mixed into them.

## Reading and inspectable evidence

Evidence cards use the registered image dimensions: landscape images span the top with text below; square and portrait images sit to the left of text. Mobile and the largest reading size stack both. Keep the full image at its natural proportions, without fixed-height filler or cropping. Enlargement is a discreet, labeled 44px overlay control. An authored layout can override the default when evidence details need a different presentation; unrelated images must not be paired just to demonstrate comparison support.

Keep prose in reading order; use multi-column explanations only when comparison benefits. Captions and evidence labels must remain readable, with redundant badges removed while evidence/reconstruction distinctions remain clear. Simple text-size controls must reflow on narrow screens without horizontal reading scroll.

Artifacts and maps can enlarge in an accessible viewer with keyboard/touch controls, focus containment and return, and text alternatives. Authored “Look here” notes and side-by-side comparisons use reviewed evidence. Keep relevant evidence available while answering. Opening maps must connect recognizable wider geography to the lesson places through their extent or a linked inset, with a visible native orientation sentence. Give maps enough width to read this connection without enlargement; do not squeeze them beside a timeline until labels become decoration. Maps/timelines disclose approximate dates, uncertain geography, deep-time units and any schematic scale; do not invent precision.

Learner copy gives a warm next action. Keep internal terms such as “deterministic,” “reviewed path” and character thresholds out of ordinary instructions. Provenance remains inspectable in secondary surfaces.

### Rolling a cylinder seal

An evidence module may opt into `interaction.kind: 'seal-roll'` without adding a lesson section or changing progress. Show a horizontal gray clay strip, an upright dark stone, and the actual photographed impression appearing behind the contact line. The strip spans two turns and stops. Use the measured repeat for the cylinder circumference and one shared distance for movement, surface rotation and print reveal; reverse movement hides the print.

The cylinder is a canvas illustration with an arcsine projection, a mirrored impression texture, inverted relief lighting, lapis tint and quiet shading. Label it **Illustration made from the museum photo**. Never imply the turning stone is photographed or that its surface is a measured 3D reconstruction. Keep the original museum photo in a **Museum photo** disclosure with the existing enlargement control and source details.

The seal has a minimum 44px focusable drag handle, pointer capture, horizontal dragging with vertical touch scrolling preserved, and Left/Right keys (Home/End also work). Plain **Roll it** and **Start over** buttons start a six-second roll and reset it. Reduced motion reveals four discrete steps instead of smooth motion. A text equivalent explains the process, and a polite status announces completion. Nothing autoplays, scores, makes sound or changes learner progress. Use existing semantic surface, ink, line and teal tokens for controls and focus.

The original photo appears when canvas or its texture fails and in print; the Akkad route has an HTML photo fallback when JavaScript is disabled. Check desktop, 390px, keyboard, touch, reduced motion and print. The mathematically registered display is an illustration; photo-derived repeat measurements and perspective limits belong in the asset lifecycle.

### Lesson terms

Terms move “what is this?” explanations out of the reading line while keeping them one tap away. Authoring rules live in [Stage 9 of the creation runbook](../content/lesson-creation-runbook.md#lesson-terms).

- **In-text term.** A dotted teal underline in the reading text's own font and color; hover and open states turn it solid with a faint teal wash. No bright highlight, icon or badge. Only the first marked occurrence in each section is a term, so a reader who jumps into a section still finds it without the page filling with underlines. Each term is a native button with an invisible hit area of at least 44px that does not change line height.
- **Definition box.** One small box at a time: kind label (Person, People, Place, Word, Object) as a teal eyebrow, the label in the editorial serif, the definition in sans, and a 44px close button. It is anchored to the term with a small pointer, below it when there is room and above it otherwise, and stays clear of the sticky mobile header and tab bar, so it never covers the term. The same popover is used at every width; at 390px it is the full reading width (340px max). A bottom sheet was rejected because it can cover the term and takes the reader out of the line they were reading.
- **Opening it.** Tap, click, Enter or Space opens it and moves focus into it (`role="dialog"`, non-modal, labelled by the term and described by the definition). Escape or the close button closes it and returns focus to the term; tapping elsewhere closes it. On devices that hover (`(hover: hover)`), resting on a term for about a third of a second shows the same box as a preview without moving focus; hover is never the only way in. Reduced motion removes the fade.
- **People, places and words panel.** Directly below Time and place, in the same quiet bordered surface. It lists only featured terms (at most 8), grouped People, Places, Words, each as label plus a one-line gloss, so it reads as an index rather than a game element. Each item scrolls to its section (smoothly unless reduced motion is set) and moves focus to the section heading. It is a disclosure: open by default on wider screens, collapsed by default at 700px and below so the first section is not pushed far down. Nothing is remembered; reopening a lesson still starts at the top.
- Lessons without terms render exactly as before: no panel, no marks.

## Home, discovery and adult support

Continue dominates Home with chapter context; an authored retrieval opportunity may connect earlier learning to what comes next. Completion states what was studied and previews the next lesson concretely. Knowledge Cards may offer optional recall and useful connections without review pressure.

Library leads with available subjects, objects and questions, with World History the default. Unavailable categories and the production roadmap are secondary. Parent accounts provide verified child-account linking and views of progress and submitted assessments in a separate surface. No public parent teaching companions; private data requires verified relationships and authorization.

## Hero and visual exploration

Preserve the excitement of legacy lesson posters by decomposing them:

- central reconstruction → cinematic hero;
- map/timeline/process → native responsive modules;
- surviving object → separate museum-neutral Evidence module;
- dense poster → optional Visual Field Guide or printable completion recap.

Choose factual visual methods using the [canonical media policy](../content/lesson-creation-runbook.md#media-method-and-fidelity-policy): licensed evidence originals, reviewed native/vector or raster diagrams/timelines, source-faithful maps, and generated reconstruction/atmosphere where useful. Lesson maps use the [Akkad locator](../../public/images/akkad/akkad-locator.jpg) as the visual reference: warm golden terrain, clear blue water and rivers, terracotta accents, subtle relief, and high-contrast labels. Adapt those choices to the geography and teaching purpose so maps feel lively and inviting for young learners without losing clarity. Real maps or reviewed data supply the geography; the Akkad image supplies style only. Preserve source/data fidelity, rights, uncertainty and accessibility. Other evidence and diagrams do not require generative restyling.

Generated art contains no titles or explanatory paragraphs. Native UI supplies caption, attribution, depiction label, hotspots, and educational text.

## Historical visual language

| Treatment | Meaning |
| --- | --- |
| Cinematic scene with explicit caption | Evidence-based reconstruction |
| Neutral museum surface | Artifact/site/source evidence |
| Illustrated atlas with subtle terrain | Geographic map, edited faithfully from a real source |
| Fine blue linework | Diagram or explanatory model |
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

### Handling a card

An earned card is a physical object the learner can pick up, not a menu destination. The card appears wherever it is earned or found (the pass celebration, the lesson's completion panel, and Recently discovered on Home), and it behaves the same way everywhere:

- It leans toward the pointer with a soft sheen, and turns when dragged sideways or tapped. A release with enough distance or speed carries it to the other face with a little weight; a short, slow drag settles back.
- The front is the card. The back is for remembering: an optional recall prompt that reveals the card's facts when the learner asks, plus an honest note about the picture (evidence vs. reconstruction, rights).
- Motion is identical for every card. No rarity-based foil, no escalating effects, no sounds, no scoring of recall, nothing persisted about it.
- A visible “Turn card over” button gives keyboard and screen-reader users the same result. The hidden face is inert and hidden from assistive technology.
- Dragging is horizontal only (`touch-action: pan-y`), so the lesson still scrolls normally under a finger.
- With `prefers-reduced-motion`, there is no lean or spin; the card simply swaps faces.
- Opening an owned card from Home is an in-place dialog with a link back to its lesson. Do not add a collection page or card-specific navigation for this.

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
