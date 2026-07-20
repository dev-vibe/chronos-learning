/**
 * Temporary curriculum-development access policy.
 *
 * Published World Spine lessons through this stable node are intentionally
 * open while the beginning of the roadmap is backfilled. Advance or remove
 * this cutoff only through an explicit product/curriculum decision.
 */
export const WORLD_SPINE_DEVELOPMENT_OPEN_THROUGH_LESSON_ID = 'lesson.uruk.first-city';

export type WorldSpineAccessPolicy = Readonly<{
  openThroughLessonId: string;
}>;

export const worldSpineAccessPolicy: WorldSpineAccessPolicy = {
  openThroughLessonId: WORLD_SPINE_DEVELOPMENT_OPEN_THROUGH_LESSON_ID,
};
