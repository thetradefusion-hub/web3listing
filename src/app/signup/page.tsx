import { Suspense } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import SignupForm from "./signup-form";

function SignupLoading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-40" />
      <div className="relative flex flex-col items-center gap-5">
        <BrandLogo size="lg" />
        <div className="size-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading sign up...</p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Sign Up",
  description: "Create a TokenWeb3Listing account to order listing services",
};

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupLoading />}>
      <SignupForm />
    </Suspense>
  );
}
