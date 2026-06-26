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
  return linesToArray(value)
    .map((line) => {
      const [question, ...rest] = line.split("|");
      return { question: question.trim(), answer: rest.join("|").trim() };
    })
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
