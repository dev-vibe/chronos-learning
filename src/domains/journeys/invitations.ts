import type { Journey, JourneyInvitation, Lesson } from '../contracts';
import type { LearnerJourneyState } from './state';

export type InvitationContext = { placement: JourneyInvitation['placements'][number]; sourceLessonId?: string };

export function resolveJourneyInvitation(
  invitations: readonly JourneyInvitation[],
  journeys: readonly Journey[],
  lessons: readonly Lesson[],
  state: LearnerJourneyState,
  context: InvitationContext,
) {
  const publishedJourneys = new Map(journeys.filter((journey) => journey.status === 'published').map((journey) => [journey.id, journey]));
  const publishedLessons = new Set(lessons.filter((lesson) => lesson.status === 'published').map((lesson) => lesson.id));
  return invitations
    .filter((invitation) => invitation.status === 'published')
    .filter((invitation) => invitation.placements.includes(context.placement))
    .filter((invitation) => !invitation.sourceLessonId || invitation.sourceLessonId === context.sourceLessonId)
    .filter((invitation) => publishedJourneys.has(invitation.destinationJourneyId) && publishedLessons.has(invitation.entryLessonId))
    .filter((invitation) => !state.invitationStates[invitation.id])
    .sort((left, right) => right.priority - left.priority || left.id.localeCompare(right.id))[0];
}
