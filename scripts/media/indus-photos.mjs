// Original photographs are preserved byte-for-byte in the research folder.
// Re-running only makes unretouched web sources; no crop, mirror, or upscaling.
import { mkdir } from 'node:fs/promises';
import sharp from 'sharp';
await mkdir('public/images/indus', { recursive: true });
for (const [name, original] of Object.entries({
  reservoir: 'reservoir-original.jpg',
  weights: 'ashmolean-weights-original.jpg',
  seal: 'seal-original.jpg',
})) {
  await sharp(`docs/research/indus-media/${original}`)
    .resize({ width: 960, withoutEnlargement: true })
    .jpeg({ quality: 97, chromaSubsampling: '4:4:4' })
    .toFile(`public/images/indus/${name}.jpg`);
}
