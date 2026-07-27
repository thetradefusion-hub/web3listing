import { DISCLAIMER_PARAGRAPHS } from "@/lib/home-content";

export function HomeDisclaimer() {
  return (
    <section className="landing-surface-deep border-t border-border py-8 sm:py-12">
      <div className="landing-container">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:tracking-[0.2em]">
            Disclaimer
          </p>
          <div className="mt-3 space-y-3 text-xs leading-relaxed text-muted-foreground sm:mt-4 sm:space-y-3.5 sm:text-sm">
            {DISCLAIMER_PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 48)}>{paragraph}</p>
            ))}
          </div>
          <p className="mt-5 text-sm font-semibold text-foreground/80 sm:mt-6">
            Web3Listing.com — Your Web3 Growth Marketplace
          </p>
        </div>
      </div>
    </section>
  );
}
