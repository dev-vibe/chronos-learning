import { expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { orientationPeriods, periodRelationship } from '../../src/domains/lessonOrientation';
import { learningConnectionsByLessonId } from '../../content/learning-connections';

it('uses one chronological scale across deep time and preserves authored approximate labels', () => {
  const current = chronosContent.lessons.find(l => l.id === 'lesson.humans.homo-sapiens-origins')!;
  const next = chronosContent.lessons.find(l => l.id === 'lesson.humans.migrations-and-interbreeding')!;
  const periods = orientationPeriods(current, [next]);
  expect(periods[0].left).toBe(0);
  expect(periods[1].left + periods[1].width).toBeCloseTo(100);
  expect(periods[0].lesson.chronology.display).toBe(current.chronology.display);
  expect(periods[1].relation).toBe('Later focus period');
  expect(orientationPeriods(current, [{ ...next, status: 'draft' }])).toHaveLength(1);
});

it('distinguishes overlapping focus periods without claiming simultaneous beginnings', () => {
  const range = { startYear: -4000, endYear: -3000, display: 'c. 4000–3000 BCE', approximate: true };
  expect(periodRelationship(range, { ...range, startYear: -3500, endYear: -2500 })).toBe('Overlapping focus periods');
  expect(periodRelationship(range, { ...range, startYear: -6000, endYear: -5000 })).toBe('Earlier focus period');
});

it('keeps authored learning connections within the published catalogue', () => {
  const published = new Set(chronosContent.lessons.filter(l => l.status === 'published').map(l => l.id));
  for (const id of published) {
    const connection = learningConnectionsByLessonId[id];
    expect(connection.extend).toBeTruthy();
    expect(connection.reasoningSkill).toBeTruthy();
    for (const link of [connection.retrieve, connection.revisit]) if (link) expect(published.has(link.lessonId)).toBe(true);
  }
});
