export type LegacyRecord = { completed_nodes?: Array<string | { node_id: string }>; xp?: number; rarity?: string; resumeSectionId?: string; canonicalCardIds?: string[] };
export type ReconciliationResult = { importedCompletion: boolean; ignoredGameFields: string[]; unresolvedMappings: string[]; unresolvedAssets: string[]; exceptionsRequiringReview: string[]; resumeSectionId?: string; cardAlreadyOwned: boolean };
const validSections = new Set(['section.uruk.masthead', 'section.uruk.opening-city-question', 'section.uruk.water-food-and-labor', 'section.uruk.the-built-city', 'section.uruk.tablets-and-administration', 'section.uruk.evidence-and-reconstruction', 'section.uruk.check-and-complete']);

export function reconcileLegacyUruk(records: LegacyRecord[]): ReconciliationResult {
  const nodes = new Set(records.flatMap((record) => record.completed_nodes ?? []).map((node) => typeof node === 'string' ? node : node.node_id));
  const ignored = [...new Set(records.flatMap((record) => [record.xp !== undefined ? 'xp' : '', record.rarity !== undefined ? 'rarity' : '']).filter(Boolean))];
  const storedResume = records.map((record) => record.resumeSectionId).find((value): value is string => Boolean(value));
  const resume = storedResume;
  return {
    importedCompletion: nodes.has('uruk'),
    ignoredGameFields: ignored,
    unresolvedMappings: [...nodes].filter((node) => node !== 'uruk'),
    unresolvedAssets: ['media.uruk.candidate: provenance review required'],
    exceptionsRequiringReview: resume && !validSections.has(resume) ? [`invalid resume section: ${resume}`] : [],
    resumeSectionId: resume && validSections.has(resume) ? resume : undefined,
    cardAlreadyOwned: records.some((record) => record.canonicalCardIds?.includes('card.place.uruk')),
  };
}
