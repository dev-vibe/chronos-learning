import assert from 'node:assert/strict';
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { after, before, test } from 'node:test';
import { mkdtemp } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';
import sharp from 'sharp';
import { createApp } from '../src/app.ts';
import { loadConfig } from '../src/config.ts';

const SECRET = 'test-secret-test-secret-test-secret';
let fakeOpenAI: Server;
let app: Server;
let base: string;
let png: Buffer;
const seen: { path: string; contentType: string; body: string }[] = [];

async function listen(s: Server) {
  await new Promise<void>((r) => s.listen(0, '127.0.0.1', r));
  return `http://127.0.0.1:${(s.address() as AddressInfo).port}`;
}

before(async () => {
  png = await sharp({ create: { width: 64, height: 48, channels: 3, background: '#cc8844' } }).png().toBuffer();
  fakeOpenAI = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      seen.push({ path: req.url!, contentType: req.headers['content-type'] ?? '', body: Buffer.concat(chunks).toString('latin1') });
      if (req.headers.authorization !== 'Bearer sk-test') {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: { message: 'bad key' } }));
      }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ data: [{ b64_json: png.toString('base64') }] }));
    });
  });
  const openaiUrl = await listen(fakeOpenAI);
  const dataDir = await mkdtemp(path.join(os.tmpdir(), 'chronos-image-mcp-'));
  app = createApp(
    loadConfig({
      OPENAI_API_KEY: 'sk-test',
      OPENAI_BASE_URL: openaiUrl,
      CONNECTOR_SECRET: SECRET,
      PUBLIC_BASE_URL: 'http://placeholder',
      DATA_DIR: dataDir,
      ALLOW_INSECURE_REFERENCE_URLS: '1',
    }),
  );
  base = await listen(app);
});

after(() => {
  fakeOpenAI.close();
  app.close();
});

async function connect(): Promise<Client> {
  const client = new Client({ name: 'test', version: '0' });
  await client.connect(new StreamableHTTPClientTransport(new URL(`${base}/mcp/${SECRET}`)));
  return client;
}

test('rejects a wrong secret', async () => {
  const r = await fetch(`${base}/mcp/wrong`, { method: 'POST', body: '{}' });
  assert.equal(r.status, 401);
});

test('lists the tools', async () => {
  const client = await connect();
  const names = (await client.listTools()).tools.map((t) => t.name).sort();
  assert.deepEqual(names, ['create_upload_link', 'edit_image', 'generate_image', 'list_images', 'view_image']);
  await client.close();
});

test('generate → view file → edit using its id → list', async () => {
  const client = await connect();
  const gen = await client.callTool({ name: 'generate_image', arguments: { prompt: 'a bronze age harbor', tier: 'draft', size: '1536x1024' } });
  assert.ok(!gen.isError, JSON.stringify(gen));
  const content = gen.content as { type: string; text?: string; mimeType?: string }[];
  assert.equal(content[0].type, 'image');
  assert.equal(content[0].mimeType, 'image/jpeg');
  const text = content[1].text!;
  const id = /id: ([a-f0-9]{32})/.exec(text)![1];
  const g = seen.at(-1)!;
  assert.equal(g.path, '/images/generations');
  assert.match(g.body, /"model":"gpt-image-2.5-flare"/);
  assert.match(g.body, /"size":"1536x1024"/);

  const file = await fetch(`${base}/files/${id}.png`);
  assert.equal(file.status, 200);
  assert.equal(file.headers.get('content-type'), 'image/png');

  const edit = await client.callTool({ name: 'edit_image', arguments: { prompt: 'same scene at dusk', reference_image_ids: [id] } });
  assert.ok(!edit.isError, JSON.stringify(edit));
  const e = seen.at(-1)!;
  assert.equal(e.path, '/images/edits');
  assert.match(e.contentType, /multipart\/form-data/);
  assert.match(e.body, /name="image\[\]"/);
  assert.match(e.body, /gpt-image-2.5-sunburst/);

  const list = await client.callTool({ name: 'list_images', arguments: {} });
  assert.match((list.content as { text: string }[])[0].text, new RegExp(id));
  await client.close();
});

test('edit_image without references explains the upload path', async () => {
  const client = await connect();
  const r = await client.callTool({ name: 'edit_image', arguments: { prompt: 'x' } });
  assert.equal(r.isError, true);
  assert.match((r.content as { text: string }[])[0].text, /create_upload_link/);
  await client.close();
});

test('upload link → upload → edit with uploaded id; expired/invalid tokens are refused', async () => {
  const client = await connect();
  const link = await client.callTool({ name: 'create_upload_link', arguments: {} });
  const uploadUrl = /(http:\/\/placeholder)(\/upload\/[\w-]+)/.exec((link.content as { text: string }[])[0].text)!;
  const page = await fetch(base + uploadUrl[2]);
  assert.equal(page.status, 200);
  const up = await fetch(base + uploadUrl[2], { method: 'POST', headers: { 'Content-Type': 'image/png' }, body: new Uint8Array(png) });
  assert.equal(up.status, 200);
  const { id } = (await up.json()) as { id: string };
  const bad = await fetch(base + uploadUrl[2], { method: 'POST', body: 'not an image' });
  assert.equal(bad.status, 400);
  assert.equal((await fetch(`${base}/upload/nope`)).status, 404);
  const edit = await client.callTool({ name: 'edit_image', arguments: { prompt: 'restyle', reference_image_ids: [id] } });
  assert.ok(!edit.isError, JSON.stringify(edit));
  await client.close();
});

test('edit_image accepts a reference URL', async () => {
  const refServer = createServer((_q, r) => {
    r.writeHead(200, { 'Content-Type': 'image/png' });
    r.end(png);
  });
  const refUrl = await listen(refServer);
  const client = await connect();
  const r = await client.callTool({ name: 'edit_image', arguments: { prompt: 'use this', reference_image_urls: [`${refUrl}/a.png`] } });
  assert.ok(!r.isError, JSON.stringify(r));
  await client.close();
  refServer.close();
});
