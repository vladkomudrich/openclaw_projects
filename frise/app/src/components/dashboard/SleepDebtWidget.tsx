"use client";

import { SleepDebt } from "@/types";
import { GlassCard } from "@/components/ui/GlassCard";
import { motion } from "framer-motion";

interface SleepDebtWidgetProps {
  sleepDebt: SleepDebt;
}

export function SleepDebtWidget({ sleepDebt }: SleepDebtWidgetProps) {
  const { totalDebt, status, daysTracked, averageSleep, idealSleep } = sleepDebt;
  
  // Convert debt to hours for display
  const debtHours = Math.abs(totalDebt) / 60;
  
  const statusConfig = {
    debt: {
      label: "Sleep debt",
      color: "var(--error)",
      bgColor: "var(--error-muted)",
      icon: "😴",
      message: `You're ${displayHours(Math.abs(totalDebt))} under your ideal sleep`,
    },
    balanced: {
      label: "Well balanced",
      color: "var(--success)",
      bgColor: "var(--success-muted)",
      icon: "✨",
      message: "Your sleep is on track!",
    },
    surplus: {
      label: "Sleep surplus",
      color: "var(--success)",
      bgColor: "var(--success-muted)",
      icon: "💪",
      message: `You're ${displayHours(totalDebt)} ahead of your ideal sleep`,
    },
  };

  const config = statusConfig[status];

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{config.icon}</span>
          <div>
            <span 
              className="font-display font-semibold"
              style={{ color: config.color }}
            >
              {config.label}
            </span>
            <p className="text-sm text-[var(--text-secondary)]">
              {config.message}
            </p>
          </div>
        </div>
        <div 
          className="stat-number"
          style={{ color: config.color }}
        >
          {status === "debt" ? "-" : status === "surplus" ? "+" : ""}
          {displayHours(Math.abs(totalDebt))}
        </div>
      </div>

      {/* Visual progress bar */}
      <SleepDebtProgressBar totalDebt={totalDebt} status={status} />
      
      {daysTracked > 0 && (
        <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mt-3 pt-3 border-t border-[var(--glass-border)]">
          <span>📊 {daysTracked} day{daysTracked > 1 ? "s" : ""} tracked</span>
          <span>Avg: {displayHours(averageSleep)} | Ideal: {displayHours(idealSleep)}</span>
        </div>
      )}
    </GlassCard>
  );
}

// Ring component for compact display
interface SleepDebtRingProps {
  sleepDebt: SleepDebt;
  size?: "sm" | "md" | "lg";
}

export function SleepDebtRing({ sleepDebt, size = "md" }: SleepDebtRingProps) {
  const { totalDebt, status } = sleepDebt;
  
  // Calculate percentage (0-100)
  // Full debt = -480min = 0%, Balanced = 50%, Full surplus = +480min = 100%
  const percentage = Math.max(0, Math.min(100, 50 + (totalDebt / 480) * 50));
  
  const sizeConfig = {
    sm: { dimension: 80, strokeWidth: 6, fontSize: "text-lg" },
    md: { dimension: 100, strokeWidth: 8, fontSize: "text-xl" },
    lg: { dimension: 120, strokeWidth: 10, fontSize: "text-2xl" },
  };
  
  const { dimension, strokeWidth, fontSize } = sizeConfig[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const statusColors = {
    debt: "var(--error)",
    balanced: "var(--success)",
    surplus: "var(--accent-blue)",
  };
  
  const statusIcons = {
    debt: "⚠️",
    balanced: "✅",
    surplus: "💪",
  };
  
  return (
    <div className="relative" style={{ width: dimension, height: dimension }}>
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="var(--glass-border)"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={statusColors[status]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg">{statusIcons[status]}</span>
        <span 
          className={`font-display font-semibold ${fontSize}`}
          style={{ color: statusColors[status] }}
        >
          {Math.abs(totalDebt) > 60 
            ? `${Math.round(Math.abs(totalDebt) / 60)}h` 
            : status === "balanced" 
              ? "OK" 
              : `${Math.abs(totalDebt)}m`
          }
        </span>
      </div>
    </div>
  );
}

// Progress bar component
function SleepDebtProgressBar({ totalDebt, status }: { totalDebt: number; status: string }) {
  // Map debt from -480 to +480 minutes to 0-100
  const progressValue = Math.max(0, Math.min(100, 50 + (totalDebt / 480) * 50));
  
  return (
    <div className="relative">
      {/* Background track */}
      <div className="h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden">
        {/* Progress fill */}
        <motion.div
          className="h-full rounded-full"
          style={{
            background: status === "debt" 
              ? "var(--error)" 
              : status === "surplus"
                ? "linear-gradient(90deg, var(--success), var(--accent-blue))"
                : "var(--success)",
          }}
          initial={{ width: 0 }}
          animate={{ width: `${progressValue}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      
      {/* Labels */}
      <div className="flex justify-between text-[10px] text-[var(--text-muted)] mt-1.5">
        <span>Debt</span>
        <span className="text-[var(--text-secondary)]">Balanced</span>
        <span>Surplus</span>
      </div>
      
      {/* Center marker */}
      <div 
        className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-[var(--text-muted)]"
        style={{ borderRadius: "1px" }}
      />
    </div>
  );
}

function displayHours(minutes: number): string {
  const hours = Math.floor(Math.abs(minutes) / 60);
  const mins = Math.abs(minutes) % 60;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}
