import type { Metadata } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { RouteLoader } from "@/components/shared/route-loader";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "TokenWeb3Listing — Web3 Listings, Marketing & Growth",
    template: "%s | TokenWeb3Listing",
  },
  description:
    "One platform for Web3 listings, marketing, liquidity, PR, community, and growth services.",
  icons: {
    icon: [{ url: "/web3Listing  symbol.png", type: "image/png" }],
    shortcut: "/web3Listing  symbol.png",
    apple: "/web3Listing  symbol.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>
          <TooltipProvider>
            <Suspense fallback={null}>
              <RouteLoader />
            </Suspense>
            {children}
            <Toaster richColors position="top-right" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
