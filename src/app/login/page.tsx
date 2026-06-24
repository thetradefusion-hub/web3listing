import { Suspense } from "react";
import LoginForm from "./login-form";

function LoginLoading() {
  return (
    <div className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060a14]">
      <div className="pointer-events-none absolute inset-0 landing-grid opacity-40" />
      <div className="login-glow pointer-events-none absolute h-64 w-64 rounded-full bg-cyan-500/20 blur-[100px]" />
      <div className="relative flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-cyan-500/20 border-t-cyan-400" />
        <p className="text-sm font-medium text-slate-400">Loading...</p>
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
