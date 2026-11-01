import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { validateContent } from '../../src/infrastructure/content/validate';

const akkadId = 'lesson.mesopotamia.akkadian-empire';
const fixture = () => {
  const bundle = structuredClone(chronosContent);
  const lesson = bundle.lessons.find((item) => item.id === akkadId)!;
  return { bundle, lesson, terms: lesson.terms! };
};
const errorsOf = (bundle: typeof chronosContent) => validateContent(bundle).errors.join('\n');

describe('lesson term validation', () => {
  it('accepts the Akkad pilot terms with no warnings', () => {
    const result = validateContent(chronosContent);
    expect(result.errors).toEqual([]);
    expect(result.warnings).toEqual([]);
    const lesson = chronosContent.lessons.find((item) => item.id === akkadId)!;
    expect(lesson.terms!.filter((term) => term.featured).length).toBeLessThanOrEqual(8);
  });

  it('rejects markup that names an unknown term', () => {
    const { bundle, lesson } = fixture();
    const module = lesson.sections[0].modules[0];
    if (module.type !== 'prose') throw new Error('expected prose');
    module.body += ' The [[ziggurat]] and the [[tower|term.akkad.tower]].';
    const errors = errorsOf(bundle);
    expect(errors).toMatch(/\[\[ziggurat\]\] names no term/);
    expect(errors).toMatch(/\[\[tower\|term\.akkad\.tower\]\] names no term/);
  });

  it('rejects unbalanced markup', () => {
    const { bundle, lesson } = fixture();
    const module = lesson.sections[0].modules[0];
    if (module.type !== 'prose') throw new Error('expected prose');
    module.body += ' An [[open mark.';
    expect(errorsOf(bundle)).toMatch(/unbalanced term markup/);
  });

  it('rejects a primary section that is not in the lesson', () => {
    const { bundle, terms } = fixture();
    terms[0].primarySectionId = 'section.akkad.missing';
    expect(errorsOf(bundle)).toMatch(/primarySectionId section\.akkad\.missing is not a section/);
  });

  it('requires definitions to cite claims and sources the lesson registers', () => {
    const { bundle, terms } = fixture();
    terms[0].claimIds = [];
    terms[1].sourceIds = [];
    terms[2].claimIds = ['claim.uruk.city-life'];
    terms[3].sourceIds = ['source.akkad.nowhere'];
    const errors = errorsOf(bundle);
    expect(errors).toMatch(new RegExp(`${terms[0].id}: definition needs at least one claimId`));
    expect(errors).toMatch(new RegExp(`${terms[1].id}: definition needs at least one sourceId`));
    expect(errors).toMatch(new RegExp(`${terms[2].id}: claim claim\\.uruk\\.city-life is not registered by the lesson`));
    expect(errors).toMatch(new RegExp(`${terms[3].id}: source source\\.akkad\\.nowhere is not registered by the lesson`));
  });

  it('allows at most eight featured terms, each with a gloss', () => {
    const { bundle, terms } = fixture();
    for (let i = 0; terms.length < 9; i += 1) terms.push({ ...terms[0], id: `term.akkad.extra-${i}`, label: `extra ${i}`, aliases: undefined });
    terms.forEach((term) => { term.featured = true; term.gloss ??= 'A short gloss'; });
    expect(errorsOf(bundle)).toMatch(new RegExp(`${terms.length} featured terms; the top panel shows at most 8`));
    const second = fixture();
    const unfeatured = second.terms.find((term) => !term.featured)!;
    unfeatured.featured = true;
    expect(errorsOf(second.bundle)).toMatch(new RegExp(`${unfeatured.id}: featured terms need a one-line gloss`));
  });

  it('keeps definitions short', () => {
    const { bundle, terms } = fixture();
    terms[0].definition = Array.from({ length: 31 }, () => 'word').join(' ') + '.';
    terms[1].definition = 'One. Two. Three.';
    const errors = errorsOf(bundle);
    expect(errors).toMatch(/definition has 31 words; keep it to 30/);
    expect(errors).toMatch(/definition has more than 2 sentences/);
  });

  it('rejects markup outside the fields that render terms', () => {
    const { bundle, lesson } = fixture();
    lesson.sections[0].heading = 'Akkad in [[Mesopotamia]]';
    lesson.significance = 'About [[Sargon]].';
    const prompt = bundle.prompts.find((item) => item.lessonId === akkadId)!;
    prompt.question = 'What did [[Sargon]] claim?';
    const map = lesson.sections.flatMap((section) => section.modules).find((module) => module.type === 'historical-map')!;
    if (map.type !== 'historical-map') throw new Error('expected map');
    map.body = 'Where [[Urkesh]] is.';
    const errors = errorsOf(bundle);
    expect(errors).toMatch(/term markup is not allowed in the heading/);
    expect(errors).toMatch(/term markup is not allowed in significance/);
    expect(errors).toMatch(/term markup is not allowed in understanding prompts \(question\)/);
    expect(errors).toMatch(/module\.akkad\.locator: term markup is not allowed in body/);
  });

  it('rejects two terms that share a name', () => {
    const { bundle, terms } = fixture();
    terms[1].aliases = [...(terms[1].aliases ?? []), terms[0].label];
    expect(errorsOf(bundle)).toMatch(/is shared by/);
  });

  it('warns, without failing, when a term is never marked in the text', () => {
    const { bundle, terms } = fixture();
    terms.push({ ...terms[0], id: 'term.akkad.unused', label: 'Unused', aliases: [], featured: false });
    const result = validateContent(bundle);
    expect(result.success).toBe(true);
    expect(result.warnings).toContain(`${akkadId} term term.akkad.unused: never marked in the lesson text`);
  });

  it('rejects duplicate term IDs across the content', () => {
    const { bundle, terms } = fixture();
    terms.push({ ...terms[0], label: 'Copy', aliases: [] });
    expect(errorsOf(bundle)).toMatch(new RegExp(`duplicate ID: ${terms[0].id}`));
  });
});
