"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { motion } from "framer-motion";
import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  description: string;
  emoji: string;
  category: "basics" | "science" | "tips" | "advanced";
  readTime: number; // minutes
}

const ARTICLES: Article[] = [
  {
    slug: "what-is-chrononutrition",
    title: "What is Chrononutrition?",
    description: "Discover the science of meal timing and how it affects your health, energy, and performance.",
    emoji: "🕐",
    category: "basics",
    readTime: 5,
  },
  {
    slug: "why-breakfast-timing-matters",
    title: "Why Breakfast Timing Matters for Your Brain",
    description: "Learn how eating breakfast at the right time can boost your mental performance by 15-20%.",
    emoji: "🧠",
    category: "science",
    readTime: 6,
  },
  {
    slug: "metabolic-switch-explained",
    title: "The Metabolic Switch: What Happens During Fasting",
    description: "Understanding the 12-hour threshold and how fasting activates fat burning and autophagy.",
    emoji: "🔥",
    category: "science",
    readTime: 7,
  },
  {
    slug: "early-vs-late-eating",
    title: "Early vs Late Eating: What the Research Shows",
    description: "Scientific evidence on why eating earlier leads to better metabolic health outcomes.",
    emoji: "📊",
    category: "science",
    readTime: 8,
  },
  {
    slug: "optimizing-performance",
    title: "Optimizing Performance with Meal Timing",
    description: "Practical strategies to maximize energy, focus, and athletic performance through timing.",
    emoji: "⚡",
    category: "tips",
    readTime: 6,
  },
  {
    slug: "chronotype-eating",
    title: "Your Chronotype and Optimal Eating Schedule",
    description: "How morning people and night owls should adjust their eating windows differently.",
    emoji: "🌙",
    category: "advanced",
    readTime: 5,
  },
  {
    slug: "travel-jet-lag-eating",
    title: "Travel and Jet Lag Eating Strategies",
    description: "Use meal timing to minimize jet lag and adapt quickly to new time zones.",
    emoji: "✈️",
    category: "tips",
    readTime: 6,
  },
];

const CATEGORIES = [
  { id: "all", label: "All", emoji: "📚" },
  { id: "basics", label: "Basics", emoji: "🌱" },
  { id: "science", label: "Science", emoji: "🔬" },
  { id: "tips", label: "Tips", emoji: "💡" },
  { id: "advanced", label: "Advanced", emoji: "🎓" },
];

export default function LearnPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesSearch =
      search === "" ||
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "all" || article.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[var(--fueltime-gray-50)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--fueltime-gray-200)] px-4 py-4 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Link href="/">
              <Button
                isIconOnly
                variant="light"
                className="text-[var(--fueltime-gray-600)]"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[var(--fueltime-gray-900)]">
                Learn
              </h1>
              <p className="text-sm text-[var(--fueltime-gray-500)]">
                The science of meal timing
              </p>
            </div>
          </div>

          {/* Search */}
          <Input
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            startContent={
              <svg className="w-5 h-5 text-[var(--fueltime-gray-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
            classNames={{
              inputWrapper: "bg-[var(--fueltime-gray-100)] border-none",
            }}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                category === cat.id
                  ? "bg-[var(--fueltime-green-500)] text-white"
                  : "bg-white text-[var(--fueltime-gray-700)] border border-[var(--fueltime-gray-200)]"
              }`}
            >
              <span>{cat.emoji}</span>
              <span className="text-sm font-medium">{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="space-y-4">
          {filteredArticles.map((article, index) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/learn/${article.slug}`}>
                <div className="bg-white rounded-2xl p-4 border border-[var(--fueltime-gray-200)] hover:border-[var(--fueltime-green-300)] hover:shadow-md transition-all">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-[var(--fueltime-green-50)] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      {article.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--fueltime-gray-900)] line-clamp-1">
                        {article.title}
                      </h3>
                      <p className="text-sm text-[var(--fueltime-gray-600)] line-clamp-2 mt-1">
                        {article.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-[var(--fueltime-gray-400)]">
                          {article.readTime} min read
                        </span>
                        <span className="text-xs px-2 py-0.5 bg-[var(--fueltime-gray-100)] rounded-full text-[var(--fueltime-gray-500)]">
                          {article.category}
                        </span>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-[var(--fueltime-gray-400)] flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <span className="text-4xl">📭</span>
            <p className="mt-4 text-[var(--fueltime-gray-500)]">
              No articles found matching your search.
            </p>
          </div>
        )}

        {/* Bottom CTA */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[var(--fueltime-green-500)] to-[var(--fueltime-green-600)] rounded-2xl text-white text-center">
          <h3 className="font-bold text-lg">Ready to optimize your eating?</h3>
          <p className="text-sm text-white/80 mt-1">
            Apply what you've learned with your personalized schedule.
          </p>
          <Link href="/">
            <Button
              className="mt-4 bg-white text-[var(--fueltime-green-600)] font-semibold"
            >
              View My Schedule
            </Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
