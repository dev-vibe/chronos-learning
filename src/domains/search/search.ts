import type { ChronosContentBundle } from '../../../content/assemble';

export type SearchResultKind = 'journey' | 'lesson' | 'knowledge-card';
export type SearchResult = { id: string; kind: SearchResultKind; title: string; context: string; destination: string; score: number };
export interface SearchProvider { search(query: string): Promise<SearchResult[]>; }
type SearchDocument = SearchResult & { text: string; aliases: readonly string[] };

export const normalizeSearchText = (value: string) => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const rank = (document: SearchDocument, normalizedQuery: string) => {
  const title = normalizeSearchText(document.title); const aliases = document.aliases.map(normalizeSearchText); const tokens = document.text.split(' ');
  if (title === normalizedQuery) return 1000;
  if (aliases.includes(normalizedQuery)) return 900;
  if (title.startsWith(normalizedQuery)) return 800;
  if (aliases.some((alias) => alias.startsWith(normalizedQuery))) return 700;
  if (tokens.some((token) => token.startsWith(normalizedQuery))) return 600;
  if (document.text.includes(normalizedQuery)) return 400;
  return 0;
};
const kindOrder: Record<SearchResultKind, number> = { journey: 0, lesson: 1, 'knowledge-card': 2 };

export function createLocalSearchProvider(content: ChronosContentBundle, aliases: Record<string, readonly string[]>): SearchProvider {
  const publishedLessons = content.lessons.filter((lesson) => lesson.status === 'published');
  const publishedLessonIds = new Set(publishedLessons.map((lesson) => lesson.id));
  const publishedJourneys = content.journeys.filter((journey) => journey.status === 'published' && journey.chapters.some((chapter) => chapter.entries.some((entry) => publishedLessonIds.has(entry.lessonId))));
  const documents: SearchDocument[] = [
    ...publishedJourneys.map((journey) => ({ id: journey.id, kind: 'journey' as const, title: journey.title, context: `${journey.kind === 'world-history' ? 'World History' : journey.kind.replace('-', ' ')} · ${journey.period}`, destination: `/library/${journey.id}`, score: 0, aliases: aliases[journey.id] ?? [], text: normalizeSearchText([journey.title, journey.learnerPromise, journey.openingQuestion, journey.description, journey.period, journey.region, ...(aliases[journey.id] ?? [])].filter(Boolean).join(' ')) })),
    ...publishedLessons.map((lesson) => ({ id: lesson.id, kind: 'lesson' as const, title: lesson.title, context: `Lesson · ${lesson.masthead} · ${lesson.place}`, destination: `/learn/${lesson.id}`, score: 0, aliases: aliases[lesson.id] ?? [], text: normalizeSearchText([lesson.title, lesson.masthead, lesson.place, lesson.significance, ...(aliases[lesson.id] ?? [])].join(' ')) })),
    ...content.cards.filter((card) => publishedLessonIds.has(card.unlockLessonId)).map((card) => ({ id: card.id, kind: 'knowledge-card' as const, title: card.title, context: `Knowledge Card · ${card.category} · ${card.date.display}`, destination: `/learn/${card.unlockLessonId}`, score: 0, aliases: aliases[card.id] ?? [], text: normalizeSearchText([card.title, card.place, card.significance, card.category, card.cardClass, ...(aliases[card.id] ?? [])].join(' ')) })),
  ];
  return { async search(query) { const normalizedQuery = normalizeSearchText(query); if (!normalizedQuery) return []; return documents.map((document) => ({ ...document, score: rank(document, normalizedQuery) })).filter((document) => document.score > 0).sort((left, right) => right.score - left.score || kindOrder[left.kind] - kindOrder[right.kind] || left.title.localeCompare(right.title) || left.id.localeCompare(right.id)).map(({ aliases: _aliases, text: _text, ...result }) => result); } };
}
