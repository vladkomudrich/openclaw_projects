"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SleepDebt, SleepEntry } from "@/types";
import { motion } from "framer-motion";
import Link from "next/link";
import { differenceInMinutes, parseISO, format } from "date-fns";

interface CompactSleepWidgetProps {
  sleepEntry: SleepEntry | null;
  sleepDebt: SleepDebt;
}

export function CompactSleepWidget({ sleepEntry, sleepDebt }: CompactSleepWidgetProps) {
  // Calculate sleep duration
  const duration = sleepEntry 
    ? calculateSleepDuration(sleepEntry.bedtime, sleepEntry.wakeTime)
    : { hours: 0, minutes: 0 };
  
  // Determine debt indicator styling
  const debtConfig = getDebtConfig(sleepDebt);
  
  return (
    <Link href="/sleep/edit">
      <motion.div
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <GlassCard 
          padding="md" 
          variant="interactive"
          className="flex items-center justify-between gap-4"
        >
          {/* Sleep duration - compact display */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--glass-bg)] flex items-center justify-center">
              <span className="text-xl">🛏️</span>
            </div>
            
            <div>
              <p className="label text-[var(--text-muted)] mb-0.5">Last night</p>
              <div className="flex items-baseline gap-1">
                <span className="font-display font-bold text-lg text-[var(--text-primary)]">
                  {duration.hours}h
                </span>
                {duration.minutes > 0 && (
                  <span className="font-display font-bold text-lg text-[var(--text-primary)]">
                    {duration.minutes}m
                  </span>
                )}
              </div>
            </div>
          </div>
          
          {/* Sleep debt badge */}
          <div className="flex items-center gap-3">
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: debtConfig.bgColor,
                color: debtConfig.textColor,
              }}
            >
              <span>{debtConfig.icon}</span>
              <span>{debtConfig.label}</span>
            </div>
            
            {/* Edit indicator */}
            <div className="text-[var(--text-muted)]">
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </div>
          </div>
        </GlassCard>
      </motion.div>
    </Link>
  );
}

// Helper: Calculate sleep duration
function calculateSleepDuration(
  bedtime: string, 
  wakeTime: string
): { hours: number; minutes: number } {
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

// Helper: Get debt indicator configuration
function getDebtConfig(sleepDebt: SleepDebt): {
  icon: string;
  label: string;
  bgColor: string;
  textColor: string;
} {
  const { status, totalDebt } = sleepDebt;
  const debtHours = Math.abs(Math.round(totalDebt / 60 * 10) / 10);
  
  if (status === "surplus") {
    return {
      icon: "✓",
      label: `+${debtHours}h`,
      bgColor: "rgba(34, 197, 94, 0.15)",
      textColor: "var(--success)",
    };
  }
  
  if (status === "balanced") {
    return {
      icon: "◉",
      label: "Balanced",
      bgColor: "rgba(91, 141, 239, 0.15)",
      textColor: "var(--accent-blue)",
    };
  }
  
  // Debt status
  if (debtHours <= 2) {
    return {
      icon: "−",
      label: `${debtHours}h debt`,
      bgColor: "rgba(245, 158, 11, 0.15)",
      textColor: "var(--warning)",
    };
  }
  
  return {
    icon: "⚠",
    label: `${debtHours}h debt`,
    bgColor: "rgba(239, 68, 68, 0.15)",
    textColor: "var(--error)",
  };
}
