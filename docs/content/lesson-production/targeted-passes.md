# Targeted passes

Status: the briefs for creation runbook Stage 14D. Each pass checks one thing, run by a fresh reader that sees only the learner-facing text, this brief and the matching section of [voice examples](voice-examples.md). A reader checking one thing finds far more of it than one checking fifteen.

## How to run them

1. Run `npm run lesson:kid-read -- --lesson <lesson-id>` and save the output to a file outside the repository.
2. Start one separate agent per pass (a subagent, a new session or another model), each with the lesson text, its brief below, and the examples file. The passes do not depend on each other; run them in parallel. Pass 2 also gets the storyboard's Point column and the kid's answer; no pass gets the research note.
3. Each pass returns flags as exact quotes with a one-line reason. Fix every flag, or record in the research note why one stays.
4. Then run the Stage 14C kid read on the fixed text with another fresh reader.

## Pass 1 — Names

> You are an editor checking one thing: names. In the lesson text, list every name of a person, people, place, god or object, section by section, and mark each one new or repeated. Do not count names that appear only in a picture caption, the panel or the word boxes. Flag: a section with more than three new names; a lesson with more than about six names a reader has to keep track of; two names that look alike or share a root (Akkad, Agade, Akkadian); one thing called by two names, or an adjective form where “X’s” would do; a name used before the text says what it is; a name the section's point does not need. Quote each one.

## Pass 2 — Points and details

> You are an editor checking one thing: whether each section has a clear point. You are given each section's intended point and the lesson's main idea. For each section, first say in one sentence what the section is about from the text alone, then compare it with the intended point. Flag: a section whose point you could not say, or said differently; a main person or group with nothing at stake that the text says (what they faced or stood to lose); an opening that does not tell the reader within a sentence or two what the section is about; any detail (a date, a number, a find spot, a story) you cannot connect to the point; a person or place whose reason for being in the lesson is not said; a place where the main idea should be stated plainly but is only implied; any box, heading or section that lists what the evidence can and cannot show, or a label that names a method (“What we can know”, “Limits”, “What you can see”) instead of what the box holds. Quote each one.

## Pass 3 — Plain words

> You are an editor checking one thing: whether every sentence says the plain thing. Flag, with the exact words: any phrase that is not literal and that people do not actually say (“What they say is loud”); any sentence an adult would have to read twice; any word a 12-year-old would not use at home that the sentence does not explain; research words (administration, attested, polity, arrangement, connection, relationship, presence, role); sentences that correct an idea the reader never had (“This does not mean…”, “X, not Y”); a hedge in every sentence of a paragraph; a reminder of what is unknown at the end of a section that is not the place where it matters; any wording that says what a historical person privately wanted, felt or intended, or that judges their character (“boast”, “to impress”, “wanted everyone to know”), unless it is attributed to a source or asked of the reader as a question.

## Pass 4 — Questions

> You are an editor checking one thing: the questions at the end. For each question: say in one sentence what it asks; flag any word that is not in the lesson or everyday speech, any label (a clue, the evidence, a find), any “not”, any second question; search the lesson for a sentence that answers the written question, and quote it if you find one (the question must make the learner take a side or use the idea, not copy it); if the written question asks the learner to take a side, say whether the lesson gives them facts to argue either way, and whether the lesson has already answered it for them; for multiple choice, cover the question and say whether the options alone give the answer away, and whether each wrong option is a mistake a real kid could make; read each piece of feedback and say whether it sends the learner to a named part of the lesson without giving the answer.

Also run `npm run lesson:check-questions -- --lesson <lesson-id>` before this pass.
