"use client";

import { Card as HeroCard, CardBody, CardHeader, CardFooter } from "@heroui/react";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  isPressable?: boolean;
  onClick?: () => void;
}

/**
 * @deprecated Use GlassCard from '@/components/ui/GlassCard' instead
 */
export function Card({ 
  children, 
  header, 
  footer, 
  className = "",
  isPressable = false,
  onClick 
}: CardProps) {
  return (
    <HeroCard 
      className={`
        bg-[var(--glass-bg)] 
        backdrop-blur-[16px]
        border border-[var(--glass-border)] 
        shadow-[var(--shadow-sm)]
        ${className}
      `}
      isPressable={isPressable}
      onPress={onClick}
    >
      {header && (
        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start">
          {header}
        </CardHeader>
      )}
      <CardBody className="overflow-visible py-4 px-4">
        {children}
      </CardBody>
      {footer && (
        <CardFooter className="pt-0 pb-4 px-4">
          {footer}
        </CardFooter>
      )}
    </HeroCard>
  );
}
