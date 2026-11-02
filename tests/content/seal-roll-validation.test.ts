import { describe, expect, it } from 'vitest';
import { chronosContent } from '../../content/chronos';
import { SealRollInteractionSchema } from '../../src/domains/contracts';
import { validateContent } from '../../src/infrastructure/content/validate';

const valid = { kind: 'seal-roll', textureMediaId: 'media.akkad.seal-repeat', repeatPx: 1382, bandTop: 0, bandBottom: 740, sealWidthPx: 490 };
function fixture() {
  const content = structuredClone(chronosContent);
  const lesson = content.lessons.find((item) => item.id === 'lesson.mesopotamia.akkadian-empire')!;
  const module = lesson.sections.flatMap((section) => section.modules).find((item) => item.id === 'module.akkad.seal-example')!;
  if (module.type !== 'evidence' || !module.interaction) throw new Error('Missing seal interaction');
  return { content, lesson, interaction: module.interaction };
}

describe('seal-roll authoring', () => {
  it('allows a zero crop origin but rejects nonpositive or nonfinite measurements and inverted bands', () => {
    expect(SealRollInteractionSchema.safeParse(valid).success).toBe(true);
    for (const patch of [{ repeatPx: 0 }, { repeatPx: Infinity }, { bandTop: -1 }, { bandBottom: 0 }, { bandTop: 740 }, { sealWidthPx: -1 }]) {
      expect(SealRollInteractionSchema.safeParse({ ...valid, ...patch }).success).toBe(false);
    }
  });
  it('requires the texture to exist and belong to the lesson', () => {
    const { content, lesson, interaction } = fixture();
    interaction.textureMediaId = 'media.missing.texture';
    expect(validateContent(content).errors.join(' ')).toContain('broken seal-roll texture');
    interaction.textureMediaId = valid.textureMediaId;
    lesson.mediaIds = lesson.mediaIds.filter((id) => id !== valid.textureMediaId);
    expect(validateContent(content).errors.join(' ')).toContain('broken lesson seal-roll texture');
  });
  it('rejects a repeat or band extending outside the actual registered texture', () => {
    const { content, interaction } = fixture();
    interaction.repeatPx = 1383;
    expect(validateContent(content).errors.join(' ')).toContain('fit inside the texture image');
    interaction.repeatPx = valid.repeatPx;
    interaction.bandBottom = 741;
    expect(validateContent(content).errors.join(' ')).toContain('fit inside the texture image');
  });
});
