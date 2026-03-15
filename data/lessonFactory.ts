import { LessonFile, LessonMetadata, NodeContent } from '../types';
import { getLessonMetadata } from './lessonMetadata';

type LegacyModule = Record<string, unknown>;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isNodeContent = (value: unknown): value is NodeContent => {
  if (!isObject(value)) return false;
  return (
    typeof value.summary === 'string' &&
    typeof value.funFact === 'string' &&
    Array.isArray(value.people) &&
    Array.isArray(value.inventions) &&
    Array.isArray(value.places) &&
    Array.isArray(value.resources)
  );
};

const findContentInLegacyModule = (id: string, legacyModule: LegacyModule): NodeContent | null => {
  for (const exportedValue of Object.values(legacyModule)) {
    if (!isObject(exportedValue)) continue;
    const candidate = exportedValue[id];
    if (isNodeContent(candidate)) return candidate;
  }
  return null;
};

export const createLessonFromLegacy = (
  id: string,
  legacyModule: LegacyModule,
  metadataOverride?: Partial<LessonMetadata>
): LessonFile => {
  const content = findContentInLegacyModule(id, legacyModule);
  if (!content) {
    throw new Error(`Could not find legacy content for lesson id: ${id}`);
  }

  return {
    metadata: {
      ...getLessonMetadata(id),
      ...(metadataOverride || {}),
    },
    content,
  };
};
