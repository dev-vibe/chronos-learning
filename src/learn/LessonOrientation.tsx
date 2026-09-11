import { chronosContent } from '../../content/chronos';
import { learningConnectionsByLessonId } from '../../content/learning-connections';
import type { Journey, Lesson } from '../domains/contracts';
import { orientationMapForLesson, orientationPeriods } from '../domains/lessonOrientation';
import { ResponsiveMedia } from './ResponsiveMedia';
import { EvidenceViewer } from './EvidenceViewer';
import './orientation.css';

/** Reuses authored geography and date ranges; never manufactures coordinates. */
export function LessonOrientation({ lesson, journey }: { lesson: Lesson; journey: Journey }) {
  const connection = learningConnectionsByLessonId[lesson.id];
  const mapModule = orientationMapForLesson(lesson);
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
        {media && <div className="orientation-map"><ResponsiveMedia media={media} alt={media.alt} sizes="(max-width: 700px) calc(100vw - 64px), (max-width: 1100px) 55vw, 620px" loading="lazy" /><EvidenceViewer className="orientation-enlarge" media={media} title={`Locator: ${lesson.place}`} summary={map?.accessibleSummary ?? media.alt}>
          {map && <><p>{map.body}</p><p>{map.coordinateNote}</p>{map.lookHere && <ul>{map.lookHere.map(item => <li key={item.label}><strong>{item.label}</strong> {item.detail}</li>)}</ul>}</>}
          <p>{map?.uncertaintyNote ?? lesson.heroCaption}</p><p>{media.rightsLabel}</p>
          <ul>{(map?.sourceIds ?? media.sourceIds).map(id => chronosContent.sources.find(source => source.id === id)).filter(Boolean).map(source => <li key={source!.id}><a href={source!.url}>{source!.title}</a></li>)}</ul>
        </EvidenceViewer></div>}
        <p><strong>{lesson.place}</strong></p>
        {map ? <p className="orientation-note">{map.modernContext}. {map.compactLabel}</p> : media ? <p className="orientation-note">{media.depictionLabel}</p> : <p className="orientation-note">The place name gives the lesson’s geographic focus; it does not mark exact boundaries.</p>}
      </div>
      <div className="orientation-time">
        <p className="orientation-time-heading">When these lessons take place</p>
        <ol aria-label="Lesson focus periods">{periods.map(({ lesson: item, relation }) => <li key={item.id} className={item.id === lesson.id ? 'is-current' : ''}>
          <div><span className="orientation-date">{item.chronology.display}</span><strong>{item.title}</strong><span className="orientation-relation">{relation}</span></div>
        </li>)}</ol>
      </div>
    </div>
    {connection && <div className="orientation-bridge">{connection.retrieve && <p><strong>Bring back an earlier idea:</strong> {connection.retrieve.prompt}</p>}<p>{connection.extend}</p></div>}
  </aside>;
}
