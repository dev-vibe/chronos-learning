import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Check } from 'lucide-react';
import type { GuessModule } from '../domains/contracts';
import { GUESS_MINIMUM_LENGTH, isSincereAttempt, type GuessGate } from '../domains/guesses';

/**
 * Guess before reading: one short, ungraded question near the top of a lesson.
 * Until the learner saves a guess, the rest of the lesson stays hidden; the guess
 * is shown again where the lesson answers it. No right or wrong, no score, no
 * feedback beyond "Saved".
 */

export type GuessContextValue = GuessGate & {
  learnerId: string;
  lessonId: string;
  onSave(guessId: string, text: string): Promise<void>;
};

const GuessContext = createContext<GuessContextValue | null>(null);
export const GuessProvider = GuessContext.Provider;
export const useGuess = () => useContext(GuessContext);

/** The element the locked lesson waits behind. Navigation to a hidden section comes here instead. */
export const GUESS_GATE_ID = 'guess-gate';

/** Brings the learner to the guess when they try to jump into the part of the lesson it is holding back. */
export function focusGuessGate(): boolean {
  const gate = document.getElementById(GUESS_GATE_ID);
  if (!gate) return false;
  const reduce = typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)')?.matches;
  gate.scrollIntoView?.({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
  gate.querySelector<HTMLElement>('textarea, button')?.focus({ preventScroll: true });
  return true;
}

// Tab-scoped, identity-scoped drafts, like written answers.
export const guessDraftKey = (learnerId: string, lessonId: string, guessId: string) => `chronos.guess-draft.v1:${learnerId}:${lessonId}:${guessId}`;

export function GuessBeforeReading({ module }: { module: GuessModule }) {
  const context = useGuess();
  if (!context?.show || context.guess?.id !== module.id) return null;
  return <GuessBox key={`${context.learnerId}:${module.id}`} module={module} context={context} />;
}

function GuessBox({ module, context }: { module: GuessModule; context: GuessContextValue }) {
  const { saved, locked, learnerId, lessonId, onSave } = context;
  const key = guessDraftKey(learnerId, lessonId, module.id);
  const [draft, setDraft] = useState(() => { try { return sessionStorage.getItem(key) ?? saved ?? ''; } catch { return saved ?? ''; } });
  const [editing, setEditing] = useState(!saved);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  // Set only by this component's own save or edit, never on load, so reopening a lesson moves nothing.
  const [focusTarget, setFocusTarget] = useState<'saved' | 'editor' | null>(null);
  // Announced only after a save in this visit; reopening a lesson with a saved guess announces nothing.
  const [announcement, setAnnouncement] = useState('');
  const input = useRef<HTMLTextAreaElement>(null);
  const savedBox = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (focusTarget === 'editor') input.current?.focus();
    if (focusTarget === 'saved') savedBox.current?.focus({ preventScroll: true });
    if (focusTarget) setFocusTarget(null);
  }, [focusTarget, editing]);
  const write = (value: string) => {
    setDraft(value); setError('');
    try { sessionStorage.setItem(key, value); } catch { /* the draft lives in this component only */ }
  };
  const save = async () => {
    if (busy) return;
    if (!isSincereAttempt(draft, GUESS_MINIMUM_LENGTH)) { setError('Write a few words, then save your guess.'); input.current?.focus(); return; }
    setBusy(true); setError('');
    try {
      await onSave(module.id, draft.trim());
      setAnnouncement(locked ? 'Saved. The rest of the lesson is open below.' : 'Saved.');
      setEditing(false);
      setFocusTarget('saved');
    } catch { setError('Your guess could not be saved. Keep this page open and try again.'); }
    finally { setBusy(false); }
  };
  const questionId = `${module.id}-question`;
  const errorId = `${module.id}-error`;
  return <div className="prompt guess" id={GUESS_GATE_ID} data-guess-id={module.id}>
    {saved && !editing
      ? <>
          <strong id={questionId}>{module.question}</strong>
          {/* Focus lands here after saving, where the button was, so the page does not jump. */}
          <div ref={savedBox} className="saved-answer" tabIndex={-1} aria-labelledby={questionId}>
            <p className="saved-answer-label"><Check aria-hidden="true" /> Saved</p>
            <p className="saved-answer-text">{saved}</p>
            <button type="button" className="secondary" onClick={() => { write(saved); setEditing(true); setFocusTarget('editor'); }}>Edit my guess</button>
          </div>
        </>
      : <>
          <label htmlFor={module.id}><strong id={questionId}>{module.question}</strong></label>
          <textarea ref={input} id={module.id} rows={2} value={draft} placeholder={module.sentenceStarter ? `${module.sentenceStarter}…` : undefined} onChange={(event) => write(event.currentTarget.value)} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} />
          <div className="prompt-actions">
            <button type="button" className="secondary" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save my guess'}</button>
            {saved && <button type="button" className="quiet-link" disabled={busy} onClick={() => { write(saved); setEditing(false); setFocusTarget('saved'); }}>Cancel</button>}
          </div>
        </>}
    {error && <p id={errorId} className="error" role="alert">{error}</p>}
    {/* Always rendered, so screen readers hear the change when the lesson opens. */}
    <p className="sr-only" role="status">{announcement}</p>
  </div>;
}

/** The calm state the hidden part of the lesson waits behind. */
export function GuessLock() {
  return <div className="guess-lock"><p>Answer to keep reading</p></div>;
}

/** The learner's own guess, shown where the lesson answers it. */
export function GuessPayoff({ targetId }: { targetId: string }) {
  const context = useGuess();
  if (!context?.guess || !context.saved || context.guess.payoffModuleId !== targetId) return null;
  return <aside className="guess-payoff" aria-label="Your guess">
    <p className="guess-payoff-label">You guessed:</p>
    <p className="guess-payoff-text">{context.saved}</p>
  </aside>;
}
