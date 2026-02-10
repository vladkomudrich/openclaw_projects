'use client';

import { Container } from '../ui/container';
import { Button } from '../ui/button';
import { SocialLinks } from '../ui/social-links';

export function Hero() {
  const scrollToMarketplace = () => {
    const element = document.getElementById('marketplace');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-[80vh] flex items-center pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent" />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Avatar */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 animate-pulse blur-xl opacity-50" />
            <div className="relative w-32 h-32 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center text-black text-5xl font-bold shadow-2xl">
              DV
            </div>
          </div>

          {/* Tagline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            I build apps and{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">
              ship fast
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-foreground-muted mb-8 max-w-xl mx-auto">
            Welcome to the Digital Vlad Empire. Explore my apps, learn about my services, and let&apos;s
            build something great together.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="lg" onClick={scrollToMarketplace}>
              Explore Apps
            </Button>
            <Button variant="outline" size="lg" onClick={() => {
              const element = document.getElementById('services');
              element?.scrollIntoView({ behavior: 'smooth' });
            }}>
              View Services
            </Button>
          </div>

          {/* Social Links */}
          <SocialLinks className="justify-center" />
        </div>
      </Container>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-foreground-muted"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7" />
        </svg>
      </div>
    </section>
  );
}
