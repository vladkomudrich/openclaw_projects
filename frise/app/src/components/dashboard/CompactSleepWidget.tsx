"use client";

import { GlassCard } from "@/components/ui/GlassCard";
import { SleepDebt, SleepEntry } from "@/types";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { differenceInMinutes, parseISO } from "date-fns";

interface CompactSleepWidgetProps {
  sleepEntry: SleepEntry | null;
  sleepDebt: SleepDebt;
}

export function CompactSleepWidget({ sleepEntry, sleepDebt }: CompactSleepWidgetProps) {
  const shouldReduceMotion = useReducedMotion();
  
  // Calculate sleep duration
  const duration = sleepEntry 
    ? calculateSleepDuration(sleepEntry.bedtime, sleepEntry.wakeTime)
    : { hours: 0, minutes: 0 };
  
  // Determine debt indicator styling
  const debtConfig = getDebtConfig(sleepDebt);
  
  return (
    <Link href="/sleep/edit">
      <motion.div
        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.01 }}
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassCard 
          padding="md" 
          variant="interactive"
          className="flex items-center justify-between gap-4"
        >
          {/* Sleep duration - compact display */}
          <div className="flex items-center gap-3">
            <motion.div 
              className="w-11 h-11 rounded-xl bg-gradient-to-br from-[var(--accent-purple)]/20 to-[var(--accent-blue)]/20 flex items-center justify-center"
              whileHover={shouldReduceMotion ? {} : { rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <span className="text-xl">🛏️</span>
            </motion.div>
            
            <div>
              <p className="label text-[var(--text-muted)] mb-0.5 tracking-wider">Last night</p>
              <div className="flex items-baseline gap-1">
                <motion.span 
                  className="font-display font-bold text-lg text-[var(--text-primary)]"
                  initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {duration.hours}h
                </motion.span>
                {duration.minutes > 0 && (
                  <motion.span 
                    className="font-display font-bold text-lg text-[var(--text-primary)]"
                    initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                  >
                    {duration.minutes}m
                  </motion.span>
                )}
              </div>
            </div>
          </div>
          
          {/* Sleep debt badge */}
          <div className="flex items-center gap-3">
            <motion.div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide"
              style={{
                backgroundColor: debtConfig.bgColor,
                color: debtConfig.textColor,
                boxShadow: `0 0 12px ${debtConfig.bgColor}`,
              }}
              initial={shouldReduceMotion ? {} : { opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span>{debtConfig.icon}</span>
              <span>{debtConfig.label}</span>
            </motion.div>
            
            {/* Edit indicator */}
            <motion.div 
              className="text-[var(--text-muted)]"
              animate={shouldReduceMotion ? {} : { x: [0, 3, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
            >
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
            </motion.div>
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
      bgColor: "rgba(74, 222, 128, 0.15)",
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
      bgColor: "rgba(251, 191, 36, 0.15)",
      textColor: "var(--warning)",
    };
  }
  
  return {
    icon: "⚠",
    label: `${debtHours}h debt`,
    bgColor: "rgba(248, 113, 113, 0.15)",
    textColor: "var(--error)",
  };
}
