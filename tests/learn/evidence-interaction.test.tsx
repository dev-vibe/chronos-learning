// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EvidenceViewer } from '../../src/learn/EvidenceViewer';
import { UnderstandingCheck, promptDraftKey } from '../../src/learn/UnderstandingCheck';
import { chronosContent } from '../../content/chronos';

const prompt = { id: 'prompt.test.example', lessonId: 'lesson.test.example', kind: 'concise-explanation' as const, question: 'What does the object show?', explanation: 'Marks can preserve a record.', required: true, minimumResponseLength: 15, hint: 'Notice the marks.' };
beforeEach(() => { sessionStorage.clear(); vi.stubEnv('VITE_MEDIA_PROVIDER', 'repository'); });
afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

it('enlarges on demand, supports zoom, traps Tab, and returns focus after Escape', async () => {
  render(<EvidenceViewer media={chronosContent.media[0]} title="The object" summary="A reviewed object." />);
  const trigger = screen.getByRole('button', { name: 'Enlarge The object' });
  expect(screen.queryByRole('img')).toBeNull();
  await userEvent.click(trigger);
  const dialog = screen.getByRole('dialog', { name: 'The object' });
  const close = screen.getByRole('button', { name: 'Close enlarged image' });
  expect(document.activeElement).toBe(close);
  fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
  expect(document.activeElement).toBe(screen.getByRole('region'));
  fireEvent.keyDown(document.activeElement!, { key: 'Tab' });
  expect(document.activeElement).toBe(close);
  await userEvent.click(screen.getByRole('button', { name: 'Show more detail' }));
  expect(screen.getByRole('img').classList.contains('is-zoomed')).toBe(true);
  fireEvent.keyDown(dialog, { key: 'Escape' });
  expect(dialog.hasAttribute('open')).toBe(false);
  expect(document.activeElement).toBe(trigger);
});

it('keeps drafts through failed submission, and never shows the model answer', async () => {
  const save = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined);
  render(<UnderstandingCheck prompt={prompt} answer="" learnerId="learner-one" onAttempt={save} />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'The marks preserve a record.' } });
  expect(save).not.toHaveBeenCalled();
  expect(screen.queryByText(prompt.explanation)).toBeNull();
  await userEvent.click(screen.getByRole('button', { name: 'Save my answer' }));
  expect((await screen.findByRole('alert')).textContent).toContain('could not be saved');
  expect(sessionStorage.getItem(promptDraftKey('learner-one', prompt.lessonId, prompt.id))).toBe('The marks preserve a record.');
  await userEvent.click(screen.getByRole('button', { name: 'Save my answer' }));
  expect(await screen.findByText('Saved')).toBeTruthy();
  expect(screen.queryByText(prompt.explanation)).toBeNull();
  expect(screen.queryByText(/correct|mastered|score/i)).toBeNull();
});

it('isolates draft visibility by learner identity and preserves saved explanations', async () => {
  sessionStorage.setItem(promptDraftKey('another-learner', prompt.lessonId, prompt.id), 'Private draft');
  render(<UnderstandingCheck prompt={prompt} answer="Previously saved explanation" learnerId="this-learner" onAttempt={vi.fn()} />);
  expect(screen.queryByText('Private draft')).toBeNull();
  expect(screen.getByText('Previously saved explanation')).toBeTruthy();
  expect(screen.getByText('Saved')).toBeTruthy();
  expect(screen.queryByText(prompt.explanation)).toBeNull();
  await userEvent.click(screen.getByRole('button', { name: 'Edit my answer' }));
  expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('Previously saved explanation');
});

it('collapses a saved written answer, and edits or cancels in place', async () => {
  const save = vi.fn(async () => undefined);
  render(<UnderstandingCheck prompt={prompt} answer="" learnerId="learner-two" onAttempt={save} />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'The marks keep a lasting record.' } });
  await userEvent.click(screen.getByRole('button', { name: 'Save my answer' }));
  expect(await screen.findByText('The marks keep a lasting record.')).toBeTruthy();
  expect(screen.queryByRole('textbox')).toBeNull();
  expect(screen.queryByRole('button', { name: 'Save my answer' })).toBeNull();
  expect(screen.queryByText(/Your draft stays/)).toBeNull();
  await userEvent.click(screen.getByRole('button', { name: 'Edit my answer' }));
  const box = screen.getByRole('textbox') as HTMLTextAreaElement;
  expect(document.activeElement).toBe(box);
  fireEvent.change(box, { target: { value: 'A change I do not want.' } });
  await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
  expect(screen.getByText('The marks keep a lasting record.')).toBeTruthy();
  await userEvent.click(screen.getByRole('button', { name: 'Edit my answer' }));
  expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('The marks keep a lasting record.');
  expect(save).toHaveBeenCalledTimes(1);
});

it('reopens a written answer in the editor when this tab has unsaved changes', () => {
  sessionStorage.setItem(promptDraftKey('learner-three', prompt.lessonId, prompt.id), 'Unsaved newer thinking');
  render(<UnderstandingCheck prompt={prompt} answer="Older saved answer" learnerId="learner-three" onAttempt={vi.fn()} />);
  expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('Unsaved newer thinking');
  expect(screen.getByRole('button', { name: 'Cancel' })).toBeTruthy();
});

it('uses authored choice feedback only after deliberate submission', async () => {
  const selection = { ...prompt, kind: 'supported-selection' as const, bestOptionId: 'choice.a', options: [{ id: 'choice.a', label: 'Marks', feedback: 'Yes. These marks show a durable record.' }, { id: 'choice.b', label: 'Color', feedback: 'Color alone cannot establish the purpose.' }] };
  const save = vi.fn(async () => undefined);
  const view = render(<UnderstandingCheck prompt={selection} answer="" learnerId="test" onAttempt={save} />);
  await userEvent.click(screen.getByLabelText('Color'));
  expect(save).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Check my answer' }));
  view.rerender(<UnderstandingCheck prompt={selection} answer="choice.b" learnerId="test" onAttempt={save} />);
  expect(await screen.findByText('Color alone cannot establish the purpose.')).toBeTruthy();
});

it('says plainly when a choice is right, and on a wrong pick shows only that option’s own feedback', async () => {
  const selection = { ...prompt, kind: 'supported-selection' as const, bestOptionId: 'choice.a', options: [{ id: 'choice.a', label: 'Marks', feedback: 'Yes. These marks show a durable record.' }, { id: 'choice.b', label: 'Color', feedback: 'Look back at the marks on the clay. What were they counting?' }] };
  const save = vi.fn(async () => undefined);
  const view = render(<UnderstandingCheck prompt={selection} answer="" learnerId="test" onAttempt={save} />);
  await userEvent.click(screen.getByLabelText('Color'));
  await userEvent.click(screen.getByRole('button', { name: 'Check my answer' }));
  view.rerender(<UnderstandingCheck prompt={selection} answer="choice.b" learnerId="test" onAttempt={save} />);
  const retry = await screen.findByRole('status');
  expect(retry.textContent?.trim()).toBe('Not quite. Try again.Look back at the marks on the clay. What were they counting?');
  expect(screen.queryByText(selection.explanation)).toBeNull();
  expect(screen.queryByText('Marks', { selector: 'p, b' })).toBeNull();
  await userEvent.click(screen.getByLabelText('Marks'));
  expect(screen.queryByText(/Not quite/)).toBeNull();
  await userEvent.click(screen.getByRole('button', { name: 'Check my answer' }));
  view.rerender(<UnderstandingCheck prompt={selection} answer="choice.a" learnerId="test" onAttempt={save} />);
  expect(await screen.findByText('Yes, that’s right.')).toBeTruthy();
  // The option's own feedback, without its leading "Yes." (the heading already says it).
  expect(screen.getByText('These marks show a durable record.')).toBeTruthy();
  // The explanation waits behind a neutral toggle.
  const more = screen.getByText('Tell me more').closest('details')!;
  expect(more.open).toBe(false);
  expect(more.textContent).toContain(selection.explanation);
  expect(save).toHaveBeenCalledTimes(2);
});

it('adds no wording of its own when a wrong option has no feedback', async () => {
  const selection = { ...prompt, kind: 'supported-selection' as const, bestOptionId: 'choice.a', options: [{ id: 'choice.a', label: 'Marks' }, { id: 'choice.b', label: 'Color' }] };
  render(<UnderstandingCheck prompt={selection} answer="choice.b" learnerId="test" onAttempt={vi.fn()} />);
  expect((await screen.findByRole('status')).textContent?.trim()).toBe('Not quite. Try again.');
});

it('labels each picture kept beside a question with its own title from the lesson, and the hint plainly', async () => {
  const pictures = [
    { id: 'module.test.tablet', title: 'Records pressed into clay', content: <p>Tablet picture</p> },
    { id: 'module.test.map', title: 'A city shaped by water', content: <p>Map picture</p> },
  ];
  render(<UnderstandingCheck prompt={prompt} answer="" learnerId="test" pictures={pictures} onAttempt={vi.fn()} />);
  const summaries = Array.from(document.querySelectorAll('.prompt-evidence > summary')).map((node) => node.textContent);
  expect(summaries).toEqual(['Records pressed into clay', 'A city shaped by water']);
  expect(screen.getByText('Hint').tagName).toBe('SUMMARY');
  expect(screen.queryByText(/evidence/i)).toBeNull();
});

it('shows an authored answer-box placeholder, and none when the lesson gives none', () => {
  const { unmount } = render(<UnderstandingCheck prompt={{ ...prompt, answerPlaceholder: 'I think the marks… because…' }} answer="" learnerId="test" onAttempt={vi.fn()} />);
  expect(screen.getByRole('textbox').getAttribute('placeholder')).toBe('I think the marks… because…');
  unmount();
  render(<UnderstandingCheck prompt={prompt} answer="" learnerId="test" onAttempt={vi.fn()} />);
  expect(screen.getByRole('textbox').hasAttribute('placeholder')).toBe(false);
});

it('gives an actionable message for empty or obsolete choices without saving an attempt', async () => {
  const selection = { ...prompt, kind: 'supported-selection' as const, bestOptionId: 'choice.a', options: [{ id: 'choice.a', label: 'Marks' }] };
  const save = vi.fn();
  sessionStorage.setItem(promptDraftKey('test', prompt.lessonId, prompt.id), 'removed-choice');
  render(<UnderstandingCheck prompt={selection} answer="" learnerId="test" onAttempt={save} />);
  await userEvent.click(screen.getByRole('button', { name: 'Check my answer' }));
  expect((await screen.findByRole('alert')).textContent).toContain('Choose an answer');
  expect(save).not.toHaveBeenCalled();
});
