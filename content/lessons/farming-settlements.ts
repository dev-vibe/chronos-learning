import type { Lesson } from '../../src/domains/contracts';
import type { AuthoredContentModule } from '../assemble';

const stubSection = (id: string) => ({
  id,
  heading: 'Coming later',
  purpose: 'Journey context only',
  modules: [{ id: id.replace('section', 'module'), type: 'prose' as const, body: 'Editorial stub; not a published lesson.', claimIds: [], sourceIds: [] }],
});

export const farmingSettlementsLesson: Lesson = { id: 'lesson.farming.settlements', legacyAliases: [], status: 'draft', title: 'Farming and Settlements', masthead: 'Before 3500 BCE', place: 'Southwest Asia', chronology: { startYear: -9000, endYear: -3500, display: 'Before 3500 BCE', approximate: true }, significance: 'Neighboring stub.', sectionIdsRequired: ['section.stub.farming'], sections: [stubSection('section.stub.farming')], claimIds: ['claim.uruk.city-life'], sourceIds: ['source.met.uruk'], mediaIds: [], promptIds: [] };

export const farmingSettlementsContent: AuthoredContentModule = {
  lessons: [farmingSettlementsLesson],
};
