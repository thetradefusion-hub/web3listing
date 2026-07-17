import Image from "next/image";
import Link from "next/link";
import { Check, CheckCircle2, Handshake, ShieldCheck, TrendingUp, Wallet } from "lucide-react";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/actions";
import { BrandLogo, SidebarBrandLogo } from "@/components/shared/brand-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { BRAND_ICON_PATH } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";

const STEPS = [
  { key: "business-profile", label: "Profile", match: "/partner/onboarding/business-profile" },
  { key: "kyc", label: "KYC", match: "/partner/onboarding/kyc" },
  { key: "agreements", label: "Agreements", match: "/partner/onboarding/agreements" },
  { key: "pending", label: "Review", match: "/partner/onboarding/pending" },
] as const;

const BENEFITS = [
  {
    icon: Handshake,
    title: "Marketplace access",
    description: "List projects and order listings, PR, and growth services.",
  },
  {
    icon: Wallet,
    title: "Earn commissions",
    description: "Get paid on marketplace orders you bring to the platform.",
  },
  {
    icon: TrendingUp,
    title: "Track everything",
    description: "Monitor orders, delivery, and wallet balance in one portal.",
  },
  {
    icon: ShieldCheck,
    title: "Verified partner",
    description: "KYC-backed trust so clients know they are working with you.",
  },
] as const;

function stepIndex(path: string) {
  const i = STEPS.findIndex((s) => path.startsWith(s.match));
  return i >= 0 ? i : 0;
}

async function handleSignOut() {
  "use server";
  await signOut();
  redirect("/login");
}

export function PartnerOnboardingShell({
  profile,
  currentPath,
  children,
}: {
  profile: Profile;
  currentPath: string;
  children: React.ReactNode;
}) {
  const active = stepIndex(currentPath);
  const progress = Math.round(((active + 1) / STEPS.length) * 100);

  return (
    <div className="auth-shell relative min-h-[100dvh] bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-30 dark:opacity-20" />
      <div className="login-glow pointer-events-none absolute -left-24 top-0 h-72 w-72 rounded-full bg-primary/20 blur-[100px] sm:h-96 sm:w-96" />
      <div className="login-glow pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-chart-2/15 blur-[100px] sm:h-96 sm:w-96" />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-2 lg:invisible lg:pointer-events-none">
          <BrandLogo href="/" className="h-8" />
        </div>
        <div className="flex items-center gap-2">
          <p className="hidden max-w-[200px] truncate text-sm text-muted-foreground sm:block">
            {profile.email}
          </p>
          <ThemeToggle
            variant="outline"
            className="size-9 rounded-xl border-border/60 bg-card/70 text-muted-foreground backdrop-blur-sm hover:border-primary/30 hover:text-foreground"
          />
          <form action={handleSignOut}>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="rounded-xl border-border/60 bg-card/70 backdrop-blur-sm"
            >
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <div className="relative flex min-h-[100dvh] flex-col lg:flex-row">
        <aside className="auth-brand-panel relative hidden overflow-hidden border-r lg:flex lg:w-[40%] lg:flex-col xl:w-[42%]">
          <div
            className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-chart-4 to-chart-2"
            aria-hidden
          />

          <div className="pointer-events-none absolute -right-6 top-16 size-52 opacity-[0.14] sm:size-64 xl:size-72">
            <Image
              src={BRAND_ICON_PATH}
              alt=""
              width={288}
              height={288}
              className="login-float size-full object-contain"
              aria-hidden
              priority
            />
          </div>

          <div className="relative flex flex-1 flex-col justify-between p-10 xl:p-14">
            <div>
              <Link href="/" className="inline-flex transition-opacity hover:opacity-90">
                <SidebarBrandLogo priority className="h-10 max-w-[210px]" />
              </Link>
              <p className="mt-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Partner onboarding
              </p>
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground xl:text-4xl">
                Finish your application to{" "}
                <span className="lh-brand-gradient">go live</span>
              </h1>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Complete profile, KYC, and agreements. Our team reviews and activates your partner
                account.
              </p>
            </div>

            <ol className="mt-10 flex flex-col gap-2.5">
              {STEPS.map((step, index) => {
                const done = index < active;
                const current = index === active;
                return (
                  <li
                    key={step.key}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-3.5 py-3 transition-colors",
                      done && "border-chart-2/35 bg-chart-2/10",
                      current && "border-primary/40 bg-primary/15",
                      !done && !current && "border-white/10 bg-white/5"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                        done && "bg-chart-2/20 text-chart-2",
                        current && "bg-primary/25 text-primary",
                        !done && !current && "bg-white/10 text-muted-foreground"
                      )}
                    >
                      {done ? <Check className="size-4" strokeWidth={2.5} /> : index + 1}
                    </span>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-sm font-semibold",
                          current || done ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {done ? "Completed" : current ? "In progress" : "Upcoming"}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="mt-10 space-y-4 border-t border-white/10 pt-8">
              <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                <span>Progress</span>
                <span className="font-semibold text-foreground">{progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-chart-4 to-chart-2 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-chart-2" strokeWidth={2.5} />
                  Secure application
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-chart-2" strokeWidth={2.5} />
                  Review in 1–2 days
                </span>
              </div>
            </div>
          </div>
        </aside>

        <main className="relative flex flex-1 flex-col px-4 pb-10 pt-20 sm:px-6 lg:px-10 lg:pb-12 lg:pt-24 xl:px-14">
          {/* Mobile progress */}
          <div className="mb-6 lg:hidden">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              Partner onboarding · Step {active + 1} of {STEPS.length}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary via-chart-4 to-chart-2"
                style={{ width: `${progress}%` }}
              />
            </div>
            <ol className="mt-4 flex gap-2 overflow-x-auto pb-1">
              {STEPS.map((step, index) => {
                const done = index < active;
                const current = index === active;
                return (
                  <li
                    key={step.key}
                    className={cn(
                      "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
                      done && "border-chart-2/40 bg-chart-2/10 text-foreground",
                      current && "border-primary/40 bg-primary/10 text-foreground",
                      !done && !current && "border-border text-muted-foreground"
                    )}
                  >
                    {done ? (
                      <Check className="size-3.5 text-chart-2" strokeWidth={2.5} />
                    ) : (
                      <span className="flex size-4 items-center justify-center rounded-full bg-muted text-[10px]">
                        {index + 1}
                      </span>
                    )}
                    {step.label}
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center">
            <div className="auth-form-card relative min-h-[min(70dvh,720px)] overflow-hidden rounded-2xl border bg-card/90 backdrop-blur-xl">
              <div
                className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary via-chart-4 to-chart-2"
                aria-hidden
              />
              <div className="p-5 sm:p-8 lg:p-10">{children}</div>
            </div>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:hidden">
              {BENEFITS.slice(0, 2).map((item) => (
                <li
                  key={item.title}
                  className="rounded-xl border border-border/70 bg-card/60 p-3.5 backdrop-blur-sm"
                >
                  <item.icon className="size-4 text-primary" strokeWidth={2} />
                  <p className="mt-2 text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
}
