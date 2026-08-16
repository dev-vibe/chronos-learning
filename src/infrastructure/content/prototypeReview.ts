import { z } from 'zod';
import { StableId } from '../../domains/contracts';

const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected an ISO date (YYYY-MM-DD)');

export const PrototypeMediaIntentionSchema = z.object({
  sectionId: StableId,
  kind: z.enum(['map', 'diagram', 'evidence', 'reconstruction', 'other']),
  purpose: z.string().min(1),
  status: z.enum(['planned', 'ready', 'not-needed']),
  mediaId: StableId.optional(),
}).superRefine((intention, context) => {
  if (intention.status === 'ready' && !intention.mediaId) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['mediaId'], message: 'ready media intentions require a mediaId' });
  }
});

export const ProductPrototypeReviewSchema = z.object({
  state: z.enum(['pending', 'approved', 'changes-requested']),
  reviewedBy: z.string().min(1).optional(),
  reviewedOn: IsoDate.optional(),
  notes: z.string().min(1).optional(),
}).superRefine((review, context) => {
  if (review.state !== 'pending' && (!review.reviewedBy || !review.reviewedOn)) {
    context.addIssue({ code: z.ZodIssueCode.custom, message: 'recorded product review requires reviewedBy and reviewedOn' });
  }
});

export const LessonPrototypeReviewSchema = z.object({
  lessonId: StableId,
  researchNotePath: z.string().regex(/^docs\/research\/[a-z0-9][a-z0-9-]*\.md$/, 'expected a repository-relative docs/research Markdown path'),
  validationTier: z.enum(['ordinary', 'reference', 'high-risk']),
  mediaIntentions: z.array(PrototypeMediaIntentionSchema).min(1),
  productReview: ProductPrototypeReviewSchema,
});

export type PrototypeMediaIntention = z.infer<typeof PrototypeMediaIntentionSchema>;
export type LessonPrototypeReview = z.infer<typeof LessonPrototypeReviewSchema>;
