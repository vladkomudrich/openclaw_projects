'use client';

import { useState, useEffect } from 'react';
import { Container } from '../ui/container';
import { AppCard } from '../app-card';

interface App {
  id: string;
  title: string;
  slug: string;
  description: string;
  iconUrl: string;
  accentColor: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface Category {
  id: string;
  name: string;
  slug: string;
  appCount: number;
}

interface MarketplaceProps {
  apps: App[];
  categories: Category[];
}

export function Marketplace({ apps, categories }: MarketplaceProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredApps = selectedCategory
    ? apps.filter((app) => app.category.slug === selectedCategory)
    : apps;

  return (
    <section id="marketplace" className="relative py-32 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-background-secondary" />
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--foreground) 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      <Container className="relative z-10">
        {/* Section Header - Asymmetric */}
        <div className="grid lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-7">
            <div className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <span className="inline-block px-3 py-1 text-xs font-mono uppercase tracking-wider text-amber-500 bg-amber-500/10 rounded mb-4">
                Marketplace
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground leading-[0.95] tracking-tight">
                Apps from the
                <br />
                <span 
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Empire
                </span>
              </h2>
            </div>
          </div>
          <div className="lg:col-span-5 flex items-end">
            <p className={`text-foreground-muted text-lg transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Each app crafted with care, built to solve real problems. Fast, focused, functional.
            </p>
          </div>
        </div>

        {/* Category Filter - Pill style */}
        {categories.length > 0 && (
          <div className={`flex flex-wrap items-center gap-2 mb-12 transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                selectedCategory === null
                  ? 'bg-foreground text-background shadow-lg'
                  : 'bg-card-bg border border-card-border text-foreground-muted hover:text-foreground hover:border-foreground/20'
              }`}
            >
              All Apps
              <span className="ml-2 text-xs opacity-60">({apps.length})</span>
            </button>
            {categories
              .filter((cat) => cat.appCount > 0)
              .map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    selectedCategory === category.slug
                      ? 'bg-foreground text-background shadow-lg'
                      : 'bg-card-bg border border-card-border text-foreground-muted hover:text-foreground hover:border-foreground/20'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-60">({category.appCount})</span>
                </button>
              ))}
          </div>
        )}

        {/* Apps Grid - Staggered animation */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card-bg border border-card-border mb-4">
              <svg className="w-8 h-8 text-foreground-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-foreground-muted text-lg">No apps available yet.</p>
            <p className="text-foreground-muted/60 text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app, index) => (
              <div 
                key={app.id}
                className={`transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                <AppCard
                  title={app.title}
                  slug={app.slug}
                  description={app.description}
                  iconUrl={app.iconUrl}
                  accentColor={app.accentColor}
                  category={app.category.name}
                />
              </div>
            ))}
          </div>
        )}

        {/* Bottom accent */}
        <div className="mt-16 flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-border" />
          <span className="text-xs font-mono uppercase tracking-wider text-foreground-muted">More coming</span>
          <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-border" />
        </div>
      </Container>
    </section>
  );
}
