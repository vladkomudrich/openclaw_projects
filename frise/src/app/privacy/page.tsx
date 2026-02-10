import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy - Frise",
  description: "Frise privacy policy - how we handle your sleep data",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-primary hover:underline mb-8"
        >
          ← Back to App
        </Link>

        <article className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold text-text-primary mb-2">Privacy Policy</h1>
          <p className="text-text-secondary mb-8">Last updated: February 6, 2026</p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Summary</h2>
            <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-4">
              <p className="text-text-primary font-medium">
                🔒 <strong>Your data stays on your device.</strong> We don't collect, store, or transmit any of your personal or sleep data.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Data Storage</h2>
            <p className="text-text-secondary mb-4">
              Frise stores all your sleep data locally in your browser using localStorage. This means:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>Your sleep entries never leave your device</li>
              <li>No account or registration is required</li>
              <li>Data is retained for 14 days automatically</li>
              <li>You can export or delete your data at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">What We Collect</h2>
            <p className="text-text-secondary mb-4">
              <strong>Nothing.</strong> Frise does not:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li>Track your usage or behavior</li>
              <li>Use cookies for tracking purposes</li>
              <li>Send your data to any servers</li>
              <li>Share any information with third parties</li>
              <li>Require any personal information</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Analytics</h2>
            <p className="text-text-secondary">
              In the future, we may add anonymous, aggregated analytics to understand how the app is used (such as page views). If we do, we will:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 mt-2">
              <li>Update this privacy policy first</li>
              <li>Never track individual users</li>
              <li>Never access your sleep data</li>
              <li>Provide an opt-out option</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Your Rights</h2>
            <p className="text-text-secondary mb-4">
              You have complete control over your data:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2">
              <li><strong>Export:</strong> Download all your data as JSON anytime via Settings</li>
              <li><strong>Delete:</strong> Clear all data instantly via Settings</li>
              <li><strong>Portability:</strong> Import your data on another device</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Third-Party Services</h2>
            <p className="text-text-secondary">
              Frise is a standalone web application. We do not integrate with any third-party services that have access to your personal data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Contact</h2>
            <p className="text-text-secondary">
              If you have questions about this privacy policy or the app, please reach out:
            </p>
            <p className="text-primary mt-2">
              hello@frise.app
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-text-primary mb-4">Changes</h2>
            <p className="text-text-secondary">
              We may update this privacy policy from time to time. Any changes will be posted on this page with an updated date.
            </p>
          </section>
        </article>
      </div>
    </main>
  );
}
