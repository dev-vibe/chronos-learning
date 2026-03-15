import { INITIAL_NODES } from '../constants';
import { LessonMetadata } from '../types';

const LESSON_METADATA_BY_ID: Record<string, LessonMetadata> = Object.fromEntries(
  INITIAL_NODES.map((node) => [node.id, node])
);

export const getLessonMetadata = (id: string): LessonMetadata => {
  const metadata = LESSON_METADATA_BY_ID[id];
  if (!metadata) {
    throw new Error(`Unknown lesson metadata id: ${id}`);
  }
  return metadata;
};

export const getAllLessonMetadata = (): LessonMetadata[] => INITIAL_NODES;
