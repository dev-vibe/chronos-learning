import type { HistoricalDateRange, Lesson } from './contracts';

/** One authored map is placed at the opening; its record stays in the lesson. */
export function orientationMapForLesson(lesson: Lesson) {
  return lesson.sections.flatMap(section => section.modules).find(module =>
    module.type === 'historical-map' && (!lesson.orientationMapModuleId || module.id === lesson.orientationMapModuleId));
}

/** The authored display string remains authoritative, including years-ago dates. */
export function periodRelationship(current: HistoricalDateRange, other: HistoricalDateRange) {
  if (other.endYear < current.startYear) return 'Earlier focus period';
  if (other.startYear > current.endYear) return 'Later focus period';
  return 'Overlapping focus periods';
}

export function orientationPeriods(current: Lesson, peers: Lesson[]) {
  const items = [current, ...peers.filter((item) => item.id !== current.id && item.status === 'published')].slice(0, 3);
  return items.sort((a, b) => a.chronology.startYear - b.chronology.startYear).map((lesson) => ({
    lesson,
    relation: lesson.id === current.id ? 'This lesson' : periodRelationship(current.chronology, lesson.chronology),
  }));
}
