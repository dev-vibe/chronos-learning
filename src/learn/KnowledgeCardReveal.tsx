import React from 'react';
import { Archive, Landmark } from 'lucide-react';
import { chronosContent } from '../../content/chronos';
import type { KnowledgeCard } from '../domains/contracts';
import { knowledgeCardTypeLabel } from '../domains/knowledgeCards';
import { ResponsiveMedia } from './ResponsiveMedia';

const lessonById = new Map(chronosContent.lessons.map((item) => [item.id, item]));
const mediaById = new Map(chronosContent.media.map((item) => [item.id, item]));

/** A Knowledge Card at trading-card proportions: name, art, type line and text box. */
export function KnowledgeCardFace({ card }: { card: KnowledgeCard }) {
  const media = mediaById.get(card.mediaId)!;
  return <div className="knowledge-card"><div className="card-frame"><div className="card-inner">
    <div className="card-name"><h3>{card.title}</h3>{card.category === 'place' ? <Landmark aria-hidden="true" /> : <Archive aria-hidden="true" />}</div>
    <div className={`card-image card-image-${card.category}`} data-depiction={media.depictionMode}><ResponsiveMedia media={media} alt={media.alt} sizes="330px" loading="lazy" /></div>
    <p className="card-type"><span className="card-class">{knowledgeCardTypeLabel(card.category)}</span><span className="card-date">{card.date.display}</span></p>
    <div className="card-text"><p>{card.significance}</p><p className="card-place">{card.place}</p></div>
  </div></div></div>;
}

export function KnowledgeCardReveal({ card, revealRef, acquired = false }: { card: KnowledgeCard; revealRef?: React.RefObject<HTMLDivElement | null>; acquired?: boolean }) {
  return <div ref={revealRef} className="card-reveal" tabIndex={-1} aria-live={acquired ? 'polite' : undefined}><KnowledgeCardFace card={card} /><div className="card-copy"><p className="eyebrow">{acquired ? 'Knowledge Card acquired' : 'In your Knowledge Cards'}</p><h3>{card.revealTitle}</h3><p>{card.revealBody}</p><ul>{card.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>{card.recallPrompt && <details className="card-recall"><summary>Try remembering</summary><p>{card.recallPrompt}</p></details>}{card.connections?.filter((connection) => lessonById.get(connection.lessonId)?.status === 'published').map((connection) => <p key={connection.lessonId}><a href={`/learn/${connection.lessonId}`}>{connection.label}</a> — {connection.reason}</p>)}</div></div>;
}
