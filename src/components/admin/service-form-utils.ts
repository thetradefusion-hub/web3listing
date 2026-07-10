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

const NUMBERED_LINE = /^\s*(\d+)[\.\)]\s*(.*)$/;

function pushFaq(faqs: FaqItem[], question: string, answer: string) {
  const q = question.replace(/^\s+|\s+$/g, "").replace(/[ \t]+\n/g, "\n");
  const a = answer.replace(/^\s+|\s+$/g, "").replace(/[ \t]+\n/g, "\n");
  if (q && a) faqs.push({ question: q, answer: a });
}

/** Turn inline "team.2.Will...developers.3.How" into real line breaks before numbered questions. */
export function normalizeNumberedFaqText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    // "audit team.2.Will" or "team. 2.Will" → newline before the number
    .replace(/([.!?])\s*(?=\d+[\.\)]\s*[A-Za-z])/g, "$1\n")
    // "support?2.Next" without space
    .replace(/([.?!:])(?=\d+[\.\)]\s*[A-Za-z])/g, "$1\n")
    // After a full answer sentence ending then "2.Question" with only spaces
    .replace(/([a-z0-9)])\s+(?=\d+[\.\)]\s*[A-Z])/g, "$1\n");
}

function splitQuestionAnswer(firstLine: string, restText: string): FaqItem | null {
  const rest = restText.replace(/^\n+/, "").replace(/\n+$/, "");
  if (rest.trim()) {
    // If "Question? Answer..." is still on the first line, split it
    const qMark = firstLine.indexOf("?");
    if (qMark > 0 && qMark < firstLine.length - 1) {
      const question = firstLine.slice(0, qMark + 1).trim();
      const sameLineAnswer = firstLine.slice(qMark + 1).trim();
      const answer = [sameLineAnswer, rest].filter(Boolean).join("\n").trim();
      if (question && answer) return { question, answer };
    }
    return { question: firstLine.trim(), answer: rest };
  }

  // Same-line: "Question? Answer continues here"
  const qMark = firstLine.indexOf("?");
  if (qMark > 0 && qMark < firstLine.length - 1) {
    const question = firstLine.slice(0, qMark + 1).trim();
    const answer = firstLine.slice(qMark + 1).trim();
    if (question && answer) return { question, answer };
  }

  return null;
}

/**
 * Numbered list FAQs (most common admin paste):
 *
 * 1. Is approval guaranteed?
 * No. Final approval depends on the auditor.
 * 2. How long does it take?
 * Typically 2 days to 2 weeks.
 */
function parseNumberedFaqs(text: string): FaqItem[] | null {
  const normalized = normalizeNumberedFaqText(text);
  const lines = normalized.split("\n");
  const starts: number[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (NUMBERED_LINE.test(lines[i]) && lines[i].replace(NUMBERED_LINE, "$2").trim()) {
      starts.push(i);
    }
  }

  if (starts.length === 0) return null;

  const faqs: FaqItem[] = [];
  for (let s = 0; s < starts.length; s++) {
    const start = starts[s];
    const end = s + 1 < starts.length ? starts[s + 1] : lines.length;
    const match = lines[start].match(NUMBERED_LINE);
    if (!match) continue;

    const firstLine = match[2].trim();
    const restText = lines.slice(start + 1, end).join("\n");
    const item = splitQuestionAnswer(firstLine, restText);
    if (item) pushFaq(faqs, item.question, item.answer);
  }

  return faqs.length > 0 ? faqs : null;
}

function hasNumberedFaqMarkers(text: string): boolean {
  return /(?:^|[\n.!?])\s*\d+[\.\)]\s*[A-Za-z]/.test(text) || /^\s*\d+[\.\)]\s*[A-Za-z]/.test(text);
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

/** Blank-line / --- separated FAQ blocks. First line = question, rest = answer. */
function parseBlankSeparatedFaqs(text: string): FaqItem[] {
  const faqs: FaqItem[] = [];
  const blocks = text
    .split(/\n\s*---\s*\n|\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  for (const block of blocks) {
    const rawLines = block.split("\n");
    const firstIdx = rawLines.findIndex((l) => l.trim());
    if (firstIdx < 0) continue;
    const question = rawLines[firstIdx].trim();
    const answer = rawLines
      .slice(firstIdx + 1)
      .join("\n")
      .replace(/^\n+/, "")
      .replace(/\n+$/, "");
    if (question && answer.trim()) {
      pushFaq(faqs, question, answer);
    } else if (question.includes("|")) {
      const [q, ...rest] = question.split("|");
      pushFaq(faqs, q, rest.join("|"));
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
 * Parse bulk FAQ text. Supported formats:
 *
 * 1. Question one?
 * Answer one
 * 2. Question two?
 * Answer two
 *
 * Q: Question
 * A: Answer
 *
 * Question
 * Answer
 * (blank line between FAQs)
 *
 * Question | answer
 */
export function linesToFaqs(value: string): FaqItem[] {
  const text = value.replace(/\r\n/g, "\n").trim();
  if (!text) return [];

  const numbered = parseNumberedFaqs(text);
  if (numbered && numbered.length > 0) return numbered;

  const labeled = parseLabeledFaqs(text);
  if (labeled && labeled.length > 0) return labeled;

  if (text.includes("|")) {
    const pipe = parsePipeFaqs(text);
    if (pipe.length > 0) return pipe;
  }

  const blankSeparated = parseBlankSeparatedFaqs(text);
  if (blankSeparated.length > 0) return blankSeparated;

  const lines = linesToArray(text);
  const faqs: FaqItem[] = [];
  for (let i = 0; i + 1 < lines.length; i += 2) {
    pushFaq(faqs, lines[i], lines[i + 1]);
  }
  return faqs;
}

/** Fix already-saved FAQs that were mashed into one item from a numbered list paste. */
export function expandFaqs(
  value: { question?: string; answer?: string }[] | null | undefined
): FaqItem[] {
  const faqs = normalizeFaqs(value);
  if (faqs.length === 0) return [];

  // Prefer repairing mashed single blobs (common after bulk paste)
  if (faqs.length === 1) {
    const combined = `${faqs[0].question}\n${faqs[0].answer}`;
    if (hasNumberedFaqMarkers(combined)) {
      const repaired = parseNumberedFaqs(
        /^\s*\d+[\.\)]/.test(faqs[0].question.trim()) ? combined : `1. ${combined}`
      );
      if (repaired && repaired.length > 1) return repaired;
    }

    const reparsed = linesToFaqs(combined);
    if (reparsed.length > 1) return reparsed;
  }

  // Also repair if any answer still contains inline numbered questions
  const needsRepair = faqs.some(
    (f) => hasNumberedFaqMarkers(f.answer) && /\d+[\.\)]\s*[A-Za-z]/.test(f.answer)
  );
  if (needsRepair) {
    const combined = faqs.map((f) => `${f.question}\n${f.answer}`).join("\n");
    const repaired = parseNumberedFaqs(
      /^\s*\d+[\.\)]/.test(combined) ? combined : `1. ${combined}`
    );
    if (repaired && repaired.length > faqs.length) return repaired;
  }

  return faqs;
}

export function normalizeFaqs(value: { question?: string; answer?: string }[] | null | undefined) {
  if (!value?.length) return [];
  return value
    .map((f) => ({
      question: (f.question || "").replace(/^\s+|\s+$/g, "").replace(/\n{2,}/g, "\n"),
      answer: (f.answer || "")
        .replace(/^\s+|\s+$/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .replace(/[ \t]+\n/g, "\n"),
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
  const faqs = expandFaqs(parseJsonArray<{ question: string; answer: string }>(value));
  if (!faqs.length) return "";
  return faqs
    .map((f, i) => `${i + 1}. ${f.question}\n${f.answer}`)
    .join("\n\n");
}
