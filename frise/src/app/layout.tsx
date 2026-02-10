import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "./providers";
import { BottomNav } from "@/components/ui/BottomNav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
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
      <body className={`${inter.variable} ${jakarta.variable} font-sans antialiased bg-background text-text-primary min-h-screen`}>
        <Providers>
          <main className="pb-24 md:pb-8">
            {children}
          </main>
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
