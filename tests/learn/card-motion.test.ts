import { describe, expect, it } from 'vitest';
import { angleForDrag, isTap, MAX_TILT_DEG, recentVelocity, settleHalfTurns, showsBack, tiltFor } from '../../src/learn/cardMotion';

describe('card tilt', () => {
  it('rests flat when the pointer is at the centre', () => {
    const tilt = tiltFor(0.5, 0.5);
    expect(tilt.rotateX).toBeCloseTo(0);
    expect(tilt.rotateY).toBeCloseTo(0);
  });

  it('leans the near edge toward the pointer, within the limit', () => {
    expect(tiltFor(1, 0.5).rotateY).toBe(MAX_TILT_DEG);
    expect(tiltFor(0, 0.5).rotateY).toBe(-MAX_TILT_DEG);
    expect(tiltFor(0.5, 0).rotateX).toBe(MAX_TILT_DEG);
    expect(tiltFor(0.5, 1).rotateX).toBe(-MAX_TILT_DEG);
    expect(tiltFor(9, -4)).toMatchObject({ rotateY: MAX_TILT_DEG, rotateX: MAX_TILT_DEG, glareX: 100, glareY: 0 });
  });
});

describe('card spin', () => {
  it('turns half a revolution for one card-width of drag', () => {
    expect(angleForDrag(0, 300, 300)).toBe(180);
    expect(angleForDrag(180, -150, 300)).toBe(90);
    expect(angleForDrag(0, 10, 0)).toBeGreaterThan(0);
  });

  it('falls back to where it started after a short, slow drag', () => {
    expect(settleHalfTurns(40, 0, 0)).toBe(0);
    expect(settleHalfTurns(-40, 0, 0)).toBe(0);
  });

  it('carries on to the other face after a deliberate drag or a flick', () => {
    expect(settleHalfTurns(120, 0, 0)).toBe(1);
    expect(settleHalfTurns(30, 0.9, 0)).toBe(1);
    expect(settleHalfTurns(150, -0.9, 1)).toBe(0);
  });

  it('never spins more than two half-turns from one release', () => {
    expect(settleHalfTurns(180, 40, 0)).toBe(2);
    expect(settleHalfTurns(-180, -40, 0)).toBe(-2);
  });

  it('knows which face is showing', () => {
    expect([0, 1, 2, 3, -1, -2].map(showsBack)).toEqual([false, true, false, true, true, false]);
  });
});

describe('gesture helpers', () => {
  it('treats tiny movement as a tap', () => {
    expect(isTap(2, 2)).toBe(true);
    expect(isTap(12, 0)).toBe(false);
  });

  it('measures velocity over only the most recent moments', () => {
    expect(recentVelocity([])).toBe(0);
    expect(recentVelocity([{ x: 0, t: 0 }])).toBe(0);
    expect(recentVelocity([{ x: 0, t: 0 }, { x: 500, t: 400 }, { x: 540, t: 440 }, { x: 600, t: 480 }])).toBeCloseTo(1.25, 2);
  });
});
