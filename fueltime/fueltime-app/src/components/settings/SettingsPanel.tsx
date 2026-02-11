"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFuelTime } from "@/contexts/FuelTimeContext";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton } from "../ui/GlassButton";
import { TimePickerWheel } from "../ui/TimePicker";
import type { Chronotype, UserGoal } from "@/types";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const CHRONOTYPES: { value: Chronotype; label: string; emoji: string }[] = [
  { value: "morning", label: "Morning Person", emoji: "☀️" },
  { value: "intermediate", label: "Intermediate", emoji: "🌤️" },
  { value: "evening", label: "Night Owl", emoji: "🌙" },
];

const GOALS: { value: UserGoal; label: string; emoji: string }[] = [
  { value: "mental_performance", label: "Mental Performance", emoji: "🎯" },
  { value: "energy_stability", label: "Energy Stability", emoji: "⚡" },
  { value: "athletic_performance", label: "Athletic Performance", emoji: "🏃" },
  { value: "metabolic_health", label: "Metabolic Health", emoji: "💪" },
  { value: "flexibility", label: "Flexibility", emoji: "🧘" },
];

const WINDOW_DURATIONS: { value: 8 | 10 | 12; label: string; sublabel: string }[] = [
  { value: 8, label: "8 hours", sublabel: "Aggressive" },
  { value: 10, label: "10 hours", sublabel: "Balanced" },
  { value: 12, label: "12 hours", sublabel: "Flexible" },
];

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const {
    profile,
    preferences,
    updateProfile,
    updatePreferences,
    exportUserData,
    resetAllData,
  } = useFuelTime();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!profile || !preferences) return null;

  const handleExport = () => {
    const data = exportUserData();
    if (data) {
      const blob = new Blob([data], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fueltime-backup-${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md z-50 bg-[var(--bg-dark)] overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 glass border-b border-[var(--glass-border)] px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚙️</span>
                  <h2 className="text-xl font-display font-semibold text-[var(--text-primary)]">
                    Settings
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="w-10 h-10 glass rounded-xl flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6 pb-8">
              {/* Schedule Section */}
              <section>
                <h3 className="label mb-3">Your Schedule</h3>
                <GlassCard variant="default" padding="md">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                        🌅 Wake Time
                      </label>
                      <TimePickerWheel
                        value={profile.wakeTime}
                        onChange={(time) => updateProfile({ wakeTime: time })}
                      />
                    </div>
                    <div className="border-t border-[var(--glass-border)] pt-4">
                      <label className="text-sm font-medium text-[var(--text-secondary)] mb-2 block">
                        🌙 Sleep Time
                      </label>
                      <TimePickerWheel
                        value={profile.sleepTime}
                        onChange={(time) => updateProfile({ sleepTime: time })}
                      />
                    </div>
                  </div>
                </GlassCard>
              </section>

              {/* Profile Section */}
              <section>
                <h3 className="label mb-3">Profile</h3>
                <GlassCard variant="default" padding="md">
                  <div className="space-y-4">
                    {/* Chronotype */}
                    <div>
                      <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block">
                        Chronotype
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {CHRONOTYPES.map((type) => (
                          <button
                            key={type.value}
                            onClick={() => updateProfile({ chronotype: type.value })}
                            className={`
                              p-3 rounded-xl border transition-all text-center
                              ${profile.chronotype === type.value
                                ? "bg-[var(--eating-muted)] border-[var(--eating-primary)] text-[var(--eating-primary)]"
                                : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--glass-border-active)]"
                              }
                            `}
                          >
                            <span className="text-xl block mb-1">{type.emoji}</span>
                            <span className="text-xs font-medium">{type.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Primary Goal */}
                    <div className="border-t border-[var(--glass-border)] pt-4">
                      <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block">
                        Primary Goal
                      </label>
                      <div className="space-y-2">
                        {GOALS.map((goal) => (
                          <button
                            key={goal.value}
                            onClick={() => updateProfile({ primaryGoal: goal.value })}
                            className={`
                              w-full p-3 rounded-xl border transition-all flex items-center gap-3 text-left
                              ${profile.primaryGoal === goal.value
                                ? "bg-[var(--fasting-muted)] border-[var(--fasting-primary)] text-[var(--fasting-primary)]"
                                : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--glass-border-active)]"
                              }
                            `}
                          >
                            <span className="text-xl">{goal.emoji}</span>
                            <span className="text-sm font-medium">{goal.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </section>

              {/* Eating Window Preferences */}
              <section>
                <h3 className="label mb-3">Eating Window</h3>
                <GlassCard variant="default" padding="md">
                  <label className="text-sm font-medium text-[var(--text-secondary)] mb-3 block">
                    Window Duration
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {WINDOW_DURATIONS.map((duration) => (
                      <button
                        key={duration.value}
                        onClick={() => updatePreferences({ windowDuration: duration.value })}
                        className={`
                          p-3 rounded-xl border transition-all text-center
                          ${preferences.windowDuration === duration.value
                            ? "bg-[var(--accent-orange-muted)] border-[var(--accent-orange)] text-[var(--accent-orange)]"
                            : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)] hover:border-[var(--glass-border-active)]"
                          }
                        `}
                      >
                        <span className="text-lg font-display font-semibold block">{duration.label}</span>
                        <span className="text-xs opacity-70">{duration.sublabel}</span>
                      </button>
                    ))}
                  </div>
                </GlassCard>
              </section>

              {/* Display Section */}
              <section>
                <h3 className="label mb-3">Display</h3>
                <GlassCard variant="default" padding="md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-[var(--text-secondary)]">
                      24-hour time format
                    </span>
                    <button
                      onClick={() =>
                        updatePreferences({
                          displayFormat: preferences.displayFormat === "24h" ? "12h" : "24h",
                        })
                      }
                      className={`
                        w-12 h-7 rounded-full transition-colors relative
                        ${preferences.displayFormat === "24h"
                          ? "bg-[var(--eating-primary)]"
                          : "bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                        }
                      `}
                    >
                      <motion.div
                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                        animate={{
                          left: preferences.displayFormat === "24h" ? "calc(100% - 24px)" : "4px",
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                </GlassCard>
              </section>

              {/* Data Management */}
              <section>
                <h3 className="label mb-3">Data</h3>
                <div className="space-y-3">
                  <GlassButton
                    variant="fasting"
                    fullWidth
                    onClick={handleExport}
                    icon={<span>📤</span>}
                  >
                    Export Data
                  </GlassButton>
                  <GlassButton
                    variant="glass"
                    fullWidth
                    onClick={() => setShowResetConfirm(true)}
                    icon={<span>🗑️</span>}
                  >
                    Reset All Data
                  </GlassButton>
                </div>
              </section>

              {/* About Section */}
              <section>
                <h3 className="label mb-3">About</h3>
                <GlassCard variant="default" padding="lg" className="text-center">
                  <p className="text-3xl mb-2">🍽️⏰</p>
                  <p className="font-display font-semibold text-[var(--text-primary)]">FuelTime</p>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Science-based meal timing optimizer
                  </p>
                  <p className="text-xs text-[var(--text-muted)] mt-2">
                    Version 1.0.0
                  </p>
                </GlassCard>
              </section>
            </div>

            {/* Reset Confirmation Modal */}
            <AnimatePresence>
              {showResetConfirm && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                  >
                    <GlassCard variant="elevated" padding="lg" className="max-w-sm">
                      <h3 className="text-lg font-display font-semibold text-[var(--text-primary)] mb-2">
                        Reset All Data?
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] mb-6">
                        This will delete all your meal logs, preferences, and profile
                        data. This action cannot be undone.
                      </p>
                      <div className="flex gap-3">
                        <GlassButton
                          variant="glass"
                          fullWidth
                          onClick={() => setShowResetConfirm(false)}
                        >
                          Cancel
                        </GlassButton>
                        <GlassButton
                          variant="danger"
                          fullWidth
                          onClick={handleReset}
                        >
                          Reset
                        </GlassButton>
                      </div>
                    </GlassCard>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
