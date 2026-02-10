import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - FuelTime",
  description: "FuelTime's privacy policy. Learn how we protect your data and respect your privacy.",
};

export default function PrivacyPage() {
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
        <h1 className="text-4xl font-bold text-[var(--fueltime-gray-900)] mb-2">
          Privacy Policy
        </h1>
        <p className="text-[var(--fueltime-gray-500)] mb-8">
          Last updated: February 6, 2026
        </p>

        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-4">
              Our Commitment to Your Privacy
            </h2>
            <p className="text-[var(--fueltime-gray-700)] leading-relaxed">
              FuelTime is designed with privacy as a core principle. We believe your health data belongs to you, and we've built our app to reflect that belief.
            </p>
            <div className="p-4 bg-[var(--fueltime-green-50)] rounded-xl mt-4">
              <p className="font-semibold text-[var(--fueltime-green-700)]">
                🔒 TL;DR: Your data stays on your device. We don't collect, store, or share your personal information.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-4">
              Data Storage
            </h2>
            <p className="text-[var(--fueltime-gray-700)] leading-relaxed">
              FuelTime uses <strong>local storage</strong> (your browser's built-in storage) to save your data. This means:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--fueltime-gray-700)] mt-4">
              <li>Your profile and preferences are stored on your device only</li>
              <li>Your meal logs never leave your device</li>
              <li>Your eating schedule calculations happen entirely in your browser</li>
              <li>No data is sent to our servers (we don't even have servers for user data)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-4">
              What We Don't Collect
            </h2>
            <p className="text-[var(--fueltime-gray-700)] leading-relaxed">
              FuelTime does <strong>not</strong> collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--fueltime-gray-700)] mt-4">
              <li>Personal identification information (name, email, phone)</li>
              <li>Health or medical data</li>
              <li>Location data</li>
              <li>Device identifiers</li>
              <li>Cookies for tracking purposes</li>
              <li>Any data that could identify you</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-4">
              Analytics
            </h2>
            <p className="text-[var(--fueltime-gray-700)] leading-relaxed">
              We may use privacy-respecting analytics to understand how the app is used in aggregate. This data is:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--fueltime-gray-700)] mt-4">
              <li>Completely anonymous</li>
              <li>Aggregated (we can't identify individual users)</li>
              <li>Used only to improve the app</li>
              <li>Never sold to third parties</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-4">
              Data Export and Deletion
            </h2>
            <p className="text-[var(--fueltime-gray-700)] leading-relaxed">
              You have full control over your data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[var(--fueltime-gray-700)] mt-4">
              <li><strong>Export:</strong> You can export all your data anytime from Settings</li>
              <li><strong>Delete:</strong> You can delete all data with one tap in Settings</li>
              <li><strong>Clear browser data:</strong> Clearing your browser's local storage also removes FuelTime data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-4">
              Third-Party Services
            </h2>
            <p className="text-[var(--fueltime-gray-700)] leading-relaxed">
              FuelTime is a standalone web app. We don't integrate with third-party services that would access your personal data. The app works entirely offline after initial load.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-4">
              Changes to This Policy
            </h2>
            <p className="text-[var(--fueltime-gray-700)] leading-relaxed">
              If we ever change our privacy practices, we'll update this page and the "last updated" date. Our commitment to privacy-first design won't change.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--fueltime-gray-900)] mb-4">
              Contact
            </h2>
            <p className="text-[var(--fueltime-gray-700)] leading-relaxed">
              Questions about privacy? We're happy to explain anything in more detail.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--fueltime-gray-50)] border-t border-[var(--fueltime-gray-200)] mt-12">
        <div className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="text-sm text-[var(--fueltime-gray-500)]">
            © 2026 FuelTime. Your privacy matters to us.
          </p>
        </div>
      </footer>
    </div>
  );
}
