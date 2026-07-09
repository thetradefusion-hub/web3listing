import Link from "next/link";
import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function OfflinePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Smartphone className="size-7" />
      </div>
      <h1 className="text-xl font-bold text-foreground">You are offline</h1>
      <p className="max-w-sm text-sm text-muted-foreground">
        Check your internet connection and reopen the Web3Listing app.
      </p>
      <Button asChild className="rounded-xl">
        <Link href="/">Try again</Link>
      </Button>
    </main>
  );
}
