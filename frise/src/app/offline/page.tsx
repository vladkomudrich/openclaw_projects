import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offline - Frise",
};

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">📴</div>
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          You're Offline
        </h1>
        <p className="text-text-secondary mb-6">
          It looks like you've lost your internet connection. Don't worry—your sleep data 
          is stored locally and will be available when you're back online.
        </p>
        <p className="text-sm text-text-secondary">
          Frise works best with an internet connection for the first load, but once cached, 
          you can view your data offline.
        </p>
      </div>
    </main>
  );
}
