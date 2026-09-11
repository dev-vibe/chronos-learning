import type { ChronosContentBundle } from '../../content/assemble';

const body = (note: string, heading: string) => {
  const start = note.indexOf(`## ${heading}`);
  if (start < 0) return '';
  const end = note.indexOf('\n## ', start + 3);
  return note.slice(start + heading.length + 3, end < 0 ? undefined : end);
};
const filled = (value: string) => value.trim().length > 3 && !/<[^>]+>|^(pending|tbd|todo|n\/a)$/i.test(value.trim());

/** Structural checks, not an automated historical or pedagogy judgment.
 * Previously approved and pending records retain their existing gate contract. */
export function validateEditorialRecord(note: string, lessonId: string, bundle: ChronosContentBundle): string[] {
  const version = note.match(/^Production record version:\s*(\S+)/m)?.[1];
  if (!version) return [];
  if (version !== '2') return ['Unsupported production record version'];
  const errors: string[] = [];
  const blueprint = body(note, 'Learning blueprint');
  for (const field of ['Retrieve', 'Extend', 'Revisit', 'Reasoning progression', 'Transfer plan', 'Completion versus mastery']) {
    const value = blueprint.split(/\r?\n/).find((line) => line.startsWith(`${field}:`))?.slice(field.length + 1) ?? '';
    if (!filled(value)) errors.push(`Learning blueprint needs a completed ${field} field`);
  }
  const rows = body(note, 'Central claim support').split(/\r?\n/)
    .filter((line) => /^\|\s*`?claim\./.test(line))
    .map((line) => line.split('|').slice(1, -1).map((cell) => cell.replaceAll('`', '').trim()));
  if (!rows.length) errors.push('Central claim support needs at least one registered claim with a precise locator');
  const lesson = bundle.lessons.find((item) => item.id === lessonId);
  for (const [claimId, sourceId, locator = '', review = ''] of rows) {
    const claim = bundle.claims.find((item) => item.id === claimId);
    if (!claim || !lesson?.claimIds.includes(claimId)) errors.push(`Central support references an unknown lesson claim: ${claimId}`);
    if (!claim?.sourceIds.includes(sourceId) || !lesson?.sourceIds.includes(sourceId)) errors.push(`${claimId}: central support source is not registered for this claim and lesson: ${sourceId}`);
    if (!filled(locator) || !/\b(?:(?:pp?|fig)\.\s*\S|(?:page|figure|passage|object|accession|section|table)\s+\S)/i.test(locator)) errors.push(`${claimId}: identify a precise page, figure, passage, section, table or object locator`);
    if (!filled(review) || !/close-reviewed/i.test(review) || !/\b\d{4}-\d{2}-\d{2}\b/.test(review) || !filled(review.replace(/close-reviewed|\d{4}-\d{2}-\d{2}|[,;:]/gi, ''))) errors.push(`${claimId}: record close review with reviewer and date`);
  }
  return errors;
}
