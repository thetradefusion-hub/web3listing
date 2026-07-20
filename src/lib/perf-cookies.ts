/** Cookie names used for faster repeat visits (theme, cache versions, returning visitor). */
export const PERF_COOKIES = {
  theme: "w3l_theme",
  catalogVersion: "w3l_cat",
  returning: "w3l_returning",
} as const;

/** Bump when public catalog cache shape changes (sync with public-catalog-cache). */
export const CATALOG_CACHE_VERSION = "v2";

export const catalogVersionCookieName = PERF_COOKIES.catalogVersion;

export type ThemeCookie = "light" | "dark" | "system";

export const PERF_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export function isThemeCookie(value: string | undefined): value is ThemeCookie {
  return value === "light" || value === "dark" || value === "system";
}
