import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About FuelTime - Science-Based Meal Timing",
  description: "Learn about FuelTime's mission to make chrononutrition science accessible and help people optimize their eating schedules for better health and performance.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-[var(--fueltime-gray-200)]">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-[var(--fueltime-gray-600)] hover:text-[var(--fueltime-green-600)] flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <span className="text-6xl">🍽️⏰</span>
          <h1 className="text-4xl font-bold text-[var(--fueltime-gray-900)] mt-4">
            About FuelTime
          </h1>
          <p className="text-xl text-[var(--fueltime-gray-600)] mt-2">
            Science-based meal timing for everyone
          </p>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-4">Our Mission</h2>
            <p className="text-[var(--fueltime-gray-700)] leading-relaxed">
              FuelTime exists to make chrononutrition science accessible to everyone. We believe that optimizing <em>when</em> you eat is one of the simplest, most powerful changes you can make for better energy, focus, and metabolic health.
            </p>
            <p className="text-[var(--fueltime-gray-700)] leading-relaxed mt-4">
              Unlike complex diet plans that focus on counting calories or restricting foods, FuelTime focuses on timing—aligning your eating patterns with your body's natural circadian rhythms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-4">The Science Behind FuelTime</h2>
            <p className="text-[var(--fueltime-gray-700)] leading-relaxed">
              FuelTime is built on decades of chrononutrition research, including groundbreaking work from institutions like the Salk Institute, Harvard Medical School, and Johns Hopkins University.
            </p>
            <p className="text-[var(--fueltime-gray-700)] leading-relaxed mt-4">
              Key scientific principles we apply:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--fueltime-gray-700)] mt-4">
              <li>Glucose tolerance and insulin sensitivity follow circadian patterns</li>
              <li>Time-restricted eating (8-12 hour windows) improves metabolic health</li>
              <li>Meal timing affects cognitive performance and energy levels</li>
              <li>Consistency in eating times is as important as the window itself</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-4">What Makes Us Different</h2>
            <div className="grid gap-6 md:grid-cols-2 mt-6">
              <div className="p-4 bg-[var(--fueltime-green-50)] rounded-xl">
                <span className="text-2xl">🎯</span>
                <h3 className="font-semibold text-[var(--fueltime-gray-900)] mt-2">Focus on Timing</h3>
                <p className="text-sm text-[var(--fueltime-gray-600)] mt-1">
                  We focus on <em>when</em> you eat, not what or how much. Works with any diet.
                </p>
              </div>
              <div className="p-4 bg-[var(--fueltime-blue-50)] rounded-xl">
                <span className="text-2xl">🔬</span>
                <h3 className="font-semibold text-[var(--fueltime-gray-900)] mt-2">Science-Backed</h3>
                <p className="text-sm text-[var(--fueltime-gray-600)] mt-1">
                  Every recommendation is based on peer-reviewed research.
                </p>
              </div>
              <div className="p-4 bg-[var(--fueltime-orange-50)] rounded-xl">
                <span className="text-2xl">⚡</span>
                <h3 className="font-semibold text-[var(--fueltime-gray-900)] mt-2">Instant Value</h3>
                <p className="text-sm text-[var(--fueltime-gray-600)] mt-1">
                  Get your personalized schedule in seconds, not days.
                </p>
              </div>
              <div className="p-4 bg-[var(--fueltime-gray-100)] rounded-xl">
                <span className="text-2xl">🔒</span>
                <h3 className="font-semibold text-[var(--fueltime-gray-900)] mt-2">Privacy-First</h3>
                <p className="text-sm text-[var(--fueltime-gray-600)] mt-1">
                  All data stored locally on your device. No account required.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-4">Our Values</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <span className="text-xl">📚</span>
                <div>
                  <p className="font-semibold text-[var(--fueltime-gray-900)]">Education First</p>
                  <p className="text-sm text-[var(--fueltime-gray-600)]">
                    We explain the science so you understand why timing matters.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-xl">🧘</span>
                <div>
                  <p className="font-semibold text-[var(--fueltime-gray-900)]">Sustainable Approach</p>
                  <p className="text-sm text-[var(--fueltime-gray-600)]">
                    We design for long-term habits, not quick fixes.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-xl">🤝</span>
                <div>
                  <p className="font-semibold text-[var(--fueltime-gray-900)]">Accessibility</p>
                  <p className="text-sm text-[var(--fueltime-gray-600)]">
                    FuelTime is free to use. Science shouldn't be paywalled.
                  </p>
                </div>
              </li>
            </ul>
          </section>
        </div>

        {/* CTA */}
        <div className="mt-12 p-8 bg-gradient-to-r from-[var(--fueltime-green-500)] to-[var(--fueltime-green-600)] rounded-2xl text-white text-center">
          <h3 className="text-2xl font-bold">Ready to Optimize Your Eating Schedule?</h3>
          <p className="text-white/80 mt-2">
            Get your personalized meal timing in 30 seconds.
          </p>
          <Link href="/">
            <button className="mt-6 px-8 py-3 bg-white text-[var(--fueltime-green-600)] font-semibold rounded-xl hover:shadow-lg transition-all">
              Get Started Free
            </button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--fueltime-gray-50)] border-t border-[var(--fueltime-gray-200)] mt-12">
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-[var(--fueltime-gray-500)]">
            © 2026 FuelTime. Built on chrononutrition research.
          </p>
        </div>
      </footer>
    </div>
  );
}
