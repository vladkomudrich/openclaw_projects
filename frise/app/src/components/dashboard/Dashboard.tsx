"use client";

import { ProductivityCurve as CurveData } from "@/types";
import { GlassCard, GlassStatCard } from "@/components/ui/GlassCard";
import { GlassButton } from "@/components/ui/GlassButton";
import { ProductivityCurve } from "@/components/visualization/ProductivityCurve";
import { CurrentPhaseHero } from "./CurrentPhaseHero";
import { CompactSleepWidget } from "./CompactSleepWidget";
import { format } from "date-fns";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

interface DashboardProps {
  curve: CurveData;
  onLogSleep?: () => void;
}

// Refined animation variants with spring physics
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.5, 
      ease: [0.16, 1, 0.3, 1] as const
    }
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

export function Dashboard({ curve, onLogSleep }: DashboardProps) {
  const { points, insights, melatoninWindow, sleepEntry, wakeTime } = curve;
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div 
      className="space-y-5 pb-8 relative"
      variants={shouldReduceMotion ? {} : containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Ambient gradient orb - decorative */}
      <div 
        className="absolute -top-20 -right-20 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(123,104,238,0.08) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden="true"
      />

      {/* Header */}
      <motion.div 
        className="text-center pt-6 md:pt-14" 
        variants={shouldReduceMotion ? {} : headerVariants}
      >
        <motion.p 
          className="label text-[var(--text-muted)] tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {format(new Date(), "EEEE, MMMM d")}
        </motion.p>
        <h1 className="text-display-md mt-2 gradient-text font-display">
          Your Productivity Forecast
        </h1>
      </motion.div>

      {/* 1. Current Phase Hero Block - Primary element */}
      <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
        <CurrentPhaseHero
          points={points}
          insights={insights}
          melatoninWindow={melatoninWindow}
        />
      </motion.div>

      {/* 2. Compact Sleep Widget - Secondary, smaller */}
      <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
        <CompactSleepWidget
          sleepEntry={sleepEntry}
          sleepDebt={insights.sleepDebt}
        />
      </motion.div>

      {/* 3. Energy Forecast - 4h focused window with scroll */}
      <motion.div variants={shouldReduceMotion ? {} : itemVariants}>
        <GlassCard padding="md" innerGlow>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-[var(--text-primary)] text-lg">
              Energy Forecast
            </h2>
            <span className="label text-[var(--text-muted)]">4h window</span>
          </div>
          <ProductivityCurve
            points={points}
            wakeTime={wakeTime}
            melatoninWindow={melatoninWindow}
            showAnimation={true}
            focusedMode={true}
          />
        </GlassCard>
      </motion.div>

      {/* 4. Key Insights Grid - Staggered reveal */}
      <motion.div 
        className="grid grid-cols-3 gap-3"
        variants={shouldReduceMotion ? {} : itemVariants}
      >
        <GlassStatCard
          icon="🎯"
          label="Deep Work"
          value={insights.peakStartTime}
          sublabel={`until ${insights.peakEndTime}`}
          delay={shouldReduceMotion ? 0 : 0.1}
        />
        <GlassStatCard
          icon="🌙"
          label="Melatonin"
          value={insights.melatoninWindowStart}
          sublabel="window opens"
          delay={shouldReduceMotion ? 0 : 0.2}
        />
        <GlassStatCard
          icon="🛏️"
          label="Bedtime"
          value={insights.optimalBedtime}
          sublabel="recommended"
          delay={shouldReduceMotion ? 0 : 0.3}
        />
      </motion.div>

      {/* Quick Actions */}
      <motion.div 
        className="flex gap-3 pt-3"
        variants={shouldReduceMotion ? {} : itemVariants}
      >
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

// Empty state when no sleep data for today - refined experience
export function DashboardEmptyState({ onLogSleep }: { onLogSleep: () => void }) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.div 
      className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background ambient elements */}
      <div 
        className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(91,141,239,0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden="true"
      />
      <div 
        className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(123,104,238,0.05) 0%, transparent 70%)",
          filter: "blur(50px)",
        }}
        aria-hidden="true"
      />

      {/* Placeholder visual */}
      <motion.div 
        className="w-full max-w-sm mb-10 relative z-10"
        initial={shouldReduceMotion ? {} : { scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassCard padding="xl" className="text-center" innerGlow>
          <motion.div 
            className="text-7xl mb-6 opacity-60"
            animate={shouldReduceMotion ? {} : { 
              y: [0, -8, 0],
              rotate: [0, 3, -3, 0] 
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            📊
          </motion.div>
          <div 
            className="h-28 rounded-2xl relative overflow-hidden"
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0.02) 0%, rgba(123,104,238,0.15) 50%, rgba(255,255,255,0.02) 100%)",
              backgroundSize: "200% 100%",
            }}
          >
            <motion.div
              className="absolute inset-0"
              animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
              }}
            />
          </div>
        </GlassCard>
      </motion.div>

      <motion.div
        className="relative z-10"
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        <h2 className="text-display-md font-display mb-4">
          <span className="gradient-text">Ready to see your forecast?</span>
        </h2>
        <p className="text-[var(--text-secondary)] mb-10 max-w-sm leading-relaxed">
          Log last night's sleep to reveal your personalized productivity curve for today.
        </p>

        <GlassButton 
          onClick={onLogSleep} 
          size="xl"
          shimmer
        >
          🌙 Log Today's Sleep
        </GlassButton>

        <motion.p 
          className="text-xs text-[var(--text-muted)] mt-8 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Takes less than 30 seconds
        </motion.p>
      </motion.div>
    </motion.div>
  );
}

// Loading state - refined skeleton
export function DashboardLoading() {
  return (
    <div className="space-y-5 pt-6 md:pt-14">
      {/* Header skeleton */}
      <div className="text-center">
        <div className="h-3 w-32 bg-[var(--glass-bg)] rounded-full mx-auto animate-pulse" />
        <div className="h-9 w-72 bg-[var(--glass-bg)] rounded-xl mx-auto mt-3 animate-pulse" />
      </div>

      {/* Phase Hero skeleton */}
      <GlassCard padding="lg">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-[var(--glass-bg)] rounded-2xl animate-pulse" />
          <div className="flex-1">
            <div className="h-6 w-40 bg-[var(--glass-bg)] rounded-lg animate-pulse" />
            <div className="h-4 w-full bg-[var(--glass-bg)] rounded mt-3 animate-pulse" />
            <div className="h-3 w-32 bg-[var(--glass-bg)] rounded mt-3 animate-pulse" />
          </div>
        </div>
      </GlassCard>

      {/* Compact sleep skeleton */}
      <GlassCard padding="md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[var(--glass-bg)] rounded-xl animate-pulse" />
            <div>
              <div className="h-3 w-16 bg-[var(--glass-bg)] rounded animate-pulse" />
              <div className="h-5 w-20 bg-[var(--glass-bg)] rounded mt-1.5 animate-pulse" />
            </div>
          </div>
          <div className="h-6 w-20 bg-[var(--glass-bg)] rounded-full animate-pulse" />
        </div>
      </GlassCard>
      
      {/* Curve skeleton */}
      <GlassCard padding="md">
        <div className="h-44 bg-[var(--glass-bg)] rounded-xl animate-pulse" />
      </GlassCard>
      
      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map(i => (
          <GlassCard key={i} padding="md">
            <div className="h-24 bg-[var(--glass-bg)] rounded-lg animate-pulse" />
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
