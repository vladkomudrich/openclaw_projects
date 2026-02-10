import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Two-Process Model - Frise Learn",
  description: "Understanding the science behind Frise's productivity predictions",
};

export default function TwoProcessModelPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Link 
          href="/learn" 
          className="inline-flex items-center text-primary hover:underline mb-8"
        >
          ← Back to Learn
        </Link>

        <article className="prose prose-slate max-w-none">
          <div className="mb-8">
            <span className="text-5xl mb-4 block">🧬</span>
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              The Two-Process Model
            </h1>
            <p className="text-text-secondary">
              4 min read · The science behind Frise
            </p>
          </div>

          <section className="mb-8">
            <p className="text-lg text-text-secondary leading-relaxed">
              Frise predicts your productivity using the <strong>Two-Process Model of sleep regulation</strong>, 
              developed by Dr. Alexander Borbély in 1982. This model explains how two independent biological 
              processes work together to determine when you feel alert and when you feel tired.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Process S: Sleep Pressure (Homeostatic)
            </h2>
            <div className="bg-thermal-low/10 border border-thermal-low/30 rounded-lg p-4 mb-4">
              <p className="text-text-primary">
                💤 <strong>Sleep pressure builds up the longer you're awake.</strong>
              </p>
            </div>
            <p className="text-text-secondary mb-4">
              Imagine a tank slowly filling with water. From the moment you wake up, adenosine 
              (a sleep-promoting chemical) accumulates in your brain. The longer you stay awake, 
              the more pressure you feel to sleep.
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>Builds up exponentially during waking hours</li>
              <li>Dissipates during sleep</li>
              <li>Affected by how well you slept the night before</li>
              <li>Caffeine works by blocking adenosine receptors</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Process C: Circadian Rhythm
            </h2>
            <div className="bg-thermal-mid/10 border border-thermal-mid/30 rounded-lg p-4 mb-4">
              <p className="text-text-primary">
                ☀️ <strong>Your internal clock cycles every ~24 hours regardless of sleep.</strong>
              </p>
            </div>
            <p className="text-text-secondary mb-4">
              Your body has a master clock in the brain (the suprachiasmatic nucleus) that regulates 
              alertness in a wave-like pattern. This rhythm is largely independent of whether you've 
              slept or not—it follows the day-night cycle.
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>Peak alertness typically around 10 AM and 6 PM</li>
              <li>Natural dip in early afternoon (2-3 PM)</li>
              <li>Lowest alertness around 3-4 AM</li>
              <li>Melatonin rises in the evening to prepare for sleep</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              How They Work Together
            </h2>
            <p className="text-text-secondary mb-4">
              Your actual alertness and productivity is the result of these two processes interacting:
            </p>
            <div className="bg-surface border border-border rounded-lg p-4 mb-4 font-mono text-center">
              <p className="text-text-primary">
                Alertness = Circadian Signal − Sleep Pressure
              </p>
            </div>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>
                <strong>Morning peak:</strong> Sleep pressure is low (just slept), circadian is rising
              </li>
              <li>
                <strong>Afternoon dip:</strong> Sleep pressure moderate, circadian dips
              </li>
              <li>
                <strong>Second wind:</strong> Sleep pressure higher, but circadian peaks again
              </li>
              <li>
                <strong>Evening decline:</strong> Both work together to make you sleepy
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              How Frise Uses This
            </h2>
            <p className="text-text-secondary mb-4">
              When you enter your sleep data, Frise calculates both processes for every 5-minute 
              interval throughout your day:
            </p>
            <ol className="list-decimal list-inside text-text-secondary space-y-2">
              <li>We determine your initial sleep pressure based on how long you slept</li>
              <li>We model how sleep pressure builds up through the day</li>
              <li>We calculate your circadian rhythm based on the time of day</li>
              <li>We combine these to predict your productivity at each moment</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              What This Means For You
            </h2>
            <div className="space-y-4">
              <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                <p className="text-text-primary">
                  ✅ <strong>Schedule important work during predicted peak times</strong>
                </p>
              </div>
              <div className="bg-info/10 border border-info/30 rounded-lg p-4">
                <p className="text-text-primary">
                  💡 <strong>Use energy dips for routine tasks or breaks</strong>
                </p>
              </div>
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-text-primary">
                  🌙 <strong>Respect the melatonin window for better sleep</strong>
                </p>
              </div>
            </div>
          </section>

          <section className="mt-12 pt-8 border-t border-border">
            <h3 className="text-lg font-semibold text-text-primary mb-4">References</h3>
            <ul className="text-sm text-text-secondary space-y-2">
              <li>
                Borbély, A. A. (1982). A two process model of sleep regulation. 
                <em>Human Neurobiology, 1</em>(3), 195-204.
              </li>
              <li>
                Daan, S., Beersma, D. G., & Borbély, A. A. (1984). Timing of human sleep: 
                recovery process gated by a circadian pacemaker. 
                <em>American Journal of Physiology</em>.
              </li>
            </ul>
          </section>
        </article>

        <div className="mt-8 text-center">
          <Link href="/learn" className="text-primary hover:underline">
            ← Read more articles
          </Link>
        </div>
      </div>
    </main>
  );
}
