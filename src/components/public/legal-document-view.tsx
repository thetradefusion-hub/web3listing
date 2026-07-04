import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import type { LegalDocument } from "@/lib/legal-content";
import { PROJECT_LEGAL_POLICIES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function LegalDocumentView({ document }: { document: LegalDocument }) {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Button variant="ghost" size="sm" className="mb-6 rounded-xl" asChild>
        <Link href="/">
          <ArrowLeft data-icon="inline-start" />
          Home
        </Link>
      </Button>

      <Card className="gap-0 overflow-hidden border-border/80 py-0 shadow-sm">
        <div className="border-b border-border/80 bg-gradient-to-br from-primary/5 via-card to-muted/20 px-6 py-8 sm:px-8">
          <div className="flex items-start gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
              <FileText className="size-5" strokeWidth={2.25} />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">{document.site}</p>
              <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{document.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">Last Updated: {document.lastUpdated}</p>
            </div>
          </div>
        </div>

        <CardContent className="flex flex-col gap-8 p-6 sm:p-8">
          {document.sections.map((section) => (
            <section key={section.number} id={`section-${section.number}`} className="scroll-mt-24">
              <h2 className="text-base font-bold text-foreground sm:text-lg">
                <span className="text-primary">{section.number}.</span> {section.title}
              </h2>

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {paragraph}
                </p>
              ))}

              {section.bullets ? (
                <ul className="mt-3 flex flex-col gap-2">
                  {section.bullets.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base"
                    >
                      <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              ) : null}

              {section.groups ? (
                <div className="mt-4 flex flex-col gap-4">
                  {section.groups.map((group) => (
                    <div key={group.title}>
                      <h3 className="text-sm font-semibold text-foreground">{group.title}</h3>
                      <ul className="mt-2 flex flex-col gap-2">
                        {group.bullets.map((item) => (
                          <li
                            key={item}
                            className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground sm:text-base"
                          >
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" aria-hidden />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}

              {section.closing ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">{section.closing}</p>
              ) : null}
            </section>
          ))}
        </CardContent>
      </Card>

      <nav
        aria-label="Related policies"
        className="mt-6 flex flex-wrap gap-2"
      >
        {PROJECT_LEGAL_POLICIES.map((policy) => (
          <Link
            key={policy.href}
            href={policy.href}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              policy.href === `/legal/${document.slug}`
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30 hover:text-primary"
            )}
          >
            {policy.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
