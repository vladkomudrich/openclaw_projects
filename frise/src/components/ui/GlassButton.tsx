"use client";

import { ReactNode, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

type ButtonVariant = "primary" | "secondary" | "glass" | "ghost" | "danger";
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
  className?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-base gap-2",
  lg: "h-13 px-6 text-lg gap-2.5",
  xl: "h-16 px-8 text-xl gap-3",
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--accent-blue)]
    text-white font-semibold
    shadow-[0_4px_16px_rgba(91,141,239,0.4)]
    hover:bg-[var(--accent-blue-light)]
    hover:shadow-[0_6px_24px_rgba(91,141,239,0.5)]
    active:bg-[var(--accent-blue)]
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
    backdrop-blur-[16px]
    border border-[var(--glass-border)]
    text-[var(--text-primary)] font-medium
    hover:bg-[var(--glass-bg-hover)]
    hover:border-[var(--glass-border-active)]
    active:bg-[var(--glass-bg)]
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
    shadow-[0_4px_16px_rgba(248,113,113,0.4)]
    hover:bg-[var(--error)]/90
    active:bg-[var(--error)]
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
      className = "",
      ...motionProps
    },
    ref
  ) {
    const baseClasses = `
      inline-flex items-center justify-center
      rounded-xl
      transition-all duration-[200ms] ease-out
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
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        {...motionProps}
      >
        {isLoading ? (
          <LoadingSpinner size={size} />
        ) : (
          <>
            {icon && iconPosition === "left" && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            <span>{children}</span>
            {icon && iconPosition === "right" && (
              <span className="flex-shrink-0">{icon}</span>
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
    <svg
      className={`animate-spin ${spinnerSize[size]}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
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
    </svg>
  );
}

// Icon-only button variant
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
