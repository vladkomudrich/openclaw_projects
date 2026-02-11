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

function EditSleepEntryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const { todayEntry, entries, addSleepEntry, deleteSleepEntry } = useSleepData();

  // Get the entry for the specified date or today
  const targetDate = dateParam || format(new Date(), "yyyy-MM-dd");
  const displayDate = parseISO(targetDate);
  const entry = dateParam 
    ? entries.find(e => e.date === dateParam) 
    : todayEntry;

  const handleSubmit = (bedtime: Date, wakeTime: Date) => {
    const duration = differenceInMinutes(wakeTime, bedtime);

    addSleepEntry({
      date: targetDate,
      bedtime: bedtime.toISOString(),
      wakeTime: wakeTime.toISOString(),
      duration: duration > 0 ? duration : duration + 24 * 60,
    });

    router.push("/");
  };

  const handleDelete = () => {
    if (entry && confirm("Are you sure you want to delete this sleep entry?")) {
      deleteSleepEntry(entry.date);
      router.push("/");
    }
  };

  // Parse existing entry if available
  const initialBedtime = entry ? parseISO(entry.bedtime) : undefined;
  const initialWakeTime = entry ? parseISO(entry.wakeTime) : undefined;

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
            Edit Sleep
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
            ✏️ Update your sleep times
          </p>
        </GlassCard>
      </motion.div>

      {/* Form */}
      <SleepEntryForm 
        onSubmit={handleSubmit}
        initialBedtime={initialBedtime}
        initialWakeTime={initialWakeTime}
        date={targetDate}
      />

      {/* Delete option */}
      {entry && (
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <GlassButton 
            variant="ghost" 
            onClick={handleDelete}
            className="!text-[var(--error)] hover:!bg-[var(--error-muted)]"
            icon={<span>🗑️</span>}
          >
            Delete Entry
          </GlassButton>
        </motion.div>
      )}
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

export default function EditSleepEntryPage() {
  return (
    <main className="min-h-screen">
      <div className="container max-w-md mx-auto px-4 py-8">
        <Suspense fallback={<LoadingFallback />}>
          <EditSleepEntryContent />
        </Suspense>
      </div>
    </main>
  );
}
