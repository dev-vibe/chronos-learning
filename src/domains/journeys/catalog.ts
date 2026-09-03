import type { Journey, Lesson } from '../contracts';
import { isLessonOpenable } from '../../config/runtimeFlags';

export type LibraryCategory = 'civilizations-regions' | 'ideas-across-time' | 'investigations';
export type CatalogJourney = {
  id: string;
  title: string;
  kind: Journey['kind'];
  category?: LibraryCategory;
  learnerPromise: string;
  period: string;
  region?: string;
  lessonCount: number;
  requiredLessonCount: number;
  chapterCount: number;
  approximateMinutes: number;
  featured: boolean;
  previewMediaId?: string;
};
export type PublishedJourneyCatalog = {
  worldHistory?: CatalogJourney;
  groups: Record<LibraryCategory, CatalogJourney[]>;
};

const categoryFor = (kind: Journey['kind']): LibraryCategory | undefined => ({
  'story-arc': 'civilizations-regions',
  'idea-trail': 'ideas-across-time',
  investigation: 'investigations',
  'world-history': undefined,
}[kind] as LibraryCategory | undefined);

export const orderedJourneyEntries = (journey: Journey) =>
  [...journey.chapters]
    .sort((left, right) => left.position - right.position || left.id.localeCompare(right.id))
    .flatMap((chapter) => [...chapter.entries]
      .sort((left, right) => left.position - right.position || left.id.localeCompare(right.id))
      .map((entry) => ({ chapter, entry })));

export const publishedEntries = (journey: Journey, lessons: readonly Lesson[]) => {
  const openableIds = new Set(lessons.filter((lesson) => isLessonOpenable(lesson)).map((lesson) => lesson.id));
  return orderedJourneyEntries(journey).filter(({ entry }) => openableIds.has(entry.lessonId));
};

export const publishedRequiredLessonIds = (journey: Journey, lessons: readonly Lesson[]) =>
  publishedEntries(journey, lessons).filter(({ entry }) => entry.required).map(({ entry }) => entry.lessonId);

const projectJourney = (journey: Journey, lessons: readonly Lesson[]): CatalogJourney | undefined => {
  if (journey.status !== 'published') return undefined;
  const entries = publishedEntries(journey, lessons);
  if (entries.length === 0) return undefined;
  return {
    id: journey.id,
    title: journey.title,
    kind: journey.kind,
    category: categoryFor(journey.kind),
    learnerPromise: journey.learnerPromise,
    period: journey.period,
    region: journey.region,
    lessonCount: entries.length,
    requiredLessonCount: entries.filter(({ entry }) => entry.required).length,
    chapterCount: new Set(entries.map(({ chapter }) => chapter.id)).size,
    approximateMinutes: journey.approximateMinutes,
    featured: journey.featured,
    previewMediaId: journey.previewMediaId,
  };
};

const editorialSort = (left: CatalogJourney, right: CatalogJourney) =>
  Number(right.featured) - Number(left.featured) || left.title.localeCompare(right.title) || left.id.localeCompare(right.id);

export function createPublishedJourneyCatalog(journeys: readonly Journey[], lessons: readonly Lesson[]): PublishedJourneyCatalog {
  const projected = journeys.map((journey) => projectJourney(journey, lessons)).filter((item): item is CatalogJourney => Boolean(item));
  const groups: PublishedJourneyCatalog['groups'] = { 'civilizations-regions': [], 'ideas-across-time': [], investigations: [] };
  for (const item of projected) if (item.category) groups[item.category].push(item);
  for (const items of Object.values(groups)) items.sort(editorialSort);
  return { worldHistory: projected.find((item) => item.kind === 'world-history'), groups };
}
