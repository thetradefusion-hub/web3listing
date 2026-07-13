import Link from "next/link";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";
import { signOut } from "@/lib/actions";
import { BrandLogo } from "@/components/shared/brand-logo";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Profile } from "@/types/database";

const STEPS = [
  { key: "business-profile", label: "Profile", match: "/partner/onboarding/business-profile" },
  { key: "kyc", label: "KYC", match: "/partner/onboarding/kyc" },
  { key: "agreements", label: "Agreements", match: "/partner/onboarding/agreements" },
  { key: "pending", label: "Review", match: "/partner/onboarding/pending" },
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

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-30" />
      <header className="relative z-10 border-b border-border/60 bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <BrandLogo href="/" className="h-8" />
          <div className="flex items-center gap-2">
            <p className="hidden truncate text-sm text-muted-foreground sm:block">
              {profile.email}
            </p>
            <ThemeToggle variant="outline" className="size-9 rounded-xl" />
            <form action={handleSignOut}>
              <Button type="submit" variant="outline" size="sm" className="rounded-xl">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Partner onboarding
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-foreground">
            Complete your partner application
          </h1>
          <ol className="mt-6 flex flex-wrap gap-2">
            {STEPS.map((step, index) => {
              const done = index < active;
              const current = index === active;
              return (
                <li
                  key={step.key}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
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

        <div className="rounded-2xl border border-border/80 bg-card/90 p-5 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
