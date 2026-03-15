import { LessonFile, LessonMetadata, NodeContent } from '../types';
import { STATIC_CONTENT } from '../staticContent';
import { getAllLessonMetadata } from './lessonMetadata';

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isLessonFile = (value: unknown): value is LessonFile => {
  if (!isObject(value)) return false;
  const metadata = value.metadata;
  const content = value.content;
  return (
    isObject(metadata) &&
    typeof metadata.id === 'string' &&
    typeof metadata.eraId === 'string' &&
    isObject(content) &&
    typeof content.summary === 'string'
  );
};

const modules = import.meta.glob('./eras/**/lessons/*.ts', { eager: true }) as Record<
  string,
  Record<string, unknown>
>;

const lessonFilesFromModules: Record<string, LessonFile> = {};

for (const mod of Object.values(modules)) {
  const candidates = Object.values(mod).filter(isLessonFile);
  for (const lesson of candidates) {
    lessonFilesFromModules[lesson.metadata.id] = lesson;
  }
}

const metadataFallback = Object.fromEntries(
  getAllLessonMetadata().map((item) => [item.id, item])
) as Record<string, LessonMetadata>;

export const LESSON_CONTENT: Record<string, NodeContent> = {
  ...STATIC_CONTENT,
  ...Object.fromEntries(
    Object.entries(lessonFilesFromModules).map(([id, lesson]) => [id, lesson.content])
  ),
};

export const LESSON_FILES: Record<string, LessonFile> = Object.fromEntries(
  Object.entries(LESSON_CONTENT)
    .filter(([id]) => !!metadataFallback[id] || !!lessonFilesFromModules[id])
    .map(([id, content]) => {
      const fromModule = lessonFilesFromModules[id];
      const metadata = fromModule?.metadata || metadataFallback[id];
      return [id, { metadata, content }];
    })
);
