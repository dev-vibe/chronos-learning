# Chronos lesson production authoring templates

Copy the needed blocks into the lesson's single `docs/research/<lesson>.md` record. Fill every applicable field and record why an item is not applicable. Do not keep an independent checklist elsewhere.

## Research and design record

```markdown
# <Lesson title> research and editorial note

Issue:
Lesson ID:
Research-note identity/version:
Journey/chapter/position:
Required or optional:
Queue status:
Accountable reviewer:
Validation tier: reference | high-risk | ordinary

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

## Research questions

- <question>

## Source ledger

| Source ID | Citation/link | Type/authority | Claims supported | Limits/bias | Corroboration | Rights | Review |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Claim ledger

| Claim ID and wording | Kind | Certainty | Sources | Counterevidence/limits | Missing perspective | Learner treatment | Review |
| --- | --- | --- | --- | --- | --- | --- | --- |

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
Required sincere-attempt evidence:

## Section/component storyboard

| Order | Section ID | Learner-facing heading | Authoring purpose (not shown) | Claims/sources | Module | Media/action | Transition |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Media decisions

| Intention ID | Section ID | Teaching question | Form | Evidence/claim basis | Depiction label | Accessible equivalent | Stage 14A treatment | Final review |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Image lifecycle

Use one block below for every accepted image. Keep the actual reference and final image visible in rendered Markdown so reviewers can compare them without locating files manually.

### `<media-id>` — <teaching role>

#### 1. Reasoning and source basis

- Teaching job:
- Governing claim IDs:
- Factual/historical sources:
- Why image instead of no media:
- Depiction and uncertainty boundary:

#### 2. Reference image actually used

| Reference preview | Origin and permitted use |
| --- | --- |
| ![Reference for <media-id>](<repository-relative-reference-path>) | Creator/institution:<br>Canonical origin:<br>License/use:<br>Accessed: |

- Repository research copy and SHA-256:
- Edit mode: style-only transformation | adapted composition | direct use
- Visual relationship to preserve:
- Locked layout/detail invariants (required for style-only transformation):
- Details not to copy or infer:

#### 3. Generation or transformation

- Operation: image edit | direct licensed use | crop/compression only
- Actual input path and SHA-256:
- Tool/model/date:
- Complete prompt (`No generation` when applicable):

```text
<exact prompt, unchanged>
```

- Candidate/rejection record:

#### 4. Accepted final image

| Reference used | Accepted final |
| --- | --- |
| ![Reference comparison for <media-id>](<repository-relative-reference-path>) | ![Accepted final for <media-id>](<repository-relative-final-master-path>) |

- Final master path, dimensions, and SHA-256:
- Runtime/fallback path and SHA-256:
- Reviewer/date/status:
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

## Ages 11–14 transformations

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

### Proxy review

Reviewer/date:
Raw prototype supplied without intended diagnosis: yes | no

| Quality area | Pass/revise/blocking/N/A | Evidence from prototype | Disposition |
| --- | --- | --- | --- |
| Mental-model coherence | | | |
| Narrative momentum | | | |
| Age-appropriate cognitive load | | | |
| Evidence reasoning | | | |
| Historical proportionality | | | |
| Visual teaching value | | | |
| Next-action clarity | | | |

### Product/editorial review

Reviewer/date:
State: pending | changes requested | approved
Material decisions:
Blocking findings:
Explicit safe deferrals:

### Optional learner observation

Observed: yes | no
Learner age band/date, if applicable:
Observed behavior:
Changes made:
Future family/public-release UAT note:

### Earlier-risk comparison

Confusing prose found earlier:
Weak transitions found earlier:
Cognitive overload found earlier:
Decorative media found earlier:
Prompt mismatch found earlier:
Unclear action hierarchy found earlier:
```

## Final sign-off

```markdown
## Final sign-off

- [ ] Research integrity
- [ ] Historical/editorial review
- [ ] Ages 11–14 learning/editorial design review
- [ ] Learner-prototype checkpoint approved
- [ ] Section/component storyboard review
- [ ] Visual/media/map/video review as applicable
- [ ] Rights/provenance review
- [ ] Knowledge Card review or explicit no-card decision
- [ ] Prompt/completion review
- [ ] Accessibility review
- [ ] Deterministic implementation and release gates
- [ ] Content/media/tests/type/build validation
- [ ] Empty-database and hosted-development verification
- [ ] Responsive browser review
- [ ] Product owner approval
```
