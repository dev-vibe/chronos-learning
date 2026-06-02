import { readFileSync } from 'node:fs';

const constantsSource = readFileSync(new URL('../constants.ts', import.meta.url), 'utf8');
const arcsSource = readFileSync(new URL('../data/arcs.ts', import.meta.url), 'utf8');

const nodeStubStart = constantsSource.indexOf('const INITIAL_NODE_STUBS');
const nodeStubEnd = constantsSource.indexOf('export const INITIAL_NODES');

if (nodeStubStart === -1 || nodeStubEnd === -1) {
  throw new Error('Could not locate INITIAL_NODE_STUBS in constants.ts.');
}

const nodeStubSource = constantsSource.slice(nodeStubStart, nodeStubEnd);
const nodeIds = new Set([...nodeStubSource.matchAll(/\bid:\s*'([^']+)'/g)].map(match => match[1]));
const arcNodeIdReferences = new Set();

for (const match of arcsSource.matchAll(/\b(?:startNodeIds|nodeIds):\s*\[([\s\S]*?)\]/g)) {
  for (const idMatch of match[1].matchAll(/'([^']+)'/g)) {
    arcNodeIdReferences.add(idMatch[1]);
  }
}

const missingNodeIds = [...arcNodeIdReferences]
  .filter(nodeId => !nodeIds.has(nodeId))
  .sort();

if (missingNodeIds.length > 0) {
  console.error(`Missing ${missingNodeIds.length} arc node ID reference(s):`);
  for (const nodeId of missingNodeIds) {
    console.error(`- ${nodeId}`);
  }
  process.exit(1);
}

console.log(`Arc node ID validation passed (${arcNodeIdReferences.size} referenced IDs).`);
