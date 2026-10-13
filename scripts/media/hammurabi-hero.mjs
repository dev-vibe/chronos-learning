// Runtime source for the generated Babylon reconstruction hero. No crop, retouching or upscaling.
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import sharp from 'sharp';
const master = 'docs/research/assets/hammurabi/hero/babylon-reconstruction-master.png';
const runtime = 'public/images/hammurabi/babylon-reconstruction.jpg';
await sharp(master).resize({ width: 1600, withoutEnlargement: true }).jpeg({ quality: 90, chromaSubsampling: '4:4:4' }).toFile(runtime);
const hash = async (path) => createHash('sha256').update(await readFile(path)).digest('hex');
console.log(JSON.stringify({ master, masterSha256: await hash(master), runtime, runtimeSha256: await hash(runtime) }, null, 2));
