"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type GlassVariant = "default" | "elevated" | "interactive" | "eating" | "fasting" | "orange";
type PaddingSize = "none" | "sm" | "md" | "lg" | "xl";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: GlassVariant;
  padding?: PaddingSize;
  glow?: boolean;
  className?: string;
  onClick?: () => void;
}

const paddingClasses: Record<PaddingSize, string> = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

const variantClasses: Record<GlassVariant, string> = {
  default: `
    bg-[var(--glass-bg)]
    border-[var(--glass-border)]
  `,
  elevated: `
    bg-[var(--bg-dark-elevated)]
    border-[var(--glass-border)]
    shadow-[var(--shadow-md)]
  `,
  interactive: `
    bg-[var(--glass-bg)]
    border-[var(--glass-border)]
    cursor-pointer 
    hover:bg-[var(--glass-bg-hover)] 
    hover:border-[var(--glass-border-active)]
    active:scale-[0.98]
  `,
  eating: `
    bg-[var(--eating-muted)]
    border-[rgba(74,222,128,0.2)]
    hover:shadow-[var(--shadow-glow-green)]
  `,
  fasting: `
    bg-[var(--fasting-muted)]
    border-[rgba(91,141,239,0.2)]
    hover:shadow-[var(--shadow-glow-blue)]
  `,
  orange: `
    bg-[var(--accent-orange-muted)]
    border-[rgba(255,179,71,0.2)]
    hover:shadow-[var(--shadow-glow-orange)]
  `,
};

export function GlassCard({
  children,
  variant = "default",
  padding = "lg",
  glow = false,
  className = "",
  onClick,
  ...motionProps
}: GlassCardProps) {
  const baseClasses = `
    relative overflow-hidden
    backdrop-blur-[16px]
    border
    rounded-[24px]
    transition-all duration-[250ms] ease-out
  `;

  const glowClass = glow 
    ? variant === "eating" 
      ? "shadow-[var(--shadow-glow-green)]"
      : variant === "fasting"
      ? "shadow-[var(--shadow-glow-blue)]"
      : variant === "orange"
      ? "shadow-[var(--shadow-glow-orange)]"
      : ""
    : "";

  return (
    <motion.div
      className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${glowClass} ${className}`}
      onClick={onClick}
      whileTap={variant === "interactive" ? { scale: 0.98 } : undefined}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}

// Header variant with title and optional icon
interface GlassCardHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function GlassCardHeader({ 
  icon, 
  title, 
  subtitle,
  action,
  className = "" 
}: GlassCardHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex items-center gap-3">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-[var(--glass-bg)] flex items-center justify-center text-xl">
            {icon}
          </div>
        )}
        <div>
          <h3 className="font-display font-semibold text-[var(--text-primary)]">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p>
          )}
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// Stat variant for displaying large numbers
interface GlassStatCardProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  sublabel?: string;
  variant?: "default" | "eating" | "fasting" | "orange";
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function GlassStatCard({
  icon,
  label,
  value,
  unit,
  sublabel,
  variant = "default",
  trend,
  trendValue,
  className = "",
}: GlassStatCardProps) {
  const trendColors = {
    up: "text-[var(--success)]",
    down: "text-[var(--error)]",
    neutral: "text-[var(--text-muted)]",
  };

  const trendIcons = {
    up: "↑",
    down: "↓",
    neutral: "→",
  };

  const valueColors = {
    default: "text-[var(--text-primary)]",
    eating: "text-[var(--eating-primary)]",
    fasting: "text-[var(--fasting-primary)]",
    orange: "text-[var(--accent-orange)]",
  };

  return (
    <GlassCard variant={variant} padding="md" className={className}>
      <div className="text-center">
        {icon && (
          <div className="text-2xl mb-2">{icon}</div>
        )}
        <p className="label mb-1">{label}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className={`stat-number-sm ${valueColors[variant]}`}>{value}</span>
          {unit && (
            <span className="text-lg text-[var(--text-secondary)] font-display">
              {unit}
            </span>
          )}
        </div>
        {sublabel && (
          <p className="text-sm text-[var(--text-secondary)] mt-1">{sublabel}</p>
        )}
        {trend && trendValue && (
          <div className={`flex items-center justify-center gap-1 mt-2 text-sm ${trendColors[trend]}`}>
            <span>{trendIcons[trend]}</span>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
}

// Status card variant for eating/fasting states
interface GlassStatusCardProps {
  status: "eating" | "fasting" | "pre-breakfast" | "post-dinner";
  title: string;
  message: string;
  timeRemaining?: string;
  nextEvent?: { name: string; time: string } | null;
  className?: string;
}

export function GlassStatusCard({
  status,
  title,
  message,
  timeRemaining,
  nextEvent,
  className = "",
}: GlassStatusCardProps) {
  const statusConfig = {
    eating: {
      emoji: "🍽️",
      variant: "eating" as const,
      gradient: "gradient-eating",
      glowClass: "glow-eating-subtle",
    },
    fasting: {
      emoji: "🔥",
      variant: "fasting" as const,
      gradient: "gradient-fasting",
      glowClass: "glow-fasting-subtle",
    },
    "pre-breakfast": {
      emoji: "🌅",
      variant: "orange" as const,
      gradient: "gradient-sunrise",
      glowClass: "",
    },
    "post-dinner": {
      emoji: "🌙",
      variant: "fasting" as const,
      gradient: "gradient-fasting",
      glowClass: "glow-fasting-subtle",
    },
  };

  const config = statusConfig[status];

  return (
    <GlassCard 
      variant={config.variant} 
      padding="lg" 
      glow 
      className={`${config.glowClass} ${className}`}
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl">{config.emoji}</span>
        <div className="flex-1">
          <h2 className="font-display font-semibold text-xl text-[var(--text-primary)]">
            {title}
          </h2>
          <p className="text-[var(--text-secondary)] mt-1">{message}</p>
          
          {timeRemaining && (
            <div className="mt-4">
              <p className="label">Time Remaining</p>
              <p className="stat-number-sm text-[var(--text-primary)] mt-1">
                {timeRemaining}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {nextEvent && (
        <div className="mt-4 pt-4 border-t border-[var(--glass-border)] flex justify-between items-center">
          <span className="text-sm text-[var(--text-secondary)]">
            Next: {nextEvent.name}
          </span>
          <span className="font-display font-semibold text-[var(--text-primary)]">
            {nextEvent.time}
          </span>
        </div>
      )}
    </GlassCard>
  );
}

// Tip card variant
interface GlassTipCardProps {
  tip: string;
  category: "timing" | "nutrition" | "performance" | "science";
  className?: string;
}

export function GlassTipCard({ tip, category, className = "" }: GlassTipCardProps) {
  const categoryConfig = {
    timing: { emoji: "⏰", color: "text-[var(--accent-orange)]" },
    nutrition: { emoji: "🥗", color: "text-[var(--eating-primary)]" },
    performance: { emoji: "⚡", color: "text-[var(--fasting-primary)]" },
    science: { emoji: "🔬", color: "text-[var(--text-secondary)]" },
  };

  const config = categoryConfig[category];

  return (
    <GlassCard variant="default" padding="md" className={className}>
      <div className="flex items-start gap-3">
        <span className={`text-2xl ${config.color}`}>{config.emoji}</span>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          {tip}
        </p>
      </div>
    </GlassCard>
  );
}
