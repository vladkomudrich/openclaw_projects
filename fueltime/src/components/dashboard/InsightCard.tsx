"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { GlassCard } from "../ui/GlassCard";

interface InsightCardProps {
  icon: ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  color?: "eating" | "fasting" | "orange" | "default";
  delay?: number;
}

export function InsightCard({
  icon,
  title,
  value,
  subtitle,
  color = "default",
  delay = 0,
}: InsightCardProps) {
  const valueColors = {
    eating: "text-[var(--eating-primary)]",
    fasting: "text-[var(--fasting-primary)]",
    orange: "text-[var(--accent-orange)]",
    default: "text-[var(--text-primary)]",
  };

  // Map to glass card variants
  const glassVariant = color === "default" ? "default" : color;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
    >
      <GlassCard variant={glassVariant} padding="md">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 glass rounded-xl flex items-center justify-center text-xl">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-[var(--text-secondary)] font-medium uppercase tracking-wide">
              {title}
            </p>
            <p className={`text-xl font-display font-semibold ${valueColors[color]} truncate`}>
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </GlassCard>
    </motion.div>
  );
}

interface StatusCardProps {
  status: "eating" | "fasting" | "pre-breakfast" | "post-dinner";
  message: string;
  nextEvent?: { name: string; time: string } | null;
}

export function StatusCard({ status, message, nextEvent }: StatusCardProps) {
  const statusConfig = {
    eating: {
      emoji: "🍽️",
      title: "Eating Window Open",
      variant: "eating" as const,
    },
    fasting: {
      emoji: "🔥",
      title: "Fasting Mode",
      variant: "fasting" as const,
    },
    "pre-breakfast": {
      emoji: "🌅",
      title: "Morning Fast",
      variant: "orange" as const,
    },
    "post-dinner": {
      emoji: "🌙",
      title: "Overnight Fast",
      variant: "fasting" as const,
    },
  };

  const config = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <GlassCard variant={config.variant} padding="lg" glow>
        <div className="flex items-start gap-4">
          <span className="text-4xl">{config.emoji}</span>
          <div className="flex-1">
            <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">
              {config.title}
            </h2>
            <p className="text-[var(--text-secondary)] mt-1">{message}</p>
          </div>
        </div>
        {nextEvent && (
          <div className="mt-4 pt-4 border-t border-[var(--glass-border)] flex justify-between items-center">
            <span className="text-sm text-[var(--text-secondary)]">
              Next: {nextEvent.name}
            </span>
            <span className="font-display font-semibold text-[var(--text-primary)]">
              {formatTime(nextEvent.time)}
            </span>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}

interface TipCardProps {
  tip: string;
  category: "timing" | "nutrition" | "performance" | "science";
}

export function TipCard({ tip, category }: TipCardProps) {
  const categoryConfig = {
    timing: { emoji: "⏰", color: "text-[var(--accent-orange)]" },
    nutrition: { emoji: "🥗", color: "text-[var(--eating-primary)]" },
    performance: { emoji: "⚡", color: "text-[var(--fasting-primary)]" },
    science: { emoji: "🔬", color: "text-[var(--text-secondary)]" },
  };

  const config = categoryConfig[category];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <GlassCard variant="default" padding="md">
        <div className="flex items-start gap-3">
          <span className={`text-2xl ${config.color}`}>{config.emoji}</span>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {tip}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  );
}

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({ score, size = 80, strokeWidth = 8 }: ScoreRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const getColor = () => {
    if (score >= 80) return "var(--eating-primary)";
    if (score >= 60) return "var(--accent-orange)";
    return "var(--error)";
  };

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--glass-border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ strokeDasharray: circumference, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-display font-semibold text-[var(--text-primary)]">
          {score}
        </span>
      </div>
    </div>
  );
}

function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "AM" : "PM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
}
