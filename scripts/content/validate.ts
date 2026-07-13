import { urukContent } from '../../content/uruk'; import { validateContent } from '../../src/infrastructure/content/validate';
const result=validateContent(urukContent); if(!result.success){console.error('Content validation failed:\n'+result.errors.map(e=>`- ${e}`).join('\n'));process.exit(1)} console.log('Content validation passed: Uruk vertical-slice references are coherent.');
