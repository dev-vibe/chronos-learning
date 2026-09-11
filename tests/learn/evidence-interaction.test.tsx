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

it('keeps drafts through failed submission, without treating examples as evaluation', async () => {
  const save = vi.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValue(undefined);
  render(<UnderstandingCheck prompt={prompt} answer="" learnerId="learner-one" onAttempt={save} />);
  fireEvent.change(screen.getByRole('textbox'), { target: { value: 'The marks preserve a record.' } });
  expect(save).not.toHaveBeenCalled();
  expect(screen.queryByText('An example explanation')).toBeNull();
  await userEvent.click(screen.getByRole('button', { name: 'Compare your thinking' }));
  expect((await screen.findByRole('alert')).textContent).toContain('could not be saved');
  expect(sessionStorage.getItem(promptDraftKey('learner-one', prompt.lessonId, prompt.id))).toBe('The marks preserve a record.');
  await userEvent.click(screen.getByRole('button', { name: 'Compare your thinking' }));
  expect(await screen.findByText('An example explanation')).toBeTruthy();
  expect(screen.queryByText(/correct|mastered|score/i)).toBeNull();
});

it('isolates draft visibility by learner identity and preserves saved explanations', () => {
  sessionStorage.setItem(promptDraftKey('another-learner', prompt.lessonId, prompt.id), 'Private draft');
  render(<UnderstandingCheck prompt={prompt} answer="Previously saved explanation" learnerId="this-learner" onAttempt={vi.fn()} />);
  expect((screen.getByRole('textbox') as HTMLTextAreaElement).value).toBe('Previously saved explanation');
  expect(screen.getByText('An example explanation')).toBeTruthy();
});

it('uses authored choice feedback only after deliberate submission', async () => {
  const selection = { ...prompt, kind: 'supported-selection' as const, options: [{ id: 'choice.a', label: 'Marks', feedback: 'These marks show a durable record.' }, { id: 'choice.b', label: 'Color', feedback: 'Color alone cannot establish the purpose.' }] };
  const save = vi.fn(async () => undefined);
  const view = render(<UnderstandingCheck prompt={selection} answer="" learnerId="test" onAttempt={save} />);
  await userEvent.click(screen.getByLabelText('Color'));
  expect(save).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Compare your thinking' }));
  view.rerender(<UnderstandingCheck prompt={selection} answer="choice.b" learnerId="test" onAttempt={save} />);
  expect(await screen.findByText('Color alone cannot establish the purpose.')).toBeTruthy();
});

it('gives an actionable message for empty or obsolete choices without saving an attempt', async () => {
  const selection = { ...prompt, kind: 'supported-selection' as const, options: [{ id: 'choice.a', label: 'Marks' }] };
  const save = vi.fn();
  sessionStorage.setItem(promptDraftKey('test', prompt.lessonId, prompt.id), 'removed-choice');
  render(<UnderstandingCheck prompt={selection} answer="" learnerId="test" onAttempt={save} />);
  await userEvent.click(screen.getByRole('button', { name: 'Compare your thinking' }));
  expect((await screen.findByRole('alert')).textContent).toContain('Choose an answer');
  expect(save).not.toHaveBeenCalled();
});
