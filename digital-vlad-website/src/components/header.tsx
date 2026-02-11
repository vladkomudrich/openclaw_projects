'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Container } from './ui/container';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/90 backdrop-blur-xl border-b border-border shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <Container>
        <nav className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 blur-lg opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="text-black font-black text-lg tracking-tighter">DV</span>
              </div>
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-bold text-foreground leading-none">Digital Vlad</span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-foreground-muted">Empire</span>
            </div>
          </Link>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => scrollTo('marketplace')}
              className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all hidden sm:block"
            >
              Apps
            </button>
            <button
              onClick={() => scrollTo('services')}
              className="px-4 py-2 text-sm font-medium text-foreground-muted hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all hidden sm:block"
            >
              Services
            </button>
            <div className="w-px h-6 bg-border mx-2 hidden sm:block" />
            <ThemeToggle />
          </div>
        </nav>
      </Container>
    </header>
  );
}
