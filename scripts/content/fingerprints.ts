import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { chronosContent } from '../../content/chronos';
import { PROMPT_FINGERPRINTS_PATH, regeneratePromptFingerprints, type PromptFingerprintFile } from '../../src/infrastructure/content/promptFingerprints';

// Records new published prompts and marks removed ones retired. Refuses (and
// writes nothing) when a published prompt changed its question under the same ID.
const recorded: PromptFingerprintFile | undefined = existsSync(PROMPT_FINGERPRINTS_PATH) ? JSON.parse(readFileSync(PROMPT_FINGERPRINTS_PATH, 'utf8')) : undefined;
const { file, errors } = regeneratePromptFingerprints(chronosContent.prompts, chronosContent.lessons, recorded);
if (errors.length) {
  console.error('Prompt fingerprints were not updated:\n' + errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}
const text = JSON.stringify(file, null, 2) + '\n';
const before = recorded ? JSON.stringify(recorded, null, 2) + '\n' : '';
if (text === before) { console.log(`${PROMPT_FINGERPRINTS_PATH} is up to date.`); process.exit(0); }
writeFileSync(PROMPT_FINGERPRINTS_PATH, text);
const active = Object.values(file.prompts).filter((entry) => !entry.retired).length;
console.log(`Wrote ${PROMPT_FINGERPRINTS_PATH}: ${active} published, ${Object.keys(file.prompts).length - active} retired.`);
