/**
 * Words a 12-year-old would not use at home, from the plain-words table in
 * Stage 12 of docs/content/lesson-creation-runbook.md. They are banned in the
 * understanding checks, and the Learn shell must never put them around lesson
 * content either (tests/learn/plain-ui-words.test.ts).
 *
 * The table lists common offenders, not every one. Add a word here when the
 * runbook's table gains it.
 */
export type PlainWordRule = { pattern: RegExp; instead: string };

export const plainWordRules: PlainWordRule[] = [
  { pattern: /\b(conclusions?|best[- ]supported|supports? best|best fits?|strongest|most likely|which statement|which of the following)\b/i, instead: 'ask the question the right answer answers' },
  { pattern: /\b(evidence|clues?|sources?|pattern|examples?)\b/i, instead: 'the thing’s name (Merer’s diary, the ovens, the door seals)' },
  { pattern: /\b(arrangements?|connections?|ties|relationships?|roles?)\b/i, instead: 'the actual link: who was in charge, a marriage, a trade' },
  { pattern: /\b(suggests?|indicates?|demonstrates?|establish(es)?|impl(y|ies)|attest(s|ed)?)\b/i, instead: 'show, tell us' },
  { pattern: /\bsignificance\b/i, instead: 'why it matters' },
  { pattern: /\b(control|kept hold of|administration|administrative|governed)\b/i, instead: 'ran the city, stayed in charge' },
  { pattern: /\b(analy[sz]e|infer|consider|evaluate)\b/i, instead: 'cut it and ask the question' },
  { pattern: /\bresearchers (are )?still\b|\bcannot prove\b|\bdoes not tell us\b/i, instead: 'say what is unknown in the lesson, not around it' },
];

/** The banned words found in a piece of text, with what to write instead. */
export function plainWordProblems(text: string) {
  return plainWordRules.flatMap((rule) => {
    const match = text.match(rule.pattern);
    return match ? [{ word: match[0], instead: rule.instead }] : [];
  });
}
