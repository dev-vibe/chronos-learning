import { expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { validateEditorialRecord } from '../../scripts/lesson/editorial-record';

const id = 'lesson.humans.homo-sapiens-origins';
const note = `Production record version: 2
## Learning blueprint
Retrieve: Start with what a surviving object can tell us.
Extend: Compare fossils across Africa.
Revisit: Ancient DNA in the next lesson.
Reasoning progression: Observation then inference with limits.
Transfer plan: A reviewed unfamiliar object in a later observation session.
Completion versus mastery: Attempts record study; independent explanation is separate evidence.
## Central claim support
| Claim ID | Source ID | Locator | Review |
| claim.humans.irhoud-age | source.humans.richter-2017-irhoud-age | Figure 2 and its dating discussion | Editor, 2026-09-10, close-reviewed |
`;
it('checks the new record without reopening existing pending or approved notes', () => {
  expect(validateEditorialRecord('## Learning blueprint\nLegacy record', id, chronosContent)).toEqual([]);
  expect(validateEditorialRecord(note, id, chronosContent)).toEqual([]);
});
it('catches missing cumulative learning and unregistered central support', () => {
  const invalid = note.replace('Extend: Compare fossils across Africa.', 'Extend: <fill this>')
    .replace('source.humans.richter-2017-irhoud-age | Figure 2 and its dating discussion', 'source.unknown.reference | homepage');
  const errors = validateEditorialRecord(invalid, id, chronosContent).join('\n');
  expect(errors).toContain('Extend');
  expect(errors).toContain('not registered');
  expect(errors).toContain('precise page');
});

it('accepts abbreviated precise locators and requires an attributed dated review', () => {
  expect(validateEditorialRecord(note.replace('Figure 2 and its dating discussion', 'pp. 293–295, dating discussion'), id, chronosContent)).toEqual([]);
  expect(validateEditorialRecord(note.replace('Editor, 2026-09-10, close-reviewed', 'close-reviewed'), id, chronosContent).join(' ')).toContain('reviewer and date');
});
