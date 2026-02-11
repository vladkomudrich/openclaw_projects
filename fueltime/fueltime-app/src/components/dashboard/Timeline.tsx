"use client";

import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { EatingWindow } from "@/types";
import { GlassCard } from "../ui/GlassCard";

interface TimelineProps {
  eatingWindow: EatingWindow;
  currentTime?: string; // HH:mm format
}

export function Timeline({ eatingWindow, currentTime }: TimelineProps) {
  const [now, setNow] = useState<string>(currentTime || getCurrentTime());

  // Update current time every minute
  useEffect(() => {
    if (currentTime) return;

    const interval = setInterval(() => {
      setNow(getCurrentTime());
    }, 60000);

    return () => clearInterval(interval);
  }, [currentTime]);

  // Calculate positions as percentages (0-100)
  const positions = useMemo(() => {
    const timeToPercent = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return ((h * 60 + m) / (24 * 60)) * 100;
    };

    const wakePercent = timeToPercent(eatingWindow.eatingWindowStart);
    // Approximate sleep time (assume ~8 hours after window ends)
    const sleepPercent = Math.min(
      timeToPercent(eatingWindow.eatingWindowEnd) + 15,
      100
    );

    return {
      wake: wakePercent,
      sleep: sleepPercent,
      windowStart: timeToPercent(eatingWindow.eatingWindowStart),
      windowEnd: timeToPercent(eatingWindow.eatingWindowEnd),
      breakfast: timeToPercent(eatingWindow.breakfast.optimal),
      lunch: timeToPercent(eatingWindow.lunch.optimal),
      dinner: timeToPercent(eatingWindow.dinner.optimal),
      current: timeToPercent(now),
      metabolicSwitch: timeToPercent(eatingWindow.metabolicSwitchTime),
    };
  }, [eatingWindow, now]);

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const period = h < 12 ? "AM" : "PM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  // Hour markers for timeline
  const hourMarkers = [0, 6, 12, 18, 24];

  return (
    <GlassCard variant="default" padding="md" className="mx-4">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display font-semibold text-[var(--text-primary)]">
          Today's Timeline
        </h3>
        <span className="text-sm text-[var(--text-secondary)]">
          {formatTime(now)}
        </span>
      </div>

      {/* Timeline container */}
      <div className="relative h-28 bg-[var(--bg-dark-elevated)] rounded-2xl overflow-hidden border border-[var(--glass-border)]">
        {/* Sleep zones (before wake and after sleep) */}
        <div
          className="absolute top-0 bottom-0 bg-[var(--glass-bg)]"
          style={{ left: 0, width: `${positions.wake - 4}%` }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg opacity-30">💤</span>
          </div>
        </div>
        <div
          className="absolute top-0 bottom-0 bg-[var(--glass-bg)]"
          style={{ left: `${positions.sleep}%`, right: 0 }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg opacity-30">💤</span>
          </div>
        </div>

        {/* Fasting zone (before eating window) */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          style={{
            left: `${positions.wake - 4}%`,
            width: `${positions.windowStart - positions.wake + 4}%`,
            transformOrigin: "left",
          }}
          className="absolute top-0 bottom-0 bg-gradient-to-r from-[var(--fasting-secondary)] to-[var(--fasting-primary)] opacity-80"
        />

        {/* Eating window */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          style={{
            left: `${positions.windowStart}%`,
            width: `${positions.windowEnd - positions.windowStart}%`,
            transformOrigin: "left",
          }}
          className="absolute top-0 bottom-0 bg-gradient-to-r from-[var(--eating-primary)] via-[var(--eating-secondary)] to-[var(--accent-orange)]"
        />

        {/* Post-dinner fasting */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          style={{
            left: `${positions.windowEnd}%`,
            width: `${positions.sleep - positions.windowEnd}%`,
            transformOrigin: "left",
          }}
          className="absolute top-0 bottom-0 bg-gradient-to-r from-[var(--fasting-primary)] to-[var(--fasting-secondary)] opacity-80"
        />

        {/* Meal markers */}
        <MealMarker
          position={positions.breakfast}
          emoji="🍳"
          label="Breakfast"
          time={formatTime(eatingWindow.breakfast.optimal)}
        />
        <MealMarker
          position={positions.lunch}
          emoji="🥗"
          label="Lunch"
          time={formatTime(eatingWindow.lunch.optimal)}
        />
        <MealMarker
          position={positions.dinner}
          emoji="🍽️"
          label="Dinner"
          time={formatTime(eatingWindow.dinner.optimal)}
        />

        {/* Current time indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          style={{ left: `${positions.current}%` }}
          className="absolute top-0 bottom-0 w-0.5 bg-white z-20"
        >
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] animate-pulse" />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-white whitespace-nowrap bg-[var(--bg-dark)] px-1.5 py-0.5 rounded">
            Now
          </div>
        </motion.div>

        {/* Hour labels */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2">
          {hourMarkers.map((hour) => (
            <span
              key={hour}
              className="text-[9px] text-[var(--text-muted)] font-medium"
              style={{ left: `${(hour / 24) * 100}%` }}
            >
              {hour === 0 ? "12AM" : hour === 12 ? "12PM" : hour < 12 ? `${hour}AM` : `${hour - 12}PM`}
            </span>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-[var(--eating-primary)] to-[var(--accent-orange)]" />
          <span className="text-[var(--text-secondary)]">Eating</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[var(--fasting-primary)]" />
          <span className="text-[var(--text-secondary)]">Fasting</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-sm bg-[var(--glass-bg)] border border-[var(--glass-border)]" />
          <span className="text-[var(--text-secondary)]">Sleep</span>
        </div>
      </div>
    </GlassCard>
  );
}

// Meal marker component
function MealMarker({
  position,
  emoji,
  label,
  time,
}: {
  position: number;
  emoji: string;
  label: string;
  time: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      style={{ left: `${position}%` }}
      className="absolute top-2 -translate-x-1/2 z-10"
    >
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 glass rounded-full flex items-center justify-center text-lg shadow-lg">
          {emoji}
        </div>
        <div className="mt-1 px-1.5 py-0.5 glass rounded text-[9px] font-medium text-[var(--text-primary)] whitespace-nowrap">
          {time}
        </div>
      </div>
    </motion.div>
  );
}

// Helper function
function getCurrentTime(): string {
  const now = new Date();
  return `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
}
