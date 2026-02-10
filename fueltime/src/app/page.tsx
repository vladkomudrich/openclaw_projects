"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useFuelTime } from "@/contexts/FuelTimeContext";
import { WelcomeScreen } from "@/components/onboarding/WelcomeScreen";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { MealLogger } from "@/components/meal-log/MealLogger";
import { SettingsPanel } from "@/components/settings/SettingsPanel";

type AppView = "loading" | "welcome" | "onboarding" | "dashboard";

export default function Home() {
  const {
    isLoading,
    isInitialized,
    onboardingCompleted,
    updateProfile,
    completeOnboarding,
    recalculateSchedule,
  } = useFuelTime();

  const [view, setView] = useState<AppView>("loading");
  const [isMealLoggerOpen, setIsMealLoggerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Determine initial view based on state
  useEffect(() => {
    if (isLoading) {
      setView("loading");
    } else if (!isInitialized) {
      setView("welcome");
    } else if (!onboardingCompleted) {
      setView("welcome");
    } else {
      setView("dashboard");
    }
  }, [isLoading, isInitialized, onboardingCompleted]);

  // Handle onboarding completion
  const handleOnboardingComplete = (profile: {
    wakeTime: string;
    sleepTime: string;
    chronotype: "morning" | "intermediate" | "evening";
    primaryGoal:
      | "mental_performance"
      | "energy_stability"
      | "athletic_performance"
      | "metabolic_health"
      | "flexibility";
    workSchedule: "standard" | "shift_work" | "flexible" | "variable";
  }) => {
    updateProfile(profile);
    completeOnboarding();
    recalculateSchedule();
    setView("dashboard");
  };

  // Loading state
  if (view === "loading") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-dark)]">
        {/* Animated logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <motion.div
            className="text-6xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            🍽️
          </motion.div>
          {/* Pulse ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[var(--eating-primary)]"
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        
        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center"
        >
          <h1 className="text-xl font-display font-semibold text-[var(--text-primary)]">
            FuelTime
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Preparing your schedule...
          </p>
        </motion.div>
        
        {/* Loading bar */}
        <motion.div
          className="mt-8 w-48 h-1 bg-[var(--glass-bg)] rounded-full overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--eating-primary)] to-[var(--fasting-primary)]"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    );
  }

  // Welcome screen
  if (view === "welcome") {
    return <WelcomeScreen onGetStarted={() => setView("onboarding")} />;
  }

  // Onboarding flow
  if (view === "onboarding") {
    return (
      <OnboardingFlow
        onComplete={handleOnboardingComplete}
        onBack={() => setView("welcome")}
      />
    );
  }

  // Main dashboard
  return (
    <>
      <Dashboard
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogMeal={() => setIsMealLoggerOpen(true)}
      />
      
      <MealLogger
        isOpen={isMealLoggerOpen}
        onClose={() => setIsMealLoggerOpen(false)}
      />
      
      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
