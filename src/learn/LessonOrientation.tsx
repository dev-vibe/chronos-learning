import { chronosContent } from '../../content/chronos';
import { learningConnectionsByLessonId } from '../../content/learning-connections';
import type { Journey, Lesson } from '../domains/contracts';
import { orientationPeriods } from '../domains/lessonOrientation';
import { ResponsiveMedia } from './ResponsiveMedia';
import { EvidenceViewer } from './EvidenceViewer';
import './orientation.css';

/** Reuses authored geography and date ranges; never manufactures coordinates. */
export function LessonOrientation({ lesson, journey }: { lesson: Lesson; journey: Journey }) {
  const connection = learningConnectionsByLessonId[lesson.id];
  const mapModule = lesson.sections.flatMap((section) => section.modules).find((module) =>
    module.type === 'historical-map' && (!lesson.orientationMapModuleId || module.id === lesson.orientationMapModuleId));
  const map = mapModule?.type === 'historical-map' ? mapModule : undefined;
  const media = chronosContent.media.find((asset) => asset.id === (map?.mediaId ?? lesson.heroMediaId) && asset.depictionMode === 'map');
  const chapter = journey.chapters.find((entry) => entry.entries.some((item) => item.lessonId === lesson.id));
  const relatedIds = [connection?.retrieve?.lessonId, connection?.revisit?.lessonId];
  // An overlap from this authored chapter is useful even when it is not the next lesson.
  const overlap = chronosContent.lessons.find((item) => item.id !== lesson.id && item.status === 'published'
    && chapter?.entries.some((entry) => entry.lessonId === item.id)
    && item.chronology.startYear <= lesson.chronology.endYear && item.chronology.endYear >= lesson.chronology.startYear);
  if (overlap) relatedIds.unshift(overlap.id);
  const peers = [...new Set(relatedIds)].flatMap((id) => {
    const item = chronosContent.lessons.find((entry) => entry.id === id && entry.status === 'published');
    return item ? [item] : [];
  });
  const periods = orientationPeriods(lesson, peers);
  return <aside className="lesson-orientation" aria-label="Time and place">
    <div className="orientation-heading"><strong>Time and place</strong><span>{chapter?.title}</span></div>
    <div className={media ? 'orientation-layout' : 'orientation-layout orientation-layout--text'}>
      <div className="orientation-place">
        {media && <div className="orientation-map"><ResponsiveMedia media={media} alt={media.alt} sizes="240px" loading="lazy" /><EvidenceViewer media={media} title={`Locator: ${lesson.place}`} summary={map?.accessibleSummary ?? media.alt}><p>{map?.uncertaintyNote ?? lesson.heroCaption}</p><p>{media.rightsLabel}</p></EvidenceViewer></div>}
        <p><strong>{lesson.place}</strong></p>
        {map ? <p className="orientation-note">{map.modernContext}. {map.compactLabel}</p> : media ? <p className="orientation-note">{media.depictionLabel}</p> : <p className="orientation-note">The place name gives the lesson’s geographic focus; it does not mark exact boundaries.</p>}
      </div>
      <div className="orientation-time">
        <ol aria-label="Lesson focus periods">{periods.map(({ lesson: item, relation, left, width }) => <li key={item.id} className={item.id === lesson.id ? 'is-current' : ''}>
          <div><span>{relation}</span><strong>{item.title}</strong><span>{item.chronology.display}</span></div>
          <div className="orientation-track" aria-hidden="true"><span style={{ marginLeft: `${left}%`, width: `${width}%` }} /></div>
        </li>)}</ol>
        <p className="orientation-note">Earlier ← time → later. Bars share one scale and show the periods these lessons focus on, not the full duration of a society. Approximate dates can overlap.</p>
      </div>
    </div>
    {connection && <div className="orientation-bridge">{connection.retrieve && <p><strong>Bring back an earlier idea:</strong> {connection.retrieve.prompt}</p>}<p>{connection.extend}</p></div>}
  </aside>;
}
