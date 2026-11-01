import { describe, expect, it, vi } from 'vitest';
import { chronosContent } from '../../content/chronos';
import type { Lesson } from '../../src/domains/contracts';
import { LessonModuleSchema } from '../../src/domains/contracts';
import { GUESS_MINIMUM_LENGTH, guessGate, isSincereAttempt, lessonGuess, validateLessonGuesses } from '../../src/domains/guesses';
import { parseSubmittedGuesses, parseSubmittedQuestions } from '../../src/domains/submissions';
import { checkPromptFingerprints, publishedPrompts, regeneratePromptFingerprints } from '../../src/infrastructure/content/promptFingerprints';
import { derivePromptRequirementState } from '../../src/learn/prompt-requirements';
import { LocalPreviewGateway, normalizeLearnState, requiredChecksDone, SupabaseLearnGateway, submissionAnswers, submissionQuestions, type LearnState } from '../../src/learn/progress';

const akkadId = 'lesson.mesopotamia.akkadian-empire';
const akkad = chronosContent.lessons.find((lesson) => lesson.id === akkadId)!;
const guessId = 'guess.akkad.keep-a-city';
const promptById = new Map(chronosContent.prompts.map((prompt) => [prompt.id, prompt]));

const withSections = (sections: Lesson['sections']): Lesson => ({ ...akkad, sections });
const guessModule = (overrides: Record<string, unknown> = {}) => ({ id: 'guess.test.first', type: 'guess' as const, claimIds: [], sourceIds: [], question: 'What would you guess?', payoffModuleId: 'module.test.answer', ...overrides });
const prose = (id: string) => ({ id, type: 'prose' as const, claimIds: [], sourceIds: [], body: 'Text.' });
const section = (id: string, modules: any[]) => ({ id, heading: 'Heading', purpose: 'Purpose', modules });

describe('guess module contract and validation', () => {
  it('parses a guess module and requires a guess. id', () => {
    expect(LessonModuleSchema.safeParse(guessModule()).success).toBe(true);
    expect(LessonModuleSchema.safeParse(guessModule({ id: 'module.test.guess' })).success).toBe(false);
    expect(LessonModuleSchema.safeParse(guessModule({ question: '' })).success).toBe(false);
  });

  it('accepts the Akkad pilot: one guess in the opening section, answered later', () => {
    expect(validateLessonGuesses(akkad)).toEqual([]);
    const guess = lessonGuess(akkad)!;
    expect(guess.id).toBe(guessId);
    expect(akkad.sections[0].modules.map((module) => module.id)).toContain(guessId);
    expect(guess.question).toBe('After the army went home, what would a king need so that the people there kept doing what he said?');
    const payoff = akkad.sections.flatMap((item) => item.modules).find((module) => module.id === guess.payoffModuleId);
    expect(payoff?.type === 'prose' && payoff.body).toMatch(/So what did it take to keep a city\?[^\n]*$/);
    // The prose no longer asks for a guess the reader can skip.
    expect(JSON.stringify(akkad.sections)).not.toContain('Make a guess before you read on');
  });

  it('allows at most one guess per lesson', () => {
    const lesson = withSections([section('section.test.one', [guessModule(), guessModule({ id: 'guess.test.second' }), prose('module.test.answer')])]);
    expect(validateLessonGuesses(lesson).join('\n')).toMatch(/at most one guess module/);
  });

  it('keeps the guess in the first section', () => {
    const lesson = withSections([section('section.test.one', [prose('module.test.opening')]), section('section.test.two', [guessModule(), prose('module.test.answer')])]);
    expect(validateLessonGuesses(lesson).join('\n')).toMatch(/must sit in the lesson's first section/);
  });

  it('needs a payoff that exists in the lesson and comes after the guess', () => {
    const missing = withSections([section('section.test.one', [guessModule({ payoffModuleId: 'module.test.nowhere' })])]);
    expect(validateLessonGuesses(missing).join('\n')).toMatch(/is not a module or section/);
    const before = withSections([section('section.test.one', [prose('module.test.answer'), guessModule()])]);
    expect(validateLessonGuesses(before).join('\n')).toMatch(/must come after the guess/);
    const ownSection = withSections([section('section.test.one', [guessModule({ payoffModuleId: 'section.test.one' })])]);
    expect(validateLessonGuesses(ownSection).join('\n')).toMatch(/must come after the guess/);
    const laterSection = withSections([section('section.test.one', [guessModule({ payoffModuleId: 'section.test.two' })]), section('section.test.two', [prose('module.test.answer')])]);
    expect(validateLessonGuesses(laterSection)).toEqual([]);
  });
});

describe('guess identity follows the prompt-change policy', () => {
  it('records published guesses alongside prompts', () => {
    const published = publishedPrompts(chronosContent.prompts, chronosContent.lessons);
    expect(published.get(guessId)).toMatchObject({ lessonId: akkadId, kind: 'guess' });
  });

  it('fails when a published guess changes its question under the same ID, but not its sentence starter', () => {
    const { file } = regeneratePromptFingerprints(chronosContent.prompts, chronosContent.lessons, undefined);
    const edit = (change: Record<string, unknown>) => chronosContent.lessons.map((lesson) => lesson.id !== akkadId ? lesson : {
      ...lesson,
      sections: lesson.sections.map((item) => ({ ...item, modules: item.modules.map((module) => module.id === guessId ? { ...module, ...change } : module) })),
    });
    expect(checkPromptFingerprints(chronosContent.prompts, edit({ sentenceStarter: 'I think a king would need' }), file)).toEqual([]);
    expect(checkPromptFingerprints(chronosContent.prompts, edit({ question: 'What did kings need?' }), file).join('\n')).toMatch(/guess guess\.akkad\.keep-a-city changed its question/);
  });
});

describe('a guess is never a check', () => {
  it('needs a few words, under the same sincere-attempt rule as written answers', () => {
    expect(isSincereAttempt('soldiers', GUESS_MINIMUM_LENGTH)).toBe(false);
    expect(isSincereAttempt('  more soldiers  ', GUESS_MINIMUM_LENGTH)).toBe(true);
  });

  it('does not count towards required checks, finishing or passing', () => {
    const guessOnly = { [guessId]: 'A king would need his own people there.' };
    expect(requiredChecksDone(akkadId, guessOnly)).toBe(false);
    const requirement = derivePromptRequirementState(akkad.promptIds, promptById, guessOnly);
    expect(requirement.requiredIds).not.toContain(guessId);
    expect(requirement.answeredIds).toEqual([]);
    expect(requirement.ready).toBe(false);
    expect(akkad.promptIds).not.toContain(guessId);
  });

  it('keeps guesses apart from prompt responses in saved progress', async () => {
    const storage = new Map<string, string>();
    vi.stubGlobal('localStorage', { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => { storage.set(key, value); } });
    const gateway = new LocalPreviewGateway();
    const saved = await gateway.saveGuess(akkadId, guessId, 'A king would need soldiers to stay.');
    expect(saved.guesses).toEqual({ [guessId]: 'A king would need soldiers to stay.' });
    expect(saved.responses).toEqual({});
    expect(saved.attemptedPromptIds).toEqual([]);
    await expect(gateway.submit(akkadId)).rejects.toThrow('required prompt attempts missing');
    vi.unstubAllGlobals();
  });

  it('drops a guess the lesson no longer has', () => {
    const state: LearnState = { learnerId: 'x', lessonId: akkadId, status: 'in-progress', attemptedPromptIds: [], exploredSectionIds: [], responses: {}, guesses: { [guessId]: 'Kept.', 'guess.akkad.retired': 'Old.' }, version: 1 };
    expect(normalizeLearnState(state).guesses).toEqual({ [guessId]: 'Kept.' });
    expect(normalizeLearnState({ ...state, guesses: undefined }).guesses).toEqual({});
  });
});

describe('what the learner sees', () => {
  it('locks the lesson until a guess is saved, and opens it once one is', () => {
    expect(guessGate(akkad, {}, false)).toMatchObject({ show: true, locked: true });
    expect(guessGate(akkad, { [guessId]: 'My guess here.' }, false)).toMatchObject({ show: true, locked: false, saved: 'My guess here.' });
  });

  it('opens a lesson finished before it had a guess, with no guess box', () => {
    expect(guessGate(akkad, {}, true)).toMatchObject({ show: false, locked: false });
  });

  it('never locks a lesson without a guess', () => {
    const uruk = chronosContent.lessons.find((lesson) => lesson.id === 'lesson.uruk.first-city')!;
    expect(guessGate(uruk, {}, false)).toEqual({ show: false, locked: false });
  });
});

describe('what goes to the parent', () => {
  const responses = { 'prompt.akkad.urkesh-difference': 'option.akkad.princess-seal', 'prompt.akkad.official-or-princess': 'I would choose an official because the workers need feeding.' };
  const guesses = { [guessId]: 'A king would need soldiers to stay.' };

  it('sends the guess with the written answers, apart from the graded questions', () => {
    expect(submissionAnswers(akkadId, responses, guesses)).toEqual({ [guessId]: guesses[guessId], 'prompt.akkad.official-or-princess': responses['prompt.akkad.official-or-princess'] });
    const questions = submissionQuestions(akkadId, guesses);
    expect(questions[0]).toEqual({ promptId: guessId, kind: 'guess', question: lessonGuess(akkad)!.question, required: false });
    // Review reads written questions and guesses separately, so a guess is never mixed into what is graded.
    expect(parseSubmittedQuestions(questions).map((item) => item.promptId)).toEqual(['prompt.akkad.official-or-princess']);
    expect(parseSubmittedGuesses(questions).map((item) => item.promptId)).toEqual([guessId]);
  });

  it('sends no guess when none was saved', () => {
    expect(submissionQuestions(akkadId, {}).some((item) => item.kind === 'guess')).toBe(false);
    expect(submissionAnswers(akkadId, responses)).not.toHaveProperty(guessId);
  });

  it('stores a guess as a tagged attempt and reads it back apart from prompt responses', async () => {
    const inserts: any[] = [];
    const attempts = [
      { prompt_id: 'prompt.akkad.official-or-princess', response: { answer: 'I would choose an official.' } },
      { prompt_id: guessId, response: { answer: 'Soldiers who stay.', kind: 'guess' } },
    ];
    const chain = (data: unknown) => { const query: any = { select: () => query, eq: () => query, in: () => query, order: () => query, single: async () => ({ data, error: null }), maybeSingle: async () => ({ data: null, error: null }), then: (resolve: (value: unknown) => unknown) => Promise.resolve({ data, error: null }).then(resolve) }; return query; };
    const client: any = { from: (table: string) => ({
      upsert: async () => ({ error: null }),
      insert: async (row: unknown) => { inserts.push(row); return { error: null }; },
      select: () => chain(table === 'lesson_progress' ? { status: 'in_progress', completed_at: null } : table === 'understanding_prompt_attempts' ? attempts : []),
    }) };
    const gateway = new SupabaseLearnGateway('11111111-1111-4111-a111-111111111111', client);
    const state = await gateway.saveGuess(akkadId, guessId, 'Soldiers who stay.');
    expect(inserts).toEqual([{ learner_id: '11111111-1111-4111-a111-111111111111', lesson_id: akkadId, prompt_id: guessId, response: { answer: 'Soldiers who stay.', kind: 'guess' } }]);
    expect(state.guesses).toEqual({ [guessId]: 'Soldiers who stay.' });
    expect(state.responses).toEqual({ 'prompt.akkad.official-or-princess': 'I would choose an official.' });
    expect(state.attemptedPromptIds).toEqual(['prompt.akkad.official-or-princess']);
  });
});
