import { lookup } from 'node:dns/promises';
import net from 'node:net';

function isPrivate(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split('.').map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
  }
  const v = ip.toLowerCase();
  if (v.startsWith('::ffff:')) return isPrivate(v.slice(7));
  return v === '::1' || v === '::' || v.startsWith('fc') || v.startsWith('fd') || v.startsWith('fe80');
}

/** Fetch a reference image over HTTPS, refusing private/internal addresses and oversized bodies. */
export async function fetchReferenceImage(url: string, maxBytes: number, allowInsecure = false): Promise<Buffer> {
  const u = new URL(url);
  if (u.protocol !== 'https:' && !(allowInsecure && u.protocol === 'http:')) throw new Error(`Reference URL must be https: ${url}`);
  if (!allowInsecure) {
    const addrs = await lookup(u.hostname, { all: true });
    if (addrs.some((a) => isPrivate(a.address))) throw new Error(`Reference URL resolves to a private address: ${u.hostname}`);
  }
  const res = await fetch(u, { redirect: 'error', signal: AbortSignal.timeout(30_000) });
  if (!res.ok) throw new Error(`Could not fetch reference image (${res.status}): ${url}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length > maxBytes) throw new Error(`Reference image is larger than ${maxBytes} bytes: ${url}`);
  return buf;
}
