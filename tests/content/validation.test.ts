import{describe,expect,it}from'vitest';
import { assembleContent } from '../../content/assemble';
import { earlyWritingSystemsContent } from '../../content/lessons/early-writing-systems';
import { farmingSettlementsContent } from '../../content/lessons/farming-settlements';
import { urukContent } from '../../content/lessons/uruk';
import { worldHistoryJourney } from '../../content/journeys/world-history';
import{chronosContent}from'../../content/chronos';import{LessonModuleSchema}from'../../src/domains/contracts';import{validateContent}from'../../src/infrastructure/content/validate';
describe('content validation',()=>{it('accepts canonical Uruk fixtures',()=>expect(validateContent(chronosContent)).toEqual({success:true,errors:[]}));it('catches duplicate ids and broken unlocks',()=>{const bad=structuredClone(chronosContent);bad.cards.push({...bad.cards[0],unlockLessonId:'lesson.missing'});const r=validateContent(bad);expect(r.success).toBe(false);expect(r.errors.join(' ')).toMatch(/duplicate ID|invalid card unlock/)})});

it('allows each chapter to begin at entry position zero',()=>{const fixture=structuredClone(chronosContent);fixture.journeys[0].chapters.push({id:'chapter.world-history.second',title:'Second chapter',position:1,entries:[{id:'entry.world-history.second-start',lessonId:'lesson.uruk.first-city',position:0,required:true,framing:'A valid new chapter start'}]});expect(validateContent(fixture).errors).not.toContain(expect.stringMatching(/duplicate journey entry position/))});

it('validates the typed Uruk historical map and generated raster asset',()=>{const lesson=chronosContent.lessons.find((item)=>item.id==='lesson.uruk.first-city')!;const module=lesson.sections.flatMap((section)=>section.modules).find((item)=>item.type==='historical-map')!;expect(LessonModuleSchema.safeParse(module).success).toBe(true);if(module.type!=='historical-map')throw new Error('historical map missing');expect(module.id).toBe('module.uruk.southern-mesopotamia-map');expect(module.mediaId).toBe('media.uruk.southern-mesopotamia-map');expect(module.compactLabel).toMatch(/illustrative map/i);expect(module.coordinateNote).toMatch(/UNESCO World Heritage coordinates/i);expect(module.uncertaintyNote).toMatch(/shown approximately/i)});

it('validates the typed Farming locator map and generated raster asset', () => {
  const lesson = chronosContent.lessons.find((item) => item.id === 'lesson.farming.settlements')!;
  const module = lesson.sections.flatMap((section) => section.modules).find((item) => item.type === 'historical-map')!;
  expect(LessonModuleSchema.safeParse(module).success).toBe(true);
  if (module.type !== 'historical-map') throw new Error('farming historical map missing');
  expect(module.id).toBe('module.farming.catalhoyuk-locator-map');
  expect(module.mediaId).toBe('media.farming.catalhoyuk-locator-map');
  expect(module.compactLabel).toMatch(/site coordinate verified/i);
  expect(module.coordinateNote).toMatch(/UNESCO World Heritage coordinates/i);
  expect(module.uncertaintyNote).toMatch(/Neolithic shorelines|coastlines/i);
});

it('validates the typed Caral historical map and generated raster asset', () => {
  const lesson = chronosContent.lessons.find((item) => item.id === 'lesson.caral.andean-urbanism')!;
  const module = lesson.sections.flatMap((section) => section.modules).find((item) => item.type === 'historical-map')!;
  expect(LessonModuleSchema.safeParse(module).success).toBe(true);
  if (module.type !== 'historical-map') throw new Error('Caral historical map missing');
  expect(module.id).toBe('module.caral.supe-map');
  expect(module.mediaId).toBe('media.caral.supe-valley-map');
  expect(module.compactLabel).toMatch(/no political borders/i);
  expect(module.coordinateNote).toMatch(/UNESCO World Heritage coordinates/i);
  expect(module.uncertaintyNote).toMatch(/Shorelines, river width, terrace edges/i);
  expect(lesson.status).toBe('draft');
  expect(chronosContent.cards.find((card) => card.id === 'card.place.caral')).toMatchObject({
    category: 'place',
    cardClass: 'foundation',
    unlockLessonId: 'lesson.caral.andean-urbanism',
    mediaId: 'media.caral.sunken-plaza',
  });
  expect(lesson.mediaIds).toEqual(expect.arrayContaining([
    'media.caral.supe-valley-map',
    'media.caral.site-hero',
    'media.caral.platform-mounds',
    'media.caral.sunken-plaza',
    'media.caral.excavated-shicra',
    'media.caral.shicra-reconstruction',
  ]));
  expect(lesson).toMatchObject({
    heroMediaId: 'media.caral.site-hero',
    heroLabel: 'Surviving evidence',
  });
});

it('detects a missing local map fallback',()=>{const fixture=structuredClone(chronosContent);const map=fixture.media.find((item)=>item.id==='media.uruk.southern-mesopotamia-map')!;if(map.locator.provider!=='object-storage')throw new Error('object storage locator missing');map.locator.fallback.path='/images/maps/missing-map.webp';expect(validateContent(fixture).errors.join(' ')).toMatch(/missing local media asset \/images\/maps\/missing-map\.webp/)});

it('rejects duplicate, oversized, or non-content-addressed media variants',()=>{const fixture=structuredClone(chronosContent);const map=fixture.media.find((item)=>item.id==='media.uruk.southern-mesopotamia-map')!;if(map.locator.provider!=='object-storage')throw new Error('object storage locator missing');map.locator.variants[1].width=map.locator.variants[0].width;map.locator.variants[1].objectKey='uruk/unversioned-map.webp';map.locator.variants[1].bytes=800000;const errors=validateContent(fixture).errors.join(' ');expect(errors).toMatch(/duplicate media variant width/);expect(errors).toMatch(/not content-addressed/);expect(errors).toMatch(/exceeds 786432 byte budget/)});

it('publishes the seven reviewed World History lessons in journey order', () => {
  const published = chronosContent.lessons.filter((lesson) => lesson.status === 'published');
  expect(published.map((lesson) => lesson.id)).toEqual([
    'lesson.humans.homo-sapiens-origins',
    'lesson.humans.migrations-and-interbreeding',
    'lesson.farming.multiple-origins',
    'lesson.farming.settlements',
    'lesson.uruk.first-city',
    'lesson.writing.early-systems',
    'lesson.egypt.nile-state',
  ]);
  const entries = chronosContent.journeys[0].chapters
    .slice()
    .sort((left, right) => left.position - right.position)
    .flatMap((chapter) => chapter.entries.slice().sort((left, right) => left.position - right.position))
    .filter((entry) => published.some((lesson) => lesson.id === entry.lessonId));
  expect(entries.map((entry) => entry.lessonId)).toEqual([
    'lesson.humans.homo-sapiens-origins',
    'lesson.humans.migrations-and-interbreeding',
    'lesson.farming.multiple-origins',
    'lesson.farming.settlements',
    'lesson.uruk.first-city',
    'lesson.writing.early-systems',
    'lesson.egypt.nile-state',
  ]);
  expect(chronosContent.lessons.find((lesson) => lesson.id === 'lesson.humans.homo-sapiens-origins')).toMatchObject({
    status: 'published',
    heroMediaId: 'media.humans.jebel-irhoud-excavation',
    promptIds: ['prompt.humans.best-supported-conclusion', 'prompt.humans.evidence-and-limit'],
    sectionIdsRequired: [
      'section.humans.skull-in-the-wrong-place',
      'section.humans.what-counts-as-us',
      'section.humans.read-the-skull',
      'section.humans.across-a-continent',
      'section.humans.connected-not-sealed-off',
      'section.humans.what-dna-adds',
      'section.humans.check-and-complete',
    ],
  });
  expect(chronosContent.lessons.find((lesson) => lesson.id === 'lesson.farming.settlements')).toMatchObject({
    status: 'published',
    heroMediaId: 'media.farming.catalhoyuk-rooftops',
    promptIds: ['prompt.farming.house-pattern', 'prompt.farming.opportunity-and-cost'],
    sectionIdsRequired: [
      'section.farming.enter-from-roof',
      'section.farming.slow-change',
      'section.farming.wall-to-wall',
      'section.farming.read-the-house',
      'section.farming.private-and-shared',
      'section.farming.bargain-of-staying',
      'section.farming.check-and-complete',
    ],
  });
});

it('catches broken writing sources, claims, prompts, media, hero, and unlock references', () => {
  const fixture = structuredClone(chronosContent);
  const writing = fixture.lessons.find((lesson) => lesson.id === 'lesson.writing.early-systems')!;
  writing.sourceIds[0] = 'source.missing.writing';
  writing.claimIds[0] = 'claim.missing.writing';
  writing.mediaIds[0] = 'media.missing.writing';
  writing.promptIds[0] = 'prompt.missing.writing';
  writing.heroMediaId = 'media.missing.hero';
  fixture.cards.find((card) => card.unlockLessonId === writing.id)!.unlockLessonId = 'lesson.missing.writing';
  const errors = validateContent(fixture).errors.join(' ');
  expect(errors).toMatch(/broken source reference source.missing.writing/);
  expect(errors).toMatch(/broken claim reference claim.missing.writing/);
  expect(errors).toMatch(/broken prompt reference prompt.missing.writing/);
  expect(errors).toMatch(/broken media reference media.missing.writing/);
  expect(errors).toMatch(/broken hero media reference media.missing.hero/);
  expect(errors).toMatch(/invalid card unlock reference lesson.missing.writing/);
});
it('requires learner-facing media rights copy independently of the internal publication gate', () => {
  const fixture = structuredClone(chronosContent);
  const writingMedia = fixture.media.find((media) => media.id === 'media.writing.proto-cuneiform-tablet')!;
  delete (writingMedia as Partial<typeof writingMedia>).rightsLabel;
  expect(validateContent(fixture).errors.join(' ')).toMatch(/rightsLabel/);
});
it('validates the assembled cross-module graph for duplicates and broken references', () => {
  const duplicateBundle = assembleContent(
    [farmingSettlementsContent, urukContent, earlyWritingSystemsContent, urukContent],
    [worldHistoryJourney],
  );
  expect(validateContent(duplicateBundle).errors.join(' ')).toMatch(/duplicate ID: source\.met\.uruk/);

  const missingUrukBundle = assembleContent(
    [farmingSettlementsContent, earlyWritingSystemsContent],
    [worldHistoryJourney],
  );
  const errors = validateContent(missingUrukBundle).errors.join(' ');
  expect(errors).toMatch(/unreachable required journey entry lesson\.uruk\.first-city/);
});
