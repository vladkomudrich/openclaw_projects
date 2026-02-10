"use client";

import { DayInsights } from "@/types";
import { GlassCard, GlassStatCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

interface InsightsPanelProps {
  insights: DayInsights;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const }
  },
};

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const insightItems = [
    {
      icon: "🎯",
      label: "Deep Work",
      value: insights.peakStartTime,
      sublabel: `until ${insights.peakEndTime}`,
      gradient: "linear-gradient(135deg, var(--accent-gold), var(--accent-purple))",
    },
    {
      icon: "🌙",
      label: "Melatonin",
      value: insights.melatoninWindowStart,
      sublabel: "window opens",
      gradient: "linear-gradient(135deg, var(--accent-purple), var(--accent-blue))",
    },
    {
      icon: "🛏️",
      label: "Bedtime",
      value: insights.optimalBedtime,
      sublabel: "recommended",
      gradient: "linear-gradient(135deg, var(--accent-blue), var(--info))",
    },
  ];

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {insightItems.map((item, index) => (
        <motion.div key={item.label} variants={itemVariants}>
          <InsightCard {...item} />
        </motion.div>
      ))}
    </motion.div>
  );
}

interface InsightCardProps {
  icon: string;
  label: string;
  value: string;
  sublabel: string;
  gradient: string;
}

function InsightCard({ icon, label, value, sublabel, gradient }: InsightCardProps) {
  return (
    <GlassCard 
      padding="md" 
      variant="interactive"
      className="text-center"
    >
      {/* Icon with gradient */}
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3"
        style={{ background: gradient }}
      >
        {icon}
      </div>
      
      {/* Label */}
      <p className="label mb-1">{label}</p>
      
      {/* Value */}
      <p 
        className="font-display font-semibold text-xl"
        style={{ 
          background: gradient,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        {value}
      </p>
      
      {/* Sublabel */}
      <p className="text-xs text-[var(--text-muted)] mt-1">
        {sublabel}
      </p>
    </GlassCard>
  );
}

// Compact horizontal layout variant
export function InsightsPanelCompact({ insights }: InsightsPanelProps) {
  return (
    <GlassCard padding="md">
      <div className="grid grid-cols-3 divide-x divide-[var(--glass-border)]">
        <div className="text-center px-2">
          <span className="text-xl">🎯</span>
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide mt-1">
            Deep Work
          </p>
          <p className="font-display font-semibold text-[var(--text-primary)]">
            {insights.peakStartTime}
          </p>
        </div>
        <div className="text-center px-2">
          <span className="text-xl">🌙</span>
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide mt-1">
            Melatonin
          </p>
          <p className="font-display font-semibold text-[var(--accent-purple)]">
            {insights.melatoninWindowStart}
          </p>
        </div>
        <div className="text-center px-2">
          <span className="text-xl">🛏️</span>
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wide mt-1">
            Bedtime
          </p>
          <p className="font-display font-semibold text-[var(--text-primary)]">
            {insights.optimalBedtime}
          </p>
        </div>
      </div>
    </GlassCard>
  );
}
