import { describe, expect, it } from 'vitest';
import type { Lesson, LessonTerm } from '../../src/domains/contracts';
import { featuredTermGroups, parseTermMarkup, planLessonTerms, stripTermMarkup, termFieldKey } from '../../src/domains/lessonTerms';

const term = (overrides: Partial<LessonTerm> & Pick<LessonTerm, 'id' | 'label'>): LessonTerm => ({
  kind: 'word', definition: 'A short definition.', primarySectionId: 'section.test.one', claimIds: ['claim.test.one'], sourceIds: ['source.test.one'], ...overrides,
});

const lesson = (terms: LessonTerm[] | undefined): Pick<Lesson, 'sections' | 'terms'> => ({
  terms,
  sections: [
    { id: 'section.test.one', heading: 'One', purpose: '', modules: [
      { id: 'module.test.prose', type: 'prose', claimIds: [], sourceIds: [], body: 'The [[stele]] stood tall.\n\nAnother [[stele]] and [[Naram-Sin’s]] army.' },
      { id: 'module.test.knowledge', type: 'knowledge', claimIds: [], sourceIds: [], eyebrow: 'Notes', title: 'Notes', body: 'About a [[stele]].', items: [{ label: 'A', detail: 'His [[stone|term.test.stele]]' }, { label: 'B', detail: 'Plain' }] },
    ] },
    { id: 'section.test.two', heading: 'Two', purpose: '', modules: [
      { id: 'module.test.scene', type: 'scene', claimIds: [], sourceIds: [], title: 'Scene', body: 'A [[stele]] in the scene.', mediaId: 'media.test.scene', hotspots: [{ label: 'a', detail: 'b' }, { label: 'c', detail: 'd' }] },
      { id: 'module.test.prose-two', type: 'prose', claimIds: [], sourceIds: [], body: 'Later the [[STELE]] moved.' },
    ] },
  ],
});

const stele = term({ id: 'term.test.stele', label: 'stele', featured: true, gloss: 'A carved stone' });
const naramSin = term({ id: 'term.test.naram-sin', label: 'Naram-Sin', kind: 'person', aliases: ["Naram-Sin's"], featured: true, gloss: 'A king' });

describe('term markup', () => {
  it('strips label and display|id forms to the text a reader sees', () => {
    expect(stripTermMarkup('The [[stele]] and [[his stone|term.test.stele]].')).toBe('The stele and his stone.');
    expect(stripTermMarkup('No markup here.')).toBe('No markup here.');
    expect(stripTermMarkup('[[ spaced ]] word')).toBe('spaced word');
  });

  it('reports unbalanced markup', () => {
    expect(parseTermMarkup('An [[open mark').malformed).toBe(true);
    expect(parseTermMarkup('A stray ]] close').malformed).toBe(true);
    expect(parseTermMarkup('A [[good]] mark').malformed).toBe(false);
  });

  it('splits text and marks in order', () => {
    expect(parseTermMarkup('a [[b]] c [[d|term.x.y]]').parts).toEqual([
      { kind: 'text', text: 'a ' },
      { kind: 'mark', display: 'b', ref: 'b', explicitId: false },
      { kind: 'text', text: ' c ' },
      { kind: 'mark', display: 'd', ref: 'term.x.y', explicitId: true },
    ]);
  });
});

describe('term plan', () => {
  it('highlights only the first marked occurrence of each term in each section', () => {
    const plan = planLessonTerms(lesson([stele, naramSin]));
    const highlights = [...plan.fields.entries()].flatMap(([key, parts]) => parts.flatMap((part) => part.kind === 'term' ? [[key, part.text, part.highlight]] : []));
    expect(highlights).toEqual([
      [termFieldKey.proseParagraph('module.test.prose', 0), 'stele', true],
      [termFieldKey.proseParagraph('module.test.prose', 1), 'stele', false],
      [termFieldKey.proseParagraph('module.test.prose', 1), 'Naram-Sin’s', true],
      [termFieldKey.body('module.test.knowledge'), 'stele', false],
      [termFieldKey.knowledgeItem('module.test.knowledge', 0), 'stone', false],
      // Section two: the scene caption is plain text, so the prose mark is the section's first highlight.
      [termFieldKey.proseParagraph('module.test.prose-two', 0), 'STELE', true],
    ]);
    expect(plan.fields.get(termFieldKey.body('module.test.scene'))).toEqual([{ kind: 'text', text: 'A ' }, { kind: 'text', text: 'stele' }, { kind: 'text', text: ' in the scene.' }]);
  });

  it('matches curly and straight apostrophes in aliases', () => {
    const plan = planLessonTerms(lesson([stele, naramSin]));
    const parts = plan.fields.get(termFieldKey.proseParagraph('module.test.prose', 1)) ?? [];
    expect(parts.some((part) => part.kind === 'term' && part.term.id === 'term.test.naram-sin')).toBe(true);
  });

  it('plans nothing for lessons without terms', () => {
    expect(planLessonTerms(lesson(undefined)).fields.size).toBe(0);
    expect(planLessonTerms(lesson([])).fields.size).toBe(0);
  });

  it('groups featured terms as people, places, words', () => {
    const groups = featuredTermGroups([stele, naramSin, term({ id: 'term.test.city', label: 'City', kind: 'place', featured: true, gloss: 'x' }), term({ id: 'term.test.hidden', label: 'Hidden', kind: 'place' })]);
    expect(groups.map((group) => [group.label, group.terms.map((item) => item.label)])).toEqual([['People', ['Naram-Sin']], ['Places', ['City']], ['Words', ['stele']]]);
  });
});
