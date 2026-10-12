import React from 'react';
import { chronosContent } from '../../content/chronos';
import type { KnowledgeCard } from '../domains/contracts';
import { InteractiveKnowledgeCard } from './InteractiveKnowledgeCard';

export { KnowledgeCardFace } from './KnowledgeCardFace';

const lessonById = new Map(chronosContent.lessons.map((item) => [item.id, item]));

/** An earned card you can handle, with the story of why it matters beside it. */
export function KnowledgeCardReveal({ card, revealRef, acquired = false }: { card: KnowledgeCard; revealRef?: React.RefObject<HTMLDivElement | null>; acquired?: boolean }) {
  return <div ref={revealRef} className="card-reveal" tabIndex={-1} aria-live={acquired ? 'polite' : undefined}><InteractiveKnowledgeCard card={card} /><div className="card-copy"><p className="eyebrow">{acquired ? 'Knowledge Card acquired' : 'In your Knowledge Cards'}</p><h3>{card.revealTitle}</h3><p>{card.revealBody}</p><ul>{card.facts.map((fact) => <li key={fact}>{fact}</li>)}</ul>{card.connections?.filter((connection) => lessonById.get(connection.lessonId)?.status === 'published').map((connection) => <p key={connection.lessonId}><a href={`/learn/${connection.lessonId}`}>{connection.label}</a> — {connection.reason}</p>)}</div></div>;
}
