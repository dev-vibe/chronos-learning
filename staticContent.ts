import { NodeContent } from './types';

/**
 * STATIC_CONTENT is assembled by eagerly loading all modules under `data/**`
 * and merging any exports that match `Record<string, NodeContent>`.
 *
 * This intentionally decouples repo folder organization (Greece/Rome/etc) from the app.
 * Reorganize files freely under `data/` without needing to update import lists.
 */

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNodeContent(value: unknown): value is NodeContent {
  if (!isObject(value)) return false;
  return (
    typeof value.summary === 'string' &&
    typeof value.funFact === 'string' &&
    Array.isArray(value.people) &&
    Array.isArray(value.inventions) &&
    Array.isArray(value.places) &&
    Array.isArray(value.resources)
  );
}

function isNodeContentRecord(value: unknown): value is Record<string, NodeContent> {
  if (!isObject(value)) return false;
  const values = Object.values(value);
  // Allow empty records (useful during WIP), but validate any present entries.
  return values.length === 0 || values.every(isNodeContent);
}

const modules = import.meta.glob('./data/**/*.ts', { eager: true }) as Record<
  string,
  Record<string, unknown>
>;

const merged: Record<string, NodeContent> = {};
const conflicts: string[] = [];

for (const mod of Object.values(modules)) {
  for (const exp of Object.values(mod)) {
    if (!isNodeContentRecord(exp)) continue;
    for (const [id, content] of Object.entries(exp)) {
      if (merged[id]) conflicts.push(id);
      merged[id] = content;
    }
  }
}

if (conflicts.length > 0) {
  // eslint-disable-next-line no-console
  console.warn(
    `[STATIC_CONTENT] Duplicate node ids encountered (last one wins): ${[
      ...new Set(conflicts),
    ].join(', ')}`
  );
}

export const STATIC_CONTENT: Record<string, NodeContent> = merged;