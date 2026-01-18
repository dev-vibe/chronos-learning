/**
 * Utility functions for handling image URLs in the application.
 * 
 * Local images should be placed in the `public/` folder and referenced
 * with paths starting with `/` (e.g., `/images/foundations/bronze_smith.jpg`).
 * Vite automatically serves files from `public/` at the root path.
 * 
 * External URLs (starting with http:// or https://) are used as-is.
 */

/**
 * Default fallback image URL (globe/earth image used across the app)
 */
export const DEFAULT_FALLBACK_IMAGE = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop";

/**
 * Normalizes an image URL for use in the application.
 * 
 * - Paths starting with `/` are treated as local assets (served from public/)
 * - Paths starting with `http://` or `https://` are treated as external URLs
 * - Empty or undefined URLs return undefined
 * 
 * @param imageUrl - The image URL to normalize
 * @returns The normalized image URL, or undefined if input is empty/undefined
 */
export function normalizeImageUrl(imageUrl?: string): string | undefined {
  if (!imageUrl) {
    return undefined;
  }

  // External URLs (http/https) are used as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Local paths starting with / are served from public/ by Vite
  if (imageUrl.startsWith('/')) {
    return imageUrl;
  }

  // If it doesn't start with / or http(s), assume it's a local path and add /
  // This handles cases where someone forgets the leading slash
  return `/${imageUrl}`;
}

/**
 * Gets an image URL with a fallback.
 * 
 * @param imageUrl - The primary image URL
 * @param fallbackUrl - Optional custom fallback image URL (defaults to DEFAULT_FALLBACK_IMAGE)
 * @returns The normalized image URL or fallback
 */
export function getImageUrlWithFallback(
  imageUrl?: string,
  fallbackUrl?: string
): string {
  const normalized = normalizeImageUrl(imageUrl);
  if (normalized) {
    return normalized;
  }
  return fallbackUrl || DEFAULT_FALLBACK_IMAGE;
}
