import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Blog post content database
const BLOG_POSTS: Record<string, {
  title: string;
  excerpt: string;
  date: string;
  readTime: number;
  category: string;
  sections: { heading: string; content: string[] }[];
}> = {
  "best-times-to-eat-for-focus-and-energy": {
    title: "Best Times to Eat for Focus and Energy: A Complete Guide",
    excerpt: "Discover the optimal meal times to maximize your mental clarity, sustain energy throughout the day, and avoid the dreaded afternoon slump.",
    date: "2026-02-06",
    readTime: 8,
    category: "Performance",
    sections: [
      {
        heading: "Introduction",
        content: [
          "If you've ever wondered why you crash at 2 PM or struggle to focus in the morning, the answer might not be what you're eating—but when.",
          "Meal timing has a profound effect on your energy levels and cognitive performance throughout the day.",
        ],
      },
      {
        heading: "The Science of Meal Timing and Energy",
        content: [
          "Your body runs on an internal clock called the circadian rhythm. This 24-hour cycle regulates everything from sleep-wake patterns to hormone production.",
          "Key findings: Glucose tolerance is highest in the morning. Insulin sensitivity peaks in the morning. Digestive efficiency follows a circadian pattern. Cognitive performance is influenced by blood glucose stability.",
        ],
      },
      {
        heading: "Optimal Breakfast Time: 1-2 Hours After Waking",
        content: [
          "Your cortisol awakening response mobilizes energy stores naturally. Glucose tolerance is at its peak. Your brain needs fuel after the overnight fast.",
          "Best breakfast foods: Protein (eggs, Greek yogurt) for sustained energy, complex carbohydrates (oatmeal, whole grains) for brain fuel, healthy fats (avocado, nuts) for satiety.",
        ],
      },
      {
        heading: "Optimal Lunch Time: 4-5 Hours After Breakfast",
        content: [
          "Your lunch should come when your digestive system is at peak efficiency—typically between 12-1 PM.",
          "Keep portions moderate to avoid the food coma effect. Balance macronutrients to prevent blood sugar spikes. Avoid heavy, high-fat meals that slow digestion.",
        ],
      },
      {
        heading: "The Afternoon Slump: Prevention Strategies",
        content: [
          "That 2-3 PM energy crash is a natural circadian dip, but poor meal timing makes it worse.",
          "Eat a lighter, balanced lunch. Have a small protein-rich snack around 3 PM if needed. Avoid high-sugar foods at lunch. Stay hydrated.",
        ],
      },
      {
        heading: "Optimal Dinner Time: 3+ Hours Before Bed",
        content: [
          "Research shows eating earlier in the evening leads to better sleep, better metabolism, and better energy the next day.",
          "Your body processes food less efficiently at night. Eating close to bedtime disrupts sleep quality. Late eating is associated with weight gain.",
        ],
      },
    ],
  },
  "science-of-meal-timing": {
    title: "The Science of Meal Timing: How Your Body's Clock Affects Metabolism",
    excerpt: "Your body doesn't treat food the same at all hours. Learn how circadian rhythms control metabolism and why timing matters as much as what you eat.",
    date: "2026-02-05",
    readTime: 10,
    category: "Science",
    sections: [
      {
        heading: "Introduction",
        content: [
          "For decades, nutrition focused on what we eat. But research reveals that when we eat may be equally important.",
          "Chrononutrition studies how meal timing interacts with our circadian rhythms to affect health, metabolism, and performance.",
        ],
      },
      {
        heading: "Your Body's Internal Clock",
        content: [
          "Every cell has a molecular clock. The master clock in your brain coordinates through light exposure. But peripheral clocks in your liver, pancreas, and gut are influenced by when you eat.",
          "Two zeitgebers (time-givers): Light sets your central clock, Food sets your peripheral clocks. When misaligned, metabolic problems ensue.",
        ],
      },
      {
        heading: "How Metabolism Changes Throughout the Day",
        content: [
          "Morning (6-10 AM): Glucose tolerance highest, insulin sensitivity peaks, thermogenesis most efficient.",
          "Midday (11 AM - 2 PM): Digestive enzyme production peaks, gut motility optimal, nutrient absorption efficient.",
          "Evening (6 PM onwards): Glucose tolerance drops 30-50%, insulin sensitivity decreases, fat storage pathways activate.",
        ],
      },
      {
        heading: "Key Research Findings",
        content: [
          "Identical meal studies show morning meals lead to lower blood glucose responses. Evening meals cause higher and longer glucose spikes.",
          "Time-restricted eating studies show 8-10 hour windows improve metabolic markers even without calorie restriction. Earlier windows outperform later ones.",
        ],
      },
    ],
  },
  "time-restricted-eating-beginners-guide": {
    title: "Time-Restricted Eating: The Beginner's Guide to TRE",
    excerpt: "Everything you need to know to start time-restricted eating, from choosing your eating window to optimizing results.",
    date: "2026-02-04",
    readTime: 12,
    category: "Getting Started",
    sections: [
      {
        heading: "What is Time-Restricted Eating?",
        content: [
          "Time-restricted eating (TRE) is a form of intermittent fasting where you consume all daily food within a specific window, typically 8-12 hours.",
          "Unlike calorie-focused diets, TRE focuses on when you eat rather than what or how much.",
        ],
      },
      {
        heading: "Common TRE Protocols",
        content: [
          "16:8 (8-hour eating window): Most researched, good for metabolic benefits. Example: Eat between 10 AM - 6 PM.",
          "14:10 (10-hour window): More sustainable for beginners. Example: Eat between 8 AM - 6 PM.",
          "12:12 (12-hour window): Minimum effective protocol. Example: Eat between 7 AM - 7 PM.",
        ],
      },
      {
        heading: "How to Start",
        content: [
          "Week 1-2: Track your current eating times and identify challenges.",
          "Week 3-4: Start with a 12-hour window, focus on consistent times, stop eating 2-3 hours before bed.",
          "Week 5+: Gradually narrow to 10-hour window if desired, experiment with earlier vs later windows.",
        ],
      },
      {
        heading: "What to Expect",
        content: [
          "First few days: Possible hunger at previous eating times—typically passes within 3-5 days.",
          "First week: Body begins adapting, many notice improved morning energy, sleep quality often improves.",
          "First month: New pattern feels natural, hunger adapts, benefits become noticeable.",
        ],
      },
      {
        heading: "Tips for Success",
        content: [
          "Stay hydrated—water, black coffee, and plain tea don't break your fast.",
          "Be consistent—same eating window daily yields best results.",
          "Front-load calories—bigger breakfast, smaller dinner.",
          "Be patient—give it 2-4 weeks to assess.",
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
  const post = BLOG_POSTS[slug];
  
  if (!post) {
    return { title: "Article Not Found" };
  }
  
  return {
    title: `${post.title} | FuelTime Blog`,
    description: post.excerpt,
    keywords: ["meal timing", "chrononutrition", "time-restricted eating", post.category.toLowerCase()],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = BLOG_POSTS[slug];
  
  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[var(--fueltime-gray-200)]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-4">
            <Link href="/blog" className="text-[var(--fueltime-gray-600)] hover:text-[var(--fueltime-green-600)] flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <span className="text-sm font-medium text-[var(--fueltime-green-600)] uppercase tracking-wide">
            {post.category}
          </span>
          <h1 className="text-4xl font-bold text-[var(--fueltime-gray-900)] mt-2 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 mt-4 text-sm text-[var(--fueltime-gray-500)]">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime} min read</span>
          </div>
        </header>

        {/* Article Content */}
        <article className="space-y-8">
          {post.sections.map((section, idx) => (
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

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[var(--fueltime-green-500)] to-[var(--fueltime-green-600)] rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold">Get Your Personalized Eating Schedule</h3>
          <p className="text-white/80 mt-2">
            FuelTime calculates your optimal meal times based on your schedule and goals.
          </p>
          <Link href="/">
            <button className="mt-6 px-8 py-3 bg-white text-[var(--fueltime-green-600)] font-semibold rounded-xl hover:shadow-lg transition-all">
              Try FuelTime Free
            </button>
          </Link>
        </div>

        {/* Related Posts */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-[var(--fueltime-gray-900)] mb-4">
            Related Articles
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(BLOG_POSTS)
              .filter(([s]) => s !== slug)
              .slice(0, 2)
              .map(([s, p]) => (
                <Link key={s} href={`/blog/${s}`}>
                  <div className="p-4 bg-[var(--fueltime-gray-50)] rounded-xl hover:bg-[var(--fueltime-green-50)] transition-colors">
                    <span className="text-xs font-medium text-[var(--fueltime-green-600)]">
                      {p.category}
                    </span>
                    <h4 className="font-semibold text-[var(--fueltime-gray-900)] mt-1 line-clamp-2">
                      {p.title}
                    </h4>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--fueltime-gray-50)] border-t border-[var(--fueltime-gray-200)] mt-12">
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="font-bold text-[var(--fueltime-gray-900)]">🍽️⏰ FuelTime</p>
          <p className="text-sm text-[var(--fueltime-gray-500)] mt-1">
            Science-based meal timing optimizer
          </p>
        </div>
      </footer>
    </div>
  );
}

export function generateStaticParams() {
  return Object.keys(BLOG_POSTS).map((slug) => ({ slug }));
}
