'use client';

import { useState } from 'react';
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

  const filteredApps = selectedCategory
    ? apps.filter((app) => app.category.slug === selectedCategory)
    : apps;

  return (
    <section id="marketplace" className="py-24 bg-background-secondary">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Digital Vlad Marketplace
          </h2>
          <p className="text-foreground-muted max-w-xl mx-auto">
            Explore apps from the Digital Vlad ecosystem. Each one crafted with care and built to
            solve real problems.
          </p>
        </div>

        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-amber-500 text-black'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              All ({apps.length})
            </button>
            {categories
              .filter((cat) => cat.appCount > 0)
              .map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.slug)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.slug
                      ? 'bg-amber-500 text-black'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  {category.name} ({category.appCount})
                </button>
              ))}
          </div>
        )}

        {/* Apps Grid */}
        {filteredApps.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-foreground-muted">No apps available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApps.map((app) => (
              <AppCard
                key={app.id}
                title={app.title}
                slug={app.slug}
                description={app.description}
                iconUrl={app.iconUrl}
                accentColor={app.accentColor}
                category={app.category.name}
              />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
