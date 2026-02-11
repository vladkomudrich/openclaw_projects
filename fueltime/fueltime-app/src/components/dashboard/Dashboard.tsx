"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Timeline } from "./Timeline";
import { InsightCard, StatusCard, TipCard, ScoreRing } from "./InsightCard";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton, FAB, IconButton } from "../ui/GlassButton";
import { BottomNav } from "../ui/BottomNav";
import { useFuelTime } from "@/contexts/FuelTimeContext";
import { getCurrentEatingStatus } from "@/lib/algorithms/eating-window";
import type { PerformanceZone } from "@/types";

interface DashboardProps {
  onOpenSettings: () => void;
  onLogMeal: () => void;
}

// Contextual tips based on time and status
const TIPS_DATABASE = [
  {
    id: "morning-glucose",
    tip: "Your glucose tolerance is highest right now—perfect time for complex carbs like oatmeal or whole grains.",
    category: "nutrition" as const,
    timeRange: [6, 10],
  },
  {
    id: "breakfast-importance",
    tip: "Eating breakfast within 2 hours of waking improves mental performance by 15-20% throughout the day.",
    category: "science" as const,
    timeRange: [6, 9],
  },
  {
    id: "lunch-energy",
    tip: "Keep lunch moderate in size. Large midday meals can cause the afternoon energy dip.",
    category: "timing" as const,
    timeRange: [11, 14],
  },
  {
    id: "afternoon-performance",
    tip: "Your body temperature peaks in late afternoon—optimal time for physical activity.",
    category: "performance" as const,
    timeRange: [14, 18],
  },
  {
    id: "dinner-timing",
    tip: "Finish eating 3+ hours before bed for better sleep quality and metabolic health.",
    category: "timing" as const,
    timeRange: [17, 20],
  },
  {
    id: "fasting-benefits",
    tip: "After 12 hours of fasting, your body shifts to fat-burning mode. Metabolic benefits are kicking in!",
    category: "science" as const,
    timeRange: [5, 8],
  },
  {
    id: "protein-timing",
    tip: "Distribute protein across all meals for optimal muscle protein synthesis—25-30g per meal is ideal.",
    category: "nutrition" as const,
    timeRange: [0, 24],
  },
  {
    id: "hydration",
    tip: "Stay hydrated during fasting hours. Water, black coffee, and unsweetened tea don't break your fast.",
    category: "nutrition" as const,
    timeRange: [5, 10],
  },
];

export function Dashboard({ onOpenSettings, onLogMeal }: DashboardProps) {
  const {
    profile,
    eatingWindow,
    performanceZones,
    recommendations,
    mealLogs,
    isLoading,
  } = useFuelTime();

  const [currentTime, setCurrentTime] = useState(getCurrentTime());

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(getCurrentTime());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get current eating status
  const status = useMemo(() => {
    if (!eatingWindow) return null;
    return getCurrentEatingStatus(currentTime, eatingWindow);
  }, [currentTime, eatingWindow]);

  // Get relevant tip for current time
  const currentTip = useMemo(() => {
    const hour = parseInt(currentTime.split(":")[0]);
    const relevantTips = TIPS_DATABASE.filter(
      (tip) => hour >= tip.timeRange[0] && hour < tip.timeRange[1]
    );
    if (relevantTips.length === 0) return TIPS_DATABASE[6]; // Default to protein tip
    return relevantTips[Math.floor(Math.random() * relevantTips.length)];
  }, [currentTime]);

  // Calculate today's timing score (simplified)
  const todayScore = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayLogs = mealLogs.filter(
      (log) => log.timestamp.split("T")[0] === today
    );
    if (todayLogs.length === 0) return null;
    const avgScore =
      todayLogs.reduce((sum, log) => sum + log.timingScore, 0) /
      todayLogs.length;
    return Math.round(avgScore);
  }, [mealLogs]);

  // Get current performance zone
  const currentZone = useMemo(() => {
    if (!performanceZones) return null;
    const zones = Object.values(performanceZones) as PerformanceZone[];
    return zones.find((zone) => {
      const [startH, startM] = zone.start.split(":").map(Number);
      const [endH, endM] = zone.end.split(":").map(Number);
      const [curH, curM] = currentTime.split(":").map(Number);
      const startMins = startH * 60 + startM;
      const endMins = endH * 60 + endM;
      const curMins = curH * 60 + curM;
      return curMins >= startMins && curMins <= endMins;
    });
  }, [performanceZones, currentTime]);

  if (isLoading || !profile || !eatingWindow || !status) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-dark)]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-10 h-10 border-3 border-[var(--eating-primary)] border-t-transparent rounded-full" />
          <p className="text-[var(--text-secondary)] font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const period = h < 12 ? "AM" : "PM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-dark)]">
      {/* Header */}
      <header className="glass sticky top-0 z-30 mx-4 mt-4 md:mt-0 md:mx-0 md:rounded-none">
        <div className="flex items-center justify-between px-4 py-3 max-w-3xl mx-auto">
          <div>
            <h1 className="text-xl font-display font-semibold text-[var(--text-primary)]">
              FuelTime
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <IconButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            }
            label="Settings"
            variant="glass"
            onClick={onOpenSettings}
          />
        </div>
      </header>

      <main className="max-w-3xl mx-auto pb-32 md:pt-4">
        {/* Status Card */}
        <div className="p-4">
          <StatusCard
            status={status.status}
            message={status.message}
            nextEvent={status.nextEvent}
          />
        </div>

        {/* Timeline */}
        <div className="mb-4">
          <Timeline eatingWindow={eatingWindow} />
        </div>

        {/* Insights Grid */}
        <div className="px-4 grid grid-cols-2 gap-3">
          <InsightCard
            icon="🍽️"
            title="Eating Window"
            value={`${eatingWindow.windowDuration}h`}
            subtitle={`${formatTime(eatingWindow.eatingWindowStart)} - ${formatTime(
              eatingWindow.eatingWindowEnd
            )}`}
            color="eating"
            delay={0.1}
          />
          <InsightCard
            icon="🔥"
            title="Fasting Duration"
            value={`${eatingWindow.fastingDuration}h`}
            subtitle="Overnight fast"
            color="fasting"
            delay={0.2}
          />
          <InsightCard
            icon="🧠"
            title="Peak Focus"
            value={formatTime(performanceZones?.peakMentalClarity.start || "09:00")}
            subtitle={`Until ${formatTime(
              performanceZones?.peakMentalClarity.end || "12:00"
            )}`}
            color="orange"
            delay={0.3}
          />
          <InsightCard
            icon="🏃"
            title="Best Workout"
            value={formatTime(performanceZones?.athleticPerformance.start || "16:00")}
            subtitle="Late afternoon peak"
            color="default"
            delay={0.4}
          />
        </div>

        {/* Today's Score (if logs exist) */}
        {todayScore !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-4 mt-4"
          >
            <GlassCard variant="default" padding="md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Today's Timing Score
                  </p>
                  <p className="text-lg font-display font-semibold text-[var(--text-primary)] mt-1">
                    {todayScore >= 80
                      ? "Great alignment! 🎉"
                      : todayScore >= 60
                      ? "Good progress 👍"
                      : "Room for improvement"}
                  </p>
                </div>
                <ScoreRing score={todayScore} />
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Current Performance Zone */}
        {currentZone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mx-4 mt-4"
          >
            <GlassCard variant="default" padding="md">
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  {currentZone.type === "mental"
                    ? "🧠"
                    : currentZone.type === "physical"
                    ? "💪"
                    : currentZone.type === "recovery"
                    ? "🌙"
                    : "⚠️"}
                </span>
                <div>
                  <p className="font-display font-semibold text-[var(--text-primary)]">
                    {currentZone.name}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {currentZone.description}
                  </p>
                  {currentZone.tips.length > 0 && (
                    <p className="text-xs text-[var(--eating-primary)] mt-2">
                      💡 {currentZone.tips[0]}
                    </p>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}

        {/* Tip of the Moment */}
        <div className="px-4 mt-4">
          <p className="text-sm font-medium text-[var(--text-secondary)] mb-2">
            💡 Tip
          </p>
          <TipCard tip={currentTip.tip} category={currentTip.category} />
        </div>

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="px-4 mt-6"
          >
            <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">
              📋 Your Personalized Recommendations
            </p>
            <div className="space-y-2">
              {recommendations.slice(0, 3).map((rec, idx) => (
                <GlassCard key={idx} variant="default" padding="sm">
                  <p className="text-sm text-[var(--text-secondary)]">{rec}</p>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}
      </main>

      {/* Floating Action Button */}
      <FAB
        icon={
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        }
        label="Log meal"
        variant="eating"
        onClick={onLogMeal}
      />

      {/* Bottom Navigation (mobile) */}
      <BottomNav />
    </div>
  );
}

function getCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}
