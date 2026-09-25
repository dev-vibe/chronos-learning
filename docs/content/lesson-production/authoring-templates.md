# Chronos lesson production authoring templates

Copy the needed blocks into the lesson's single `docs/research/<lesson>.md` record. Fill every applicable field and record why an item is not applicable. Do not keep an independent checklist elsewhere.

## Research and design record

```markdown
# <Lesson title> research and editorial note

Issue:
Lesson ID:
Research-note identity/version:
Production record version: 2
Journey/chapter/position:
Required or optional:
Accountable reviewer:
Validation tier: reference | high-risk | ordinary

## Owner decision card (Stage 3B)

Recommended focus: <one short sentence>
Reply `all yes` or give numbered `yes / change / no` responses; a change needs only a few words.

| # | Provisional teaching beat — one-sentence message | Visual that might help (or none) |
| --- | --- | --- |
| 1 | | |
| 2 | | |
| 3 | | |
| 4 | | |
| 5 | | |

Material decision-changing caveat, if any: <one sentence; otherwise omit>
Optional explanation and [research packet](#recent-challenge-audit-stages-3a3b) follow. Decision status: pending | responded with date/link.

## Node proposal

Essential question:
Durable understanding:
Supporting understandings:
Evidence encounter:
Prerequisites:
Common misconceptions:
Scope — dates/places/actors:
Why this is one lesson:
Non-goals/deferred material:
Bridge from previous lesson:
Bridge to next lesson:
Geographic orientation: recognizable wider-world anchor → region → lesson places:
Visible native orientation sentence and intended map size:

## Research questions

- <question>

## Source ledger

| Source ID | Citation/link | Type/expertise | Role (central supporting / qualifying / discovery lead) | Claims supported and exact location | Limits/bias | Corroboration | Rights | Review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Recent-challenge audit (Stages 3A–3B)

Baseline account that would otherwise be inherited:
Default search window and any extension beyond approximately 50 years:

| Revision/upset and consequence | Origin/current form | Evidence/provenance | Method and inferential link | Independent corroboration | Strongest countercase | Discriminating test | Status | Lesson consequence |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

Full matrix above is for consequential challenges, including the inherited account. Peripheral proposals are screened briefly:

| Proposal / evidence lead | Why peripheral or deferred | Reconsider if |
| --- | --- | --- |

Ancient, Indigenous, local, descendant, or transmitted accounts considered:
Comparative analyses considered:

### Coverage statement

- Search terms and terminology variants:
- Databases, repositories, and citation trails:
- Disciplines and evidence classes:
- Independent or claim-owner channels:
- Inaccessible evidence:
- Known gaps:

### Research-direction packet and product-owner response

Provisional synthesis:
Possible effect on essential question and central argument:
Required main-lesson highlights:
Story Arc / Investigation depth candidates:
Judgments or further research requested from product owner:
Packet shared (date/link):
Product-owner response:
Follow-up research and disposition:

## Claim ledger

| Claim ID and wording | Kind | Certainty | Sources | Counterevidence/limits | Missing perspective | Learner treatment | Review |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Central claim support

List every claim carrying the explanation, chronology, attribution, key visual relationship or major misconception correction. Repeat rows for independent support or qualifying evidence; exact locators identify page/figure/passage/object and relevant context. Register central source IDs in authored content. The gate validates IDs/structure; reviewers judge completeness and claim fit.

| Claim ID | Source ID | Locator | Review |
| --- | --- | --- | --- |
| <registered claim ID> | <registered source ID> | <p. / fig. / named passage / object ID and description> | <reviewer, date, close-reviewed> |

## Content triage

| Candidate idea | Essential/supporting/enrichment/deferred/rejected | Why | Destination |
| --- | --- | --- | --- |

## Learning blueprint

Essential question:
Durable understanding:
Supporting understandings:
Prerequisites:
Misconceptions:
Indispensable vocabulary:
Evidence encounter:
Historical-thinking move:
Retrieve: <earlier idea and existing lesson ID, or everyday prior knowledge for an opening lesson>
Extend: <how the explanation develops or complicates that idea>
Revisit: <where it returns; mark planned/unpublished content honestly>
Reasoning progression: <prior scaffold → current move → next increase in independence>
Transfer plan: <reviewed unfamiliar evidence here or at a named later occasion; justify deferral>
Completion versus mastery: <sincere attempts record study; what observation could show independent understanding>
Required sincere-attempt evidence:
Story spine: <person, object, place or puzzle followed from opening to end>
Memorable moments: <two to four true, specific details or stories a learner would retell>

## Section/component storyboard

| Order | Section ID | Learner-facing heading | Authoring purpose (not shown) | Claims/sources | Module | Media/action | Transition |
| --- | --- | --- | --- | --- | --- | --- | --- |

Heading voice: each learner-facing heading names the subject or job in ordinary words. Fail metaphors, riddles, and punchlines. If the heading needs explaining, rewrite it.
Recurring type labels: evidence chrome **Surviving evidence**; close-read knowledge **What you can see**; labor/institution knowledge **Who did the work**; source-limit knowledge **What we can know**.

## Media decisions

| Intention ID | Section ID | Teaching question | Form | Evidence/claim basis | Depiction label | Accessible equivalent | Stage 14A treatment | Final review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Image lifecycle

Use one block below for every accepted image. Keep every actual subject reference and the final image visible in rendered Markdown so reviewers can compare them without locating files manually. Repeat the reference preview row for every input; style/layout references do not count as evidence for a real subject.

### `<media-id>` — <teaching role>

#### 1. Reasoning and source basis

- Teaching job:
- Governing claim IDs:
- Factual/historical sources:
- Why image instead of no media:
- Depiction and uncertainty boundary:

#### 2. Reference image or reviewed data actually used

For direct evidence and image-based transformations, show the actual reference image. For factual native/vector/data rendering, link the reviewed measurements or dataset and versioned renderer instead of inventing a reference image; retain a visible accepted-final preview and compare its labels, geometry, measurements, and relationships against that record. Maps still require the authoritative geographical anchor specified in the map guidance. The gate accepts both this heading and the earlier image-only heading.

| Reference preview | Origin and permitted use |
| --- | --- |
| ![Reference for <media-id>](<repository-relative-reference-path>) | Creator/institution:<br>Canonical origin:<br>License/use:<br>Accessed: |

- Repository research copy and SHA-256:
- Edit mode: style-only transformation | adapted composition | direct use
- Visual relationship to preserve:
- Locked layout/detail invariants (required for style-only transformation):
- Details not to copy or infer:

| Depicted real subject / composite panel | Actual subject reference and object/accession or figure ID | Input path and SHA-256 | Physical or measured details to preserve | Final fidelity verdict |
| --- | --- | --- | --- | --- |
| <each subject; no uncovered real subjects permitted> | <photograph, scan, measured drawing, or published plan of that subject> | <actual image supplied to tool or reviewed data used by renderer> | <identity, morphology, inscription, wall relationships, survey patterns as applicable> | pass / fail |

- Separate style/layout-only references:
- Unsupported subjects omitted or replaced with native text:

#### 3. Generation or transformation

- Operation: image edit | direct licensed use | crop/compression only | deterministic/native/vector rendering
- Reviewed data/code paths and versions (for deterministic output):
- Every actual input path and SHA-256:
- Tool/model/date:
- Complete prompt, including subject-to-reference mapping and prohibition on invented physical or measured details (`No generation` when applicable):

```text
<exact prompt, unchanged>
```

- Candidate/rejection record:

#### 4. Accepted final image

| Reference used | Accepted final |
| --- | --- |
| ![Reference comparison for <media-id>](<repository-relative-reference-path>) | ![Accepted final for <media-id>](<repository-relative-final-master-path>) |

- Final master path, dimensions, and SHA-256: (archival research copy; typically PNG)
- Runtime/fallback path and SHA-256: (catalog `sourcePath` under `public/images/` plus optimized fallback; JPEG + `photo` when the archival file cannot meet ql-v1)
- Reviewer/date/status:
- Subject coverage verdict — every depicted real subject has an actual visual reference or reviewed factual data used by the method: yes | no (a `no` cannot be accepted)
- Subject fidelity verdict — every subject preserves its referenced physical or measured details: yes | no (a `no` cannot be accepted in either edit mode; illustrative/reconstruction labels do not waive this)
- Fidelity verdict — every locked invariant retained: yes | no (a `no` cannot be accepted)
- Lesson-size verdict — evidence-bearing differences remain visually distinct on desktop and mobile: yes | no (a `no` cannot be accepted)
- Comparison verdict — preserved relationship:
- Comparison verdict — intentional changes:
- Comparison verdict — unsupported details checked:

## Knowledge Card decision

Decision: card | no card
Rationale:
Stable card ID, category, class, and unlock lesson if applicable:
Understanding anchored:
Sources and visual brief:

## Prompt rationale

| Prompt ID | Required | Understanding/evidence assessed | Misconception exposed | Feedback job |
| --- | --- | --- | --- | --- |

## Ages 11–15 transformations

Initial drafting reference: roughly 12–13; age fit remains a hypothesis until observed with learners.

- <original complexity or risk> → <learner treatment without distortion>
```

## Individual media decision

Use this block for any medium requiring more detail. Follow the specialist runbook rather than copying its procedure here.

```markdown
Teaching purpose:
Claim/source basis:
Selected form and alternatives considered:
Depiction mode/label:
Placement and learner action:
Accessibility equivalent:
Rights/provenance:
Specialist runbook outputs:
Review status:
```

## Prototype review record

```markdown
## Learner-prototype review

Prototype lesson ID:
Research-note identity/version:
Preview route:
Prototype commit:
Validation tier: reference | high-risk | ordinary
Deterministic prototype gate: pass | fail

### Media intentions

| Intention ID | Section ID | Annotation shown | Review state | Disposition |
| --- | --- | --- | --- | --- |

### Author quality check (Stage 14B)

Checked by/date:

| Question area | Pass/revise/blocking/N/A | Evidence from prototype | Disposition |
| --- | --- | --- | --- |
| Mental model | | | |
| Cumulative learning | | | |
| Momentum | | | |
| Cognitive load | | | |
| Headings | | | |
| Evidence reasoning | | | |
| Proportionality | | | |
| Visual value | | | |
| Story | | | |
| Next action | | | |
| Research integrity | | | |
| Rights, media and accessibility | | | |
| Technical integrity | | | |

### Product/editorial review

Reviewer/date:
State: pending | changes requested | approved
Material decisions:
Blocking findings:
Explicit safe deferrals:
```

## Final sign-off

```markdown
## Final sign-off

Research checkpoint response (owner touchpoint 1): <date / link>
Prototype approval (owner touchpoint 2): <date / link>
Implementation and release gates: pass <date>
Publication: merged <PR link>; <n> media objects checksum-verified
Owner hosted check (owner touchpoint 3): pass <date>
```
