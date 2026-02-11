import type { Metadata, Viewport } from "next";
import { Outfit, Fraunces } from "next/font/google";
import { Providers } from "./providers";
import { BottomNav } from "@/components/ui/BottomNav";
import "./globals.css";

// Body font: Modern geometric sans with excellent readability
const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

// Display font: Distinctive soft serif with character - premium feel
const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  weight: "variable",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: "Frise - Your Sleep-Powered Productivity Forecast",
  description: "Discover your daily productivity peaks and valleys based on your sleep patterns. Science-backed predictions using the Two-Process Model.",
  keywords: ["sleep", "productivity", "circadian rhythm", "sleep tracker", "energy forecast"],
  authors: [{ name: "Frise" }],
  openGraph: {
    title: "Frise - Your Sleep-Powered Productivity Forecast",
    description: "Discover your daily productivity peaks and valleys based on your sleep patterns.",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Frise",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0F",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${outfit.variable} ${fraunces.variable} font-sans antialiased bg-background text-text-primary min-h-screen`}>
        <Providers>
          {/* Noise texture overlay for visual depth */}
          <div className="noise-overlay" aria-hidden="true" />
          <main className="pb-24 md:pb-8 relative z-10">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
