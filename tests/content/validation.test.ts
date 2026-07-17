import{describe,expect,it}from'vitest';import{chronosContent}from'../../content/chronos';import{LessonModuleSchema}from'../../src/domains/contracts';import{validateContent}from'../../src/infrastructure/content/validate';
describe('content validation',()=>{it('accepts canonical Uruk fixtures',()=>expect(validateContent(chronosContent)).toEqual({success:true,errors:[]}));it('catches duplicate ids and broken unlocks',()=>{const bad=structuredClone(chronosContent);bad.cards.push({...bad.cards[0],unlockLessonId:'lesson.missing'});const r=validateContent(bad);expect(r.success).toBe(false);expect(r.errors.join(' ')).toMatch(/duplicate ID|invalid card unlock/)})});

it('allows each chapter to begin at entry position zero',()=>{const fixture=structuredClone(chronosContent);fixture.journeys[0].chapters.push({id:'chapter.world-history.second',title:'Second chapter',position:1,entries:[{id:'entry.world-history.second-start',lessonId:'lesson.uruk.first-city',position:0,required:true,framing:'A valid new chapter start'}]});expect(validateContent(fixture).errors).not.toContain(expect.stringMatching(/duplicate journey entry position/))});

it('validates the typed Uruk historical map and generated raster asset',()=>{const lesson=chronosContent.lessons.find((item)=>item.id==='lesson.uruk.first-city')!;const module=lesson.sections.flatMap((section)=>section.modules).find((item)=>item.type==='historical-map')!;expect(LessonModuleSchema.safeParse(module).success).toBe(true);if(module.type!=='historical-map')throw new Error('historical map missing');expect(module.id).toBe('module.uruk.southern-mesopotamia-map');expect(module.mediaId).toBe('media.uruk.southern-mesopotamia-map');expect(module.compactLabel).toMatch(/illustrative map/i);expect(module.coordinateNote).toMatch(/UNESCO World Heritage coordinates/i);expect(module.uncertaintyNote).toMatch(/shown approximately/i)});

it('detects a missing local map fallback',()=>{const fixture=structuredClone(chronosContent);const map=fixture.media.find((item)=>item.id==='media.uruk.southern-mesopotamia-map')!;if(map.locator.provider!=='object-storage')throw new Error('object storage locator missing');map.locator.fallback.path='/images/maps/missing-map.webp';expect(validateContent(fixture).errors.join(' ')).toMatch(/missing local media asset \/images\/maps\/missing-map\.webp/)});

it('rejects duplicate, oversized, or non-content-addressed media variants',()=>{const fixture=structuredClone(chronosContent);const map=fixture.media.find((item)=>item.id==='media.uruk.southern-mesopotamia-map')!;if(map.locator.provider!=='object-storage')throw new Error('object storage locator missing');map.locator.variants[1].width=map.locator.variants[0].width;map.locator.variants[1].objectKey='uruk/unversioned-map.webp';map.locator.variants[1].bytes=800000;const errors=validateContent(fixture).errors.join(' ');expect(errors).toMatch(/duplicate media variant width/);expect(errors).toMatch(/not content-addressed/);expect(errors).toMatch(/exceeds 786432 byte budget/)});

it('publishes exactly the two reviewed World History lessons in journey order', () => {
  const published = chronosContent.lessons.filter((lesson) => lesson.status === 'published');
  expect(published.map((lesson) => lesson.id)).toEqual(['lesson.uruk.first-city', 'lesson.writing.early-systems']);
  const entries = chronosContent.journeys[0].chapters[0].entries
    .filter((entry) => published.some((lesson) => lesson.id === entry.lessonId))
    .sort((left, right) => left.position - right.position);
  expect(entries.map((entry) => entry.lessonId)).toEqual(['lesson.uruk.first-city', 'lesson.writing.early-systems']);
  expect(chronosContent.lessons.find((lesson) => lesson.id === 'lesson.farming.settlements')).toMatchObject({ status: 'draft', promptIds: [] });
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
