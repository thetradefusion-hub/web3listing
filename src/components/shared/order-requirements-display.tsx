import { parseOrderRequirements } from "@/lib/service-requirements";

export function OrderRequirementsDisplay({
  requirements,
}: {
  requirements: string | null | undefined;
}) {
  const parsed = parseOrderRequirements(requirements);

  if (!parsed) {
    return <p className="text-sm text-muted-foreground">No requirements submitted.</p>;
  }

  if (parsed.kind === "legacy") {
    return <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{parsed.text}</p>;
  }

  const entries = Object.entries(parsed.responses).filter(([, value]) => value?.trim());

  return (
    <div className="flex flex-col gap-3">
      {entries.length > 0 ? (
        <dl className="grid gap-2 sm:grid-cols-2">
          {entries.map(([label, value]) => (
            <div key={label} className="rounded-xl border border-border bg-muted/15 px-3.5 py-3">
              <dt className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{label}</dt>
              <dd className="mt-1 break-words text-sm text-foreground">{value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
      {parsed.notes ? (
        <div className="rounded-xl border border-border bg-muted/15 px-3.5 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Additional notes</p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">{parsed.notes}</p>
        </div>
      ) : null}
    </div>
  );
}
