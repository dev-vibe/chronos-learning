import React, { useMemo } from 'react';
import { Check, ChevronDown, Lock } from 'lucide-react';
import { worldSpineNodeCount, worldSpineRoadmap } from '../../content/world-spine/roadmap';
import type { Lesson } from '../domains/contracts';
import { createWorldSpineRoadmapView } from '../domains/journeys/worldSpine';
import type { JourneyProgressSummary } from '../learn/progress';

type WorldSpineOverviewProps = {
  lessons: readonly Lesson[];
  summaries: Record<string, JourneyProgressSummary>;
  currentLessonId: string;
};

export function WorldSpineOverview({ lessons, summaries, currentLessonId }: WorldSpineOverviewProps) {
  const chapters = useMemo(
    () => createWorldSpineRoadmapView(worldSpineRoadmap, lessons, summaries, currentLessonId),
    [currentLessonId, lessons, summaries],
  );
  const availableNow = chapters.reduce((count, chapter) => count + chapter.publishedCount, 0);

  return <section className="world-spine-overview" aria-labelledby="world-spine-title">
    <header>
      <div>
        <p className="label">Complete curriculum map</p>
        <h2 id="world-spine-title">Complete World History roadmap</h2>
        <p>Every planned stop is visible. Reviewed lessons open in sequence; lessons still being prepared remain locked without hiding where the journey is going.</p>
      </div>
      <dl>
        <div><dt>{worldSpineRoadmap.length}</dt><dd>chronological chapters</dd></div>
        <div><dt>{worldSpineNodeCount}</dt><dd>lessons in the roadmap</dd></div>
        <div><dt>{availableNow}</dt><dd>available now</dd></div>
      </dl>
    </header>
    <div className="world-spine-chapters">
      {chapters.map((chapter) => <details key={chapter.id} open={chapter.containsCurrent || undefined}>
        <summary>
          <span className="overview-chapter-number">{chapter.id}</span>
          <span><strong>{chapter.title}</strong><small>{chapter.period}</small></span>
          <span className="overview-chapter-count">{chapter.nodes.length} lessons</span>
          <ChevronDown aria-hidden="true" />
        </summary>
        <p>{chapter.purpose}</p>
        <ol>
          {chapter.nodes.map((node) => <li key={node.id} className={node.status}>
            <span className="overview-node-marker" aria-hidden="true">
              {node.completed ? <Check /> : node.status === 'locked' || node.status === 'preparing' ? <Lock /> : node.order}
            </span>
            <span className="overview-node-copy">
              <small>{node.dateDisplay}</small>
              {node.href ? <a href={node.href}>{node.title}</a> : <strong>{node.title}</strong>}
            </span>
            <em>{node.status === 'preparing' ? 'In preparation' : node.status === 'locked' ? node.lockReason : node.status === 'current' ? 'Current lesson' : node.status === 'completed' ? 'Completed' : 'Available'}</em>
          </li>)}
        </ol>
      </details>)}
    </div>
  </section>;
}
