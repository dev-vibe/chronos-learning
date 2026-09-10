import type { HistoricalDateRange, Lesson } from './contracts';

/** The authored display string remains authoritative, including years-ago dates. */
export function periodRelationship(current: HistoricalDateRange, other: HistoricalDateRange) {
  if (other.endYear < current.startYear) return 'Earlier focus period';
  if (other.startYear > current.endYear) return 'Later focus period';
  return 'Overlapping focus periods';
}

export function orientationPeriods(current: Lesson, peers: Lesson[]) {
  const items = [current, ...peers.filter((item) => item.id !== current.id && item.status === 'published')].slice(0, 3);
  const start = Math.min(...items.map((item) => item.chronology.startYear));
  const end = Math.max(...items.map((item) => item.chronology.endYear));
  const span = end - start || 1;
  return items.map((lesson) => ({
    lesson,
    relation: lesson.id === current.id ? 'This lesson' : periodRelationship(current.chronology, lesson.chronology),
    left: 100 * (lesson.chronology.startYear - start) / span,
    width: 100 * (lesson.chronology.endYear - lesson.chronology.startYear) / span,
  }));
}
