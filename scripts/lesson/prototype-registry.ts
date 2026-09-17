const IMPORT_EXPRESSION = /import\s*\{\s*([A-Za-z0-9_]+)\s*\}\s*from\s*['"](\.\/prototype-reviews\/[^'"]+)['"];?\r?\n/g;

function lessonIdExpression(lessonId: string): RegExp {
  return new RegExp(`lessonId:\\s*['"]${lessonId.replaceAll('.', '\\.')}['"]`);
}

function removeIdentifierFromRegistry(source: string, identifier: string): string {
  return source.replace(
    /export const chronosPrototypeReviews: readonly LessonPrototypeReview\[\] = \[([\s\S]*?)\];/,
    (_statement, body: string) => {
      const remaining = body
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item.length > 0 && item !== identifier);
      return `export const chronosPrototypeReviews: readonly LessonPrototypeReview[] = [${remaining.join(', ')}];`;
    },
  );
}

function removeInlineReview(source: string, lessonId: string): string {
  const lessonMatch = lessonIdExpression(lessonId).exec(source);
  if (!lessonMatch || lessonMatch.index === undefined) return source;

  const objectStart = source.lastIndexOf('{', lessonMatch.index);
  if (objectStart < 0) return source;

  let depth = 0;
  let quote: "'" | '"' | '`' | undefined;
  let escaped = false;
  let objectEnd = -1;
  for (let index = objectStart; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (character === '\\') escaped = true;
      else if (character === quote) quote = undefined;
      continue;
    }
    if (character === "'" || character === '"' || character === '`') {
      quote = character;
      continue;
    }
    if (character === '{') depth += 1;
    if (character === '}' && --depth === 0) {
      objectEnd = index + 1;
      break;
    }
  }
  if (objectEnd < 0) return source;

  const trailingComma = source.slice(objectEnd).match(/^\s*,/);
  const removeEnd = trailingComma ? objectEnd + trailingComma[0].length : objectEnd;
  return source
    .slice(0, objectStart)
    .concat(source.slice(removeEnd))
    .replace(/(export const chronosPrototypeReviews: readonly LessonPrototypeReview\[\] = \[)\s*(\];)/, '$1$2')
    .replace(/,(\s*)\]/, '$1]');
}

export function unregisterPrototypeReview(
  indexSource: string,
  lessonId: string,
  importedFiles: Record<string, string> = {},
): { next: string; changed: boolean } {
  const lessonIdInFile = lessonIdExpression(lessonId);
  let next = indexSource;
  const identifiers = new Set<string>();

  for (const match of indexSource.matchAll(new RegExp(IMPORT_EXPRESSION.source, 'g'))) {
    const identifier = match[1];
    const specifier = match[2];
    const imported = importedFiles[specifier] ?? importedFiles[`${specifier}.ts`] ?? '';
    if (lessonIdInFile.test(imported)) {
      identifiers.add(identifier);
      next = next.replace(match[0], '');
    }
  }

  for (const identifier of identifiers) next = removeIdentifierFromRegistry(next, identifier);
  next = removeInlineReview(next, lessonId);

  const changed = next !== indexSource;
  if (lessonIdInFile.test(next)) {
    throw new Error(`${lessonId} is still registered in content/prototype-reviews.ts`);
  }
  return { next: next.replace(/\n{3,}/g, '\n\n'), changed };
}
