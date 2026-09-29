import { timingSafeEqual } from 'node:crypto';
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { Config } from './config.ts';
import { OpenAIImages } from './openai.ts';
import { ImageStore, MIME_BY_EXT, sniffExt } from './storage.ts';
import { buildServer } from './tools.ts';
import { UploadTokens } from './uploads.ts';

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

function send(res: ServerResponse, status: number, body: string | Buffer, headers: Record<string, string> = {}) {
  res.writeHead(status, { 'Cache-Control': 'no-store', ...headers });
  res.end(body);
}

async function readBody(req: IncomingMessage, limit: number): Promise<Buffer> {
  const chunks: Buffer[] = [];
  let size = 0;
  for await (const chunk of req) {
    size += (chunk as Buffer).length;
    if (size > limit) throw Object.assign(new Error('Body too large'), { status: 413 });
    chunks.push(chunk as Buffer);
  }
  return Buffer.concat(chunks);
}

const UPLOAD_PAGE = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Upload reference images</title>
<style>body{font:16px system-ui;max-width:32rem;margin:2rem auto;padding:0 1rem}#drop{border:2px dashed #888;border-radius:12px;padding:2rem;text-align:center}
li{margin:.5rem 0;word-break:break-all}.err{color:#b00020}</style>
<h1>Upload reference images</h1>
<p>Choose or drop PNG, JPEG or WebP files, then tell Claude you're done.</p>
<div id="drop"><input id="f" type="file" accept="image/png,image/jpeg,image/webp" multiple></div>
<ul id="out"></ul>
<script>
const out=document.getElementById('out');
async function up(file){
  const li=document.createElement('li');li.textContent=file.name+' …';out.append(li);
  try{
    const r=await fetch(location.pathname,{method:'POST',headers:{'Content-Type':file.type},body:file});
    const j=await r.json();
    if(!r.ok)throw new Error(j.error||r.status);
    li.textContent=file.name+' → uploaded (id '+j.id+')';
  }catch(e){li.className='err';li.textContent=file.name+' failed: '+e.message}
}
const f=document.getElementById('f');
f.addEventListener('change',()=>[...f.files].forEach(up));
const d=document.getElementById('drop');
d.addEventListener('dragover',e=>e.preventDefault());
d.addEventListener('drop',e=>{e.preventDefault();[...e.dataTransfer.files].forEach(up)});
</script>`;

export function createApp(cfg: Config): Server {
  const store = new ImageStore(cfg.dataDir);
  const openai = new OpenAIImages(cfg);
  const uploads = new UploadTokens();
  const deps = { cfg, store, openai, uploads };

  return createServer(async (req, res) => {
    try {
      const url = new URL(req.url ?? '/', 'http://local');
      const p = url.pathname;

      if (p === '/healthz') return send(res, 200, 'ok');

      // MCP endpoint. Authless connector: the secret is a path segment. A Bearer header also works for other clients.
      const mcpMatch = /^\/mcp(?:\/([^/]+))?$/.exec(p);
      if (mcpMatch) {
        const bearer = /^Bearer (.+)$/.exec(req.headers.authorization ?? '')?.[1] ?? '';
        const presented = mcpMatch[1] ?? bearer;
        if (!presented || !safeEqual(presented, cfg.connectorSecret)) return send(res, 401, 'Unauthorized');
        if (req.method !== 'POST') return send(res, 405, 'Method not allowed', { Allow: 'POST' });
        const body = JSON.parse((await readBody(req, 1024 * 1024)).toString('utf8'));
        const server = buildServer(deps);
        const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
        res.on('close', () => {
          void transport.close();
          void server.close();
        });
        await server.connect(transport);
        return await transport.handleRequest(req, res, body);
      }

      const fileMatch = /^\/files\/([a-f0-9]{32})\.(png|jpg|webp)$/.exec(p);
      if (fileMatch && req.method === 'GET') {
        const stored = await store.read(fileMatch[1]);
        if (!stored || stored.meta.ext !== fileMatch[2]) return send(res, 404, 'Not found');
        return send(res, 200, stored.data, {
          'Content-Type': MIME_BY_EXT[stored.meta.ext],
          'Cache-Control': 'private, max-age=31536000, immutable',
        });
      }

      const uploadMatch = /^\/upload\/([A-Za-z0-9_-]+)$/.exec(p);
      if (uploadMatch) {
        if (!uploads.valid(uploadMatch[1])) return send(res, 404, 'This upload link has expired. Ask Claude for a new one.');
        if (req.method === 'GET') return send(res, 200, UPLOAD_PAGE, { 'Content-Type': 'text/html; charset=utf-8' });
        if (req.method === 'POST') {
          const data = await readBody(req, cfg.maxReferenceBytes);
          if (!sniffExt(data)) return send(res, 400, JSON.stringify({ error: 'Not a PNG, JPEG or WebP image' }), { 'Content-Type': 'application/json' });
          const meta = await store.save(data, { kind: 'uploaded' });
          return send(res, 200, JSON.stringify({ id: meta.id }), { 'Content-Type': 'application/json' });
        }
      }

      return send(res, 404, 'Not found');
    } catch (e) {
      const status = (e as { status?: number }).status ?? (e instanceof SyntaxError ? 400 : 500);
      if (!res.headersSent) send(res, status, JSON.stringify({ error: status === 500 ? 'Internal error' : (e as Error).message }), { 'Content-Type': 'application/json' });
      if (status === 500) console.error(e);
    }
  });
}

