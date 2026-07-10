import { Suspense } from "react";
import LoginForm from "./login-form";

export const metadata = {
  title: "Sign In",
  description: "Sign in to the Web3Listing partner dashboard",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
