import mediaManifest from '../media/generated/chronos-media.json';
import { MediaLocatorSchema } from '../../src/domains/contracts';

export const mediaLocator = (id: string) => {
  const entry = mediaManifest.assets.find((asset) => asset.id === id);
  if (!entry) throw new Error(`Missing generated media locator for ${id}`);
  return MediaLocatorSchema.parse(entry.locator);
};
