/** Detect TipTap / HTML article content vs plain markdown/text. */
export function looksLikeHtml(content: string) {
  const trimmed = content.trim();
  if (!trimmed) return false;
  return /^<[a-z][\s\S]*>/i.test(trimmed) || /<\/(p|h2|h3|ul|ol|li|blockquote|div)>/i.test(trimmed);
}

/** Convert simple markdown-style blog content into HTML for the rich editor. */
export function markdownToHtml(content: string) {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (!normalized) return "<p></p>";

  const lines = normalized.split("\n");
  const parts: string[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];
  let listTag: "ul" | "ol" | null = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    const text = escapeHtml(paragraph.join(" ").replace(/\s+/g, " ").trim());
    paragraph = [];
    if (text) parts.push(`<p>${inlineMarkdown(text)}</p>`);
  };

  const flushList = () => {
    if (!listTag || !listItems.length) {
      listItems = [];
      listTag = null;
      return;
    }
    parts.push(
      `<${listTag}>${listItems.map((i) => `<li>${inlineMarkdown(escapeHtml(i))}</li>`).join("")}</${listTag}>`
    );
    listItems = [];
    listTag = null;
  };

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) {
      flushList();
      flushParagraph();
      continue;
    }

    const h2 = trimmed.match(/^##\s+(.+)$/);
    if (h2) {
      flushList();
      flushParagraph();
      parts.push(`<h2>${inlineMarkdown(escapeHtml(h2[1].trim()))}</h2>`);
      continue;
    }

    const h3 = trimmed.match(/^###\s+(.+)$/);
    if (h3) {
      flushList();
      flushParagraph();
      parts.push(`<h3>${inlineMarkdown(escapeHtml(h3[1].trim()))}</h3>`);
      continue;
    }

    const ol = trimmed.match(/^\d+[\.)]\s+(.+)$/);
    if (ol) {
      flushParagraph();
      if (listTag && listTag !== "ol") flushList();
      listTag = "ol";
      listItems.push(ol[1].trim());
      continue;
    }

    const ul = trimmed.match(/^[-*•]\s+(.+)$/);
    if (ul) {
      flushParagraph();
      if (listTag && listTag !== "ul") flushList();
      listTag = "ul";
      listItems.push(ul[1].trim());
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushList();
  flushParagraph();
  return parts.join("") || "<p></p>";
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function inlineMarkdown(escaped: string) {
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}
