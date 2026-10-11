// @vitest-environment jsdom
import { cleanup, createEvent, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { InteractiveKnowledgeCard } from '../../src/learn/InteractiveKnowledgeCard';
import { KnowledgeCardViewer } from '../../src/learn/KnowledgeCardViewer';

afterEach(cleanup);

const withPrompt = chronosContent.cards.find((card) => card.recallPrompt)!;
const withoutPrompt = chronosContent.cards.find((card) => !card.recallPrompt)!;

const spin = (container: HTMLElement) => container.querySelector<HTMLElement>('.kc-spin')!;
const stage = (container: HTMLElement) => {
  const element = container.querySelector<HTMLElement>('.kc-stage')!;
  element.getBoundingClientRect = () => ({ left: 0, top: 0, width: 300, height: 420, right: 300, bottom: 420, x: 0, y: 0, toJSON() {} });
  return element;
};
/** jsdom ignores `timeStamp` in event init, so stamp it explicitly to simulate a drag over time. */
const pointer = (type: 'pointerDown' | 'pointerMove' | 'pointerUp', element: HTMLElement, clientX: number, timeStamp: number) => {
  const event = createEvent[type](element, { pointerId: 1, pointerType: 'mouse', button: 0, clientX, clientY: 200 });
  Object.defineProperty(event, 'timeStamp', { value: 1000 + timeStamp }) // React treats a 0 timestamp as missing;
  fireEvent(element, event);
};
/** A slow drag: the pointer pauses before release, so there is no flick. */
const dragTo = (element: HTMLElement, from: number, to: number) => {
  pointer('pointerDown', element, from, 0);
  pointer('pointerMove', element, (from + to) / 2, 300);
  pointer('pointerMove', element, to, 600);
  pointer('pointerMove', element, to, 900);
  pointer('pointerUp', element, to, 900);
};
/** A quick flick: a short, fast swipe. */
const flick = (element: HTMLElement, from: number, to: number) => {
  pointer('pointerDown', element, from, 0);
  pointer('pointerMove', element, to, 60);
  pointer('pointerUp', element, to, 60);
};

describe('InteractiveKnowledgeCard', () => {
  it('shows the front, with the back hidden from assistive technology', () => {
    const { container } = render(<InteractiveKnowledgeCard card={withPrompt} />);
    expect(screen.getByRole('heading', { name: withPrompt.title })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: 'Try remembering' })).toBeNull();
    expect(container.querySelector('.kc-back')?.hasAttribute('inert')).toBe(true);
    expect(screen.getByRole('button', { name: 'Turn over to try remembering' }).getAttribute('aria-pressed')).toBe('false');
  });

  it('turns over with the button and turns back', async () => {
    const { container } = render(<InteractiveKnowledgeCard card={withPrompt} />);
    await userEvent.click(screen.getByRole('button', { name: 'Turn over to try remembering' }));
    expect(screen.getByRole('heading', { name: 'Try remembering' })).toBeTruthy();
    expect(screen.queryByRole('heading', { name: withPrompt.title })).toBeNull();
    expect(container.querySelector('.kc-front')?.hasAttribute('inert')).toBe(true);
    expect(spin(container).style.getPropertyValue('--kc-spin')).toBe('180deg');
    const back = screen.getByRole('button', { name: 'Turn card back over' });
    expect(back.getAttribute('aria-pressed')).toBe('true');
    await userEvent.click(back);
    expect(screen.getByRole('heading', { name: withPrompt.title })).toBeTruthy();
  });

  it('lets the learner practice recalling before the facts appear', async () => {
    render(<InteractiveKnowledgeCard card={withPrompt} />);
    await userEvent.click(screen.getByRole('button', { name: 'Turn over to try remembering' }));
    expect(screen.getByText(withPrompt.recallPrompt!)).toBeTruthy();
    expect(screen.queryByRole('list', { name: `What to remember about ${withPrompt.title}` })).toBeNull();
    await userEvent.click(screen.getByRole('button', { name: /Show what to remember/ }));
    const facts = screen.getByRole('list', { name: `What to remember about ${withPrompt.title}` });
    expect(within(facts).getAllByRole('listitem')).toHaveLength(withPrompt.facts.length);
    expect(screen.queryByText(withPrompt.recallPrompt!)).toBeNull();
  });

  it('shows the facts straight away when a card has no recall prompt', async () => {
    render(<InteractiveKnowledgeCard card={withoutPrompt} />);
    await userEvent.click(screen.getByRole('button', { name: 'Turn card over' }));
    expect(screen.getByRole('heading', { name: 'Remember this' })).toBeTruthy();
    expect(screen.queryByRole('button', { name: /Show what to remember/ })).toBeNull();
    expect(screen.getAllByRole('listitem')).toHaveLength(withoutPrompt.facts.length);
  });

  it('is honest on the back about what the picture is', async () => {
    render(<InteractiveKnowledgeCard card={withPrompt} />);
    await userEvent.click(screen.getByRole('button', { name: 'Turn over to try remembering' }));
    expect(screen.getByText('About the picture')).toBeTruthy();
    expect(screen.getByText(withPrompt.depictionLabel)).toBeTruthy();
  });

  it('turns over when the card itself is tapped', () => {
    const { container } = render(<InteractiveKnowledgeCard card={withPrompt} />);
    const element = stage(container);
    fireEvent.pointerDown(element, { pointerId: 1, pointerType: 'touch', clientX: 100, clientY: 100 });
    fireEvent.pointerUp(element, { pointerId: 1, pointerType: 'touch', clientX: 101, clientY: 100 });
    expect(spin(container).style.getPropertyValue('--kc-spin')).toBe('180deg');
    expect(screen.getByRole('heading', { name: 'Try remembering' })).toBeTruthy();
  });

  it('spins with a deliberate drag, and settles back after a short one', () => {
    const { container } = render(<InteractiveKnowledgeCard card={withPrompt} />);
    const element = stage(container);
    dragTo(element, 40, 70);
    expect(spin(container).style.getPropertyValue('--kc-spin')).toBe('0deg');
    expect(spin(container).hasAttribute('data-dragging')).toBe(false);
    dragTo(element, 40, 240);
    expect(spin(container).style.getPropertyValue('--kc-spin')).toBe('180deg');
    expect(screen.getByRole('heading', { name: 'Try remembering' })).toBeTruthy();
  });

  it('turns over on a quick flick even when the drag is short', () => {
    const { container } = render(<InteractiveKnowledgeCard card={withPrompt} />);
    flick(stage(container), 100, 160);
    expect(spin(container).style.getPropertyValue('--kc-spin')).toBe('180deg');
  });

  it('follows the finger while dragging', () => {
    const { container } = render(<InteractiveKnowledgeCard card={withPrompt} />);
    const element = stage(container);
    fireEvent.pointerDown(element, { pointerId: 1, pointerType: 'mouse', button: 0, clientX: 0, clientY: 100 });
    fireEvent.pointerMove(element, { pointerId: 1, pointerType: 'mouse', clientX: 150, clientY: 100 });
    expect(spin(container).hasAttribute('data-dragging')).toBe(true);
    expect(spin(container).style.getPropertyValue('--kc-spin')).toBe('90deg');
    fireEvent.pointerCancel(element, { pointerId: 1, pointerType: 'mouse', clientX: 150, clientY: 100 });
    expect(spin(container).style.getPropertyValue('--kc-spin')).toBe('180deg');
  });

  it('leans toward the mouse and levels out when it leaves', () => {
    const { container } = render(<InteractiveKnowledgeCard card={withPrompt} />);
    const element = stage(container);
    const tilt = container.querySelector<HTMLElement>('.kc-tilt')!;
    fireEvent.pointerMove(element, { pointerId: 1, pointerType: 'mouse', clientX: 300, clientY: 210 });
    expect(tilt.hasAttribute('data-active')).toBe(true);
    expect(tilt.style.getPropertyValue('--kc-ry')).toBe('9deg');
    fireEvent.pointerLeave(element, { pointerId: 1, pointerType: 'mouse' });
    expect(tilt.hasAttribute('data-active')).toBe(false);
    expect(tilt.style.getPropertyValue('--kc-ry')).toBe('');
  });

  it('does not lean or spin when the learner prefers reduced motion, but still turns over', async () => {
    const original = window.matchMedia;
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({ matches: query.includes('reduce'), media: query, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent: () => false, onchange: null }));
    try {
      const { container } = render(<InteractiveKnowledgeCard card={withPrompt} />);
      const element = stage(container);
      fireEvent.pointerMove(element, { pointerId: 1, pointerType: 'mouse', clientX: 300, clientY: 210 });
      expect(container.querySelector('.kc-tilt')?.hasAttribute('data-active')).toBe(false);
      dragTo(element, 40, 240);
      expect(spin(container).style.getPropertyValue('--kc-spin')).toBe('0deg');
      await userEvent.click(screen.getByRole('button', { name: 'Turn over to try remembering' }));
      expect(screen.getByRole('heading', { name: 'Try remembering' })).toBeTruthy();
    } finally {
      window.matchMedia = original;
    }
  });

  it('does not turn the card when a control on its back is pressed', async () => {
    const { container } = render(<InteractiveKnowledgeCard card={withPrompt} />);
    await userEvent.click(screen.getByRole('button', { name: 'Turn over to try remembering' }));
    await userEvent.click(screen.getByRole('button', { name: /Show what to remember/ }));
    expect(spin(container).style.getPropertyValue('--kc-spin')).toBe('180deg');
    expect(screen.getByRole('heading', { name: 'Try remembering' })).toBeTruthy();
  });
});

describe('KnowledgeCardViewer', () => {
  it('opens a labelled dialog, focuses close, closes on Escape and links back to the lesson', async () => {
    const onClose = vi.fn();
    render(<KnowledgeCardViewer card={withPrompt} onClose={onClose} />);
    const dialog = screen.getByRole('dialog', { name: withPrompt.title });
    expect(document.activeElement).toBe(within(dialog).getByRole('button', { name: 'Close card' }));
    expect(within(dialog).getByRole('link', { name: /Revisit the lesson/ }).getAttribute('href')).toBe(`/learn/${withPrompt.unlockLessonId}`);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('keeps Tab inside the dialog, skipping the hidden face', async () => {
    render(<KnowledgeCardViewer card={withPrompt} onClose={() => undefined} />);
    const dialog = screen.getByRole('dialog');
    await userEvent.tab();
    expect(document.activeElement).toBe(within(dialog).getByRole('button', { name: /Turn over/ }));
    await userEvent.tab();
    expect(document.activeElement).toBe(within(dialog).getByRole('link', { name: /Revisit the lesson/ }));
    await userEvent.tab();
    expect(document.activeElement).toBe(within(dialog).getByRole('button', { name: 'Close card' }));
  });
});
