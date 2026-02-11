import type { Metadata } from 'next';
import { Syne, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/providers/theme-provider';
import './globals.css';

// Display font - Bold, geometric, distinctive
const syne = Syne({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
});

// Body font - Clean, modern, readable
const jakarta = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

// Mono font - For code and technical elements
const jetbrains = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
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
      <body className={`${syne.variable} ${jakarta.variable} ${jetbrains.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
