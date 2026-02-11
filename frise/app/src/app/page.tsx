"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSleepData } from "@/hooks/useSleepData";
import { Dashboard, DashboardEmptyState, DashboardLoading } from "@/components/dashboard/Dashboard";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";

export default function HomePage() {
  const router = useRouter();
  const { 
    isLoading, 
    hasTodayData, 
    hasCompletedOnboarding,
    productivityCurve,
  } = useSleepData();

  const handleGetStarted = () => {
    router.push("/sleep/new");
  };

  const handleLogSleep = () => {
    router.push("/sleep/new");
  };

  // Show loading state
  if (isLoading) {
    return (
      <main className="container max-w-2xl mx-auto px-4 py-8 md:pt-24">
        <DashboardLoading />
      </main>
    );
  }

  // Show welcome screen for first-time users
  if (!hasCompletedOnboarding && !hasTodayData) {
    return <WelcomeScreen onGetStarted={handleGetStarted} />;
  }

  // Show empty state if no data for today
  if (!hasTodayData || !productivityCurve) {
    return (
      <main className="container max-w-2xl mx-auto px-4 md:pt-24">
        <DashboardEmptyState onLogSleep={handleLogSleep} />
      </main>
    );
  }

  // Show dashboard with data
  return (
    <main className="container max-w-2xl mx-auto px-4 py-8 md:pt-24">
      <Dashboard curve={productivityCurve} onLogSleep={handleLogSleep} />
    </main>
  );
}
