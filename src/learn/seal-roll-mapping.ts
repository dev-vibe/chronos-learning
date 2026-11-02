/** All distances are in the measured texture's pixels, before responsive scaling. */
export const wrapSealColumn = (column: number, repeat: number) => ((column % repeat) + repeat) % repeat;

export function printColumn(distance: number, repeat: number) {
  return wrapSealColumn(distance, repeat);
}

export function cylinderColumn(distance: number, offset: number, repeat: number) {
  const radius = repeat / (2 * Math.PI);
  // M(u) = I(-u): the stone is the horizontally mirrored impression.
  // Its rotation is -distance, so M(-distance + r asin(d/r)) meets I(distance)
  // at the contact line (d=0). One circumference advances one complete repeat.
  const angle = Math.asin(Math.max(-1, Math.min(1, offset / radius)));
  return wrapSealColumn(distance - radius * angle, repeat);
}

export function sealGeometry(repeat: number, bandHeight: number) {
  const radius = repeat / (2 * Math.PI);
  const padding = radius + repeat * .08;
  return { radius, padding, travel: repeat * 2, width: repeat * 2 + padding * 2, height: bandHeight + repeat * .18, top: repeat * .09 };
}
