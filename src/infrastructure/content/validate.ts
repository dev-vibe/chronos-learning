import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  ClaimSchema,
  JourneySchema,
  JourneyInvitationSchema,
  KnowledgeCardSchema,
  LessonSchema,
  MediaAssetSchema,
  SourceSchema,
  UnderstandingPromptSchema,
} from '../../domains/contracts';

export type ContentBundle = {
  sources: unknown[];
  claims: unknown[];
  media: unknown[];
  prompts: unknown[];
  lessons: unknown[];
  journeys: unknown[];
  invitations: unknown[];
  cards: unknown[];
};

const MAX_PUBLISHED_VARIANT_BYTES = 768 * 1024;

export function validateContent(input: ContentBundle) {
  const errors: string[] = [];
  const parse = <T>(items: unknown[], schema: any, label: string): T[] => items.flatMap((item, index) => {
    const result = schema.safeParse(item);
    if (!result.success) {
      errors.push(result.error.issues.map((issue: any) => {
        const path = issue.path.length ? `.` + issue.path.join('.') : '';
        return `${label}[${index}]${path}: ${issue.message}`;
      }).join(', '));
      return [];
    }
    return [result.data];
  });

  const sources = parse<any>(input.sources, SourceSchema, 'source');
  const claims = parse<any>(input.claims, ClaimSchema, 'claim');
  const media = parse<any>(input.media, MediaAssetSchema, 'media');
  const prompts = parse<any>(input.prompts, UnderstandingPromptSchema, 'prompt');
  const lessons = parse<any>(input.lessons, LessonSchema, 'lesson');
  const journeys = parse<any>(input.journeys, JourneySchema, 'journey');
  const invitations = parse<any>(input.invitations ?? [], JourneyInvitationSchema, 'invitation');
  const cards = parse<any>(input.cards, KnowledgeCardSchema, 'card');
  const all = [...sources, ...claims, ...media, ...prompts, ...lessons, ...journeys, ...invitations, ...cards];
  const ids = new Set<string>();
  for (const item of all) {
    if (ids.has(item.id)) errors.push(`duplicate ID: ${item.id}`);
    ids.add(item.id);
  }

  const sourceIds = new Set(sources.map((item) => item.id));
  const lessonIds = new Set(lessons.map((item) => item.id));
  const claimIds = new Set(claims.map((item) => item.id));
  const mediaIds = new Set(media.map((item) => item.id));
  const promptIds = new Set(prompts.map((item) => item.id));
  const mediaById = new Map(media.map((item) => [item.id, item]));
  const promptById = new Map(prompts.map((item) => [item.id, item]));
  const lessonById = new Map(lessons.map((item) => [item.id, item]));
  const refs = (owner: string, values: string[], known: Set<string>, kind: string) => values.forEach((id) => {
    if (!known.has(id)) errors.push(`${owner}: broken ${kind} reference ${id}`);
  });

  for (const lesson of lessons) {
    const sectionIds = new Set<string>();
    for (const section of lesson.sections) {
      if (sectionIds.has(section.id)) errors.push(`${lesson.id}: duplicate section ID ${section.id}`);
      sectionIds.add(section.id);
      for (const module of section.modules) {
        refs(module.id, module.sourceIds, sourceIds, 'source');
        refs(module.id, module.claimIds, claimIds, 'claim');
        if ((module.type === 'evidence' || module.type === 'historical-map') && !mediaIds.has(module.mediaId)) errors.push(`${module.id}: broken media reference ${module.mediaId}`);
        if (module.type === 'historical-map') {
          const asset = mediaById.get(module.mediaId);
          if (asset && asset.depictionMode !== 'map') errors.push(`${module.id}: historical map media must use map depiction mode`);
        }
        if (module.type === 'prompt') {
          const prompt = promptById.get(module.promptId);
          if (!prompt) errors.push(`${module.id}: broken prompt reference ${module.promptId}`);
          else if (prompt.lessonId !== lesson.id) errors.push(`${module.id}: prompt ${module.promptId} belongs to ${prompt.lessonId}`);
          if (!lesson.promptIds.includes(module.promptId)) errors.push(`${module.id}: prompt ${module.promptId} is missing from ${lesson.id} promptIds`);
        }
      }
    }
    refs(lesson.id, lesson.sectionIdsRequired, sectionIds, 'required section');
    refs(lesson.id, lesson.sourceIds, sourceIds, 'source');
    refs(lesson.id, lesson.claimIds, claimIds, 'claim');
    refs(lesson.id, lesson.mediaIds, mediaIds, 'media');
    refs(lesson.id, lesson.promptIds, promptIds, 'prompt');
    if (lesson.heroMediaId && !mediaIds.has(lesson.heroMediaId)) errors.push(`${lesson.id}: broken hero media reference ${lesson.heroMediaId}`);
    for (const promptId of lesson.promptIds) {
      const prompt = promptById.get(promptId);
      if (prompt && prompt.lessonId !== lesson.id) errors.push(`${lesson.id}: prompt ${promptId} belongs to ${prompt.lessonId}`);
    }
    const requiredPromptCount = lesson.promptIds.filter((id: string) => promptById.get(id)?.required).length;
    if (lesson.status === 'published' && (requiredPromptCount < 1 || requiredPromptCount > 3)) errors.push(`${lesson.id}: published lessons require one to three required prompts`);
  }

  for (const claim of claims) refs(claim.id, claim.sourceIds, sourceIds, 'source');
  for (const asset of media) {
    refs(asset.id, asset.sourceIds, sourceIds, 'source');
    if (!asset.depictionLabel) errors.push(`${asset.id}: missing depiction label`);
    const fallbackPath = asset.locator.provider === 'repository' ? asset.locator.path : asset.locator.fallback.path;
    if (!existsSync(resolve(process.cwd(), 'public', fallbackPath.slice(1)))) errors.push(`${asset.id}: missing local media asset ${fallbackPath}`);
    if (asset.locator.provider === 'object-storage') {
      const widths = new Set<number>();
      for (const variant of asset.locator.variants) {
        if (widths.has(variant.width)) errors.push(`${asset.id}: duplicate media variant width ${variant.width}`);
        widths.add(variant.width);
        if (!variant.objectKey.includes(variant.sha256.slice(0, 16))) errors.push(`${asset.id}: media object key is not content-addressed ${variant.objectKey}`);
        if (variant.bytes > MAX_PUBLISHED_VARIANT_BYTES) errors.push(`${asset.id}: media variant exceeds ${MAX_PUBLISHED_VARIANT_BYTES} byte budget ${variant.objectKey}`);
      }
    }
  }

  for (const prompt of prompts) {
    if (!prompt.explanation.trim()) errors.push(`${prompt.id}: missing prompt explanation`);
    if (!lessonIds.has(prompt.lessonId)) errors.push(`${prompt.id}: broken lesson reference ${prompt.lessonId}`);
    else if (!lessonById.get(prompt.lessonId).promptIds.includes(prompt.id)) errors.push(`${prompt.id}: not registered by lesson ${prompt.lessonId}`);
  }

  const journeyById = new Map(journeys.map((journey) => [journey.id, journey]));
  for (const journey of journeys) {
    const journeyLessonIds = new Set<string>();
    for (const chapter of journey.chapters) {
      const positions = new Set<number>();
      for (const entry of chapter.entries) {
        if (positions.has(entry.position)) errors.push(`${chapter.id}: duplicate journey entry position ${entry.position}`);
        positions.add(entry.position);
        if (!lessonIds.has(entry.lessonId)) errors.push(`${entry.id}: unreachable required journey entry ${entry.lessonId}`);
        journeyLessonIds.add(entry.lessonId);
      }
    }
    if (!journeyLessonIds.has(journey.entryLessonId)) errors.push(`${journey.id}: entry lesson is not part of the journey ${journey.entryLessonId}`);
    if (journey.status === 'published' && lessonById.get(journey.entryLessonId)?.status !== 'published') errors.push(`${journey.id}: published journey entry lesson must be published ${journey.entryLessonId}`);
    if (journey.previewMediaId && !mediaIds.has(journey.previewMediaId)) errors.push(`${journey.id}: broken preview media reference ${journey.previewMediaId}`);
    refs(journey.id, journey.prerequisiteJourneyIds, new Set(journeys.map((item) => item.id)), 'prerequisite journey');
    refs(journey.id, journey.relatedJourneyIds, new Set(journeys.map((item) => item.id)), 'related journey');
  }

  for (const invitation of invitations) {
    const destination = journeyById.get(invitation.destinationJourneyId);
    if (!destination) errors.push(`${invitation.id}: broken destination journey reference ${invitation.destinationJourneyId}`);
    const destinationEntries = destination?.chapters.flatMap((chapter: any) => chapter.entries) ?? [];
    if (!destinationEntries.some((entry: any) => entry.lessonId === invitation.entryLessonId)) errors.push(`${invitation.id}: entry lesson is not in destination journey ${invitation.entryLessonId}`);
    if (invitation.sourceLessonId && !lessonIds.has(invitation.sourceLessonId)) errors.push(`${invitation.id}: broken source lesson reference ${invitation.sourceLessonId}`);
    if (invitation.status === 'published') {
      if (destination?.status !== 'published') errors.push(`${invitation.id}: published invitation destination must be published`);
      if (lessonById.get(invitation.entryLessonId)?.status !== 'published') errors.push(`${invitation.id}: published invitation entry lesson must be published`);
    }
  }

  const cardUnlockCounts = new Map<string, number>();
  for (const card of cards) {
    refs(card.id, card.lessonIds, lessonIds, 'lesson');
    refs(card.id, card.sourceIds, sourceIds, 'source');
    if (!lessonIds.has(card.unlockLessonId)) errors.push(`${card.id}: invalid card unlock reference ${card.unlockLessonId}`);
    const unlockCount = (cardUnlockCounts.get(card.unlockLessonId) ?? 0) + 1;
    cardUnlockCounts.set(card.unlockLessonId, unlockCount);
    if (unlockCount > 3) errors.push(`${card.id}: more than three deterministic unlocks for ${card.unlockLessonId}`);
    if (!mediaIds.has(card.mediaId)) errors.push(`${card.id}: broken media reference ${card.mediaId}`);
  }

  return { success: errors.length === 0, errors };
}
