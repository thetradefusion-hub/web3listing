import { Fragment } from "react";
import DOMPurify from "isomorphic-dompurify";
import { looksLikeHtml } from "@/lib/blog-content";

type Block =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

/** Renders TipTap HTML or legacy markdown-style blog content. */
export function BlogArticleBody({ content }: { content: string }) {
  if (looksLikeHtml(content)) {
    const safe = DOMPurify.sanitize(content, {
      USE_PROFILES: { html: true },
      ADD_ATTR: ["target", "rel"],
    });

    return (
      <div
        className="blog-article-body"
        dangerouslySetInnerHTML={{ __html: safe }}
      />
    );
  }

  const blocks = parseArticleBlocks(content);

  return (
    <div className="blog-article-body space-y-5 sm:space-y-6">
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2
              key={index}
              className="scroll-mt-24 border-b border-border/60 pb-3 pt-4 text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]"
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === "h3") {
          return (
            <h3
              key={index}
              className="scroll-mt-24 pt-2 text-lg font-semibold tracking-tight text-foreground sm:text-xl"
            >
              {block.text}
            </h3>
          );
        }
        if (block.type === "ul") {
          return (
            <ul
              key={index}
              className="list-disc space-y-2 pl-5 text-[15px] leading-7 text-muted-foreground sm:text-base sm:leading-8"
            >
              {block.items.map((item, i) => (
                <li key={i}>
                  <InlineText text={item} />
                </li>
              ))}
            </ul>
          );
        }
        return (
          <p key={index} className="text-[15px] leading-7 text-muted-foreground sm:text-base sm:leading-8">
            <InlineText text={block.text} />
          </p>
        );
      })}
    </div>
  );
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|__[^_]+__)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (
          (part.startsWith("**") && part.endsWith("**")) ||
          (part.startsWith("__") && part.endsWith("__"))
        ) {
          return (
            <strong key={i} className="font-semibold text-foreground">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}

export function parseArticleBlocks(content: string): Block[] {
  const normalized = content.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const lines = normalized.split("\n");
  const blocks: Block[] = [];
  let paragraph: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    const text = paragraph.join(" ").replace(/\s+/g, " ").trim();
    paragraph = [];
    if (text) blocks.push({ type: "p", text });
  };

  const flushList = () => {
    if (listItems.length) {
      blocks.push({ type: "ul", items: listItems });
      listItems = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      flushParagraph();
      continue;
    }

    const h2 = trimmed.match(/^##\s+(.+)$/);
    if (h2) {
      flushList();
      flushParagraph();
      blocks.push({ type: "h2", text: h2[1].trim() });
      continue;
    }

    const h3 = trimmed.match(/^###\s+(.+)$/);
    if (h3) {
      flushList();
      flushParagraph();
      blocks.push({ type: "h3", text: h3[1].trim() });
      continue;
    }

    const bullet = trimmed.match(/^[-*•]\s+(.+)$/) || trimmed.match(/^\d+[\.)]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      listItems.push(bullet[1].trim());
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushList();
  flushParagraph();
  return blocks;
}
