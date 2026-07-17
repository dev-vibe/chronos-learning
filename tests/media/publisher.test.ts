import { createHash } from 'node:crypto';
import { describe, expect, it, vi } from 'vitest';
import {
  publishMedia,
  type Manifest,
  type StorageBoundary,
  type StorageDownload,
  type UploadOptions,
} from '../../scripts/media/publisher';

const ownedBytes = new TextEncoder().encode('Chronos-owned synthetic media fixture');
const otherBytes = new TextEncoder().encode('different bytes');
const digest = (bytes: Uint8Array) => createHash('sha256').update(bytes).digest('hex');
const objectData = (bytes: Uint8Array) => ({
  arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer,
});

const manifest: Manifest = {
  assets: [{
    id: 'media.test.owned',
    source: { bucket: 'media-source', objectKey: 'test/source.png', mimeType: 'image/png', sha256: digest(ownedBytes) },
    locator: {
      bucket: 'media-public',
      variants: [{ objectKey: 'test/480w.webp', mimeType: 'image/webp', sha256: digest(ownedBytes) }],
    },
  }],
};

function createStorage(responses: Record<string, StorageDownload> = {}) {
  const download = vi.fn(async (bucket: string, objectKey: string): Promise<StorageDownload> => responses[`${bucket}/${objectKey}`] ?? { data: null, error: { statusCode: '404' } });
  const upload = vi.fn(async (_bucket: string, _objectKey: string, _bytes: Uint8Array, _options: UploadOptions) => ({ error: null }));
  const boundary: StorageBoundary = {
    from(bucket) {
      return {
        download: (objectKey) => download(bucket, objectKey),
        upload: (objectKey, bytes, options) => upload(bucket, objectKey, bytes, options),
      };
    },
  };
  return { boundary, download, upload };
}

const approved = [{ id: 'media.test.owned', reviewStatus: 'approved' }];
const unapproved = [{ id: 'media.test.owned', reviewStatus: 'provenance-review-required' }];
const readBytes = vi.fn(async () => ownedBytes);

function options(storage: StorageBoundary, overrides: Partial<Parameters<typeof publishMedia>[0]> = {}) {
  return {
    media: approved,
    manifest,
    storage,
    readBytes,
    log: vi.fn(),
    ...overrides,
  };
}

describe('media publisher trust boundary', () => {
  it('rejects unapproved public publication before touching Storage', async () => {
    const storage = createStorage();
    await expect(publishMedia(options(storage.boundary, { media: unapproved }))).rejects.toThrow(/Publication blocked.*media\.test\.owned/);
    expect(storage.download).not.toHaveBeenCalled();
    expect(storage.upload).not.toHaveBeenCalled();
  });

  it('permits private source-only ingestion for an unapproved asset', async () => {
    const storage = createStorage();
    await publishMedia(options(storage.boundary, { media: unapproved, sourcesOnly: true }));
    expect(storage.download).toHaveBeenCalledTimes(1);
    expect(storage.download).toHaveBeenCalledWith('media-source', 'test/source.png');
    expect(storage.upload).toHaveBeenCalledTimes(1);
    expect(storage.upload.mock.calls[0][0]).toBe('media-source');
  });

  it('uploads missing source and derivative objects immutably', async () => {
    const storage = createStorage();
    await publishMedia(options(storage.boundary));
    expect(storage.upload).toHaveBeenCalledTimes(2);
    for (const call of storage.upload.mock.calls) expect(call[3]).toMatchObject({ upsert: false });
  });

  it('verifies a matching existing object without uploading it', async () => {
    const storage = createStorage({
      'media-source/test/source.png': { data: objectData(ownedBytes), error: null },
    });
    const log = vi.fn();
    await publishMedia(options(storage.boundary, { sourcesOnly: true, log }));
    expect(storage.upload).not.toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith('verified media-source/test/source.png');
  });

  it('rejects an existing object whose hash differs from the immutable manifest', async () => {
    const storage = createStorage({
      'media-source/test/source.png': { data: objectData(otherBytes), error: null },
    });
    await expect(publishMedia(options(storage.boundary, { sourcesOnly: true }))).rejects.toThrow(/does not match its immutable manifest hash/);
    expect(storage.upload).not.toHaveBeenCalled();
  });

  it('propagates non-404 download errors without attempting an upload', async () => {
    const forbidden = { statusCode: '403', message: 'forbidden' };
    const storage = createStorage({
      'media-source/test/source.png': { data: null, error: forbidden },
    });
    await expect(publishMedia(options(storage.boundary, { sourcesOnly: true }))).rejects.toBe(forbidden);
    expect(storage.upload).not.toHaveBeenCalled();
  });

  it('fails verify-only mode when a remote object is missing', async () => {
    const storage = createStorage();
    await expect(publishMedia(options(storage.boundary, { sourcesOnly: true, verifyOnly: true }))).rejects.toThrow('Missing remote media object media-source/test/source.png');
    expect(storage.upload).not.toHaveBeenCalled();
  });
});
