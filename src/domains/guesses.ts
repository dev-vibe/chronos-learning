import type { GuessModule, Lesson } from './contracts';

/**
 * "Guess before reading": one short, ungraded question near the top of a lesson.
 * The learner commits to a guess before the rest of the lesson appears, and the
 * guess is shown again where the lesson answers it, and on the parent's Review
 * page. A guess made before reading helps learners remember the answer when they
 * reach it, but only when they actually commit to one.
 *
 * It is not an understanding prompt: it never counts towards the lesson's one to
 * three required checks or towards finishing or passing, and nothing grades it.
 */

/** The fewest characters a guess needs: a few words, under the same sincere-attempt rule as written answers. */
export const GUESS_MINIMUM_LENGTH = 10;

/** A sincere attempt: at least `minimumLength` characters once trimmed. Shared by written answers and guesses. */
export const isSincereAttempt = (text: string | undefined, minimumLength: number) => (text ?? '').trim().length >= minimumLength;

export const isGuessId = (id: string) => id.startsWith('guess.');

type LessonSections = Pick<Lesson, 'sections'>;

/** The lesson's guess modules in page order (validation allows at most one). */
export const lessonGuesses = (lesson: LessonSections | undefined): GuessModule[] =>
  (lesson?.sections ?? []).flatMap((section) => section.modules).filter((module): module is GuessModule => module.type === 'guess');

export const lessonGuess = (lesson: LessonSections | undefined): GuessModule | undefined => lessonGuesses(lesson)[0];

export type GuessGate = {
  guess?: GuessModule;
  /** The learner's saved guess, if any. */
  saved?: string;
  /** Whether the guess box is shown at all. */
  show: boolean;
  /** Whether the lesson after the guess stays hidden until a guess is saved. */
  locked: boolean;
};

/**
 * Decides what the learner sees. A lesson finished before it had a guess opens in
 * full with no guess box: a guess made after reading the answer is not a guess.
 */
export function guessGate(lesson: LessonSections, guesses: Readonly<Record<string, string>> | undefined, finished: boolean): GuessGate {
  const guess = lessonGuess(lesson);
  if (!guess) return { show: false, locked: false };
  const saved = guesses?.[guess.id]?.trim() ? guesses[guess.id] : undefined;
  if (saved) return { guess, saved, show: true, locked: false };
  if (finished) return { guess, show: false, locked: false };
  return { guess, show: true, locked: true };
}

/** Content rules for guesses, reported by `npm run validate:content`. */
export function validateLessonGuesses(lesson: Lesson): string[] {
  const errors: string[] = [];
  const guesses = lessonGuesses(lesson);
  if (!guesses.length) return errors;
  if (guesses.length > 1) errors.push(`${lesson.id}: a lesson has at most one guess module, found ${guesses.map((guess) => guess.id).join(', ')}`);
  const order: Array<{ id: string; sectionIndex: number; position: number; kind: 'section' | 'module' }> = [];
  lesson.sections.forEach((section, sectionIndex) => {
    order.push({ id: section.id, sectionIndex, position: order.length, kind: 'section' });
    section.modules.forEach((module) => order.push({ id: module.id, sectionIndex, position: order.length, kind: 'module' }));
  });
  for (const guess of guesses) {
    const at = order.find((item) => item.kind === 'module' && item.id === guess.id)!;
    if (at.sectionIndex !== 0) errors.push(`${guess.id}: a guess module must sit in the lesson's first section`);
    const payoff = order.find((item) => item.id === guess.payoffModuleId);
    if (!payoff) { errors.push(`${guess.id}: payoffModuleId ${guess.payoffModuleId} is not a module or section in ${lesson.id}`); continue; }
    if (payoff.id === guess.id) { errors.push(`${guess.id}: payoffModuleId must name where the lesson answers the guess, not the guess itself`); continue; }
    // A section pays off after the guess only if it is a later section; a module only if it comes later on the page.
    const after = payoff.kind === 'section' ? payoff.sectionIndex > at.sectionIndex : payoff.position > at.position;
    if (!after) errors.push(`${guess.id}: payoffModuleId ${guess.payoffModuleId} must come after the guess`);
  }
  return errors;
}
