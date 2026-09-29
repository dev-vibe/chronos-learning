import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import sharp from 'sharp';
import { z } from 'zod';
import type { Config } from './config.ts';
import { fetchReferenceImage } from './fetchImage.ts';
import type { ImageQuality, ImageSize, OpenAIImages } from './openai.ts';
import { ID_PATTERN, MIME_BY_EXT, type ImageMeta, type ImageStore } from './storage.ts';
import type { UploadTokens } from './uploads.ts';

export interface ToolDeps {
  cfg: Config;
  store: ImageStore;
  openai: OpenAIImages;
  uploads: UploadTokens;
}

const tier = z
  .enum(['reference', 'draft'])
  .default('reference')
  .describe('"reference" = highest fidelity, use when the result must closely follow an approved reference or final art. "draft" = faster and cheaper, for exploring ideas.');
const size = z.enum(['auto', '1024x1024', '1536x1024', '1024x1536']).default('auto').describe('Landscape 1536x1024, portrait 1024x1536, or square.');
const quality = z.enum(['auto', 'low', 'medium', 'high']).default('auto');
const transparent = z.boolean().default(false).describe('Transparent background (sprites, cut-outs).');

const fileUrl = (cfg: Config, m: ImageMeta) => `${cfg.publicBaseUrl}/files/${m.id}.${m.ext}`;

/** Downscaled JPEG so the tool result stays small; the full-resolution file is behind the link. */
async function preview(data: Buffer): Promise<{ b64: string; width: number; height: number }> {
  const img = sharp(data).rotate();
  const { width = 0, height = 0 } = await img.metadata();
  const out = await img
    .resize({ width: 1024, height: 1024, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 82 })
    .toBuffer();
  return { b64: out.toString('base64'), width, height };
}

async function imageResult(deps: ToolDeps, meta: ImageMeta, data: Buffer, note: string): Promise<CallToolResult> {
  const p = await preview(data);
  const lines = [
    note,
    `id: ${meta.id}`,
    `full-resolution ${meta.ext.toUpperCase()} (${p.width}x${p.height}): ${fileUrl(deps.cfg, meta)}`,
    meta.model ? `model: ${meta.model}` : '',
    'The inline image is a downscaled preview. Pass the id as reference_image_ids to edit_image to iterate on it.',
  ].filter(Boolean);
  return {
    content: [
      { type: 'image', data: p.b64, mimeType: 'image/jpeg' },
      { type: 'text', text: lines.join('\n') },
    ],
  };
}

const fail = (message: string): CallToolResult => ({ isError: true, content: [{ type: 'text', text: message }] });

export function buildServer(deps: ToolDeps): McpServer {
  const { cfg, store, openai, uploads } = deps;
  const server = new McpServer({ name: 'chronos-image', version: '0.1.0' });

  server.registerTool(
    'generate_image',
    {
      title: 'Generate image',
      description:
        'Create a new image from a text prompt with the OpenAI image model. Returns a preview plus an id and a full-resolution link. Write the prompt in full; nothing is added to it.',
      inputSchema: { prompt: z.string().min(1).max(32000), tier, size, quality, transparent_background: transparent },
      annotations: { readOnlyHint: false, openWorldHint: true },
    },
    async (a) => {
      try {
        const model = cfg.models[a.tier];
        const data = await openai.generate({
          model,
          prompt: a.prompt,
          size: a.size as ImageSize,
          quality: a.quality as ImageQuality,
          transparentBackground: a.transparent_background,
        });
        const meta = await store.save(data, { kind: 'generated', prompt: a.prompt, model, size: a.size });
        return await imageResult(deps, meta, data, 'Generated image.');
      } catch (e) {
        return fail(e instanceof Error ? e.message : String(e));
      }
    },
  );

  server.registerTool(
    'edit_image',
    {
      title: 'Edit image with references',
      description:
        'Create or revise an image using one or more reference images. Provide references as ids (from generate_image, edit_image, create_upload_link or list_images) and/or public https URLs. Images attached in the chat are NOT available to this tool: upload them first with create_upload_link. Optionally give a mask id (PNG whose transparent areas mark what may change).',
      inputSchema: {
        prompt: z.string().min(1).max(32000).describe('What to produce, and how each reference is used (e.g. "image 1 is the layout, image 2 is style only").'),
        reference_image_ids: z.array(z.string().regex(ID_PATTERN)).max(16).default([]),
        reference_image_urls: z.array(z.string().url()).max(16).default([]),
        mask_image_id: z.string().regex(ID_PATTERN).optional(),
        tier,
        size,
        quality,
        transparent_background: transparent,
      },
      annotations: { readOnlyHint: false, openWorldHint: true },
    },
    async (a) => {
      try {
        if (!a.reference_image_ids.length && !a.reference_image_urls.length) {
          return fail('Provide at least one reference_image_ids or reference_image_urls entry. To use an image from the chat, call create_upload_link first.');
        }
        const images: { data: Buffer; mime: string }[] = [];
        for (const id of a.reference_image_ids) {
          const stored = await store.read(id);
          if (!stored) return fail(`No stored image with id ${id}. Use list_images to see available ids.`);
          images.push({ data: stored.data, mime: MIME_BY_EXT[stored.meta.ext] });
        }
        for (const url of a.reference_image_urls) {
          const data = await fetchReferenceImage(url, cfg.maxReferenceBytes, cfg.allowInsecureReferenceUrls);
          const tmp = await sharp(data).metadata();
          images.push({ data, mime: tmp.format === 'jpeg' ? 'image/jpeg' : tmp.format === 'webp' ? 'image/webp' : 'image/png' });
        }
        let mask: { data: Buffer; mime: string } | undefined;
        if (a.mask_image_id) {
          const stored = await store.read(a.mask_image_id);
          if (!stored) return fail(`No stored mask with id ${a.mask_image_id}.`);
          mask = { data: stored.data, mime: MIME_BY_EXT[stored.meta.ext] };
        }
        const model = cfg.models[a.tier];
        const data = await openai.edit({
          model,
          prompt: a.prompt,
          size: a.size as ImageSize,
          quality: a.quality as ImageQuality,
          transparentBackground: a.transparent_background,
          images,
          mask,
        });
        const meta = await store.save(data, {
          kind: 'edited',
          prompt: a.prompt,
          model,
          size: a.size,
          references: a.reference_image_ids,
          referenceUrls: a.reference_image_urls,
        });
        return await imageResult(deps, meta, data, `Edited image using ${images.length} reference image(s).`);
      } catch (e) {
        return fail(e instanceof Error ? e.message : String(e));
      }
    },
  );

  server.registerTool(
    'create_upload_link',
    {
      title: 'Create reference-upload link',
      description:
        'Returns a short-lived link where the user can drop reference images. Uploaded images get ids that appear in list_images. Use this whenever the user wants to edit or match an image that only exists in the chat or on their device.',
      inputSchema: {},
    },
    async () => {
      const t = uploads.create();
      return {
        content: [
          {
            type: 'text',
            text: `Ask the user to open this link (valid ${Math.round(t.ttlMs / 60000)} minutes) and drop the reference image(s), then tell you when done:\n${cfg.publicBaseUrl}/upload/${t.token}\nAfter that, call list_images to find the uploaded ids.`,
          },
        ],
      };
    },
  );

  server.registerTool(
    'list_images',
    {
      title: 'List recent images',
      description: 'Lists recently generated, edited and uploaded images with ids, prompts and links, newest first.',
      inputSchema: { limit: z.number().int().min(1).max(50).default(15) },
      annotations: { readOnlyHint: true },
    },
    async ({ limit }) => {
      const items = await store.list(limit);
      const text = items.length
        ? items
            .map((m) => `${m.id}  ${m.kind}  ${m.createdAt}${m.model ? `  ${m.model}` : ''}${m.prompt ? `\n  prompt: ${m.prompt.slice(0, 120).replace(/\s+/g, ' ')}` : ''}\n  ${fileUrl(cfg, m)}`)
            .join('\n')
        : 'No images yet.';
      return { content: [{ type: 'text', text }] };
    },
  );

  server.registerTool(
    'view_image',
    {
      title: 'View stored image',
      description: 'Shows a preview of a stored image by id.',
      inputSchema: { id: z.string().regex(ID_PATTERN) },
      annotations: { readOnlyHint: true },
    },
    async ({ id }) => {
      const stored = await store.read(id);
      if (!stored) return fail(`No stored image with id ${id}.`);
      return await imageResult(deps, stored.meta, stored.data, `Stored ${stored.meta.kind} image.`);
    },
  );

  return server;
}
