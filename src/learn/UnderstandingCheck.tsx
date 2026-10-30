import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, CheckCircle2, RotateCcw } from 'lucide-react';
import type { UnderstandingPrompt } from '../domains/contracts';

/** A picture from the lesson to keep beside the question. Its title, written in the lesson, labels it. */
export type PromptPicture = { id: string; title: string; content: ReactNode };

type Props = {
  prompt: UnderstandingPrompt;
  answer: string;
  learnerId: string;
  pictures?: PromptPicture[];
  /** A parent sent the lesson back: open a written answer for editing, filled with what was sent. */
  reopen?: boolean;
  onAttempt(id: string, response: string): Promise<void>;
};

// Tab-scoped, identity-scoped drafts are deliberately separate from submitted progress.
export const promptDraftKey = (learnerId: string, lessonId: string, promptId: string) => `chronos.prompt-draft.v1:${learnerId}:${lessonId}:${promptId}`;

export function UnderstandingCheck({ prompt, answer, learnerId, pictures = [], reopen = false, onAttempt }: Props) {
  const key = promptDraftKey(learnerId, prompt.lessonId, prompt.id);
  const [draft, setDraft] = useState(() => { try { return sessionStorage.getItem(key) ?? answer; } catch { return answer; } });
  // A written answer with unsaved changes in this tab reopens in the editor.
  const [compared, setCompared] = useState(() => Boolean(answer) && (prompt.kind !== 'concise-explanation' || (!reopen && draft === answer)));
  const [focusEditor, setFocusEditor] = useState(false);
  // The last answer known to be saved: from progress, or from this component's own save.
  const [savedText, setSavedText] = useState(answer);
  useEffect(() => { if (answer) setSavedText(answer); }, [answer]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [draftSaved, setDraftSaved] = useState(true);
  const input = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { if (focusEditor) { input.current?.focus(); setFocusEditor(false); } }, [focusEditor]);
  const write = (value: string) => {
    setDraft(value); setError('');
    try { sessionStorage.setItem(key, value); setDraftSaved(true); } catch { setDraftSaved(false); }
  };
  const compare = async (value = draft) => {
    if (prompt.kind === 'concise-explanation' && value.trim().length < prompt.minimumResponseLength) {
      setError('Write a little more, then save it.'); input.current?.focus(); return;
    }
    if (prompt.kind === 'supported-selection' && !prompt.options.some((option) => option.id === value)) {
      setError('Choose an answer, then check it.'); return;
    }
    if (!value.trim() || busy) return;
    setBusy(true); setError('');
    try {
      await onAttempt(prompt.id, value.trim());
      setSavedText(value.trim());
      setCompared(true);
      // Keep the draft until another explicit submission, including optional revisions.
    } catch { setError('Your answer could not be saved. Keep this page open and try again.'); }
    finally { setBusy(false); }
  };
  const essay = prompt.kind === 'concise-explanation';
  // Once saved, a written answer collapses to read-only text with an Edit button.
  const savedEssay = essay && compared && Boolean(savedText);
  const edit = () => { setCompared(false); setFocusEditor(true); };
  const cancel = () => { write(savedText); setCompared(true); };
  return <div className="prompt" id={`prompt-${prompt.id}`}>
    {essay && !savedEssay
      ? <label htmlFor={prompt.id}><strong>{prompt.question}</strong></label>
      : <strong id={`${prompt.id}-question`}>{prompt.question}</strong>}
    {/* The shell adds no words of its own here: each picture is labeled with its own title from the lesson. */}
    {pictures.map((picture) => <details key={picture.id} className="prompt-evidence"><summary>{picture.title}</summary><div>{picture.content}</div></details>)}
    {prompt.hint && <details className="prompt-hint"><summary>Hint</summary><p>{prompt.hint}</p></details>}
    {savedEssay
      // No model answer here: that would be the answer key. The parent sees it on Review.
      ? <div className="saved-answer" role="status" aria-label="Your saved answer">
          <p className="saved-answer-label"><Check aria-hidden="true" /> Saved</p>
          <p className="saved-answer-text">{savedText}</p>
          <button type="button" className="secondary" onClick={edit}>Edit my answer</button>
        </div>
      : essay
        ? <>
            <textarea ref={input} id={prompt.id} value={draft} placeholder={prompt.answerPlaceholder} onChange={(event) => write(event.currentTarget.value)} aria-invalid={Boolean(error)} aria-describedby={`${prompt.id}-draft-note${error ? ` ${prompt.id}-error` : ''}`} />
            <div className="prompt-actions">
              <button type="button" className="secondary" disabled={busy} onClick={() => compare()}>{busy ? 'Saving…' : 'Save my answer'}</button>
              {savedText && <button type="button" className="quiet-link" disabled={busy} onClick={cancel}>Cancel</button>}
            </div>
            <small id={`${prompt.id}-draft-note`}>{draftSaved ? 'Your draft stays in this tab when you return. Save it when you are ready.' : 'This browser could not keep your draft. Keep this tab open until you save it.'}</small>
          </>
        : <>
            <div role="radiogroup" aria-labelledby={`${prompt.id}-question`}>{prompt.options.map((choice) => <label key={choice.id}><input type="radio" name={prompt.id} checked={draft === choice.id} onChange={() => { write(choice.id); setCompared(false); }} /><span>{choice.label}</span></label>)}</div>
            <div className="prompt-actions"><button type="button" className="secondary" disabled={busy} onClick={() => compare()}>{busy ? 'Saving…' : 'Check my answer'}</button></div>
          </>}
    {error && <p id={`${prompt.id}-error`} className="error" role="alert">{error}</p>}
    {compared && prompt.kind === 'supported-selection' && <SelectionFeedback prompt={prompt} answer={answer} />}
  </div>;
}

type SelectionPrompt = Extract<UnderstandingPrompt, { kind: 'supported-selection' }>;

/**
 * Right: "Yes, that's right." with the chosen option's own feedback; the explanation waits behind a toggle.
 * Wrong: only that option's own feedback, never the right answer or a generic line from the shell.
 */
function SelectionFeedback({ prompt, answer }: { prompt: SelectionPrompt; answer: string }) {
  const chosen = prompt.options.find((option) => option.id === answer);
  if (answer === prompt.bestOptionId) {
    // Some authored feedback already opens with "Yes."; the heading says it.
    const note = chosen?.feedback?.replace(/^Yes[.!,]\s*/, '');
    return <div className="feedback feedback-correct" role="status">
      <strong><CheckCircle2 aria-hidden="true" /> Yes, that’s right.</strong>
      {note && <p>{note}</p>}
      <details className="feedback-more"><summary>Tell me more</summary><p>{prompt.explanation}</p></details>
    </div>;
  }
  return <div className="feedback feedback-retry" role="status">
    <strong><RotateCcw aria-hidden="true" /> Not quite. Try again.</strong>
    {chosen?.feedback && <p>{chosen.feedback}</p>}
  </div>;
}
