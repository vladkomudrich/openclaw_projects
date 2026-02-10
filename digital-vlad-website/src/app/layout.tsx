import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Digital Vlad | Apps, Portfolio & Services',
  description:
    'I build apps and ship fast. Explore the Digital Vlad marketplace, portfolio, and services.',
  keywords: ['Digital Vlad', 'apps', 'portfolio', 'developer', 'services'],
  authors: [{ name: 'Digital Vlad' }],
  openGraph: {
    title: 'Digital Vlad | Apps, Portfolio & Services',
    description: 'I build apps and ship fast. Explore the Digital Vlad marketplace.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
