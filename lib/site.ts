/**
 * Single source of truth for the production domain.
 * Everything that needs an absolute URL (metadata, JSON-LD, sitemap, robots,
 * registry install commands) reads it from here — change the domain in one place.
 */
export const SITE_DOMAIN = "localhostui.com";
export const SITE_URL = `https://${SITE_DOMAIN}`;

/** Absolute URL for a path on the production site. */
export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`.replace(/\/$/, "") || SITE_URL;
}
