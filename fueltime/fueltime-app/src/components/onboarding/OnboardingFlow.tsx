"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TimePickerWheel } from "../ui/TimePicker";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton, IconButton } from "../ui/GlassButton";
import type { Chronotype, UserGoal, WorkSchedule } from "@/types";
import { calculateOptimalSchedule } from "@/lib/algorithms/eating-window";

interface OnboardingFlowProps {
  onComplete: (profile: OnboardingResult) => void;
  onBack: () => void;
}

interface OnboardingResult {
  wakeTime: string;
  sleepTime: string;
  chronotype: Chronotype;
  primaryGoal: UserGoal;
  workSchedule: WorkSchedule;
}

const STEPS = [
  { id: "schedule", title: "Your Schedule", required: true },
  { id: "chronotype", title: "Your Chronotype", required: false },
  { id: "goal", title: "Your Goal", required: false },
];

const CHRONOTYPES: { value: Chronotype; emoji: string; title: string; description: string }[] = [
  {
    value: "morning",
    emoji: "☀️",
    title: "Morning Person",
    description: "Wake naturally before 7 AM, peak energy in morning",
  },
  {
    value: "intermediate",
    emoji: "🌤️",
    title: "Somewhere in Between",
    description: "Flexible schedule, balanced energy throughout day",
  },
  {
    value: "evening",
    emoji: "🌙",
    title: "Night Owl",
    description: "Prefer late nights, peak energy in evening",
  },
];

const GOALS: { value: UserGoal; emoji: string; title: string; description: string }[] = [
  {
    value: "mental_performance",
    emoji: "🎯",
    title: "Better Focus & Mental Performance",
    description: "Optimize for cognitive clarity and concentration",
  },
  {
    value: "energy_stability",
    emoji: "⚡",
    title: "Stable Energy Throughout Day",
    description: "Eliminate energy crashes and maintain consistent vitality",
  },
  {
    value: "athletic_performance",
    emoji: "🏃",
    title: "Athletic Performance",
    description: "Time meals for optimal workout performance and recovery",
  },
  {
    value: "metabolic_health",
    emoji: "💪",
    title: "Metabolic Health",
    description: "Improve insulin sensitivity and glucose control",
  },
  {
    value: "flexibility",
    emoji: "🧘",
    title: "Overall Wellness",
    description: "Balanced approach with flexibility for social life",
  },
];

export function OnboardingFlow({ onComplete, onBack }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [wakeTime, setWakeTime] = useState("07:00");
  const [sleepTime, setSleepTime] = useState("23:00");
  const [chronotype, setChronotype] = useState<Chronotype>("intermediate");
  const [primaryGoal, setPrimaryGoal] = useState<UserGoal>("energy_stability");

  // Calculate preview eating window
  const preview = calculateOptimalSchedule({
    wakeTime,
    sleepTime,
    chronotype,
    goal: primaryGoal,
    workSchedule: "standard",
  });

  const formatTime = (time: string) => {
    const [h, m] = time.split(":").map(Number);
    const period = h < 12 ? "AM" : "PM";
    const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
    return `${h12}:${m.toString().padStart(2, "0")} ${period}`;
  };

  const handleNext = useCallback(() => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete({
        wakeTime,
        sleepTime,
        chronotype,
        primaryGoal,
        workSchedule: "standard",
      });
    }
  }, [currentStep, wakeTime, sleepTime, chronotype, primaryGoal, onComplete]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      onBack();
    }
  }, [currentStep, onBack]);

  const handleSkip = useCallback(() => {
    if (currentStep === STEPS.length - 1) {
      onComplete({
        wakeTime,
        sleepTime,
        chronotype,
        primaryGoal,
        workSchedule: "standard",
      });
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [currentStep, wakeTime, sleepTime, chronotype, primaryGoal, onComplete]);

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--bg-dark)] flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-4">
          <IconButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            }
            label="Back"
            variant="ghost"
            onClick={handlePrevious}
          />
          <span className="text-sm font-medium text-[var(--text-secondary)]">
            Step {currentStep + 1} of {STEPS.length}
          </span>
          {!STEPS[currentStep].required ? (
            <GlassButton variant="ghost" size="sm" onClick={handleSkip}>
              Skip
            </GlassButton>
          ) : (
            <div className="w-12" />
          )}
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-[var(--glass-bg)] rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[var(--eating-primary)] to-[var(--fasting-primary)]"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6 overflow-y-auto">
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)]">
                  When do you wake up and sleep?
                </h2>
                <p className="mt-2 text-[var(--text-secondary)]">
                  This helps us align your eating with your circadian rhythm
                </p>
              </div>

              <div className="space-y-4">
                <GlassCard variant="orange" padding="lg">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🌅</span>
                    <span className="text-lg font-display font-semibold text-[var(--text-primary)]">
                      Wake Time
                    </span>
                  </div>
                  <TimePickerWheel value={wakeTime} onChange={setWakeTime} />
                </GlassCard>

                <GlassCard variant="fasting" padding="lg">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl">🌙</span>
                    <span className="text-lg font-display font-semibold text-[var(--text-primary)]">
                      Sleep Time
                    </span>
                  </div>
                  <TimePickerWheel value={sleepTime} onChange={setSleepTime} />
                </GlassCard>
              </div>

              {/* Preview Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GlassCard variant="eating" padding="lg" glow>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xl">✨</span>
                    <span className="font-display font-semibold text-[var(--text-primary)]">
                      Your Eating Window Preview
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Window Opens</p>
                      <p className="text-2xl font-display font-semibold text-[var(--eating-primary)]">
                        {formatTime(preview.eatingWindow.eatingWindowStart)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Window Closes</p>
                      <p className="text-2xl font-display font-semibold text-[var(--eating-primary)]">
                        {formatTime(preview.eatingWindow.eatingWindowEnd)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-[var(--glass-border)] flex justify-between">
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Eating</p>
                      <p className="font-display font-semibold text-[var(--text-primary)]">
                        {preview.eatingWindow.windowDuration}h
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--text-secondary)]">Fasting</p>
                      <p className="font-display font-semibold text-[var(--text-primary)]">
                        {preview.eatingWindow.fastingDuration}h
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}

          {currentStep === 1 && (
            <motion.div
              key="chronotype"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)]">
                  Are you a morning person or night owl?
                </h2>
                <p className="mt-2 text-[var(--text-secondary)]">
                  We'll fine-tune your schedule to match your natural rhythm
                </p>
              </div>

              <div className="space-y-3">
                {CHRONOTYPES.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setChronotype(type.value)}
                    className={`
                      w-full p-4 rounded-2xl border transition-all text-left
                      ${chronotype === type.value
                        ? "bg-[var(--eating-muted)] border-[var(--eating-primary)]"
                        : "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--glass-border-active)]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{type.emoji}</span>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-[var(--text-primary)]">
                          {type.title}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {type.description}
                        </p>
                      </div>
                      {chronotype === type.value && (
                        <svg
                          className="w-6 h-6 text-[var(--eating-primary)]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {currentStep === 2 && (
            <motion.div
              key="goal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2 className="text-2xl font-display font-semibold text-[var(--text-primary)]">
                  What's most important to you?
                </h2>
                <p className="mt-2 text-[var(--text-secondary)]">
                  We'll optimize your eating window for your primary goal
                </p>
              </div>

              <div className="space-y-3">
                {GOALS.map((goal) => (
                  <button
                    key={goal.value}
                    onClick={() => setPrimaryGoal(goal.value)}
                    className={`
                      w-full p-4 rounded-2xl border transition-all text-left
                      ${primaryGoal === goal.value
                        ? "bg-[var(--fasting-muted)] border-[var(--fasting-primary)]"
                        : "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--glass-border-active)]"
                      }
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-3xl">{goal.emoji}</span>
                      <div className="flex-1">
                        <p className="font-display font-semibold text-[var(--text-primary)]">
                          {goal.title}
                        </p>
                        <p className="text-sm text-[var(--text-secondary)]">
                          {goal.description}
                        </p>
                      </div>
                      {primaryGoal === goal.value && (
                        <svg
                          className="w-6 h-6 text-[var(--fasting-primary)]"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Button */}
      <div className="px-4 py-4 border-t border-[var(--glass-border)]">
        <GlassButton
          variant={currentStep === STEPS.length - 1 ? "eating" : "primary"}
          size="lg"
          fullWidth
          onClick={handleNext}
        >
          {currentStep === STEPS.length - 1 ? "See My Schedule" : "Continue"}
        </GlassButton>
      </div>
    </div>
  );
}
