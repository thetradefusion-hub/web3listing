import { parseJsonArray } from "@/lib/service-catalog";

export function linesToArray(value: string) {
  return value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function linesToProcessSteps(value: string) {
  return linesToArray(value).map((line) => {
    const [title, ...rest] = line.split("|");
    return { title: title.trim(), description: rest.join("|").trim() || undefined };
  });
}

type FaqItem = { question: string; answer: string };

function pushFaq(faqs: FaqItem[], question: string, answer: string) {
  const q = question.trim();
  const a = answer.trim();
  if (q && a) faqs.push({ question: q, answer: a });
}

/** Parse Q:/A: labeled blocks from bulk FAQ text. */
function parseLabeledFaqs(text: string): FaqItem[] | null {
  const hasLabels = /(?:^|\n)\s*(?:Q|Question)\s*[:\-]/i.test(text);
  if (!hasLabels) return null;

  const faqs: FaqItem[] = [];
  const pairRe =
    /(?:^|\n)\s*(?:Q|Question)\s*[:\-]\s*([\s\S]*?)\n\s*(?:A|Answer)\s*[:\-]\s*([\s\S]*?)(?=(?:\n\s*(?:Q|Question)\s*[:\-])|$)/gi;
  let match: RegExpExecArray | null;
  while ((match = pairRe.exec(text)) !== null) {
    pushFaq(faqs, match[1], match[2]);
  }
  return faqs;
}

/** Blank-line separated: first line = question, remaining lines = answer. */
function parseBlankSeparatedFaqs(text: string): FaqItem[] {
  const faqs: FaqItem[] = [];
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length >= 2) {
      pushFaq(faqs, lines[0], lines.slice(1).join("\n"));
    } else if (lines.length === 1 && lines[0].includes("|")) {
      const [question, ...rest] = lines[0].split("|");
      pushFaq(faqs, question, rest.join("|"));
    }
  }

  return faqs;
}

/** One FAQ per line: Question | answer */
function parsePipeFaqs(text: string): FaqItem[] {
  const faqs: FaqItem[] = [];
  for (const line of linesToArray(text)) {
    if (!line.includes("|")) continue;
    const [question, ...rest] = line.split("|");
    pushFaq(faqs, question, rest.join("|"));
  }
  return faqs;
}

/**
 * Parse bulk FAQ text. Preferred formats (any of these work):
 *
 * Q: How long does it take?
 * A: Usually 3-5 business days.
 *
 * Q: Is approval guaranteed?
 * A: No — final approval depends on the platform.
 *
 * Or blank-line pairs:
 * How long does it take?
 * Usually 3-5 business days.
 *
 * Or one per line: Question | answer
 */
export function linesToFaqs(value: string): FaqItem[] {
  const text = value.replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  const labeled = parseLabeledFaqs(text);
  if (labeled && labeled.length > 0) return labeled;

  // Prefer pipe lines when present so multi-line "Q | A" isn't misread as blank blocks
  if (text.includes("|")) {
    const pipe = parsePipeFaqs(text);
    if (pipe.length > 0) return pipe;
  }

  const blankSeparated = parseBlankSeparatedFaqs(text);
  if (blankSeparated.length > 0) return blankSeparated;

  // Last resort: consecutive lines where odd = question, even = answer
  const lines = linesToArray(text);
  const faqs: FaqItem[] = [];
  for (let i = 0; i + 1 < lines.length; i += 2) {
    pushFaq(faqs, lines[i], lines[i + 1]);
  }
  return faqs;
}

export function normalizeFaqs(value: { question?: string; answer?: string }[] | null | undefined) {
  if (!value?.length) return [];
  return value
    .map((f) => ({
      question: (f.question || "").trim(),
      answer: (f.answer || "").trim(),
    }))
    .filter((f) => f.question && f.answer);
}

export function arrayToLines(value: unknown) {
  return parseJsonArray<string>(value).join("\n");
}

export function processStepsToLines(value: unknown) {
  return parseJsonArray<{ title: string; description?: string }>(value)
    .map((s) => (s.description ? `${s.title} | ${s.description}` : s.title))
    .join("\n");
}

export function faqsToLines(value: unknown) {
  const faqs = parseJsonArray<{ question: string; answer: string }>(value);
  if (!faqs.length) return "";
  return faqs.map((f) => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n");
}
