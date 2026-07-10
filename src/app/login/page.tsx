import { Suspense } from "react";
import LoginForm from "./login-form";

export const metadata = {
  title: "Sign In",
  description: "Sign in to your Web3Listing dashboard",
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
