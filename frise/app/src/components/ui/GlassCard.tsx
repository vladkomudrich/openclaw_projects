"use client";

import { ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: "default" | "elevated" | "interactive";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  glowColor?: "blue" | "purple" | "gold";
  className?: string;
  onClick?: () => void;
}

const paddingClasses = {
  none: "",
  sm: "p-3",
  md: "p-4",
  lg: "p-6",
  xl: "p-8",
};

const glowColors = {
  blue: "hover:shadow-[0_0_20px_rgba(91,141,239,0.3)]",
  purple: "hover:shadow-[0_0_20px_rgba(123,104,238,0.3)]",
  gold: "hover:shadow-[0_0_20px_rgba(255,179,71,0.3)]",
};

export function GlassCard({
  children,
  variant = "default",
  padding = "lg",
  glow = false,
  glowColor = "blue",
  className = "",
  onClick,
  ...motionProps
}: GlassCardProps) {
  const baseClasses = `
    relative overflow-hidden
    bg-[var(--glass-bg)]
    backdrop-blur-[16px]
    border border-[var(--glass-border)]
    rounded-[24px]
    transition-all duration-[250ms] ease-out
  `;

  const variantClasses = {
    default: "",
    elevated: "bg-[var(--bg-dark-elevated)] shadow-[var(--shadow-md)]",
    interactive: `
      cursor-pointer 
      hover:bg-[var(--glass-bg-hover)] 
      hover:border-[var(--glass-border-active)]
      active:scale-[0.98]
    `,
  };

  const glowClass = glow ? glowColors[glowColor] : "";

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

  return (
    <GlassCard padding="md" className={className}>
      <div className="text-center">
        {icon && (
          <div className="text-2xl mb-2">{icon}</div>
        )}
        <p className="label mb-1">{label}</p>
        <div className="flex items-baseline justify-center gap-1">
          <span className="stat-number text-[var(--text-primary)]">{value}</span>
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
