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

export function linesToFaqs(value: string) {
  const lines = linesToArray(value);
  const faqs: { question: string; answer: string }[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("|")) {
      const [question, ...rest] = line.split("|");
      const answer = rest.join("|").trim();
      if (question.trim() && answer) {
        faqs.push({ question: question.trim(), answer });
      }
      continue;
    }

    // Support "Question?" on one line and answer on the next
    const next = lines[i + 1];
    if (line.endsWith("?") && next && !next.endsWith("?") && !next.includes("|")) {
      faqs.push({ question: line, answer: next });
      i += 1;
      continue;
    }

    // Support "Question? Answer on same line"
    const qMark = line.indexOf("?");
    if (qMark > 0 && qMark < line.length - 1) {
      const question = line.slice(0, qMark + 1).trim();
      const answer = line.slice(qMark + 1).trim();
      if (question && answer) faqs.push({ question, answer });
    }
  }

  return faqs;
}

export function normalizeFaqs(
  value: { question?: string; answer?: string }[] | null | undefined
) {
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
  return parseJsonArray<{ question: string; answer: string }>(value)
    .map((f) => `${f.question} | ${f.answer}`)
    .join("\n");
}
