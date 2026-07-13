import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/shared/theme-provider";
import { RouteLoader } from "@/components/shared/route-loader";
import { PwaProvider } from "@/components/shared/pwa-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Web3Listing — Web3 Listings, Marketing & Growth",
    template: "%s | Web3Listing",
  },
  description:
    "One platform for Web3 listings, marketing, liquidity, PR, community, and growth services.",
  applicationName: "Web3Listing",
  appleWebApp: {
    capable: true,
    title: "Web3Listing",
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [{ url: "/web3_exact_colors.svg", type: "image/svg+xml" }],
    shortcut: "/web3_exact_colors.svg",
    apple: "/pwa/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#635BFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>
          <TooltipProvider>
            <PwaProvider>
              <Suspense fallback={null}>
                <RouteLoader />
              </Suspense>
              {children}
              <Toaster richColors position="top-right" />
            </PwaProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
