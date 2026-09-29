import type { Config } from './config.ts';

export type ImageSize = 'auto' | '1024x1024' | '1536x1024' | '1024x1536';
export type ImageQuality = 'auto' | 'low' | 'medium' | 'high';

export interface GenerateParams {
  model: string;
  prompt: string;
  size: ImageSize;
  quality: ImageQuality;
  transparentBackground?: boolean;
}

export interface EditParams extends GenerateParams {
  images: { data: Buffer; mime: string }[];
  mask?: { data: Buffer; mime: string };
}

interface ImagesResponse {
  data?: { b64_json?: string; url?: string }[];
  error?: { message?: string };
}

export class OpenAIImages {
  constructor(private readonly cfg: Config) {}

  async generate(p: GenerateParams): Promise<Buffer> {
    const body: Record<string, unknown> = {
      model: p.model,
      prompt: p.prompt,
      size: p.size,
      quality: p.quality,
      n: 1,
      output_format: 'png',
    };
    if (p.transparentBackground) body.background = 'transparent';
    const res = await fetch(`${this.cfg.openaiBaseUrl}/images/generations`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.cfg.openaiApiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return this.decode(res);
  }

  async edit(p: EditParams): Promise<Buffer> {
    const form = new FormData();
    form.set('model', p.model);
    form.set('prompt', p.prompt);
    form.set('size', p.size);
    form.set('quality', p.quality);
    form.set('n', '1');
    form.set('output_format', 'png');
    if (p.transparentBackground) form.set('background', 'transparent');
    p.images.forEach((img, i) => {
      form.append('image[]', new Blob([new Uint8Array(img.data)], { type: img.mime }), `reference-${i + 1}.${img.mime.split('/')[1]}`);
    });
    if (p.mask) form.set('mask', new Blob([new Uint8Array(p.mask.data)], { type: p.mask.mime }), 'mask.png');
    const res = await fetch(`${this.cfg.openaiBaseUrl}/images/edits`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${this.cfg.openaiApiKey}` },
      body: form,
    });
    return this.decode(res);
  }

  private async decode(res: Response): Promise<Buffer> {
    const text = await res.text();
    let json: ImagesResponse = {};
    try {
      json = JSON.parse(text) as ImagesResponse;
    } catch {
      /* non-JSON error body */
    }
    if (!res.ok) throw new Error(`OpenAI Images API ${res.status}: ${json.error?.message ?? text.slice(0, 300)}`);
    const item = json.data?.[0];
    if (item?.b64_json) return Buffer.from(item.b64_json, 'base64');
    if (item?.url) return Buffer.from(await (await fetch(item.url)).arrayBuffer());
    throw new Error('OpenAI Images API returned no image data.');
  }
}
