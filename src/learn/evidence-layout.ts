import type { LessonModule, MediaAsset } from '../domains/contracts';

// `type?:` so the plain (non-strict) typecheck does not resolve this to `never`; see EvidenceModule.tsx.
type EvidenceLayout = Extract<LessonModule, { type?: 'evidence' }>['layout'];

/** Use registered dimensions, so layout is stable before images load or fall back. */
export function evidenceLayout(media: MediaAsset, authored?: EvidenceLayout): NonNullable<EvidenceLayout> {
  if (authored) return authored;
  const { width, height } = media.locator.provider === 'repository' ? media.locator : media.locator.fallback;
  return width > height ? 'stacked' : 'side-by-side';
}
