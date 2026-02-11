import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FuelTime Blog - Chrononutrition Science & Meal Timing Tips",
  description: "Learn about the science of meal timing, chrononutrition research, and practical tips to optimize your eating schedule for better energy and health.",
  keywords: [
    "chrononutrition",
    "meal timing",
    "time-restricted eating",
    "intermittent fasting",
    "circadian rhythm",
    "metabolic health",
    "breakfast timing",
    "eating window",
  ],
  openGraph: {
    title: "FuelTime Blog - Chrononutrition Science & Meal Timing Tips",
    description: "Learn about the science of meal timing and optimize your eating schedule.",
    type: "website",
  },
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  category: string;
  featured?: boolean;
}

const BLOG_POSTS: BlogPost[] = [
  {
    slug: "best-times-to-eat-for-focus-and-energy",
    title: "Best Times to Eat for Focus and Energy: A Complete Guide",
    excerpt: "Discover the optimal meal times to maximize your mental clarity, sustain energy throughout the day, and avoid the dreaded afternoon slump.",
    date: "2026-02-06",
    readTime: 8,
    category: "Performance",
    featured: true,
  },
  {
    slug: "science-of-meal-timing",
    title: "The Science of Meal Timing: How Your Body's Clock Affects Metabolism",
    excerpt: "Your body doesn't treat food the same at all hours. Learn how circadian rhythms control metabolism and why timing matters as much as what you eat.",
    date: "2026-02-05",
    readTime: 10,
    category: "Science",
    featured: true,
  },
  {
    slug: "time-restricted-eating-beginners-guide",
    title: "Time-Restricted Eating: The Beginner's Guide to TRE",
    excerpt: "Everything you need to know to start time-restricted eating, from choosing your eating window to optimizing results.",
    date: "2026-02-04",
    readTime: 12,
    category: "Getting Started",
    featured: true,
  },
  {
    slug: "breakfast-myths-debunked",
    title: "Breakfast Myths Debunked: What Science Really Says",
    excerpt: "Is breakfast really the most important meal? Should you eat immediately upon waking? We separate fact from fiction.",
    date: "2026-02-03",
    readTime: 7,
    category: "Science",
  },
  {
    slug: "late-night-eating-effects",
    title: "Late Night Eating: Why Dinner Timing Affects Your Sleep and Weight",
    excerpt: "Research shows eating late has consequences beyond calories. Learn how dinner timing affects sleep quality, metabolism, and body composition.",
    date: "2026-02-02",
    readTime: 6,
    category: "Research",
  },
  {
    slug: "optimizing-athletic-performance-meal-timing",
    title: "Meal Timing for Athletes: Pre, During, and Post-Workout Nutrition",
    excerpt: "Strategic meal timing can enhance your workouts and recovery. Learn when to eat for optimal athletic performance.",
    date: "2026-02-01",
    readTime: 9,
    category: "Performance",
  },
];

export default function BlogPage() {
  const featuredPosts = BLOG_POSTS.filter((p) => p.featured);
  const recentPosts = BLOG_POSTS.filter((p) => !p.featured);

  return (
    <div className="min-h-screen bg-[var(--fueltime-gray-50)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--fueltime-gray-200)]">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <nav className="flex items-center justify-between mb-6">
            <Link href="/" className="text-xl font-bold text-[var(--fueltime-green-600)]">
              🍽️⏰ FuelTime
            </Link>
            <div className="flex gap-4 text-sm">
              <Link href="/" className="text-[var(--fueltime-gray-600)] hover:text-[var(--fueltime-green-600)]">
                App
              </Link>
              <Link href="/learn" className="text-[var(--fueltime-gray-600)] hover:text-[var(--fueltime-green-600)]">
                Learn
              </Link>
              <Link href="/blog" className="text-[var(--fueltime-green-600)] font-medium">
                Blog
              </Link>
            </div>
          </nav>
          
          <h1 className="text-4xl font-bold text-[var(--fueltime-gray-900)]">
            FuelTime Blog
          </h1>
          <p className="text-lg text-[var(--fueltime-gray-600)] mt-2">
            Science-backed insights on meal timing, chrononutrition, and metabolic health
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Featured Posts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-6">
            Featured Articles
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="bg-white rounded-2xl overflow-hidden border border-[var(--fueltime-gray-200)] hover:border-[var(--fueltime-green-300)] hover:shadow-lg transition-all h-full">
                  <div className="h-32 bg-gradient-to-br from-[var(--fueltime-green-400)] to-[var(--fueltime-green-600)] flex items-center justify-center">
                    <span className="text-5xl">📚</span>
                  </div>
                  <div className="p-5">
                    <span className="text-xs font-medium text-[var(--fueltime-green-600)] uppercase tracking-wide">
                      {post.category}
                    </span>
                    <h3 className="font-bold text-[var(--fueltime-gray-900)] mt-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--fueltime-gray-600)] mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-4 text-xs text-[var(--fueltime-gray-400)]">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Posts */}
        <section>
          <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-6">
            Recent Articles
          </h2>
          <div className="space-y-4">
            {recentPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <article className="bg-white rounded-xl p-5 border border-[var(--fueltime-gray-200)] hover:border-[var(--fueltime-green-300)] hover:shadow-md transition-all flex gap-4">
                  <div className="w-16 h-16 bg-[var(--fueltime-green-50)] rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl">📖</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-medium text-[var(--fueltime-green-600)] uppercase tracking-wide">
                      {post.category}
                    </span>
                    <h3 className="font-semibold text-[var(--fueltime-gray-900)] mt-1 line-clamp-1">
                      {post.title}
                    </h3>
                    <p className="text-sm text-[var(--fueltime-gray-600)] mt-1 line-clamp-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-[var(--fueltime-gray-400)]">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime} min read</span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>

        {/* Newsletter / CTA */}
        <section className="mt-12 p-8 bg-gradient-to-r from-[var(--fueltime-green-500)] to-[var(--fueltime-green-600)] rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold">Ready to Optimize Your Eating Schedule?</h3>
          <p className="text-white/80 mt-2 max-w-md mx-auto">
            FuelTime calculates your personalized eating window based on your sleep schedule and goals.
          </p>
          <Link href="/">
            <button className="mt-6 px-8 py-3 bg-white text-[var(--fueltime-green-600)] font-semibold rounded-xl hover:shadow-lg transition-all">
              Get Started Free
            </button>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[var(--fueltime-gray-200)] mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="font-bold text-[var(--fueltime-gray-900)]">🍽️⏰ FuelTime</p>
              <p className="text-sm text-[var(--fueltime-gray-500)]">
                Science-based meal timing optimizer
              </p>
            </div>
            <nav className="flex gap-6 text-sm text-[var(--fueltime-gray-600)]">
              <Link href="/learn" className="hover:text-[var(--fueltime-green-600)]">Learn</Link>
              <Link href="/blog" className="hover:text-[var(--fueltime-green-600)]">Blog</Link>
              <Link href="/about" className="hover:text-[var(--fueltime-green-600)]">About</Link>
              <Link href="/privacy" className="hover:text-[var(--fueltime-green-600)]">Privacy</Link>
            </nav>
          </div>
          <p className="text-center text-xs text-[var(--fueltime-gray-400)] mt-6">
            © 2026 FuelTime. Based on chrononutrition research.
          </p>
        </div>
      </footer>
    </div>
  );
}
