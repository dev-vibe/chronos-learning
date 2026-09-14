// @vitest-environment jsdom
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { LessonOrientation } from '../../src/learn/LessonOrientation';

afterEach(cleanup);
const journey = chronosContent.journeys.find(item => item.id === 'journey.world-history')!;

describe('opening geographic orientation', () => {
  it('explains the Indus region relative to recognizable geography without opening the map viewer', () => {
    const lesson = chronosContent.lessons.find(item => item.id === 'lesson.indus.cities-and-signs')!;
    const { container } = render(<LessonOrientation lesson={lesson} journey={journey} />);
    const orientation = screen.getByRole('complementary', { name: 'Time and place' });
    expect(within(orientation).getByText(/These cities were in South Asia/).textContent).toContain('east of Africa');
    expect(within(orientation).getByText(/These cities were in South Asia/).closest('dialog')).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(container.querySelector('.orientation-layout--wide-map')).not.toBeNull();
  });

  it('keeps the portrait Nile map in its existing column layout', () => {
    const lesson = chronosContent.lessons.find(item => item.id === 'lesson.egypt.nile-state')!;
    const { container } = render(<LessonOrientation lesson={lesson} journey={journey} />);
    expect(container.querySelector('.orientation-map img')).not.toBeNull();
    expect(container.querySelector('.orientation-layout--wide-map')).toBeNull();
    expect(screen.getByRole('list', { name: 'Lesson focus periods' })).toBeTruthy();
  });
});
