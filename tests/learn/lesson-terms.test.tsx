// @vitest-environment jsdom
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { chronosContent } from '../../content/chronos';
import type { Lesson } from '../../src/domains/contracts';
import { splitProseParagraphs, termFieldKey } from '../../src/domains/lessonTerms';
import { KeyTermsPanel, LessonTermsProvider, placeBox, TermText } from '../../src/learn/LessonTerms';

const akkad = chronosContent.lessons.find((lesson) => lesson.id === 'lesson.mesopotamia.akkadian-empire')!;
const uruk = chronosContent.lessons.find((lesson) => lesson.id === 'lesson.uruk.first-city')!;

let hover = false;
beforeEach(() => {
  hover = false;
  vi.stubGlobal('matchMedia', vi.fn((query: string) => ({ matches: query === '(hover: hover)' ? hover : false, addEventListener: vi.fn(), removeEventListener: vi.fn() })));
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

/** Renders a lesson's prose the way LearnApp does, with each section's heading. */
function LessonText({ lesson }: { lesson: Lesson }) {
  return <div className="learn-app"><LessonTermsProvider lesson={lesson}><KeyTermsPanel lesson={lesson} />
    {lesson.sections.map((section) => <section key={section.id} id={section.id}><header className="section-heading"><h2>{section.heading}</h2></header>
      {section.modules.map((module) => module.type === 'prose'
        ? <div key={module.id}>{splitProseParagraphs(module.body).map((paragraph, index) => <p key={index}><TermText field={termFieldKey.proseParagraph(module.id, index)} text={paragraph} /></p>)}</div>
        : null)}
    </section>)}
  </LessonTermsProvider></div>;
}

describe('in-text terms', () => {
  it('marks only the first occurrence of a term in each section', () => {
    render(<LessonText lesson={akkad} />);
    const opening = document.getElementById('section.akkad.place-and-question')!;
    expect(within(opening).getAllByRole('button', { name: 'Agade' })).toHaveLength(1);
    expect(opening.textContent).toContain('king of Agade, wanted');
    expect(opening.textContent).not.toContain('[[');
  });

  it('opens a labelled definition box on click, moves focus in, and Escape returns focus to the term', async () => {
    const user = userEvent.setup();
    render(<LessonText lesson={akkad} />);
    const term = within(document.getElementById('section.akkad.naram-sin-stele')!).getByRole('button', { name: 'stele' });
    expect(term.getAttribute('aria-expanded')).toBe('false');
    await user.click(term);
    const box = screen.getByRole('dialog', { name: 'stele' });
    expect(term.getAttribute('aria-expanded')).toBe('true');
    expect(term.getAttribute('aria-controls')).toBe(box.id);
    expect(within(box).getByText('Word')).toBeTruthy();
    expect(box.textContent).toContain('A tall stone slab set upright');
    expect(document.activeElement).toBe(box);
    expect(box.closest('.learn-app')).not.toBeNull();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(term);
  });

  it('opens from the keyboard with Enter and Space, and the close button returns focus', async () => {
    const user = userEvent.setup();
    render(<LessonText lesson={akkad} />);
    const term = screen.getAllByRole('button', { name: 'Urkesh' })[0];
    term.focus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('dialog', { name: 'Urkesh' }).textContent).toContain('Place');
    await user.click(screen.getByRole('button', { name: 'Close Urkesh' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.activeElement).toBe(term);
    await user.keyboard(' ');
    expect(screen.getByRole('dialog', { name: 'Urkesh' })).toBeTruthy();
  });

  it('closes when the reader taps elsewhere', async () => {
    const user = userEvent.setup();
    render(<LessonText lesson={akkad} />);
    await user.click(screen.getAllByRole('button', { name: 'Sargon' })[0]);
    expect(screen.getByRole('dialog')).toBeTruthy();
    await user.click(screen.getByText(/wanted everyone to know/));
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('previews on hover only where the device can hover, after a short delay', () => {
    vi.useFakeTimers();
    render(<LessonText lesson={akkad} />);
    const term = screen.getAllByRole('button', { name: 'Tell Leilan' })[0];
    fireEvent.pointerEnter(term, { pointerType: 'mouse' });
    act(() => { vi.advanceTimersByTime(500); });
    expect(screen.queryByRole('dialog')).toBeNull();
    hover = true;
    fireEvent.pointerEnter(term, { pointerType: 'mouse' });
    act(() => { vi.advanceTimersByTime(100); });
    expect(screen.queryByRole('dialog')).toBeNull();
    act(() => { vi.advanceTimersByTime(400); });
    expect(screen.getByRole('dialog', { name: 'Tell Leilan' })).toBeTruthy();
    expect(document.activeElement).not.toBe(screen.getByRole('dialog'));
    fireEvent.pointerLeave(term, { pointerType: 'mouse' });
    act(() => { vi.advanceTimersByTime(400); });
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders a lesson without terms as plain text, with no panel', () => {
    const { container } = render(<LessonText lesson={uruk} />);
    expect(container.querySelector('.lesson-term')).toBeNull();
    expect(container.querySelector('.key-terms')).toBeNull();
  });
});

describe('People, places and words panel', () => {
  it('lists featured terms by group and jumps to the primary section heading', async () => {
    const user = userEvent.setup();
    render(<LessonText lesson={akkad} />);
    const panel = screen.getByRole('navigation', { name: 'People, places and words' });
    const groups = [...panel.querySelectorAll('.key-terms__group-label')].map((node) => node.textContent);
    expect(groups).toEqual(['People', 'Places', 'Words']);
    expect(within(panel).getAllByRole('button').length).toBe(1 + akkad.terms!.filter((term) => term.featured).length);
    await user.click(within(panel).getByRole('button', { name: /^Urkesh/ }));
    const heading = within(document.getElementById('section.akkad.urkesh-ties')!).getByRole('heading', { level: 2 });
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(document.activeElement).toBe(heading);
  });

  it('collapses and expands', async () => {
    const user = userEvent.setup();
    render(<LessonText lesson={akkad} />);
    const toggle = screen.getByRole('button', { name: 'People, places and words' });
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    await user.click(toggle);
    expect(toggle.getAttribute('aria-expanded')).toBe('false');
    expect(within(screen.getByRole('navigation', { name: 'People, places and words' })).queryByRole('button', { name: /^Sargon/ })).toBeNull();
  });
});

describe('definition box placement', () => {
  const viewport = { width: 390, top: 78, bottom: 760 };
  it('sits below the term when there is room, and above it otherwise, never covering it', () => {
    const term = { top: 300, bottom: 330, left: 100, width: 40 };
    const below = placeBox(term, { height: 150 }, viewport);
    expect(below.side).toBe('below');
    expect(below.top).toBeGreaterThanOrEqual(term.bottom);
    const low = { top: 680, bottom: 710, left: 100, width: 40 };
    const above = placeBox(low, { height: 150 }, viewport);
    expect(above.side).toBe('above');
    expect(above.top + 150).toBeLessThanOrEqual(low.top);
    expect(above.width).toBe(340);
    expect(above.left).toBeGreaterThanOrEqual(16);
  });
});
