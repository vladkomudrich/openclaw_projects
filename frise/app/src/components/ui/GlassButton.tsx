"use client";

import { ReactNode, forwardRef } from "react";
import { motion, HTMLMotionProps, useReducedMotion } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "glass" | "ghost" | "danger" | "premium";
type ButtonSize = "sm" | "md" | "lg" | "xl";

interface GlassButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  shimmer?: boolean;
  className?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm gap-1.5 rounded-lg",
  md: "h-11 px-5 text-base gap-2 rounded-xl",
  lg: "h-13 px-6 text-lg gap-2.5 rounded-xl",
  xl: "h-16 px-8 text-xl gap-3 rounded-2xl",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--accent-blue)]
    text-white font-semibold
    shadow-[0_4px_20px_-4px_rgba(91,141,239,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]
    hover:bg-[var(--accent-blue-light)]
    hover:shadow-[0_8px_30px_-4px_rgba(91,141,239,0.6)]
    active:shadow-[0_2px_10px_-2px_rgba(91,141,239,0.4)]
  `,
  secondary: `
    bg-transparent
    border-2 border-[var(--accent-blue)]
    text-[var(--accent-blue)] font-semibold
    hover:bg-[var(--accent-blue)]/10
    hover:border-[var(--accent-blue-light)]
    active:bg-[var(--accent-blue)]/20
  `,
  glass: `
    bg-[var(--glass-bg)]
    backdrop-blur-[20px] backdrop-saturate-[1.2]
    border border-[var(--glass-border)]
    text-[var(--text-primary)] font-medium
    shadow-[0_2px_12px_-2px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.04)]
    hover:bg-[var(--glass-bg-hover)]
    hover:border-[var(--glass-border-active)]
    hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.4)]
  `,
  ghost: `
    bg-transparent
    text-[var(--text-secondary)] font-medium
    hover:bg-[var(--glass-bg)]
    hover:text-[var(--text-primary)]
    active:bg-[var(--glass-bg-hover)]
  `,
  danger: `
    bg-[var(--error)]
    text-white font-semibold
    shadow-[0_4px_20px_-4px_rgba(248,113,113,0.5),inset_0_1px_0_rgba(255,255,255,0.15)]
    hover:brightness-110
    active:shadow-[0_2px_10px_-2px_rgba(248,113,113,0.4)]
  `,
  premium: `
    bg-gradient-to-r from-[var(--accent-blue)] via-[var(--accent-purple)] to-[var(--accent-blue)]
    text-white font-semibold
    background-size: 200% 100%
    shadow-[0_4px_24px_-4px_rgba(123,104,238,0.5),inset_0_1px_0_rgba(255,255,255,0.2)]
    hover:shadow-[0_8px_32px_-4px_rgba(123,104,238,0.6)]
    animate-gradient-shift
  `,
};

export const GlassButton = forwardRef<HTMLButtonElement, GlassButtonProps>(
  function GlassButton(
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      isDisabled = false,
      fullWidth = false,
      icon,
      iconPosition = "left",
      shimmer = false,
      className = "",
      ...motionProps
    },
    ref
  ) {
    const shouldReduceMotion = useReducedMotion();

    const baseClasses = `
      relative
      inline-flex items-center justify-center
      transition-all duration-200 ease-out
      focus-visible:outline-none
      focus-visible:ring-2
      focus-visible:ring-[var(--accent-blue)]
      focus-visible:ring-offset-2
      focus-visible:ring-offset-[var(--bg-dark)]
      disabled:opacity-50
      disabled:cursor-not-allowed
      disabled:pointer-events-none
    `;

    return (
      <motion.button
        ref={ref}
        className={`
          ${baseClasses}
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${fullWidth ? "w-full" : ""}
          ${className}
        `}
        disabled={isDisabled || isLoading}
        whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
        whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...motionProps}
      >
        {/* Shimmer effect overlay */}
        {shimmer && !isLoading && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="absolute inset-0 -translate-x-full"
              animate={{ translateX: ["100%", "-100%"] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
              style={{
                background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)",
              }}
            />
          </motion.div>
        )}

        {isLoading ? (
          <LoadingSpinner size={size} />
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <motion.span 
                className="flex-shrink-0"
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {icon}
              </motion.span>
            )}
            <span>{children}</span>
            {icon && iconPosition === "right" && (
              <motion.span 
                className="flex-shrink-0"
                initial={{ opacity: 0, x: 5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                {icon}
              </motion.span>
            )}
          </>
        )}
      </motion.button>
    );
  }
);

function LoadingSpinner({ size }: { size: ButtonSize }) {
  const spinnerSize = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
    xl: "w-7 h-7",
  };

  return (
    <motion.svg
      className={`${spinnerSize[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </motion.svg>
  );
}

// Icon-only button variant with enhanced hover states
interface IconButtonProps extends Omit<GlassButtonProps, "children" | "icon"> {
  icon: ReactNode;
  label: string; // For accessibility
}

export function IconButton({
  icon,
  label,
  variant = "glass",
  size = "md",
  className = "",
  ...props
}: IconButtonProps) {
  const iconSizeClasses: Record<ButtonSize, string> = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-14 h-14",
  };

  return (
    <GlassButton
      variant={variant}
      size={size}
      className={`!p-0 ${iconSizeClasses[size]} ${className}`}
      aria-label={label}
      {...props}
    >
      {icon}
    </GlassButton>
  );
}

// Pill button variant for tags/filters
interface PillButtonProps {
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function PillButton({ 
  children, 
  isActive = false, 
  onClick, 
  className = "" 
}: PillButtonProps) {
  const shouldReduceMotion = useReducedMotion();
  
  return (
    <motion.button
      className={`
        px-4 py-2 rounded-full text-sm font-medium
        transition-all duration-200
        ${isActive 
          ? "bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] border border-[var(--accent-blue)]/30" 
          : "bg-[var(--glass-bg)] text-[var(--text-secondary)] border border-[var(--glass-border)] hover:text-[var(--text-primary)] hover:bg-[var(--glass-bg-hover)]"
        }
        ${className}
      `}
      onClick={onClick}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
    >
      {children}
    </motion.button>
  );
}
