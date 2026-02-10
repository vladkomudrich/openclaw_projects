"use client";

import { ProductivityCurve as CurveData } from "@/types";
import { GlassCard, GlassStatCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { ProductivityCurve } from "@/components/visualization/ProductivityCurve";
import { SleepDebtRing } from "./SleepDebtWidget";
import { ContextualAdvice } from "./ContextualAdvice";
import { format, parseISO, differenceInMinutes } from "date-fns";
import Link from "next/link";
import { motion } from "framer-motion";

interface DashboardProps {
  curve: CurveData;
  onLogSleep?: () => void;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const }
  },
};

export function Dashboard({ curve, onLogSleep }: DashboardProps) {
  const { points, insights, melatoninWindow, sleepEntry, wakeTime } = curve;
  
  // Calculate sleep duration
  const sleepDuration = sleepEntry 
    ? calculateSleepDuration(sleepEntry.bedtime, sleepEntry.wakeTime)
    : { hours: 0, minutes: 0 };
  
  return (
    <motion.div 
      className="space-y-5 pb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div className="text-center pt-4 md:pt-16" variants={itemVariants}>
        <p className="label text-[var(--text-muted)]">
          {format(new Date(), "EEEE, MMMM d")}
        </p>
        <h1 className="text-display-md mt-1 gradient-text">
          Your Productivity Forecast
        </h1>
      </motion.div>

      {/* Sleep Summary Card */}
      <motion.div variants={itemVariants}>
        <GlassCard padding="lg">
          <div className="flex items-center justify-between">
            {/* Sleep Duration */}
            <div className="flex-1">
              <p className="label">Last Night's Sleep</p>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="stat-number-lg text-[var(--text-primary)]">
                  {sleepDuration.hours}
                </span>
                <span className="text-2xl text-[var(--text-secondary)] font-display">h</span>
                {sleepDuration.minutes > 0 && (
                  <>
                    <span className="stat-number-lg text-[var(--text-primary)]">
                      {sleepDuration.minutes}
                    </span>
                    <span className="text-2xl text-[var(--text-secondary)] font-display">m</span>
                  </>
                )}
              </div>
              
              {/* Sleep Timeline Bar */}
              <SleepTimelineBar 
                bedtime={sleepEntry?.bedtime || ""} 
                wakeTime={sleepEntry?.wakeTime || ""}
              />
            </div>

            {/* Sleep Debt Ring */}
            <div className="flex-shrink-0 ml-4">
              <SleepDebtRing sleepDebt={insights.sleepDebt} />
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Productivity Curve */}
      <motion.div variants={itemVariants}>
        <GlassCard padding="md">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-semibold text-[var(--text-primary)]">
              Energy Forecast
            </h2>
            <span className="label">24h outlook</span>
          </div>
          <ProductivityCurve
            points={points}
            wakeTime={wakeTime}
            melatoninWindow={melatoninWindow}
            showAnimation={true}
          />
        </GlassCard>
      </motion.div>

      {/* Contextual Advice */}
      <motion.div variants={itemVariants}>
        <ContextualAdvice
          zone={insights.currentZone}
          productivityValue={insights.currentProductivity}
        />
      </motion.div>

      {/* Key Insights Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-3 gap-3">
          <GlassStatCard
            icon="🎯"
            label="Deep Work"
            value={insights.peakStartTime}
            sublabel={`until ${insights.peakEndTime}`}
          />
          <GlassStatCard
            icon="🌙"
            label="Melatonin"
            value={insights.melatoninWindowStart}
            sublabel="window opens"
          />
          <GlassStatCard
            icon="🛏️"
            label="Bedtime"
            value={insights.optimalBedtime}
            sublabel="recommended"
          />
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={itemVariants} className="flex gap-3 pt-2">
        <Link href="/sleep/edit" className="flex-1">
          <GlassButton 
            variant="glass" 
            fullWidth
            icon={<span>✏️</span>}
          >
            Edit Sleep
          </GlassButton>
        </Link>
        <Link href="/history" className="flex-1">
          <GlassButton 
            variant="ghost" 
            fullWidth
            icon={<span>📊</span>}
          >
            History
          </GlassButton>
        </Link>
      </motion.div>
    </motion.div>
  );
}

// Sleep Timeline Bar Component
function SleepTimelineBar({ bedtime, wakeTime }: { bedtime: string; wakeTime: string }) {
  if (!bedtime || !wakeTime) return null;
  
  const bedDate = parseISO(bedtime);
  const wakeDate = parseISO(wakeTime);
  
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-2">
        <span>{format(bedDate, "h:mm a")}</span>
        <span>{format(wakeDate, "h:mm a")}</span>
      </div>
      <div className="h-3 rounded-full overflow-hidden bg-[var(--glass-bg)]">
        <div 
          className="h-full gradient-sleep-timeline rounded-full"
          style={{ width: "100%" }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1">
        <span>💤 Fell asleep</span>
        <span>☀️ Woke up</span>
      </div>
    </div>
  );
}

function calculateSleepDuration(bedtime: string, wakeTime: string): { hours: number; minutes: number } {
  try {
    const bedDate = parseISO(bedtime);
    const wakeDate = parseISO(wakeTime);
    const totalMinutes = differenceInMinutes(wakeDate, bedDate);
    return {
      hours: Math.floor(totalMinutes / 60),
      minutes: totalMinutes % 60,
    };
  } catch {
    return { hours: 0, minutes: 0 };
  }
}

// Empty state when no sleep data for today
export function DashboardEmptyState({ onLogSleep }: { onLogSleep: () => void }) {
  return (
    <motion.div 
      className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Placeholder visual */}
      <motion.div 
        className="w-full max-w-sm mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <GlassCard padding="xl" className="text-center">
          <div className="text-7xl mb-4 opacity-50">📊</div>
          <div className="h-24 rounded-xl bg-gradient-to-r from-[var(--glass-bg)] via-[var(--accent-purple)]/20 to-[var(--glass-bg)] animate-shimmer" />
        </GlassCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <h2 className="text-display-md gradient-text mb-3">
          Ready to see your forecast?
        </h2>
        <p className="text-[var(--text-secondary)] mb-8 max-w-sm">
          Log last night's sleep to reveal your personalized productivity curve for today.
        </p>

        <GlassButton onClick={onLogSleep} size="xl">
          🌙 Log Today's Sleep
        </GlassButton>

        <p className="text-xs text-[var(--text-muted)] mt-6">
          Takes less than 30 seconds
        </p>
      </motion.div>
    </motion.div>
  );
}

// Loading state
export function DashboardLoading() {
  return (
    <div className="space-y-5 pt-4 md:pt-16">
      {/* Header skeleton */}
      <div className="text-center">
        <div className="h-4 w-32 bg-[var(--glass-bg)] rounded-full mx-auto animate-shimmer" />
        <div className="h-8 w-64 bg-[var(--glass-bg)] rounded-lg mx-auto mt-2 animate-shimmer" />
      </div>

      {/* Main card skeleton */}
      <GlassCard padding="lg">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="h-3 w-24 bg-[var(--glass-bg)] rounded animate-shimmer" />
            <div className="h-16 w-40 bg-[var(--glass-bg)] rounded-lg mt-2 animate-shimmer" />
            <div className="h-3 w-full bg-[var(--glass-bg)] rounded-full mt-4 animate-shimmer" />
          </div>
          <div className="w-24 h-24 bg-[var(--glass-bg)] rounded-full animate-shimmer" />
        </div>
      </GlassCard>
      
      {/* Curve skeleton */}
      <GlassCard padding="md">
        <div className="h-48 bg-[var(--glass-bg)] rounded-xl animate-shimmer" />
      </GlassCard>
      
      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <GlassCard key={i} padding="md">
            <div className="h-20 bg-[var(--glass-bg)] rounded-lg animate-shimmer" />
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
