import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { LessonModuleSchema } from '../../src/domains/contracts';
import { validateContent } from '../../src/infrastructure/content/validate';

describe('Migrations, Encounters, and Ancient DNA content', () => {
  it('publishes the evidence-aware lesson with two required prompts and one people card', () => {
    const lesson = chronosContent.lessons.find((item) => item.id === 'lesson.humans.migrations-and-interbreeding');
    expect(lesson).toMatchObject({
      status: 'published',
      title: 'Migrations, Encounters, and Ancient DNA',
      heroMediaId: 'media.humans.migrations-hero-map',
      mediaIds: expect.arrayContaining(['media.humans.migrations-hero-map', 'media.humans.adna-clean-room']),
      promptIds: ['prompt.humans.long-segments-inference', 'prompt.humans.adna-evidence-and-limit'],
    });
    expect(lesson?.sections).toHaveLength(6);
    expect(lesson?.sections.flatMap((section) => section.modules).every((module) => LessonModuleSchema.safeParse(module).success)).toBe(true);
    expect(lesson?.sections.flatMap((section) => section.modules).find((module) => module.id === 'module.humans.adna-clean-room')).toMatchObject({
      type: 'evidence',
      mediaId: 'media.humans.adna-clean-room',
    });

    const cards = chronosContent.cards.filter((card) => card.unlockLessonId === lesson?.id);
    expect(cards.map((card) => card.id)).toEqual(['card.people.neanderthals']);
    expect(cards.map((card) => card.category)).toEqual(['people']);
  });

  it('fails closed on the rejected SVG-derived evidence map', () => {
    const lesson = chronosContent.lessons.find((item) => item.id === 'lesson.humans.migrations-and-interbreeding')!;
    const module = lesson.sections.flatMap((section) => section.modules).find((item) => item.id === 'module.humans.ancient-genome-map');
    expect(module).toBeUndefined();
    expect(lesson.mediaIds).not.toContain('media.humans.ancient-genome-map');
  });

  it('allows the approved deterministic unlock but rejects a fourth card for one lesson', () => {
    const oneCardFixture = structuredClone(chronosContent);
    expect(validateContent(oneCardFixture).success).toBe(true);

    const fixture = structuredClone(chronosContent);
    const base = fixture.cards.find((card) => card.id === 'card.people.neanderthals')!;
    fixture.cards.push(
      { ...base, id: 'card.people.ancient-dna-extra-one' },
      { ...base, id: 'card.people.ancient-dna-extra-two' },
      { ...base, id: 'card.people.ancient-dna-extra-three' },
    );
    expect(validateContent(fixture).errors.join(' ')).toMatch(/more than three deterministic unlocks/);
  });
});
