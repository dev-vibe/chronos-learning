import { describe, expect, it } from 'vitest';
import { cylinderColumn, printColumn, sealGeometry } from '../../src/learn/seal-roll-mapping';

describe('seal roll texture mapping', () => {
  const repeat = 400;
  const radius = sealGeometry(repeat, 80).radius;
  it('matches the printed column at the center contact line throughout both turns', () => {
    for (const distance of [0, 17, 200, 399, 400, 633, 800]) {
      expect(cylinderColumn(distance, 0, repeat)).toBeCloseTo(printColumn(distance, repeat));
    }
  });
  it('mirrors the impression column ordering across the visible stone', () => {
    expect(cylinderColumn(200, -radius / 2, repeat)).toBeGreaterThan(200);
    expect(cylinderColumn(200, radius / 2, repeat)).toBeLessThan(200);
  });
  it('repeats after one circumference for printing and stone rotation', () => {
    for (const distance of [-47, 0, 73, 397]) {
      expect(printColumn(distance + repeat, repeat)).toBeCloseTo(printColumn(distance, repeat));
      expect(cylinderColumn(distance + repeat, radius / 2, repeat)).toBeCloseTo(cylinderColumn(distance, radius / 2, repeat));
    }
  });
  it('uses asin projection, reaching a quarter turn at either silhouette and clamping outside it', () => {
    expect(cylinderColumn(200, radius / 2, repeat)).toBeCloseTo(200 - repeat / 12);
    expect(cylinderColumn(200, radius, repeat)).toBeCloseTo(100);
    expect(cylinderColumn(200, -radius, repeat)).toBeCloseTo(300);
    expect(cylinderColumn(200, radius * 2, repeat)).toBeCloseTo(100);
  });
});
