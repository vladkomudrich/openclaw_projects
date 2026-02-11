"use client";

import { Button as HeroButton } from "@heroui/react";
import { ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  isDisabled?: boolean;
  fullWidth?: boolean;
  startContent?: ReactNode;
  endContent?: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-[var(--accent-blue)] text-white hover:bg-[var(--accent-blue-light)] shadow-[var(--shadow-glow-blue)]",
  secondary: "bg-transparent border-2 border-[var(--accent-blue)] text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/10",
  ghost: "bg-transparent text-[var(--text-secondary)] hover:bg-[var(--glass-bg)] hover:text-[var(--text-primary)]",
  danger: "bg-[var(--error)] text-white hover:opacity-90",
};

/**
 * @deprecated Use GlassButton from '@/components/ui/GlassButton' instead
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  isDisabled = false,
  fullWidth = false,
  startContent,
  endContent,
  onClick,
  type = "button",
  className = "",
}: ButtonProps) {
  return (
    <HeroButton
      className={`font-medium rounded-xl transition-all ${variantStyles[variant]} ${className}`}
      size={size}
      isLoading={isLoading}
      isDisabled={isDisabled}
      fullWidth={fullWidth}
      startContent={startContent}
      endContent={endContent}
      onPress={onClick}
      type={type}
    >
      {children}
    </HeroButton>
  );
}
