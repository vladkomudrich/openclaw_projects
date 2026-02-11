'use client';

import { useEffect, useState } from 'react';
import { Container } from '../ui/container';
import { Button } from '../ui/button';
import { SocialLinks } from '../ui/social-links';

export function Hero() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToMarketplace = () => {
    const element = document.getElementById('marketplace');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      
      {/* Diagonal accent line */}
      <div className="absolute top-0 right-0 w-1/2 h-full overflow-hidden pointer-events-none">
        <div 
          className="absolute -right-1/4 top-0 w-full h-[200%] bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent"
          style={{ transform: 'rotate(-15deg)', transformOrigin: 'top right' }}
        />
      </div>

      {/* Grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <Container className="relative z-20">
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left content - Asymmetric, not centered */}
          <div className={`lg:col-span-7 transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Status badge */}
            <div 
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 mb-8 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span className="text-xs font-mono uppercase tracking-wider text-amber-500">Building in public</span>
            </div>

            {/* Main headline - Large, bold, broken lines */}
            <h1 className="mb-6">
              <span 
                className={`block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-foreground leading-[0.9] tracking-tight transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              >
                I BUILD
              </span>
              <span 
                className={`block text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[0.9] tracking-tight mt-1 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{
                  background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f97316 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                & SHIP FAST
              </span>
            </h1>

            {/* Subtext */}
            <p 
              className={`text-lg sm:text-xl text-foreground-muted max-w-lg mb-10 leading-relaxed transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              Solo founder crafting apps that solve real problems. 
              Welcome to the <span className="text-foreground font-semibold">Digital Vlad Empire</span>.
            </p>

            {/* CTAs */}
            <div 
              className={`flex flex-col sm:flex-row items-start gap-4 mb-12 transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
              <Button size="lg" onClick={scrollToMarketplace} className="group">
                <span>Explore Apps</span>
                <svg 
                  className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                onClick={() => {
                  const element = document.getElementById('services');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                View Services
              </Button>
            </div>

            {/* Social Links */}
            <div className={`transition-all duration-700 delay-600 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <SocialLinks />
            </div>
          </div>

          {/* Right side - Large geometric element */}
          <div className={`lg:col-span-5 hidden lg:flex items-center justify-center transition-all duration-1000 delay-300 ${mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 blur-3xl bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent rounded-full scale-150" />
              
              {/* Main avatar/logo element */}
              <div className="relative w-64 h-64 xl:w-80 xl:h-80">
                {/* Rotating border */}
                <div 
                  className="absolute inset-0 rounded-3xl border-2 border-amber-500/30"
                  style={{
                    animation: 'spin 20s linear infinite',
                  }}
                />
                
                {/* Inner container */}
                <div className="absolute inset-4 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/25">
                  <span className="text-7xl xl:text-8xl font-black text-black tracking-tighter">DV</span>
                </div>

                {/* Floating stats */}
                <div className="absolute -bottom-4 -left-4 px-4 py-2 bg-card-bg border border-card-border rounded-xl shadow-lg">
                  <span className="text-2xl font-bold text-foreground">10+</span>
                  <span className="text-xs text-foreground-muted block">Apps shipped</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />

      {/* Scroll indicator */}
      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-20 transition-all duration-700 delay-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-mono uppercase tracking-wider text-foreground-muted">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-foreground-muted to-transparent" />
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
