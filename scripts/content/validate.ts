import { existsSync, readFileSync } from 'node:fs';
import { chronosContent } from '../../content/chronos'; import { validateContent } from '../../src/infrastructure/content/validate';
import { checkPromptFingerprints, PROMPT_FINGERPRINTS_PATH } from '../../src/infrastructure/content/promptFingerprints';
const result=validateContent(chronosContent);
const recorded=existsSync(PROMPT_FINGERPRINTS_PATH)?JSON.parse(readFileSync(PROMPT_FINGERPRINTS_PATH,'utf8')):undefined;
const errors=[...(result.success?[]:result.errors),...checkPromptFingerprints(chronosContent.prompts,chronosContent.lessons,recorded)];
if(errors.length){console.error('Content validation failed:\n'+errors.map(e=>`- ${e}`).join('\n'));process.exit(1)} console.log('Content validation passed: repository-authored lesson references are coherent and published prompts keep their identity.');
