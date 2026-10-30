import { readFileSync } from 'node:fs';
import ts from 'typescript';

/**
 * Collects the text a component file can put on screen: JSX text, text-bearing
 * JSX attributes (aria-label, placeholder, title, alt…) and string literals in
 * code, minus the strings that are clearly not words for people (class names,
 * ids, module paths, comparisons against enum values, DOM and storage keys).
 */
const textAttributes = new Set(['aria-label', 'aria-description', 'placeholder', 'title', 'alt', 'label', 'summary', 'eyebrow', 'body']);
const machineCalls = new Set(['querySelector', 'querySelectorAll', 'getElementById', 'closest', 'setAttribute', 'removeAttribute', 'getAttribute', 'hasAttribute', 'getItem', 'setItem', 'removeItem', 'setProperty', 'removeProperty', 'addEventListener', 'removeEventListener', 'matchMedia', 'require', 'stubEnv', 'toLocaleDateString', 'toLocaleString']);

export type UiString = { file: string; line: number; text: string };

export function uiStrings(file: string): UiString[] {
  const source = ts.createSourceFile(file, readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const found: UiString[] = [];
  const add = (node: ts.Node, text: string) => {
    const value = text.replace(/\s+/g, ' ').trim();
    if (/[a-z]/i.test(value)) found.push({ file, line: source.getLineAndCharacterOfPosition(node.getStart()).line + 1, text: value });
  };
  const visit = (node: ts.Node): void => {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node) || ts.isTypeNode(node)) return;
    if (ts.isJsxAttribute(node)) {
      const name = node.name.getText(source);
      if (!textAttributes.has(name)) return;
    }
    if (ts.isBinaryExpression(node) && [ts.SyntaxKind.EqualsEqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsEqualsToken, ts.SyntaxKind.EqualsEqualsToken, ts.SyntaxKind.ExclamationEqualsToken].includes(node.operatorToken.kind)) return;
    if (ts.isCaseClause(node)) { node.statements.forEach(visit); return; }
    if (ts.isElementAccessExpression(node)) { visit(node.expression); return; }
    if (ts.isCallExpression(node)) {
      const callee = node.expression;
      const name = ts.isPropertyAccessExpression(callee) ? callee.name.text : ts.isIdentifier(callee) ? callee.text : '';
      if (machineCalls.has(name) || callee.kind === ts.SyntaxKind.ImportKeyword) { visit(callee); return; }
    }
    if (ts.isPropertyAssignment(node)) { visit(node.initializer); return; }
    if (ts.isJsxText(node)) { add(node, node.text); return; }
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) { add(node, node.text); return; }
    if (ts.isTemplateExpression(node)) {
      add(node, [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join(' '));
      node.templateSpans.forEach((span) => visit(span.expression));
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}
