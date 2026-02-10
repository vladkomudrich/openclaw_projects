import { Metadata } from "next";
import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";

export const metadata: Metadata = {
  title: "Learn - Frise",
  description: "Learn about sleep science, circadian rhythms, and productivity optimization",
};

const articles = [
  {
    id: "circadian-rhythms",
    title: "How Circadian Rhythms Work",
    description: "Your body's 24-hour internal clock controls energy, alertness, and sleep.",
    emoji: "🌅",
    readTime: "3 min",
    gradient: "linear-gradient(135deg, var(--accent-gold), var(--accent-purple))",
  },
  {
    id: "two-process-model",
    title: "The Two-Process Model",
    description: "The science behind Frise's productivity predictions.",
    emoji: "🧬",
    readTime: "4 min",
    gradient: "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
  },
  {
    id: "sleep-timing",
    title: "Why Sleep Timing Matters",
    description: "It's not just how much you sleep, but when you sleep.",
    emoji: "⏰",
    readTime: "3 min",
    gradient: "linear-gradient(135deg, var(--accent-blue), var(--info))",
  },
  {
    id: "chronotypes",
    title: "Understanding Your Chronotype",
    description: "Are you a morning lark, night owl, or somewhere in between?",
    emoji: "🦉",
    readTime: "4 min",
    gradient: "linear-gradient(135deg, var(--thermal-low), var(--accent-purple))",
  },
  {
    id: "consistency",
    title: "Sleep Consistency Tips",
    description: "How to maintain regular sleep patterns for better productivity.",
    emoji: "📅",
    readTime: "3 min",
    gradient: "linear-gradient(135deg, var(--success), var(--accent-blue))",
  },
];

export default function LearnPage() {
  return (
    <main className="min-h-screen">
      <div className="container max-w-2xl mx-auto px-4 py-8 md:pt-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-display-md gradient-text">Learn</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Understand the science behind your productivity patterns
          </p>
        </div>

        {/* Articles List */}
        <div className="space-y-4">
          {articles.map((article, index) => (
            <Link key={article.id} href={`/learn/${article.id}`}>
              <GlassCard 
                variant="interactive" 
                padding="lg"
                className="group"
                style={{
                  animationDelay: `${index * 0.1}s`,
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon with gradient */}
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-105 transition-transform"
                    style={{ background: article.gradient }}
                  >
                    {article.emoji}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display font-semibold text-[var(--text-primary)] mb-1 group-hover:text-[var(--accent-blue)] transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">
                      {article.description}
                    </p>
                    <span className="text-xs text-[var(--text-muted)]">
                      {article.readTime} read
                    </span>
                  </div>
                  
                  {/* Arrow */}
                  <span className="text-[var(--text-muted)] group-hover:text-[var(--accent-blue)] group-hover:translate-x-1 transition-all">
                    →
                  </span>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>

        {/* Science badge */}
        <div className="mt-12 text-center">
          <GlassCard padding="md" className="inline-block">
            <p className="text-sm text-[var(--text-secondary)]">
              🧬 Frise uses the <span className="text-[var(--accent-purple)]">Two-Process Model</span> of sleep regulation, 
              developed by Dr. Alexander Borbély in 1982.
            </p>
          </GlassCard>
        </div>
      </div>
    </main>
  );
}
