"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSleepData } from "@/hooks/useSleepData";
import { SleepEntryForm } from "@/components/sleep/SleepEntryForm";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { format, differenceInMinutes, parseISO } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";

function NewSleepEntryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const { addSleepEntry, updateSettings, hasCompletedOnboarding } = useSleepData();

  const targetDate = dateParam || format(new Date(), "yyyy-MM-dd");
  const displayDate = parseISO(targetDate);

  const handleSubmit = (bedtime: Date, wakeTime: Date) => {
    const duration = differenceInMinutes(wakeTime, bedtime);

    addSleepEntry({
      date: targetDate,
      bedtime: bedtime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      duration: duration > 0 ? duration : duration + 24 * 60,
    });

    // Mark onboarding as complete
    if (!hasCompletedOnboarding) {
      updateSettings({ onboardingCompleted: true });
    }

    router.push("/");
  };

  return (
    <>
      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Link href="/">
          <GlassButton variant="ghost" size="sm" icon={<span>←</span>}>
            Back
          </GlassButton>
        </Link>
        <div className="text-center">
          <h1 className="font-display font-semibold text-[var(--text-primary)]">
            Log Your Sleep
          </h1>
          <p className="text-xs text-[var(--text-muted)]">
            {format(displayDate, "EEEE, MMMM d")}
          </p>
        </div>
        <div className="w-20" />
      </motion.div>

      {/* Instructions */}
      <motion.div 
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <GlassCard padding="md" className="inline-block">
          <p className="text-[var(--text-secondary)]">
            🌙 When did you go to bed and wake up?
          </p>
        </GlassCard>
      </motion.div>

      {/* Form */}
      <SleepEntryForm onSubmit={handleSubmit} date={targetDate} />

      {/* Privacy note */}
      <motion.div
        className="text-center mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <p className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-2">
          <span>🔒</span>
          Your data stays on your device
        </p>
      </motion.div>
    </>
  );
}

function LoadingFallback() {
  return (
    <div className="space-y-6">
      <div className="h-12 bg-[var(--glass-bg)] rounded-xl animate-shimmer" />
      <div className="h-48 bg-[var(--glass-bg)] rounded-xl animate-shimmer" />
      <div className="h-32 bg-[var(--glass-bg)] rounded-xl animate-shimmer" />
    </div>
  );
}

export default function NewSleepEntryPage() {
  return (
    <main className="min-h-screen">
      <div className="container max-w-md mx-auto px-4 py-8">
        <Suspense fallback={<LoadingFallback />}>
          <NewSleepEntryContent />
        </Suspense>
      </div>
    </main>
  );
}
