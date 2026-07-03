import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BrandLogo } from "@/components/shared/brand-logo";
import { TELEGRAM_SUPPORT } from "@/lib/constants";
import { TelegramAnchor } from "@/components/shared/telegram-anchor";

export default function ForgotPasswordPage() {
  return (
    <div className="dark flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-cyan-950/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <BrandLogo size="lg" />
          </div>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Contact your account manager or support via Telegram to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full bg-cyan-500 text-black hover:bg-cyan-400">
            <TelegramAnchor href={TELEGRAM_SUPPORT}>
              Contact Support on Telegram
            </TelegramAnchor>
          </Button>
          <Button variant="ghost" asChild className="w-full">
            <Link href="/login">Back to Login</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
