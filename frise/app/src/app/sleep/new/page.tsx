"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSleepData } from "@/hooks/useSleepData";
import { SleepEntryForm } from "@/components/sleep/SleepEntryForm";
import { GlassButton } from "@/components/ui/GlassButton";
import { GlassCard } from "@/components/ui/GlassCard";
import { format, differenceInMinutes, parseISO } from "date-fns";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

function NewSleepEntryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const { addSleepEntry, updateSettings, hasCompletedOnboarding } = useSleepData();
  const shouldReduceMotion = useReducedMotion();

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
    <div className="relative">
      {/* Ambient background elements */}
      <div 
        className="absolute -top-32 -right-32 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(123,104,238,0.08) 0%, transparent 60%)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />
      <div 
        className="absolute top-1/2 -left-20 w-[200px] h-[200px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(91,141,239,0.05) 0%, transparent 60%)",
          filter: "blur(50px)",
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <motion.div 
        className="flex items-center justify-between mb-10 relative z-10"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] as const }}
      >
        <Link href="/">
          <GlassButton variant="ghost" size="sm" icon={<span>←</span>}>
            Back
          </GlassButton>
        </Link>
        <div className="text-center">
          <h1 className="font-display font-semibold text-lg text-[var(--text-primary)]">
            Log Your Sleep
          </h1>
          <p className="text-xs text-[var(--text-muted)] tracking-wide mt-0.5">
            {format(displayDate, "EEEE, MMMM d")}
          </p>
        </div>
        <div className="w-20" />
      </motion.div>

      {/* Instructions */}
      <motion.div 
        className="text-center mb-10 relative z-10"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <GlassCard padding="md" className="inline-block !px-6">
          <p className="text-[var(--text-secondary)] flex items-center gap-2">
            <motion.span
              animate={shouldReduceMotion ? {} : { rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🌙
            </motion.span>
            <span>When did you go to bed and wake up?</span>
          </p>
        </GlassCard>
      </motion.div>

      {/* Form */}
      <div className="relative z-10">
        <SleepEntryForm onSubmit={handleSubmit} date={targetDate} />
      </div>

      {/* Privacy note */}
      <motion.div
        className="text-center mt-10 relative z-10"
        initial={shouldReduceMotion ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-xs text-[var(--text-muted)] flex items-center justify-center gap-2 tracking-wide">
          <span>🔒</span>
          Your data stays on your device
        </p>
      </motion.div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div className="h-9 w-20 bg-[var(--glass-bg)] rounded-lg animate-pulse" />
        <div className="text-center">
          <div className="h-6 w-32 bg-[var(--glass-bg)] rounded-lg animate-pulse mx-auto" />
          <div className="h-4 w-24 bg-[var(--glass-bg)] rounded mt-1 animate-pulse mx-auto" />
        </div>
        <div className="w-20" />
      </div>
      <div className="h-12 bg-[var(--glass-bg)] rounded-xl animate-pulse max-w-xs mx-auto" />
      <div className="h-40 bg-[var(--glass-bg)] rounded-2xl animate-pulse" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-28 bg-[var(--glass-bg)] rounded-2xl animate-pulse" />
        <div className="h-28 bg-[var(--glass-bg)] rounded-2xl animate-pulse" />
      </div>
      <div className="h-56 bg-[var(--glass-bg)] rounded-2xl animate-pulse" />
      <div className="h-14 bg-[var(--glass-bg)] rounded-xl animate-pulse" />
    </div>
  );
}

export default function NewSleepEntryPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="container max-w-md mx-auto px-4 py-8">
        <Suspense fallback={<LoadingFallback />}>
          <NewSleepEntryContent />
        </Suspense>
      </div>
    </main>
  );
}
