"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSleepData } from "@/hooks/useSleepData";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { format, parseISO, subDays, startOfDay } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export default function HistoryPage() {
  const router = useRouter();
  const { entries, deleteSleepEntry, missingDates } = useSleepData();

  // Generate list of last 14 days
  const datesList = useMemo(() => {
    const dates: { date: string; entry: typeof entries[0] | null }[] = [];
    const today = startOfDay(new Date());
    
    for (let i = 0; i < 14; i++) {
      const date = format(subDays(today, i), "yyyy-MM-dd");
      const entry = entries.find(e => e.date === date) || null;
      dates.push({ date, entry });
    }
    
    return dates;
  }, [entries]);

  // Calculate stats
  const stats = useMemo(() => {
    if (entries.length === 0) return null;
    
    const totalDuration = entries.reduce((sum, e) => sum + e.duration, 0);
    const avgDuration = Math.round(totalDuration / entries.length);
    const bestNight = entries.reduce((best, e) => e.duration > best.duration ? e : best, entries[0]);
    
    return {
      avgDuration,
      totalNights: entries.length,
      bestNight: {
        date: bestNight.date,
        duration: bestNight.duration,
      },
    };
  }, [entries]);

  const handleDelete = (date: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteSleepEntry(date);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
  };

  const formatTime = (isoString: string) => {
    return format(parseISO(isoString), "h:mm a");
  };

  return (
    <main className="min-h-screen">
      <div className="container max-w-md mx-auto px-4 py-8 md:pt-24">
        {/* Header */}
        <motion.div 
          className="text-center mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-display-md gradient-text">Sleep History</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Track your sleep patterns over time
          </p>
        </motion.div>

        {/* Summary Stats */}
        {stats && (
          <motion.div 
            className="grid grid-cols-3 gap-3 mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard padding="sm" className="text-center">
              <p className="text-2xl font-display font-semibold text-[var(--accent-blue)]">
                {stats.totalNights}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">
                Nights
              </p>
            </GlassCard>
            <GlassCard padding="sm" className="text-center">
              <p className="text-2xl font-display font-semibold text-[var(--accent-purple)]">
                {formatDuration(stats.avgDuration)}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">
                Average
              </p>
            </GlassCard>
            <GlassCard padding="sm" className="text-center">
              <p className="text-2xl font-display font-semibold text-[var(--accent-gold)]">
                {formatDuration(stats.bestNight.duration)}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide">
                Best Night
              </p>
            </GlassCard>
          </motion.div>
        )}

        {/* Missing days warning */}
        {missingDates.length > 0 && (
          <motion.div 
            className="mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <GlassCard 
              padding="sm" 
              className="!border-[var(--warning)]"
              style={{ background: "var(--warning-muted)" }}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="text-sm font-medium text-[var(--warning)]">
                    {missingDates.length} day{missingDates.length !== 1 ? "s" : ""} missing
                  </p>
                  <p className="text-xs text-[var(--text-muted)]">
                    Consistent tracking helps improve predictions
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Entries List */}
        <motion.div 
          className="space-y-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {datesList.map(({ date, entry }) => {
            const displayDate = parseISO(date);
            const isToday = date === format(new Date(), "yyyy-MM-dd");
            const isYesterday = date === format(subDays(new Date(), 1), "yyyy-MM-dd");

            return (
              <motion.div key={date} variants={itemVariants}>
                <GlassCard
                  padding="md"
                  variant={entry ? "default" : "default"}
                  className={`
                    transition-all
                    ${!entry ? "!opacity-50 !border-dashed" : ""}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {/* Date indicator */}
                      <div className={`
                        w-12 h-12 rounded-xl flex flex-col items-center justify-center
                        ${entry 
                          ? "bg-gradient-to-br from-[var(--accent-purple)]/20 to-[var(--accent-blue)]/20" 
                          : "bg-[var(--glass-bg)]"
                        }
                      `}>
                        <span className="text-[10px] text-[var(--text-muted)] uppercase">
                          {format(displayDate, "EEE")}
                        </span>
                        <span className="text-lg font-display font-semibold text-[var(--text-primary)]">
                          {format(displayDate, "d")}
                        </span>
                      </div>

                      <div>
                        {/* Date label */}
                        <div className="flex items-center gap-2">
                          <span className="font-display font-semibold text-[var(--text-primary)]">
                            {isToday ? "Today" : isYesterday ? "Yesterday" : format(displayDate, "MMM d")}
                          </span>
                          {!entry && (
                            <span className="text-[10px] bg-[var(--warning-muted)] text-[var(--warning)] px-2 py-0.5 rounded-full">
                              Missing
                            </span>
                          )}
                        </div>

                        {/* Sleep data */}
                        {entry ? (
                          <div className="mt-0.5 text-sm text-[var(--text-secondary)]">
                            <span>{formatTime(entry.bedtime)}</span>
                            <span className="mx-2 text-[var(--text-muted)]">→</span>
                            <span>{formatTime(entry.wakeTime)}</span>
                            <span className="ml-2 text-[var(--accent-blue)] font-medium">
                              {formatDuration(entry.duration)}
                            </span>
                          </div>
                        ) : (
                          <p className="mt-0.5 text-sm text-[var(--text-muted)]">
                            No data recorded
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      {entry ? (
                        <>
                          <GlassButton
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/sleep/edit?date=${date}`)}
                            className="!px-2"
                          >
                            ✏️
                          </GlassButton>
                          <GlassButton
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(date)}
                            className="!px-2 !text-[var(--error)] hover:!bg-[var(--error-muted)]"
                          >
                            ✕
                          </GlassButton>
                        </>
                      ) : (
                        <GlassButton
                          variant="secondary"
                          size="sm"
                          onClick={() => router.push(`/sleep/new?date=${date}`)}
                        >
                          + Add
                        </GlassButton>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Export hint */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <GlassCard padding="md" className="inline-block">
            <p className="text-sm text-[var(--text-secondary)]">
              💾 Want to backup your data?{" "}
              <Link 
                href="/settings" 
                className="text-[var(--accent-blue)] hover:text-[var(--accent-blue-light)] transition-colors"
              >
                Export in Settings
              </Link>
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </main>
  );
}
