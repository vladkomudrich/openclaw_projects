import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Article content database
const ARTICLES: Record<string, {
  title: string;
  description: string;
  emoji: string;
  readTime: number;
  sections: { heading: string; content: string[] }[];
}> = {
  "what-is-chrononutrition": {
    title: "What is Chrononutrition?",
    description: "Discover the science of meal timing and how it affects your health, energy, and performance.",
    emoji: "🕐",
    readTime: 5,
    sections: [
      {
        heading: "Introduction",
        content: [
          "Chrononutrition is the science of how meal timing affects our metabolism, energy levels, and overall health. It's based on the understanding that our bodies have internal clocks—circadian rhythms—that regulate nearly every biological process, including how we digest and metabolize food.",
        ],
      },
      {
        heading: "Your Body's Clock",
        content: [
          "Your body doesn't treat food the same way at all hours. In the morning (6-10 AM), glucose tolerance is highest, insulin sensitivity peaks, and your metabolism is revving up.",
          "At midday (11 AM - 2 PM), digestion peaks and energy utilization is high.",
          "In the evening (6 PM onwards), glucose tolerance drops 50%+, insulin sensitivity decreases, and metabolism winds down.",
        ],
      },
      {
        heading: "Why Timing Matters",
        content: [
          "Research shows that when you eat can be as important as what you eat. Same calories eaten early vs. late produce different metabolic outcomes.",
          "Breakfast skippers show 15-20% worse cognitive performance. Late dinners disrupt sleep and increase fat storage.",
        ],
      },
      {
        heading: "Time-Restricted Eating",
        content: [
          "A key application of chrononutrition is time-restricted eating: consuming all food within an 8-12 hour window.",
          "This allows a 12-16 hour overnight fast, giving your body time to complete digestion and switch to fat burning.",
        ],
      },
      {
        heading: "The Benefits",
        content: [
          "When you align eating with your circadian rhythm, you get: more stable energy, better mental clarity, improved metabolic health, better sleep quality, and enhanced fat burning.",
        ],
      },
    ],
  },
  "why-breakfast-timing-matters": {
    title: "Why Breakfast Timing Matters for Your Brain",
    description: "Learn how eating breakfast at the right time can boost your mental performance by 15-20%.",
    emoji: "🧠",
    readTime: 6,
    sections: [
      {
        heading: "The Breakfast-Brain Connection",
        content: [
          "Your brain is the most energy-demanding organ, consuming about 20% of daily calories. After an overnight fast, your brain is running low on glucose.",
          "Studies show breakfast skippers have 15-20% worse cognitive performance including impaired working memory, attention span, and decision-making.",
        ],
      },
      {
        heading: "Optimal Timing: 1-2 Hours After Waking",
        content: [
          "The cortisol awakening response mobilizes energy stores naturally. Eating too early can blunt this response.",
          "Glucose tolerance peaks in the morning hours. Insulin sensitivity is highest, directing nutrients to muscles and brain.",
        ],
      },
      {
        heading: "Best Breakfast Components",
        content: [
          "Protein (eggs, Greek yogurt) provides tyrosine for dopamine and sustains satiety.",
          "Complex carbohydrates (oatmeal, whole grain toast) provide steady glucose for brain fuel.",
          "Healthy fats (avocado, nuts) support brain cell membranes and slow digestion for sustained energy.",
        ],
      },
    ],
  },
  "metabolic-switch-explained": {
    title: "The Metabolic Switch: What Happens During Fasting",
    description: "Understanding the 12-hour threshold and how fasting activates fat burning and autophagy.",
    emoji: "🔥",
    readTime: 7,
    sections: [
      {
        heading: "What is the Metabolic Switch?",
        content: [
          "Around 12 hours into a fast, your body transitions from burning glucose to burning fat for fuel.",
          "This involves depleting glycogen stores, increasing fat oxidation, producing ketones, and activating autophagy (cellular cleanup).",
        ],
      },
      {
        heading: "The Timeline",
        content: [
          "Hours 0-4: Digesting recent meal, blood glucose elevated, insulin high.",
          "Hours 4-8: Blood glucose normalizes, insulin drops, liver glycogen being used.",
          "Hours 8-12: Glycogen depleting, fat oxidation increasing, ketone production starting.",
          "Hours 12-16: The magic happens—glycogen depleted, fat burning increased, autophagy activated.",
        ],
      },
      {
        heading: "Benefits of Hitting the Switch",
        content: [
          "Fat burning: Access to stored body fat for fuel and improved metabolic flexibility.",
          "Cellular cleanup: Removal of damaged proteins, recycling of cellular components.",
          "Metabolic health: Improved insulin sensitivity, better glucose control, reduced inflammation.",
          "Mental clarity: Ketones efficiently fuel the brain, many report enhanced focus.",
        ],
      },
    ],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = ARTICLES[slug];
  
  if (!article) {
    return { title: "Article Not Found" };
  }
  
  return {
    title: `${article.title} | FuelTime Learn`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: "article",
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = ARTICLES[slug];
  
  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[var(--fueltime-gray-200)] px-4 py-4 sticky top-0 z-30">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/learn" className="p-2 rounded-lg hover:bg-[var(--fueltime-gray-100)] text-[var(--fueltime-gray-600)]">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <span className="text-sm text-[var(--fueltime-gray-500)]">
            Back to Learn
          </span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {/* Article Header */}
        <div className="text-center mb-8">
          <span className="text-5xl">{article.emoji}</span>
          <h1 className="text-3xl font-bold text-[var(--fueltime-gray-900)] mt-4">
            {article.title}
          </h1>
          <p className="text-[var(--fueltime-gray-600)] mt-2">
            {article.readTime} min read
          </p>
        </div>

        {/* Article Content */}
        <article className="space-y-8">
          {article.sections.map((section, idx) => (
            <section key={idx}>
              <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-4">
                {section.heading}
              </h2>
              {section.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="text-[var(--fueltime-gray-700)] leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>

        {/* Bottom CTA */}
        <div className="mt-12 p-6 bg-gradient-to-r from-[var(--fueltime-green-500)] to-[var(--fueltime-green-600)] rounded-2xl text-white text-center">
          <h3 className="font-bold text-lg">Apply What You've Learned</h3>
          <p className="text-sm text-white/80 mt-1">
            Get your personalized eating schedule based on your goals.
          </p>
          <div className="flex gap-3 justify-center mt-4">
            <Link href="/" className="px-6 py-2 bg-white text-[var(--fueltime-green-600)] font-semibold rounded-xl hover:shadow-lg transition-all">
              View My Schedule
            </Link>
            <Link href="/learn" className="px-6 py-2 border-2 border-white text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
              More Articles
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(ARTICLES).map((slug) => ({ slug }));
}
