import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import Script from "next/script";
import { Inter } from "next/font/google";
import { ThemeProvider, THEME_INIT_SCRIPT } from "@/components/shared/theme-provider";
import {
  DeferredRouteLoader,
  DeferredToaster,
} from "@/components/shared/deferred-ui";
import { PwaProvider } from "@/components/shared/pwa-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-FL94FFKPL8";

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
  verification: {
    google: "EnmJj3CTwWibrMu_ag1EiZ8lecwPPcCzyT-PZ2bWkws",
  },
  appleWebApp: {
    capable: true,
    title: "Web3Listing",
    statusBarStyle: "black-translucent",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/pwa/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/pwa/icon-512.png", sizes: "512x512", type: "image/png" },
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

const PWA_BOOT_SPLASH_SCRIPT = `(function(){try{var s=window.matchMedia("(display-mode: standalone)").matches||("standalone"in navigator&&navigator.standalone);if(!s||sessionStorage.getItem("pwa-splash-seen-session")==="1")return;var e=document.getElementById("pwa-boot-splash");if(e)e.hidden=false;}catch(_){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <script dangerouslySetInnerHTML={{ __html: PWA_BOOT_SPLASH_SCRIPT }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <div id="pwa-boot-splash" className="pwa-splash" hidden suppressHydrationWarning>
          <div className="pwa-splash__bg" />
          <div className="pwa-splash__grid" aria-hidden />
          <div className="pwa-splash__glow pwa-splash__glow--purple" aria-hidden />
          <div className="pwa-splash__glow pwa-splash__glow--lime" aria-hidden />
          <div className="pwa-splash__content">
            <div className="pwa-splash__logo-stack">
              <span className="pwa-splash__ring pwa-splash__ring--outer" aria-hidden />
              <span className="pwa-splash__ring pwa-splash__ring--inner" aria-hidden />
              <div className="pwa-splash__logo-wrap">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/web3_exact_colors.svg" alt="" className="pwa-splash__logo" />
              </div>
            </div>
            <p className="pwa-splash__brand">Web3Listing</p>
            <p className="pwa-splash__tagline">List · Market · Grow</p>
            <div className="pwa-splash__progress" aria-hidden>
              <span className="pwa-splash__progress-bar" />
            </div>
          </div>
        </div>
        <ThemeProvider defaultTheme="dark">
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
