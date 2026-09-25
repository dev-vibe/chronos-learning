import React from 'react';
import { Archive, Compass, Landmark } from 'lucide-react';
import { chronosContent } from '../../content/chronos';
import type { KnowledgeCard } from '../domains/contracts';
import { knowledgeCardTypeLabel } from '../domains/knowledgeCards';
import { ResponsiveMedia } from './ResponsiveMedia';

const lessonById = new Map(chronosContent.lessons.map((item) => [item.id, item]));
const mediaById = new Map(chronosContent.media.map((item) => [item.id, item]));

export function KnowledgeCardFace({ card }: { card: KnowledgeCard }) {
  const media = mediaById.get(card.mediaId)!;
  return <div className="knowledge-card"><div className="card-frame"><div className={`card-image card-image-${card.category}`} data-depiction={media.depictionMode}><ResponsiveMedia media={media} alt={media.alt} sizes="320px" loading="lazy" /></div><div className="card-body"><span className="card-class">{card.category === 'place' ? <Landmark /> : <Archive />} {knowledgeCardTypeLabel(card.category)}</span><h3>{card.title}</h3><p className="card-date">{card.date.display} · {card.place}</p><p>{card.significance}</p><div className="card-ornament" aria-hidden="true"><i /><Compass /><i /></div></div></div></div>;
}

export function KnowledgeCardReveal({ card, revealRef, acquired = false }: { card: KnowledgeCard; revealRef?: React.RefObject<HTMLDivElement | null>; acquired?: boolean }) {
  return <div ref={revealRef} className="card-reveal" tabIndex={-1} aria-live={acquired ? 'polite' : undefined}><KnowledgeCardFace card={card} /><div className="card-copy"><p className="eyebrow">{acquired ? 'Knowledge Card acquired' : 'In your Knowledge Cards'}</p><h3>{card.revealTitle}</h3><p>{card.revealBody}</p><ul>{card.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>{card.recallPrompt && <details className="card-recall"><summary>Try remembering</summary><p>{card.recallPrompt}</p></details>}{card.connections?.filter((connection) => lessonById.get(connection.lessonId)?.status === 'published').map((connection) => <p key={connection.lessonId}><a href={`/learn/${connection.lessonId}`}>{connection.label}</a> — {connection.reason}</p>)}</div></div>;
}
