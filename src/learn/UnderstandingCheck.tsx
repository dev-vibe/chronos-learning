import { useRef, useState, type ReactNode } from 'react';
import type { UnderstandingPrompt } from '../domains/contracts';

type Props = { prompt: UnderstandingPrompt; answer: string; learnerId: string; evidence?: ReactNode; onAttempt(id: string, response: string): Promise<void> };

// Tab-scoped, identity-scoped drafts are deliberately separate from submitted progress.
export const promptDraftKey = (learnerId: string, lessonId: string, promptId: string) => `chronos.prompt-draft.v1:${learnerId}:${lessonId}:${promptId}`;

export function UnderstandingCheck({ prompt, answer, learnerId, evidence, onAttempt }: Props) {
  const key = promptDraftKey(learnerId, prompt.lessonId, prompt.id);
  const [draft, setDraft] = useState(() => { try { return sessionStorage.getItem(key) ?? answer; } catch { return answer; } });
  const [compared, setCompared] = useState(Boolean(answer));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [draftSaved, setDraftSaved] = useState(true);
  const input = useRef<HTMLTextAreaElement>(null);
  const write = (value: string) => {
    setDraft(value); setError('');
    try { sessionStorage.setItem(key, value); setDraftSaved(true); } catch { setDraftSaved(false); }
  };
  const compare = async (value = draft) => {
    if (prompt.kind === 'concise-explanation' && value.trim().length < prompt.minimumResponseLength) {
      setError('Add a little more about your thinking. Try including a detail from the lesson.'); input.current?.focus(); return;
    }
    if (prompt.kind === 'supported-selection' && !prompt.options.some((option) => option.id === value)) {
      setError('Choose an answer, then compare your thinking with the evidence.'); return;
    }
    if (!value.trim() || busy) return;
    setBusy(true); setError('');
    try {
      await onAttempt(prompt.id, value.trim());
      setCompared(true);
      // Keep the draft until another explicit submission, including optional revisions.
    } catch { setError('Your answer could not be saved. Keep this page open and try Compare your thinking again.'); }
    finally { setBusy(false); }
  };
  const choiceFeedback = prompt.kind === 'supported-selection' ? prompt.options.find((option) => option.id === answer)?.feedback : undefined;
  return <div className="prompt">
    {prompt.kind === 'concise-explanation'
      ? <label htmlFor={prompt.id}><strong>{prompt.question}</strong></label>
      : <strong id={`${prompt.id}-question`}>{prompt.question}</strong>}
    {evidence && <details className="prompt-evidence"><summary>Keep the evidence nearby</summary><div>{evidence}</div></details>}
    {prompt.hint && <details className="prompt-hint"><summary>A hint</summary><p>{prompt.hint}</p></details>}
    {prompt.kind === 'concise-explanation'
      ? <textarea ref={input} id={prompt.id} value={draft} placeholder="Use an example from the lesson…" onChange={(event) => write(event.currentTarget.value)} aria-invalid={Boolean(error)} aria-describedby={`${prompt.id}-draft-note${error ? ` ${prompt.id}-error` : ''}`} />
      : <div role="radiogroup" aria-labelledby={`${prompt.id}-question`}>{prompt.options.map((choice) => <label key={choice.id}><input type="radio" name={prompt.id} checked={draft === choice.id} onChange={() => { write(choice.id); setCompared(false); }} /><span>{choice.label}</span></label>)}</div>}
    <div className="prompt-actions"><button type="button" className="secondary" disabled={busy} onClick={() => compare()}>{busy ? 'Saving…' : 'Compare your thinking'}</button></div>
    {prompt.kind === 'concise-explanation' && <small id={`${prompt.id}-draft-note`}>{draftSaved ? 'Your draft stays in this tab when you return. Share your thinking when you are ready.' : 'This browser could not keep your draft. Keep this tab open until you share your thinking.'}</small>}
    {error && <p id={`${prompt.id}-error`} className="error" role="alert">{error}</p>}
    {compared && <div className="feedback" role="status"><strong>{prompt.kind === 'concise-explanation' ? 'An example explanation' : 'Compare the evidence'}</strong><p>{choiceFeedback ?? prompt.explanation}</p><p>{prompt.kind === 'concise-explanation' ? 'Your explanation can use different words. What would you keep or add?' : 'Think about what supports this explanation.'}</p>{prompt.kind === 'concise-explanation' && <button type="button" className="secondary" onClick={() => { setCompared(false); input.current?.focus(); }}>Revise my thinking (optional)</button>}</div>}
  </div>;
}
