"use client";

import { HeroUIProvider } from "@heroui/react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { FuelTimeProvider } from "@/contexts/FuelTimeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <ErrorBoundary>
      <HeroUIProvider navigate={router.push}>
        <FuelTimeProvider>
          {children}
        </FuelTimeProvider>
      </HeroUIProvider>
    </ErrorBoundary>
  );
}
