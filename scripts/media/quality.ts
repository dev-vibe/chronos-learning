import sharp, { type WebpOptions } from 'sharp';

export const QUALITY_POLICY = {
  profile: 'ql-v1',
  minimumPsnrDb: 45,
  maximumMeanAbsoluteError: 1,
  maximumChannelDelta: 16,
  maximumVariantBytes: 768 * 1024,
  minimumSavingsRatioForLossyReencode: 0.05,
  webpQualities: [96, 94, 92, 90, 88, 86, 84, 82, 80],
} as const;

export type RawReference = { data: Buffer; width: number; height: number; channels: 4 };
export type Fidelity =
  | { mode: 'pixel-exact'; psnrDb: null; meanAbsoluteError: 0; maximumChannelDelta: 0 }
  | { mode: 'measured-quasi-lossless'; psnrDb: number; meanAbsoluteError: number; maximumChannelDelta: number };
export type Compression = {
  profile: typeof QUALITY_POLICY.profile;
  codec: 'jpeg' | 'png' | 'webp';
  encoder: 'source-passthrough' | 'webp-lossless' | 'webp-lossy';
  quality?: number;
};
export type EncodedCandidate = { bytes: Buffer; extension: '.jpg' | '.png' | '.webp'; mimeType: 'image/jpeg' | 'image/png' | 'image/webp'; compression: Compression; fidelity: Fidelity };

const round = (value: number, places: number) => Number(value.toFixed(places));

export async function createReference(source: Buffer, width: number): Promise<RawReference> {
  const { data, info } = await sharp(source).rotate().resize({ width, withoutEnlargement: true }).toColourspace('srgb').ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (info.channels !== 4) throw new Error('Expected four-channel reference, received ' + info.channels);
  return { data, width: info.width, height: info.height, channels: 4 };
}

async function measure(reference: RawReference, candidate: Buffer): Promise<Fidelity> {
  const decoded = await sharp(candidate).toColourspace('srgb').ensureAlpha().raw().toBuffer();
  if (decoded.byteLength !== reference.data.byteLength) throw new Error('Encoded candidate changed image dimensions or channels');
  let squaredError = 0;
  let absoluteError = 0;
  let maximumChannelDelta = 0;
  for (let index = 0; index < reference.data.length; index += 1) {
    const delta = Math.abs(reference.data[index] - decoded[index]);
    squaredError += delta * delta;
    absoluteError += delta;
    maximumChannelDelta = Math.max(maximumChannelDelta, delta);
  }
  if (squaredError === 0) return { mode: 'pixel-exact', psnrDb: null, meanAbsoluteError: 0, maximumChannelDelta: 0 };
  const meanSquaredError = squaredError / reference.data.length;
  return {
    mode: 'measured-quasi-lossless',
    psnrDb: round(10 * Math.log10((255 * 255) / meanSquaredError), 2),
    meanAbsoluteError: round(absoluteError / reference.data.length, 3),
    maximumChannelDelta,
  };
}

function meetsPolicy(candidate: EncodedCandidate) {
  if (candidate.bytes.byteLength > QUALITY_POLICY.maximumVariantBytes) return false;
  if (candidate.fidelity.mode === 'pixel-exact') return true;
  return candidate.fidelity.psnrDb >= QUALITY_POLICY.minimumPsnrDb
    && candidate.fidelity.meanAbsoluteError <= QUALITY_POLICY.maximumMeanAbsoluteError
    && candidate.fidelity.maximumChannelDelta <= QUALITY_POLICY.maximumChannelDelta;
}

const webpOptions = (quality?: number, preset?: WebpOptions['preset']): WebpOptions => quality === undefined
  ? { lossless: true, effort: 6, exact: true, preset }
  : { quality, effort: 6, exact: true, smartSubsample: true, preset };

export async function selectCandidate(reference: RawReference, preset: WebpOptions['preset'], passthrough?: { bytes: Buffer; extension: '.jpg' | '.png' | '.webp'; mimeType: 'image/jpeg' | 'image/png' | 'image/webp' }): Promise<EncodedCandidate> {
  const candidates: EncodedCandidate[] = [];
  let passthroughCandidate: EncodedCandidate | undefined;
  if (passthrough) {
    passthroughCandidate = {
      ...passthrough,
      compression: { profile: QUALITY_POLICY.profile, codec: passthrough.mimeType.slice(6) as Compression['codec'], encoder: 'source-passthrough' },
      fidelity: await measure(reference, passthrough.bytes),
    };
    candidates.push(passthroughCandidate);
  }
  const rawInput = { raw: { width: reference.width, height: reference.height, channels: reference.channels } } as const;
  const lossless = await sharp(reference.data, rawInput).webp(webpOptions(undefined, preset)).toBuffer();
  candidates.push({ bytes: lossless, extension: '.webp', mimeType: 'image/webp', compression: { profile: QUALITY_POLICY.profile, codec: 'webp', encoder: 'webp-lossless' }, fidelity: await measure(reference, lossless) });
  for (const quality of QUALITY_POLICY.webpQualities) {
    const bytes = await sharp(reference.data, rawInput).webp(webpOptions(quality, preset)).toBuffer();
    candidates.push({ bytes, extension: '.webp', mimeType: 'image/webp', compression: { profile: QUALITY_POLICY.profile, codec: 'webp', encoder: 'webp-lossy', quality }, fidelity: await measure(reference, bytes) });
  }
  const accepted = candidates.filter(meetsPolicy).sort((left, right) => left.bytes.byteLength - right.bytes.byteLength);
  if (accepted.length === 0) throw new Error('No candidate met ' + QUALITY_POLICY.profile + ' quality and byte thresholds at ' + reference.width + 'x' + reference.height);
  const smallest = accepted[0];
  if (passthroughCandidate && meetsPolicy(passthroughCandidate) && smallest.compression.encoder === 'webp-lossy') {
    const savingsRatio = 1 - smallest.bytes.byteLength / passthroughCandidate.bytes.byteLength;
    if (savingsRatio < QUALITY_POLICY.minimumSavingsRatioForLossyReencode) return passthroughCandidate;
  }
  return smallest;
}
