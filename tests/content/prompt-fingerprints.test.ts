import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import {
  checkPromptFingerprints,
  fingerprintPrompt,
  PROMPT_FINGERPRINTS_PATH,
  regeneratePromptFingerprints,
  type PromptFingerprintFile,
} from '../../src/infrastructure/content/promptFingerprints';

const committed = (): PromptFingerprintFile => JSON.parse(readFileSync(PROMPT_FINGERPRINTS_PATH, 'utf8'));
const content = () => structuredClone(chronosContent);
const choiceId = 'prompt.uruk.administration-evidence';
const essayId = 'prompt.uruk.opportunity-and-cost';
type Content = ReturnType<typeof content>;
const edit = (bundle: Content, id: string, change: (prompt: any) => void) => { change(bundle.prompts.find((prompt) => prompt.id === id)!); return bundle; };
const errorsFor = (bundle: Content, file = committed()) => checkPromptFingerprints(bundle.prompts, bundle.lessons, file);

describe('published prompt fingerprints', () => {
  it('match the committed file for every published prompt', () => {
    const file = committed();
    expect(errorsFor(content(), file)).toEqual([]);
    const published = chronosContent.lessons.filter((lesson) => lesson.status === 'published').flatMap((lesson) => lesson.promptIds);
    expect(Object.keys(file.prompts).filter((id) => !file.prompts[id].retired).sort()).toEqual([...new Set(published)].sort());
  });

  it('regenerating the committed file changes nothing', () => {
    const { file, errors } = regeneratePromptFingerprints(chronosContent.prompts, chronosContent.lessons, committed());
    expect(errors).toEqual([]);
    expect(file).toEqual(committed());
  });

  it.each([
    ['question text', choiceId, (prompt: any) => { prompt.question = `${prompt.question} Explain.`; }],
    ['an option label', choiceId, (prompt: any) => { prompt.options[0].label = 'A different option'; }],
    ['an option id', choiceId, (prompt: any) => { prompt.options[0].id = 'option.uruk.renamed'; }],
    ['an added option', choiceId, (prompt: any) => { prompt.options.push({ id: 'option.uruk.extra', label: 'Another choice' }); }],
    ['the best option', choiceId, (prompt: any) => { prompt.bestOptionId = 'option.uruk.reconstruction'; }],
    ['the required flag', essayId, (prompt: any) => { prompt.required = false; }],
    ['the minimum answer length', essayId, (prompt: any) => { prompt.minimumResponseLength = 40; }],
  ])('fails when %s changes under the same ID, and tells the author to use a new ID', (_label, id, change) => {
    const errors = errorsFor(edit(content(), id, change));
    expect(errors).toHaveLength(1);
    expect(errors[0]).toContain(`prompt ${id} changed`);
    expect(errors[0]).toMatch(/give the changed prompt a new ID/);
  });

  it.each([
    ['explanation', choiceId, (prompt: any) => { prompt.explanation = 'A rewritten explanation in the story voice.'; }],
    ['hint', choiceId, (prompt: any) => { prompt.hint = 'A friendlier hint.'; }],
    ['option feedback', choiceId, (prompt: any) => { prompt.options[0].feedback = 'Look again at what survives.'; }],
    ['option order', choiceId, (prompt: any) => { prompt.options.reverse(); }],
    ['evidence links', choiceId, (prompt: any) => { delete prompt.evidenceModuleIds; }],
  ])('allows %s to change under the same ID', (_label, id, change) => {
    expect(errorsFor(edit(content(), id, change))).toEqual([]);
  });

  it('accepts a replaced prompt once it has a new ID and the file is regenerated, keeping the old one as retired', () => {
    const bundle = content();
    const lesson = bundle.lessons.find((item) => item.id === 'lesson.uruk.first-city')!;
    const old = bundle.prompts.find((prompt) => prompt.id === essayId)!;
    const replacement = { ...old, id: 'prompt.uruk.opportunity-and-cost-v2', question: 'Name one opportunity and one cost of city life, and say who carried the cost.' };
    bundle.prompts = bundle.prompts.filter((prompt) => prompt.id !== essayId).concat(replacement);
    lesson.promptIds = lesson.promptIds.map((id) => id === essayId ? replacement.id : id);

    const stale = errorsFor(bundle);
    expect(stale).toContain(`published prompt ${replacement.id} has no fingerprint. Run npm run content:fingerprints.`);
    expect(stale.some((error) => error.startsWith(`prompt ${essayId} is no longer published`))).toBe(true);

    const { file, errors } = regeneratePromptFingerprints(bundle.prompts, bundle.lessons, committed());
    expect(errors).toEqual([]);
    expect(file.prompts[essayId]).toEqual({ ...committed().prompts[essayId], retired: true });
    expect(file.prompts[replacement.id]).toEqual({ lessonId: 'lesson.uruk.first-city', fingerprint: fingerprintPrompt(replacement) });
    expect(errorsFor(bundle, file)).toEqual([]);
  });

  it('never lets a retired ID come back as a different question', () => {
    const bundle = content();
    const lesson = bundle.lessons.find((item) => item.id === 'lesson.uruk.first-city')!;
    lesson.promptIds = lesson.promptIds.filter((id) => id !== essayId);
    const { file } = regeneratePromptFingerprints(bundle.prompts, bundle.lessons, committed());
    expect(file.prompts[essayId].retired).toBe(true);

    lesson.promptIds.push(essayId);
    edit(bundle, essayId, (prompt) => { prompt.question = 'A different question reusing the old ID'; });
    expect(errorsFor(bundle, file)[0]).toContain(`prompt ${essayId} changed`);
  });

  it('refuses to regenerate over a changed question instead of recording the new hash', () => {
    const bundle = edit(content(), choiceId, (prompt) => { prompt.bestOptionId = 'option.uruk.later-story'; });
    const { file, errors } = regeneratePromptFingerprints(bundle.prompts, bundle.lessons, committed());
    expect(errors[0]).toContain(`prompt ${choiceId} changed`);
    expect(file.prompts[choiceId]).toEqual(committed().prompts[choiceId]);
  });

  it('ignores prompts in draft lessons until they are published', () => {
    const bundle = content();
    const draft = bundle.lessons.find((lesson) => lesson.status === 'draft' && lesson.promptIds.length > 0);
    if (!draft) return;
    edit(bundle, draft.promptIds[0], (prompt) => { prompt.question = 'Still being drafted'; });
    expect(errorsFor(bundle)).toEqual([]);
  });

  it('reports a missing fingerprint file', () => {
    expect(checkPromptFingerprints(chronosContent.prompts, chronosContent.lessons, undefined)).toEqual([`${PROMPT_FINGERPRINTS_PATH} is missing. Run npm run content:fingerprints.`]);
  });
});
