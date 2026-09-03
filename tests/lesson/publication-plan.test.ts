import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import {
  defaultSnapshotVersion,
  lessonSlug,
  planLessonPublication,
  renderPublicationDatabaseTest,
  renderPublicationMigration,
} from '../../scripts/lesson/publication-plan';

describe('lesson publication plan', () => {
  it('derives a no-card World History cutover from authored content', () => {
    const plan = planLessonPublication(chronosContent, 'lesson.farming.multiple-origins', {
      issueId: 'ASH-74',
      equivalentAliasIds: ['neolithic_revolution'],
    });
    expect(plan).toMatchObject({
      slug: 'multiple_origins',
      snapshotVersion: 'multiple-origins-v1',
      journeyId: 'journey.world-history',
      entryId: 'entry.world-history.multiple-origins',
      journeyPosition: 3,
      required: true,
      requiredPromptIds: ['prompt.farming.multi.what-evidence-supports', 'prompt.farming.multi.explain-independent'],
      cardIds: [],
      previousLessonId: 'lesson.humans.sahul-crossing',
    });
    expect(plan.aliases).toEqual([
      expect.objectContaining({ legacyId: 'neolithic_revolution', semanticallyEquivalent: true }),
    ]);
    const sql = renderPublicationMigration(plan);
    expect(sql).not.toContain('knowledge_cards');
    expect(sql).toContain("values ('entry.world-history.multiple-origins', 'journey.world-history', 'lesson.farming.multiple-origins', 3, true)");
    const testSql = renderPublicationDatabaseTest(plan);
    expect(testSql).toContain('not-configured');
    const planned = Number(testSql.match(/select plan\((\d+)\)/)?.[1]);
    expect([...testSql.matchAll(/select (ok|is|throws_ok)\(/g)]).toHaveLength(planned);
  });

  it('includes the Caral Place card and marks a reviewed equivalent alias', () => {
    const plan = planLessonPublication(chronosContent, 'lesson.caral.andean-urbanism', {
      issueId: 'ASH-98',
      equivalentAliasIds: ['caral_norte_chico'],
    });
    expect(plan.cardIds).toEqual(['card.place.caral']);
    expect(plan.aliases).toEqual([
      expect.objectContaining({ legacyId: 'caral_norte_chico', semanticallyEquivalent: true }),
    ]);
    const sql = renderPublicationMigration(plan);
    expect(sql).toContain("('card.place.caral', 'andean-urbanism-v1')");
    expect(sql).toContain("('lesson.caral.andean-urbanism', 'card.place.caral', 0)");
    expect(sql).toContain('true');
    expect(renderPublicationDatabaseTest(plan)).toContain('already-owned');
  });

  it('shifts later published entries when inserting out of learner order', () => {
    const bundle = structuredClone(chronosContent);
    const farming = bundle.lessons.find((lesson) => lesson.id === 'lesson.farming.multiple-origins')!;
    farming.status = 'draft';
    const plan = planLessonPublication(bundle, 'lesson.farming.multiple-origins');
    expect(plan.journeyPosition).toBe(3);
    expect(plan.shiftLaterEntries).toBe(true);
    expect(renderPublicationMigration(plan)).toContain('position + 100');
  });

  it('names snapshot versions from the stable lesson id', () => {
    expect(lessonSlug('lesson.farming.multiple-origins')).toBe('multiple_origins');
    expect(defaultSnapshotVersion('lesson.farming.multiple-origins')).toBe('multiple-origins-v1');
  });
});
