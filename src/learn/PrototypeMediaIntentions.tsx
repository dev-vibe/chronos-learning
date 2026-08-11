import type { Lesson } from '../domains/contracts';
import type { LessonPrototypeReview } from '../infrastructure/content/prototypeReview';
import { unlockPreviewLessonsEnabled } from '../config/runtimeFlags';

const KIND_LABELS = {
  map: 'Map',
  diagram: 'Diagram',
  evidence: 'Evidence',
  reconstruction: 'Reconstruction',
  other: 'Media',
} as const;

export function PrototypeMediaIntentions({
  lesson,
  review,
  sectionId,
}: {
  lesson: Pick<Lesson, 'status'>;
  review?: LessonPrototypeReview;
  sectionId: string;
}) {
  if (lesson.status !== 'draft' || !unlockPreviewLessonsEnabled() || !review) return null;
  const intentions = review.mediaIntentions.filter((intention) => intention.sectionId === sectionId);
  if (intentions.length === 0) return null;

  return <aside className="prototype-media-intentions" aria-label="Prototype media intentions" data-prototype-annotation-for={sectionId}>
    <p className="prototype-media-label">Prototype review <span>Not learner content</span></p>
    <ul>
      {intentions.map((intention, index) => <li key={`${intention.sectionId}-${intention.kind}-${index}`}>
        <span>{KIND_LABELS[intention.kind]}</span>
        <p>{intention.purpose}</p>
        <small>{intention.status.replace('-', ' ')}</small>
      </li>)}
    </ul>
  </aside>;
}
