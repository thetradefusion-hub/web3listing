import { Suspense } from "react";
import { BrandLogo } from "@/components/shared/brand-logo";
import LoginForm from "./login-form";

function LoginLoading() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-40" />
      <div className="login-glow pointer-events-none absolute h-64 w-64 rounded-full bg-primary/20 blur-[100px]" />
      <div className="relative flex flex-col items-center gap-5">
        <BrandLogo size="lg" />
        <div className="size-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        <p className="text-sm font-medium text-muted-foreground">Loading sign in...</p>
      </div>
    </div>
  );
}

export const metadata = {
  title: "Sign In",
  description: "Sign in to the TokenWeb3Listing partner dashboard",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
