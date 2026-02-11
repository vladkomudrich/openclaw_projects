"use client";

import { ReactNode, forwardRef } from "react";
import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion";

interface GlassCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children: ReactNode;
  variant?: "default" | "elevated" | "interactive" | "layered";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  glow?: boolean;
  glowColor?: "blue" | "purple" | "gold";
  innerGlow?: boolean;
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
  blue: "rgba(91, 141, 239, 0.2)",
  purple: "rgba(123, 104, 238, 0.2)",
  gold: "rgba(255, 179, 71, 0.2)",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  function GlassCard(
    {
      children,
      variant = "default",
      padding = "lg",
      glow = false,
      glowColor = "blue",
      innerGlow = false,
      className = "",
      onClick,
      ...motionProps
    },
    ref
  ) {
    const shouldReduceMotion = useReducedMotion();

    const baseClasses = `
      relative overflow-hidden
      bg-[var(--glass-bg)]
      backdrop-blur-[20px] backdrop-saturate-[1.2]
      border border-[var(--glass-border)]
      rounded-[24px]
      transition-all duration-300 ease-out
    `;

    const variantClasses = {
      default: `
        shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]
      `,
      elevated: `
        bg-[var(--bg-dark-elevated)] 
        shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]
      `,
      interactive: `
        cursor-pointer 
        shadow-[0_4px_24px_-4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]
        hover:bg-[var(--glass-bg-hover)] 
        hover:border-[var(--glass-border-active)]
        hover:shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]
      `,
      layered: `
        bg-gradient-to-br from-white/[0.08] via-white/[0.04] to-white/[0.02]
        backdrop-blur-[24px] backdrop-saturate-[1.3]
        shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4),0_2px_8px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]
      `,
    };

    const hoverAnimation = variant === "interactive" && !shouldReduceMotion
      ? { scale: 1.01, y: -2 }
      : {};

    const tapAnimation = variant === "interactive" && !shouldReduceMotion
      ? { scale: 0.98 }
      : {};

    return (
      <motion.div
        ref={ref}
        className={`${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
        onClick={onClick}
        whileHover={hoverAnimation}
        whileTap={tapAnimation}
        style={{
          ...(glow && !shouldReduceMotion ? {
            boxShadow: `0 0 40px ${glowColors[glowColor]}, 0 4px 24px -4px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.04)`,
          } : {}),
        }}
        {...motionProps}
      >
        {/* Inner glow effect */}
        {innerGlow && (
          <div 
            className="absolute inset-0 rounded-[inherit] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 50%)",
            }}
          />
        )}
        {children}
      </motion.div>
    );
  }
);

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
          <motion.div 
            className="w-10 h-10 rounded-xl bg-[var(--glass-bg)] flex items-center justify-center text-xl"
            whileHover={{ scale: 1.05, rotate: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            {icon}
          </motion.div>
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

// Stat variant for displaying large numbers with enhanced animations
interface GlassStatCardProps {
  icon?: ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  sublabel?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  delay?: number;
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
  delay = 0,
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
    <GlassCard 
      padding="md" 
      className={className}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        ease: [0.16, 1, 0.3, 1] 
      }}
    >
      <div className="text-center">
        {icon && (
          <motion.div 
            className="text-2xl mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 15,
              delay: delay + 0.1 
            }}
          >
            {icon}
          </motion.div>
        )}
        <p className="label mb-1">{label}</p>
        <motion.div 
          className="flex items-baseline justify-center gap-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: delay + 0.2 }}
        >
          <span className="stat-number text-[var(--text-primary)]">{value}</span>
          {unit && (
            <span className="text-lg text-[var(--text-secondary)] font-display">
              {unit}
            </span>
          )}
        </motion.div>
        {sublabel && (
          <motion.p 
            className="text-sm text-[var(--text-secondary)] mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.3 }}
          >
            {sublabel}
          </motion.p>
        )}
        {trend && trendValue && (
          <motion.div 
            className={`flex items-center justify-center gap-1 mt-2 text-sm ${trendColors[trend]}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: delay + 0.4 }}
          >
            <span>{trendIcons[trend]}</span>
            <span>{trendValue}</span>
          </motion.div>
        )}
      </div>
    </GlassCard>
  );
}

// Feature card with visual accent
interface GlassFeatureCardProps extends Omit<GlassCardProps, "children"> {
  icon: ReactNode;
  title: string;
  description: string;
  accentColor?: "blue" | "purple" | "gold";
}

export function GlassFeatureCard({
  icon,
  title,
  description,
  accentColor = "blue",
  className = "",
  ...props
}: GlassFeatureCardProps) {
  const accentGradients = {
    blue: "from-[var(--accent-blue)] to-[var(--accent-blue-light)]",
    purple: "from-[var(--accent-purple)] to-[var(--accent-purple-light)]",
    gold: "from-[var(--accent-gold)] to-[var(--accent-gold-light)]",
  };

  return (
    <GlassCard 
      variant="interactive" 
      padding="lg" 
      innerGlow 
      className={`group ${className}`}
      {...props}
    >
      {/* Accent line */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1 rounded-t-[24px] bg-gradient-to-r ${accentGradients[accentColor]} opacity-80 group-hover:opacity-100 transition-opacity`}
      />
      
      <motion.div 
        className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${accentGradients[accentColor]} flex items-center justify-center text-2xl mb-4`}
        whileHover={{ scale: 1.05, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {icon}
      </motion.div>
      
      <h3 className="font-display font-semibold text-lg text-[var(--text-primary)] mb-2">
        {title}
      </h3>
      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
        {description}
      </p>
    </GlassCard>
  );
}
