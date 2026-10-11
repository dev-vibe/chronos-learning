import React from 'react';
import { Archive, Landmark } from 'lucide-react';
import { chronosContent } from '../../content/chronos';
import type { KnowledgeCard } from '../domains/contracts';
import { knowledgeCardTypeLabel } from '../domains/knowledgeCards';
import { ResponsiveMedia } from './ResponsiveMedia';

const mediaById = new Map(chronosContent.media.map((item) => [item.id, item]));

/** A Knowledge Card at trading-card proportions: name, art, type line and text box. */
export function KnowledgeCardFace({ card }: { card: KnowledgeCard }) {
  const media = mediaById.get(card.mediaId)!;
  return <div className="knowledge-card"><div className="card-frame"><div className="card-inner">
    <div className="card-name"><h3>{card.title}</h3>{card.category === 'place' ? <Landmark aria-hidden="true" /> : <Archive aria-hidden="true" />}</div>
    <div className={`card-image card-image-${card.category}`} data-depiction={media.depictionMode}><ResponsiveMedia media={media} alt={media.alt} sizes="330px" loading="lazy" draggable={false} /></div>
    <p className="card-type"><span className="card-class">{knowledgeCardTypeLabel(card.category)}</span><span className="card-date">{card.date.display}</span></p>
    <div className="card-text"><p>{card.significance}</p><p className="card-place">{card.place}</p></div>
  </div></div></div>;
}
