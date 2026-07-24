import React, { useMemo } from 'react';
import { Check, ChevronDown, Lock } from 'lucide-react';
import { worldSpineNodeCount, worldSpineRoadmap } from '../../content/world-spine/roadmap';
import type { Lesson } from '../domains/contracts';
import { createWorldSpineRoadmapView } from '../domains/journeys/worldSpine';
import type { JourneyProgressSummary, LearnState } from './progress';

type WorldSpineTimelineProps = {
  lesson: Lesson;
  lessons: readonly Lesson[];
  summaries: Record<string, JourneyProgressSummary>;
  currentState: LearnState;
  currentSectionId?: string;
  showCurrentSections?: boolean;
  onNavigate(id: string): void;
  onClose(): void;
};

export function WorldSpineTimeline({
  lesson,
  lessons,
  summaries,
  currentState,
  currentSectionId,
  showCurrentSections = true,
  onNavigate,
  onClose,
}: WorldSpineTimelineProps) {
  const combinedSummaries = useMemo(() => ({
    ...summaries,
    [lesson.id]: {
      lessonId: lesson.id,
      status: currentState.status,
      completedAt: currentState.completedAt,
    },
  }), [currentState.completedAt, currentState.status, lesson.id, summaries]);
  const chapters = useMemo(
    () => createWorldSpineRoadmapView(worldSpineRoadmap, lessons, combinedSummaries, lesson.id),
    [combinedSummaries, lesson.id, lessons],
  );
  const availableCount = chapters.reduce((count, chapter) => count + chapter.publishedCount, 0);
  const explored = currentState.exploredSectionIds;

  return <>
    <div className="rail-heading spine-heading">
      <p className="eyebrow">World History</p>
      <h2>World Spine</h2>
      <p>A chronological path from human beginnings to the present.</p>
    </div>
    <div className="spine-stats" aria-label={availableCount + ' of ' + worldSpineNodeCount + ' lessons available'}>
      <span><b>{availableCount}</b> available now</span>
      <span><b>{worldSpineNodeCount}</b> lesson roadmap</span>
    </div>
    <section className="spine-timeline" aria-label="World History timeline">
      {chapters.map((chapter) => {
        const currentIndex = chapter.nodes.findIndex((node) => node.id === lesson.id);
        const nearbyIds = new Set(
          currentIndex < 0
            ? []
            : chapter.nodes.slice(Math.max(0, currentIndex - 2), currentIndex + 3).map((node) => node.id),
        );
        const visibleNodes = chapter.nodes.filter((node) => node.status !== 'preparing' || nearbyIds.has(node.id));
        const hiddenCount = chapter.nodes.length - visibleNodes.length;
        return <details className="spine-chapter" key={chapter.id} open={chapter.containsCurrent || undefined}>
          <summary>
            <span className="spine-chapter-number">{chapter.id}</span>
            <span className="spine-chapter-copy"><strong>{chapter.title}</strong><small>{chapter.period}</small></span>
            <span className="spine-chapter-count">{chapter.nodes.length}</span>
            <ChevronDown aria-hidden="true" />
          </summary>
          {visibleNodes.length ? <ol className="spine-node-list">
          {visibleNodes.map((node) => {
            const body = <>
              <span className="spine-node-marker" aria-hidden="true">
                {node.completed ? <Check /> : node.status === 'locked' || node.status === 'preparing' ? <Lock /> : node.order}
              </span>
              <span className="spine-node-copy">
                <small>{node.dateDisplay}</small>
                <strong>{node.title}</strong>
                {node.lockReason && <em>{node.lockReason}</em>}
              </span>
            </>;
            const current = node.id === lesson.id;
            return <li key={node.id} className={'spine-node ' + node.status}>
              {node.href && node.status !== 'locked'
                ? <a href={node.href} aria-current={current ? 'page' : undefined} onClick={current ? (event) => {
                  event.preventDefault();
                  onNavigate(lesson.sections[0].id);
                  onClose();
                } : undefined}>{body}</a>
                : <div className="spine-node-disabled" aria-disabled="true">{body}</div>}
              {current && showCurrentSections && node.status !== 'locked' && node.status !== 'preparing' && <div className="current-lesson-sections">
                <div className="section-index-label"><span>In this lesson</span><b>{explored.length}/{lesson.sections.length}</b></div>
                <nav className="section-nav" aria-label="Lesson sections">
                  {lesson.sections.map((section, index) => <button key={section.id} className={currentSectionId === section.id ? 'active' : ''} aria-current={currentSectionId === section.id ? 'location' : undefined} onClick={() => {
                    onNavigate(section.id);
                    onClose();
                  }}><span aria-hidden="true" className={explored.includes(section.id) ? 'done' : ''}>{explored.includes(section.id) ? <Check size={10} /> : index + 1}</span>{section.heading}</button>)}
                </nav>
              </div>}
            </li>;
          })}
          </ol> : <p className="spine-chapter-quiet">Lessons in this chapter are still being prepared.</p>}
          {hiddenCount > 0 && <p className="spine-hidden-count">{hiddenCount} more planned {hiddenCount === 1 ? 'lesson' : 'lessons'} in the complete roadmap</p>}
        </details>;
      })}
    </section>
    <a className="rail-roadmap-link" href="/library/journey.world-history#world-spine-title">View complete 185-lesson roadmap</a>
  </>;
}
