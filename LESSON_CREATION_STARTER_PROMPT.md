# Chronos Lesson Creation Starter Prompt

Use this prompt to build one Chronos history lesson at a time. It is designed for
ages 11-14, the existing `NodeContent` schema, collectible card rewards, and a
high standard of historical rigor.

## Copy/Paste Starter Prompt

```text
You are helping build Chronos Learning Terminal, a gamified world-history
curriculum for students ages 11-14. Your job is to create exactly one excellent
history lesson at a time.

Before writing the lesson, inspect the repo and the existing completed lessons,
especially:
- data/eras/prelude/climate_transition.ts
- data/eras/foundations/agriculture.ts
- data/eras/foundations/mesopotamia_cities.ts
- data/eras/foundations/egypt_kingdoms.ts
- data/eras/classical/*.ts
- types.ts
- NODE_RESEARCH_RUNBOOK.md
- CONTENT_TODO.md

Preserve the existing lesson contract:
- summary: vivid 3-4 paragraph narrative
- funFact: one sticky, surprising detail
- people: 2-4 trading-card figures, including ordinary people when useful
- inventions: 1-3 concrete innovations in Problem -> Solution -> Impact form
- places: 1-3 physical anchors with location and historical significance
- resources: 3-5 high-quality links, with direct URLs when possible
- quiz: 7-10 questions with teaching explanations and collectibleCards
- imageUrl/imageFit: every collectible-worthy person/invention/place should have
  an image candidate or a deliberate plan to create/source one

Work one node only:
1. Identify the exact node stub in constants.ts: id, title, year, eraId, region,
   tags, neighboring nodes.
2. Decide which existing era/unit file should receive the lesson, or create the
   smallest appropriate new unit file under data/eras/{era}/.
3. Do not jump to other nodes except to maintain chronology and continuity.

Audience standard:
- Write for curious 11-14 year olds, not toddlers and not college students.
- Make the lesson vivid, concrete, and human.
- Define hard terms in context.
- Be honest about uncertainty, debate, cruelty, slavery, war, religion, empire,
  disease, and conquest, but avoid graphic detail and culture-war sermonizing.
- Keep moral clarity and historical empathy together: people in the past were
  real humans operating inside worlds unlike ours.
- At the same time, be brutallyt honest and factual about the past, and avoid the temptation to make it more palatable or less controversial.

Research standard:
Do a rigorous research phase before drafting. Use at least:
- 3 scholarly or institution-backed overview sources
- 3 primary sources: artifacts, inscriptions, maps, objects, or ancient texts when
  available
- 1 source that complicates the simple story, such as a debate, minority
  perspective, archaeological uncertainty, or source-limit warning
- 2 student-friendly resources suitable for ages 11-14
- 1 visual-source pass for every card/reward candidate

Preferred source ladder:
1. Museums, libraries, archives, universities, encyclopedias with editorial
   standards, archaeological projects, peer-reviewed summaries.
2. Primary-source collections and object pages.
3. Strong educational media: Khan Academy, Smarthistory, Crash Course, PBS, BBC,
   History Hit, museum channels, university lectures.
4. Wikipedia only for orientation and leads, never as the final authority.
5. Avoid ad-heavy, sensational, unsourced, AI-content-farm, or conspiracy pages.

Go-to pedagogy references to keep in mind:
- C3 Inquiry Arc: begin with a compelling question, use disciplinary tools,
  evaluate sources/evidence, communicate conclusions.
- Library of Congress primary-source method: observe, question, infer, and test
  with more evidence.
- Stanford historical thinking: sourcing, contextualization, corroboration, and
  close reading.
- How Students Learn: balance factual knowledge with concepts like cause,
  change, evidence, and historical accounts.
- Retrieval practice and spacing: make the quiz do more than grade; make it help
  memory.
- Metacognition: include explanations that model how a historian knows, not just
  what happened.
- Classical/ancient wisdom: use biographies, models, anti-models, civic virtue,
  cause/consequence, and comparison across republics/empires. The American
  founders read classical history this way, using Greece and Rome as both
  inspiration and warning.

The lesson should answer a compelling historical question, not merely "what
happened?" Examples:
- How did this change what ordinary people could do?
- What problem did this society solve, and what new problems did it create?
- Why did this event seem reasonable to people at the time?
- What evidence survives, and what does it fail to tell us?
- What did later people imitate, fear, or misunderstand about this story?

Research workflow:
1. Source sweep:
   - List the best sources found.
   - For each source, note what it contributes and any limitations.
   - Flag disputed claims and avoid presenting speculation as fact.
2. Story spine:
   - Before: what world/problem existed?
   - Spark: what changed?
   - Struggle: who acted, chose, adapted, resisted, or misunderstood?
   - Consequences: short-term and long-term effects.
   - Evidence: what sources/artifacts let us know this?
3. Content map:
   - Pick 2-4 people. Include non-famous roles if they teach the system well.
   - Pick 1-3 inventions/social technologies.
   - Pick 1-3 places/objects/landscapes.
   - Pick 3-5 resources.
   - Pick 4-6 collectible card rewards from the strongest people/inventions/places.
4. Image sourcing:
   - Prefer local repo images if they already exist and match the subject.
   - Prefer public-domain or open-access sources: Library of Congress Free to Use
     and Reuse, Smithsonian Open Access, The Met Open Access, Wikimedia Commons
     with a usable license, museum object pages, national archives, university or
     archaeological project images.
   - For ancient people with no reliable portrait, use an artifact, statue,
     coin, manuscript, site, or historically responsible generated/local image.
   - Do not use random Google thumbnail URLs, hotlinked ad-site images, or
     modern fantasy art unless clearly labeled and appropriate.
   - Record an image sourcing ledger: subject, chosen URL/local path, license or
     rights note, backup option, and why it fits the card.
5. Draft the lesson in the project style:
   - Summary: 3-4 paragraphs, 450-750 words when the topic deserves it.
   - People cards: punchy but accurate, with achievements and legacy where known.
   - Inventions: every entry must have a real problem, solution, and impact.
   - Places: make geography matter.
   - Resources: direct URLs, YouTube links with rel=0 when using normal video URLs.
   - Quiz: 5-7 questions. Include factual, causal, comparison, source/evidence,
     and consequence questions. Explanations must teach.
6. Final review:
   - Verify all node ids and collectible card indices.
   - Verify all required TypeScript fields and category values.
   - Verify every major claim against sources.
   - Check age fit: no babyish tone, no academic fog, no graphic excess.
   - Check global balance and avoid lazy "great man only" history.
   - Check that the lesson includes ordinary lives, systems, trade-offs, and
     consequences.
   - Check image links and resource links for suitability.
   - Run the relevant build/typecheck command if available.

Output format:
1. Brief research dossier with source list and image ledger.
2. A short plan for the single lesson.
3. The actual code patch for the lesson.
4. Verification notes, including any unresolved source or image concerns.

Do not create more than one lesson unless explicitly asked.
Do not invent citations, URLs, dates, quotes, or image licenses.
If evidence is uncertain, say so in the lesson in plain language.
```

## What Existing Lessons Teach Us

The strongest current lessons, especially agriculture, animal domestication,
bronze, Mesopotamia, and Egypt, share a useful shape:

- They start with a dramatic human problem, not an encyclopedia definition.
- They make invisible systems visible: food surplus, trade routes, writing,
  bureaucracy, disease, hierarchy, logistics, and ecological limits.
- They use collectible cards as a second lesson layer: people show agency,
  inventions show mechanisms, and places make the story tangible.
- Their best quiz explanations teach a new connection instead of merely saying
  the answer is correct.
- They are most memorable when they include trade-offs: agriculture feeds more
  people but worsens health; bronze empowers cities but requires fragile tin
  routes; writing preserves memory but begins as accounting and power.

The routine above strengthens that pattern with a more explicit research dossier,
image-rights discipline, and final historical-thinking review.

## Reference Shelf

These are not rigid authorities. They are dependable starting points to keep the
curriculum ambitious, evidence-based, and alive.

- C3 Framework / Inquiry Arc: questions, disciplinary tools, evidence, and
  conclusions. Nebraska Department of Education summary:
  https://www.education.ne.gov/socialstudies/c3-framework-and-inquiry-based-learning/
- National Academies, How Students Learn: History in the Classroom: balance
  factual knowledge with concepts such as cause, change, evidence, and historical
  accounts:
  https://nap.nationalacademies.org/catalog/11100/how-students-learn-history-in-the-classroom
- Library of Congress, Getting Started with Primary Sources: primary sources
  build curiosity, analysis, inference, and multiple-perspective reasoning:
  https://memory.loc.gov/programs/teachers/getting-started-with-primary-sources/
- Stanford/Reading Like a Historian overview via TeachingHistory.org: sourcing,
  contextualization, and corroboration:
  https://teachinghistory.org/best-practices/using-primary-sources/24001
- Education Endowment Foundation, metacognition and self-regulation: planning,
  monitoring, evaluation, reasoning, and debate:
  https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit/metacognition-and-self-regulation
- Nature Reviews Psychology on spacing and retrieval practice:
  https://www.nature.com/articles/s44159-022-00089-1
- Mount Vernon on classicism and the founders: classical history as model and
  warning, especially Rome, Cato, Cincinnatus, Cicero, and Polybius:
  https://www.mountvernon.org/library/digitalhistory/digital-encyclopedia/article/classicism
- Founders Online: primary documents for Washington, Franklin, Hamilton, Jay,
  Adams, Jefferson, and Madison:
  https://founders.archives.gov/about/

## Image Source Shelf

- Library of Congress Free to Use and Reuse:
  https://www.loc.gov/free-to-use/
- Smithsonian Open Access:
  https://www.si.edu/openaccess/faq
- The Met Open Access:
  https://www.metmuseum.org/about-the-met/policies-and-documents/open-access
- Wikimedia Commons licensing guidance:
  https://commons.wikimedia.org/wiki/Commons:Licensing

## Final Review Rubric

Use this rubric before considering a lesson finished.

- Historical accuracy: claims are sourced, uncertainty is named, no invented
  quotes or details.
- Historical thinking: includes cause, change, evidence, perspective, and
  consequences.
- Story quality: has a hook, stakes, human choices, trade-offs, and an ending
  that explains why the event matters.
- Audience fit: 11-14 year olds can follow it, but it still respects their
  intelligence.
- Global balance: avoids treating Europe or famous rulers as the default center
  unless the node genuinely requires it.
- Card quality: people, inventions, and places are collectible because they
  deepen the lesson, not because the schema needs filling.
- Image quality: every card image is relevant, appropriate, stable, and has a
  rights/provenance note in the research dossier.
- Quiz quality: questions retrieve important knowledge, require causal thinking,
  and teach through explanations.
- Technical fit: valid `NodeContent`, correct node id, correct category values,
  correct collectible card indices, direct resource URLs, and successful build.
