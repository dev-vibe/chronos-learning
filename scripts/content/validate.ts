import { chronosContent } from '../../content/chronos'; import { validateContent } from '../../src/infrastructure/content/validate';
const result=validateContent(chronosContent); if(!result.success){console.error('Content validation failed:\n'+result.errors.map(e=>`- ${e}`).join('\n'));process.exit(1)} console.log('Content validation passed: repository-authored lesson references are coherent.');
