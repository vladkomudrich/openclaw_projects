import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Premium heading font
const jakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

// Clean body font
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FuelTime - Science-Based Meal Timing Optimizer",
  description:
    "Fuel your peak performance with science-based meal timing. Optimize your eating windows for better energy, focus, and metabolic health using chrononutrition science.",
  keywords: [
    "meal timing",
    "chrononutrition",
    "eating window",
    "circadian rhythm",
    "time-restricted eating",
    "intermittent fasting",
    "metabolic health",
    "energy optimization",
    "focus",
    "performance",
  ],
  authors: [{ name: "FuelTime" }],
  creator: "FuelTime",
  publisher: "FuelTime",
  openGraph: {
    title: "FuelTime - Science-Based Meal Timing Optimizer",
    description:
      "Optimize your eating windows for better energy, focus, and metabolic health.",
    type: "website",
    locale: "en_US",
    siteName: "FuelTime",
  },
  twitter: {
    card: "summary_large_image",
    title: "FuelTime - Science-Based Meal Timing Optimizer",
    description:
      "Optimize your eating windows for better energy, focus, and metabolic health.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0A0A0F" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0F" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon.svg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="FuelTime" />
      </head>
      <body className={`${jakartaSans.variable} ${inter.variable} antialiased bg-[var(--bg-dark)] text-[var(--text-primary)]`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
