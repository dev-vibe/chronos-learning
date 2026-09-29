import { randomBytes } from 'node:crypto';

/** Short-lived, in-memory upload tokens. A restart invalidates outstanding links, which is fine. */
export class UploadTokens {
  private readonly tokens = new Map<string, number>();
  constructor(readonly ttlMs = 15 * 60_000) {}

  create(): { token: string; ttlMs: number } {
    this.sweep();
    const token = randomBytes(24).toString('base64url');
    this.tokens.set(token, Date.now() + this.ttlMs);
    return { token, ttlMs: this.ttlMs };
  }

  valid(token: string): boolean {
    const exp = this.tokens.get(token);
    if (!exp) return false;
    if (exp < Date.now()) {
      this.tokens.delete(token);
      return false;
    }
    return true;
  }

  private sweep() {
    const now = Date.now();
    for (const [t, exp] of this.tokens) if (exp < now) this.tokens.delete(t);
  }
}
