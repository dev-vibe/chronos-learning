import type { Lesson, LessonModule, LessonSection, LessonTerm, LessonTermKind, UnderstandingPrompt } from './contracts';

/**
 * Lesson terms: words, people and places marked in lesson text that open a short definition.
 *
 * Markup is explicit, never auto-matched:
 *   [[stele]]                    resolves by the term's label or one of its aliases
 *   [[his stone|term.akkad.stele]] shows "his stone" and resolves by term ID
 *
 * Markup is allowed only in the fields listed by `termTextFields`. Everything that turns lesson
 * text into plain text (scripts, viewer summaries, search) must call `stripTermMarkup`.
 */

const MARKUP = /\[\[([^[\]|]+?)(?:\|([^[\]|]+?))?\]\]/g;
const MAX_FEATURED_TERMS = 8;
const MAX_DEFINITION_WORDS = 30;
const MAX_DEFINITION_SENTENCES = 2;
const MAX_GLOSS_WORDS = 10;

export type TermMarkup = { display: string; ref: string; explicitId: boolean };
export type TermTextPart = { kind: 'text'; text: string } | ({ kind: 'mark' } & TermMarkup);
export type ResolvedTermPart = { kind: 'text'; text: string } | { kind: 'term'; text: string; term: LessonTerm; highlight: boolean };
export type TermTextField = { key: string; sectionId: string; moduleId: string; text: string; interactive: boolean };
export type LessonTermPlan = { termsById: Map<string, LessonTerm>; fields: Map<string, ResolvedTermPart[]> };

export const hasTermMarkup = (text: string) => text.includes('[[') || text.includes(']]');

/** Parses markup into text and marked parts. Text without markup comes back as one text part. */
export function parseTermMarkup(text: string): { parts: TermTextPart[]; malformed: boolean } {
  const parts: TermTextPart[] = [];
  let last = 0;
  let leftover = '';
  for (const match of text.matchAll(MARKUP)) {
    const index = match.index ?? 0;
    const before = text.slice(last, index);
    leftover += before;
    if (before) parts.push({ kind: 'text', text: before });
    const display = match[1].trim();
    const id = match[2]?.trim();
    parts.push({ kind: 'mark', display, ref: id ?? display, explicitId: Boolean(id) });
    last = index + match[0].length;
  }
  const rest = text.slice(last);
  leftover += rest;
  if (rest) parts.push({ kind: 'text', text: rest });
  return { parts, malformed: hasTermMarkup(leftover) };
}

/** Replaces each mark with the text a reader sees. Text without markup is returned unchanged. */
export function stripTermMarkup(text: string): string {
  if (!hasTermMarkup(text)) return text;
  return text.replace(MARKUP, (_whole, display: string) => display.trim());
}

const normalize = (value: string) => value.normalize('NFC').replace(/[’‘`]/g, "'").replace(/\s+/g, ' ').trim().toLocaleLowerCase();

export function createTermIndex(terms: readonly LessonTerm[] = []) {
  const byId = new Map(terms.map((term) => [term.id, term]));
  const byName = new Map<string, LessonTerm[]>();
  for (const term of terms) {
    for (const name of new Set([term.label, ...(term.aliases ?? [])].map(normalize))) byName.set(name, [...(byName.get(name) ?? []), term]);
  }
  const resolve = (mark: TermMarkup): LessonTerm | undefined => {
    if (mark.explicitId) return byId.get(mark.ref);
    const matches = byName.get(normalize(mark.ref)) ?? [];
    return matches.length === 1 ? matches[0] : undefined;
  };
  return { byId, byName, resolve };
}

/** Prose paragraphs are rendered one <p> each; the renderer and the term plan share this split. */
export const splitProseParagraphs = (body: string) => body.split(/\n\n+/).map((part) => part.trim()).filter(Boolean);

/** Field keys used by the renderer to find a field's resolved parts. */
export const termFieldKey = {
  proseParagraph: (moduleId: string, index: number) => `${moduleId}:body:${index}`,
  body: (moduleId: string) => `${moduleId}:body`,
  knowledgeItem: (moduleId: string, index: number) => `${moduleId}:items:${index}:detail`,
};

/**
 * The fields that may carry markup, in page order. Scene captions sit inside a disclosure
 * summary, so their terms read as plain text (no nested button) and do not claim the
 * section's first highlight.
 */
export function termTextFields(section: LessonSection): TermTextField[] {
  const fields: TermTextField[] = [];
  const add = (moduleId: string, key: string, text: string, interactive = true) => fields.push({ key, sectionId: section.id, moduleId, text, interactive });
  for (const module of section.modules) {
    if (module.type === 'prose') splitProseParagraphs(module.body).forEach((paragraph, index) => add(module.id, termFieldKey.proseParagraph(module.id, index), paragraph));
    if (module.type === 'knowledge') {
      add(module.id, termFieldKey.body(module.id), module.body);
      module.items.forEach((item, index) => add(module.id, termFieldKey.knowledgeItem(module.id, index), item.detail));
    }
    if (module.type === 'evidence') add(module.id, termFieldKey.body(module.id), module.body);
    if (module.type === 'scene') add(module.id, termFieldKey.body(module.id), module.body, false);
  }
  return fields;
}

/** Resolves every marked field; only the first marked occurrence of a term in each section is highlighted. */
export function planLessonTerms(lesson: Pick<Lesson, 'sections' | 'terms'>): LessonTermPlan {
  const index = createTermIndex(lesson.terms);
  const fields = new Map<string, ResolvedTermPart[]>();
  if (!lesson.terms?.length) return { termsById: index.byId, fields };
  for (const section of lesson.sections) {
    const highlighted = new Set<string>();
    for (const field of termTextFields(section)) {
      if (!hasTermMarkup(field.text)) continue;
      const parts = parseTermMarkup(field.text).parts.map((part): ResolvedTermPart => {
        if (part.kind === 'text') return part;
        const term = index.resolve(part);
        if (!term || !field.interactive) return { kind: 'text', text: part.display };
        const highlight = !highlighted.has(term.id);
        highlighted.add(term.id);
        return { kind: 'term', text: part.display, term, highlight };
      });
      fields.set(field.key, parts);
    }
  }
  return { termsById: index.byId, fields };
}

export const termKindLabels: Record<LessonTermKind, string> = { person: 'Person', people: 'People', place: 'Place', word: 'Word', thing: 'Object' };

export type FeaturedTermGroup = { id: 'people' | 'places' | 'words'; label: string; terms: LessonTerm[] };
const groupOfKind: Record<LessonTermKind, FeaturedTermGroup['id']> = { person: 'people', people: 'people', place: 'places', word: 'words', thing: 'words' };
const groupLabels: Record<FeaturedTermGroup['id'], string> = { people: 'People', places: 'Places', words: 'Words' };

/** Featured terms grouped people → places → words, keeping authored order inside each group. */
export function featuredTermGroups(terms: readonly LessonTerm[] = []): FeaturedTermGroup[] {
  return (['people', 'places', 'words'] as const)
    .map((id) => ({ id, label: groupLabels[id], terms: terms.filter((term) => term.featured && groupOfKind[term.kind] === id) }))
    .filter((group) => group.terms.length > 0);
}

const wordCount = (text: string) => text.split(/\s+/).filter(Boolean).length;
const sentenceCount = (text: string) => text.split(/(?<=[.?!])\s+(?=[A-Z“"'‘(])/).filter((part) => part.trim()).length;

/** Every string in `value` with its path, for finding markup where it is not allowed. */
function* strings(value: unknown, path: string): Generator<[string, string]> {
  if (typeof value === 'string') yield [path, value];
  else if (Array.isArray(value)) for (const [index, item] of value.entries()) yield* strings(item, `${path}.${index}`);
  else if (value && typeof value === 'object') for (const [key, item] of Object.entries(value)) yield* strings(item, path ? `${path}.${key}` : key);
}

const allowedModulePaths = (module: LessonModule): RegExp => {
  if (module.type === 'prose' || module.type === 'evidence' || module.type === 'scene') return /^body$/;
  if (module.type === 'knowledge') return /^(body|items\.\d+\.detail)$/;
  return /^$/;
};

/**
 * Term rules for one lesson. Errors fail `npm run validate:content`; warnings are printed.
 * `registered` is what the lesson registers, which every definition must cite.
 */
export function validateLessonTerms(lesson: Lesson, prompts: readonly UnderstandingPrompt[] = []): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  const terms = lesson.terms ?? [];
  const index = createTermIndex(terms);
  const sectionIds = new Set(lesson.sections.map((section) => section.id));
  const lessonClaims = new Set(lesson.claimIds);
  const lessonSources = new Set(lesson.sourceIds);
  const ids = new Set<string>();

  for (const term of terms) {
    const owner = `${lesson.id} term ${term.id}`;
    if (ids.has(term.id)) errors.push(`${owner}: duplicate term ID`);
    ids.add(term.id);
    if (!sectionIds.has(term.primarySectionId)) errors.push(`${owner}: primarySectionId ${term.primarySectionId} is not a section of this lesson`);
    if (!term.claimIds.length) errors.push(`${owner}: definition needs at least one claimId`);
    if (!term.sourceIds.length) errors.push(`${owner}: definition needs at least one sourceId`);
    for (const id of term.claimIds) if (!lessonClaims.has(id)) errors.push(`${owner}: claim ${id} is not registered by the lesson`);
    for (const id of term.sourceIds) if (!lessonSources.has(id)) errors.push(`${owner}: source ${id} is not registered by the lesson`);
    if (wordCount(term.definition) > MAX_DEFINITION_WORDS) errors.push(`${owner}: definition has ${wordCount(term.definition)} words; keep it to ${MAX_DEFINITION_WORDS}`);
    if (sentenceCount(term.definition) > MAX_DEFINITION_SENTENCES) errors.push(`${owner}: definition has more than ${MAX_DEFINITION_SENTENCES} sentences`);
    if (term.featured && !term.gloss) errors.push(`${owner}: featured terms need a one-line gloss`);
    if (term.gloss && wordCount(term.gloss) > MAX_GLOSS_WORDS) errors.push(`${owner}: gloss has ${wordCount(term.gloss)} words; keep it to ${MAX_GLOSS_WORDS}`);
    for (const [path, text] of strings({ label: term.label, definition: term.definition, gloss: term.gloss, aliases: term.aliases }, '')) {
      if (hasTermMarkup(text)) errors.push(`${owner}: term markup is not allowed in ${path}`);
    }
  }
  for (const [name, matches] of index.byName) {
    if (matches.length > 1) errors.push(`${lesson.id}: term name “${name}” is shared by ${matches.map((term) => term.id).join(' and ')}; mark it as [[text|term-id]] or rename an alias`);
  }
  const featured = terms.filter((term) => term.featured).length;
  if (featured > MAX_FEATURED_TERMS) errors.push(`${lesson.id}: ${featured} featured terms; the top panel shows at most ${MAX_FEATURED_TERMS}`);

  const marked = new Map<string, Set<string>>();
  for (const section of lesson.sections) {
    for (const field of termTextFields(section)) {
      const { parts, malformed } = parseTermMarkup(field.text);
      if (malformed) errors.push(`${field.moduleId}: unbalanced term markup “[[ … ]]”`);
      for (const part of parts) {
        if (part.kind !== 'mark') continue;
        const term = index.resolve(part);
        if (!term) {
          errors.push(`${field.moduleId}: term markup [[${part.explicitId ? `${part.display}|${part.ref}` : part.ref}]] names no term in ${lesson.id}`);
          continue;
        }
        marked.set(term.id, (marked.get(term.id) ?? new Set()).add(section.id));
      }
    }
    for (const module of section.modules) {
      const allowed = allowedModulePaths(module);
      for (const [path, text] of strings(module, '')) {
        if (!allowed.test(path) && hasTermMarkup(text)) errors.push(`${module.id}: term markup is not allowed in ${path}`);
      }
    }
    if (hasTermMarkup(section.heading)) errors.push(`${section.id}: term markup is not allowed in the heading`);
  }
  for (const [key, value] of Object.entries(lesson)) {
    if (key === 'sections' || key === 'terms') continue;
    for (const [path, text] of strings(value, key)) if (hasTermMarkup(text)) errors.push(`${lesson.id}: term markup is not allowed in ${path}`);
  }
  for (const prompt of prompts) {
    for (const [path, text] of strings(prompt, '')) if (hasTermMarkup(text)) errors.push(`${prompt.id}: term markup is not allowed in understanding prompts (${path})`);
  }
  for (const term of terms) {
    const sections = marked.get(term.id);
    if (!sections) warnings.push(`${lesson.id} term ${term.id}: never marked in the lesson text`);
    else if (term.featured && sectionIds.has(term.primarySectionId) && !sections.has(term.primarySectionId)) warnings.push(`${lesson.id} term ${term.id}: featured, but not marked in its primary section ${term.primarySectionId}`);
  }
  return { errors, warnings };
}
