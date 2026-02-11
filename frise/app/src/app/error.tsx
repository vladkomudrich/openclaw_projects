"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to console (could be sent to error tracking service)
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">😵</div>
        <h1 className="text-2xl font-bold text-text-primary mb-4">
          Something went wrong
        </h1>
        <p className="text-text-secondary mb-6">
          We hit an unexpected error. Your data is safe—it's stored locally in your browser.
        </p>
        
        <div className="space-y-3">
          <Button onClick={reset} fullWidth>
            Try Again
          </Button>
          <Button 
            variant="secondary" 
            fullWidth 
            onClick={() => window.location.href = "/"}
          >
            Go Home
          </Button>
        </div>

        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 p-4 bg-error/10 rounded-lg text-left">
            <p className="text-sm font-mono text-error">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-text-secondary mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
