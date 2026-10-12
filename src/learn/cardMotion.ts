/**
 * Pure motion rules for the tactile Knowledge Card.
 *
 * Kept free of DOM and React so the "feel" — how far a card tilts, how far a
 * drag turns it, where a release settles — is easy to test and tune in one place.
 */

/** The most a card leans toward the pointer, in degrees. Deliberately subtle. */
export const MAX_TILT_DEG = 9;

/** Dragging one full card-width turns the card half a revolution (front to back). */
export const DEGREES_PER_CARD_WIDTH = 180;

/** Pointer travel below this many pixels is a tap, not a drag. */
export const TAP_SLOP_PX = 6;

/** How far ahead (ms) a release velocity carries the card before it settles. */
const THROW_LOOKAHEAD_MS = 140;

/** The most half-turns one release may add or remove, so a hard fling cannot spin wildly. */
const MAX_THROW_HALF_TURNS = 2;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export type Tilt = { rotateX: number; rotateY: number; glareX: number; glareY: number };

/**
 * Where the pointer is on the card, as fractions 0–1 from the top-left, becomes a
 * lean toward that point plus a position for the light sheen.
 */
export function tiltFor(fractionX: number, fractionY: number, max = MAX_TILT_DEG): Tilt {
  const x = clamp(fractionX, 0, 1);
  const y = clamp(fractionY, 0, 1);
  return {
    rotateX: round((0.5 - y) * 2 * max),
    rotateY: round((x - 0.5) * 2 * max),
    glareX: round(x * 100),
    glareY: round(y * 100),
  };
}

/** Degrees of card rotation for a horizontal drag of `deltaX` pixels across a card `width` pixels wide. */
export function angleForDrag(startAngle: number, deltaX: number, width: number): number {
  return startAngle + (deltaX / Math.max(width, 1)) * DEGREES_PER_CARD_WIDTH;
}

/**
 * When the learner lets go, the card settles face-up or face-down. A slow, short
 * drag falls back to where it started; a deliberate drag or a flick carries on.
 * Returns the resting position in half-turns (even = front, odd = back).
 */
export function settleHalfTurns(angle: number, velocityDegPerMs: number, startHalfTurns: number): number {
  const projected = angle + velocityDegPerMs * THROW_LOOKAHEAD_MS;
  const target = Math.round(projected / 180);
  return clamp(target, startHalfTurns - MAX_THROW_HALF_TURNS, startHalfTurns + MAX_THROW_HALF_TURNS) || 0; // `|| 0` folds -0 into 0
}

export const isTap = (deltaX: number, deltaY: number) => Math.hypot(deltaX, deltaY) < TAP_SLOP_PX;

/** Which face is toward the learner: even half-turns show the front, odd the back. */
export const showsBack = (halfTurns: number) => Math.abs(halfTurns) % 2 === 1;

export type VelocitySample = { x: number; t: number };

/** Horizontal pointer speed in px/ms over the most recent ~100ms of a drag. */
export function recentVelocity(samples: VelocitySample[]): number {
  if (samples.length < 2) return 0;
  const last = samples[samples.length - 1];
  const first = samples.find((sample) => last.t - sample.t <= 100) ?? samples[0];
  const elapsed = last.t - first.t;
  return elapsed > 0 ? (last.x - first.x) / elapsed : 0;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}
