import { z } from 'zod';

export const StableId = z.string().regex(/^[a-z]+(?:\.[a-z0-9-]+)+$/);
export const HistoricalDateRangeSchema = z.object({
  startYear: z.number().int(), endYear: z.number().int(), display: z.string().min(1), approximate: z.boolean().default(false),
}).refine((v) => v.startYear <= v.endYear, 'startYear must not be after endYear');
export type HistoricalDateRange = z.infer<typeof HistoricalDateRangeSchema>;

export const ClaimSchema = z.object({ id: StableId, statement: z.string().min(1), kind: z.enum(['observation','interpretation','reconstruction','later-tradition']), certainty: z.enum(['high','moderate','low','contested']), sourceIds: z.array(StableId).min(1), reviewStatus: z.enum(['reviewed','editorial-review-required']) });
export const SourceSchema = z.object({ id: StableId, title: z.string(), url: z.string().url(), publisher: z.string(), accessedOn: z.string(), licenseOrUse: z.string().min(1), reviewStatus: z.enum(['reviewed','review-required']) });
export const MediaAssetSchema = z.object({ id: StableId, path: z.string(), alt: z.string().min(1), depictionMode: z.enum(['evidence','evidence-based-reconstruction','diagram','map']), depictionLabel: z.string().min(1), sourceIds: z.array(StableId).min(1), visualBriefRef: z.string().min(1), reviewStatus: z.enum(['approved','provenance-review-required']) });

const BaseModule = z.object({ id: StableId, claimIds: z.array(StableId).default([]), sourceIds: z.array(StableId).default([]) });
export const HistoricalMapModuleSchema = BaseModule.extend({
  type: z.literal('historical-map'), eyebrow: z.string().min(1), title: z.string().min(1), body: z.string().min(1), mediaId: StableId,
  periodLabel: z.string().min(1), focusPlace: z.string().min(1), modernContext: z.string().min(1), accessibleSummary: z.string().min(1),
  uncertaintyNote: z.string().min(1), depictionStatus: z.enum(['evidence-based-reconstruction', 'illustrative-reconstruction']),
});
export const LessonModuleSchema = z.discriminatedUnion('type', [
  BaseModule.extend({ type: z.literal('prose'), body: z.string().min(1) }),
  BaseModule.extend({ type: z.literal('knowledge'), eyebrow: z.string().min(1), title: z.string().min(1), body: z.string().min(1), items: z.array(z.object({ label: z.string().min(1), detail: z.string().min(1) })).min(2).max(4) }),
  BaseModule.extend({ type: z.literal('scene'), title: z.string().min(1), body: z.string().min(1), mediaId: StableId, hotspots: z.array(z.object({ label: z.string().min(1), detail: z.string().min(1) })).min(2).max(4) }),
  BaseModule.extend({ type: z.literal('evidence'), title: z.string().min(1), artifactLabel: z.string().min(1), body: z.string().min(1), mediaId: StableId }),
  HistoricalMapModuleSchema,
  BaseModule.extend({ type: z.literal('prompt'), promptId: StableId }),
]);
export type LessonModule = z.infer<typeof LessonModuleSchema>;
export type HistoricalMapModule = z.infer<typeof HistoricalMapModuleSchema>;
export const LessonSectionSchema = z.object({ id: StableId, heading: z.string(), purpose: z.string(), modules: z.array(LessonModuleSchema).min(1) });
export const UnderstandingPromptSchema = z.object({ id: StableId, lessonId: StableId, kind: z.enum(['supported-selection','concise-explanation']), question: z.string(), explanation: z.string().min(1), required: z.boolean(), minimumResponseLength: z.number().int().positive().optional() });
export const LessonSchema = z.object({ id: StableId, legacyAliases: z.array(z.string()), title: z.string(), masthead: z.string(), chronology: HistoricalDateRangeSchema, significance: z.string(), sectionIdsRequired: z.array(StableId), sections: z.array(LessonSectionSchema).min(1), claimIds: z.array(StableId).min(1), sourceIds: z.array(StableId).min(1), mediaIds: z.array(StableId), promptIds: z.array(StableId) });
export const JourneyEntrySchema = z.object({ id: StableId, lessonId: StableId, position: z.number().int().nonnegative(), required: z.boolean(), framing: z.string() });
export const JourneyChapterSchema = z.object({ id: StableId, title: z.string(), position: z.number().int().nonnegative(), entries: z.array(JourneyEntrySchema).min(1) });
export const JourneySchema = z.object({ id: StableId, title: z.string(), kind: z.enum(['world-history','story-arc','idea-trail','investigation']), chapters: z.array(JourneyChapterSchema).min(1) });
export const KnowledgeCardSchema = z.object({ id: StableId, title: z.string(), category: z.enum(['place','person','artifact','invention','event','idea']), cardClass: z.enum(['foundation','breakthrough','turning-point','masterwork','witness','enigma','legacy']), date: HistoricalDateRangeSchema, significance: z.string(), facts: z.array(z.string()).min(3).max(5), lessonIds: z.array(StableId).min(1), sourceIds: z.array(StableId).min(1), mediaId: StableId, unlockLessonId: StableId });
export type Lesson = z.infer<typeof LessonSchema>; export type LessonSection = z.infer<typeof LessonSectionSchema>; export type Journey = z.infer<typeof JourneySchema>; export type JourneyChapter = z.infer<typeof JourneyChapterSchema>; export type JourneyEntry = z.infer<typeof JourneyEntrySchema>; export type Source = z.infer<typeof SourceSchema>; export type Claim = z.infer<typeof ClaimSchema>; export type MediaAsset = z.infer<typeof MediaAssetSchema>; export type UnderstandingPrompt = z.infer<typeof UnderstandingPromptSchema>; export type KnowledgeCard = z.infer<typeof KnowledgeCardSchema>;

export type LessonProgress = { learnerId:string; lessonId:string; status:'in-progress'|'completed'; resumeSectionId?:string; attemptedPromptIds:string[]; completedAt?:string };
export type CardOwnership = { learnerId:string; cardId:string; acquiredAt:string };
export type CompleteLessonCommand = { lessonId:string; idempotencyKey:string; explicitCompletion:true; attemptedPromptIds:string[]; rawScrollPosition?:number };
export type CompleteLessonResult = { completion:'newly-completed'|'already-completed'; cardOwnership:'newly-acquired'|'already-owned'|'not-configured'; cardId?:string };

export const compareHistoricalDates = (a: HistoricalDateRange, b: HistoricalDateRange) => a.startYear - b.startYear || a.endYear - b.endYear;
export const canExplicitlyComplete = (requiredPromptIds:string[], command:CompleteLessonCommand) => command.explicitCompletion && requiredPromptIds.every((id) => command.attemptedPromptIds.includes(id));
