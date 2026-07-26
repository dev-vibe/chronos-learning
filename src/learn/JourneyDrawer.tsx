import React, { useEffect, useRef } from 'react';
import { Check, X } from 'lucide-react';
import { chronosContent } from '../../content/chronos';
import { isLessonOpenable } from '../config/runtimeFlags';
import type { Journey, Lesson } from '../domains/contracts';
import type { JourneyProgressSummary, LearnState } from './progress';
import { WorldSpineTimeline } from './WorldSpineTimeline';

export const orderedJourneyEntries = (
  journey: Journey,
  lessons: readonly Lesson[] = chronosContent.lessons,
) => {
  const lessonById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
  return [...journey.chapters]
    .sort((left, right) => left.position - right.position)
    .flatMap((chapter) => [...chapter.entries]
      .sort((left, right) => left.position - right.position)
      .map((entry) => ({ chapter, entry, lesson: lessonById.get(entry.lessonId) }))
      .filter((item): item is {
        chapter: Journey['chapters'][number];
        entry: Journey['chapters'][number]['entries'][number];
        lesson: Lesson;
      } => Boolean(item.lesson && isLessonOpenable(
        item.lesson as { status: 'published' | 'draft' },
      ))));
};

export const createJourneyDrawerState = (
  lessonId: string,
  summary?: JourneyProgressSummary,
): LearnState => ({
  learnerId: 'drawer-preview',
  lessonId,
  status: summary?.status ?? 'in-progress',
  completedAt: summary?.completedAt,
  attemptedPromptIds: [],
  exploredSectionIds: [],
  responses: {},
  version: 1,
});

type JourneyDrawerProps = {
  open: boolean;
  onClose(): void;
  onNavigate(id: string): void;
  lesson: Lesson;
  journey: Journey;
  lessons?: readonly Lesson[];
  summaries: Record<string, JourneyProgressSummary>;
  currentState: LearnState;
  currentSectionId?: string;
  showCurrentSections?: boolean;
  returnFocus: React.RefObject<HTMLElement | null>;
};

export function JourneyDrawer({
  open,
  onClose,
  onNavigate,
  lesson,
  journey,
  lessons = chronosContent.lessons,
  summaries,
  currentState,
  currentSectionId,
  showCurrentSections = true,
  returnFocus,
}: JourneyDrawerProps) {
  const railRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        returnFocus.current?.focus();
        return;
      }
      if (event.key !== 'Tab' || !railRef.current) return;
      const focusable = [...railRef.current.querySelectorAll<HTMLElement>(
        'button,summary,[href],[tabindex]:not([tabindex="-1"])',
      )];
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose, returnFocus]);

  const entries = orderedJourneyEntries(journey, lessons);
  const explored = currentState.exploredSectionIds;
  const accessibleName = journey.kind === 'world-history' ? 'World History' : `${journey.title} journey`;
  const close = () => {
    onClose();
    returnFocus.current?.focus();
  };

  return <>
    <div className={`learn-scrim ${open ? 'is-open' : ''}`} onClick={close} aria-hidden="true" />
    <aside
      ref={railRef}
      className={`journey-rail ${open ? 'is-open' : ''}`}
      aria-label={accessibleName}
      aria-hidden={!open}
      aria-modal={open || undefined}
      inert={!open}
      role={open ? 'dialog' : undefined}
    >
      <button
        ref={closeRef}
        className="icon-button rail-close"
        onClick={close}
        aria-label={`Close ${accessibleName}`}
      >
        <X />
      </button>
      {journey.kind === 'world-history' ? <WorldSpineTimeline
        lesson={lesson}
        lessons={lessons}
        summaries={summaries}
        currentState={currentState}
        currentSectionId={currentSectionId}
        showCurrentSections={showCurrentSections}
        onNavigate={onNavigate}
        onClose={onClose}
      /> : <>
        <div className="rail-heading">
          <p className="eyebrow">{journey.title}</p>
          <h2>{entries.find((item) => item.lesson.id === lesson.id)?.chapter.title}</h2>
          <p>From settlements to recorded information</p>
        </div>
        <ol className="journey-list">{entries.map(({ entry, lesson: item }, index) => {
          const isCurrent = item.id === lesson.id;
          const isComplete = isCurrent
            ? currentState.status === 'completed'
            : summaries[item.id]?.status === 'completed';
          const status = isCurrent ? 'current' : isComplete ? 'complete' : 'available';
          const content = <>
            <span className="journey-node">{isComplete ? <Check size={14} /> : index + 1}</span>
            <div>
              <small>{item.masthead}</small>
              <strong>{item.title}</strong>
              {isCurrent && <span>{explored.length} of {lesson.sections.length} sections explored</span>}
            </div>
          </>;
          return <li key={entry.id} className={status}>
            <a
              href={`/learn/${item.id}`}
              aria-current={isCurrent ? 'page' : undefined}
              onClick={isCurrent ? (event) => {
                event.preventDefault();
                onNavigate(lesson.sections[0].id);
                onClose();
              } : undefined}
            >
              {content}
            </a>
          </li>;
        })}</ol>
        <div className="section-index-label">
          <span>In this lesson</span>
          <b>{explored.length}/{lesson.sections.length}</b>
        </div>
        <nav className="section-nav" aria-label="Lesson sections">
          {lesson.sections.map((section, index) => <button
            key={section.id}
            className={currentSectionId === section.id ? 'active' : ''}
            aria-current={currentSectionId === section.id ? 'location' : undefined}
            onClick={() => {
              onNavigate(section.id);
              onClose();
            }}
          >
            <span aria-hidden="true" className={explored.includes(section.id) ? 'done' : ''}>
              {explored.includes(section.id) ? <Check size={10} /> : index + 1}
            </span>
            {section.heading}
          </button>)}
        </nav>
      </>}
    </aside>
  </>;
}
