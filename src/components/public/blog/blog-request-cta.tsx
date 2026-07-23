import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BlogRequestCta({
  title = "Leave a request",
  description = "Launching your own token project? Our experts are ready to help with listing on exchanges, market making, marketing and other solutions.",
  buttonLabel = "Submit application",
  href = "/contact",
}: {
  title?: string;
  description?: string;
  buttonLabel?: string;
  href?: string;
}) {
  return (
    <aside className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-[#1a0b2e] via-[#12081f] to-[#0b0618] px-5 py-6 text-white sm:px-7 sm:py-7">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgb(255 255 255 / 0.06) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.06) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-primary/30 blur-3xl" aria-hidden />
      <div className="relative">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d9f99d]">{title}</p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:text-[15px]">{description}</p>
        <Button
          asChild
          className="mt-5 h-11 rounded-full bg-[#d9f99d] px-6 font-semibold uppercase tracking-wide text-[#0b0618] hover:bg-[#ecfccb]"
        >
          <Link href={href}>{buttonLabel}</Link>
        </Button>
      </div>
    </aside>
  );
}
