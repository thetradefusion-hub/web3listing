import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/shared/theme-provider";
import {
  DeferredRouteLoader,
  DeferredToaster,
} from "@/components/shared/deferred-ui";
import { PwaProvider } from "@/components/shared/pwa-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
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
    statusBarStyle: "black-translucent",
    startupImage: [
      {
        url: "/pwa/splash-750x1334.jpg",
        media:
          "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/pwa/splash-828x1792.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)",
      },
      {
        url: "/pwa/splash-1125x2436.jpg",
        media:
          "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/pwa/splash-1170x2532.jpg",
        media:
          "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/pwa/splash-1242x2688.jpg",
        media:
          "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/pwa/splash-1290x2796.jpg",
        media:
          "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)",
      },
      {
        url: "/pwa/splash-2048x2732.jpg",
        media:
          "(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)",
      },
      "/pwa/splash.jpg",
    ],
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
      { url: "/web3_exact_colors.svg", type: "image/svg+xml" },
    ],
    shortcut: "/pwa/icon-192.png",
    apple: [{ url: "/pwa/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#6B21A8" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0618" },
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
                <DeferredRouteLoader />
              </Suspense>
              {children}
              <DeferredToaster richColors position="top-right" />
            </PwaProvider>
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
