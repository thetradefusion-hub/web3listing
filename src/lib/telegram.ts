export const DEFAULT_MANAGER_TELEGRAM_USERNAME = "blackbox1920";

export function buildTelegramLink(usernameOrLink?: string | null): string {
  const fallback = `https://t.me/${encodeURIComponent(DEFAULT_MANAGER_TELEGRAM_USERNAME)}`;
  if (!usernameOrLink?.trim()) return fallback;

  const value = usernameOrLink.trim();

  if (/^https?:\/\//i.test(value)) {
    return fixTelegramMeUrl(value);
  }

  const username = value.replace(/^@+/, "");
  return `https://t.me/${encodeURIComponent(username)}`;
}

function fixTelegramMeUrl(url: string): string {
  const match = url.match(/^(https?:\/\/(?:www\.)?t\.me\/)([^/?#]+)/i);
  if (!match) return url;

  const [, base, slug] = match;
  if (slug.includes("@") && !slug.includes("%40")) {
    return `${base}${encodeURIComponent(slug.replace(/^@+/, ""))}`;
  }

  return url;
}
