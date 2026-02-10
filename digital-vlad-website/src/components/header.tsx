'use client';

import Link from 'next/link';
import { Container } from './ui/container';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <Container>
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
              <span className="text-black font-bold text-lg">DV</span>
            </div>
            <span className="font-bold text-lg text-foreground hidden sm:block">Digital Vlad</span>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => scrollTo('marketplace')}
              className="text-foreground-muted hover:text-foreground transition-colors hidden sm:block"
            >
              Apps
            </button>
            <button
              onClick={() => scrollTo('services')}
              className="text-foreground-muted hover:text-foreground transition-colors hidden sm:block"
            >
              Services
            </button>
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  );
}
