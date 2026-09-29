import { randomBytes } from 'node:crypto';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export type ImageKind = 'generated' | 'edited' | 'uploaded';
export type ImageExt = 'png' | 'jpg' | 'webp';

export interface ImageMeta {
  id: string;
  ext: ImageExt;
  kind: ImageKind;
  createdAt: string;
  prompt?: string;
  model?: string;
  size?: string;
  /** IDs of stored images used as references for an edit. */
  references?: string[];
  /** URLs fetched as references for an edit. */
  referenceUrls?: string[];
}

export const ID_PATTERN = /^[a-f0-9]{32}$/;

export const MIME_BY_EXT: Record<ImageExt, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  webp: 'image/webp',
};

export function sniffExt(buf: Buffer): ImageExt | null {
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return 'png';
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpg';
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
}

/** Images are stored on disk with a JSON sidecar recording provenance. IDs are 128-bit random. */
export class ImageStore {
  constructor(private readonly dir: string) {}

  async save(buf: Buffer, meta: Omit<ImageMeta, 'id' | 'ext' | 'createdAt'>): Promise<ImageMeta> {
    const ext = sniffExt(buf);
    if (!ext) throw new Error('Unsupported image format (need PNG, JPEG or WebP).');
    await mkdir(this.dir, { recursive: true });
    const id = randomBytes(16).toString('hex');
    const full: ImageMeta = { id, ext, createdAt: new Date().toISOString(), ...meta };
    await writeFile(path.join(this.dir, `${id}.${ext}`), buf);
    await writeFile(path.join(this.dir, `${id}.json`), JSON.stringify(full, null, 2));
    return full;
  }

  async meta(id: string): Promise<ImageMeta | null> {
    if (!ID_PATTERN.test(id)) return null;
    try {
      return JSON.parse(await readFile(path.join(this.dir, `${id}.json`), 'utf8')) as ImageMeta;
    } catch {
      return null;
    }
  }

  async read(id: string): Promise<{ meta: ImageMeta; data: Buffer } | null> {
    const meta = await this.meta(id);
    if (!meta) return null;
    return { meta, data: await readFile(path.join(this.dir, `${id}.${meta.ext}`)) };
  }

  async list(limit = 20): Promise<ImageMeta[]> {
    let names: string[];
    try {
      names = await readdir(this.dir);
    } catch {
      return [];
    }
    const metas = await Promise.all(
      names.filter((n) => n.endsWith('.json')).map((n) => this.meta(n.slice(0, -5))),
    );
    return metas
      .filter((m): m is ImageMeta => m !== null)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .slice(0, limit);
  }
}
