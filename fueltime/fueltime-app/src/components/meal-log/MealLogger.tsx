"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useFuelTime } from "@/contexts/FuelTimeContext";
import { GlassCard } from "../ui/GlassCard";
import { GlassButton, IconButton } from "../ui/GlassButton";
import { calculateMealTimingScore, isWithinWindow } from "@/lib/algorithms/eating-window";
import type { MealType, MealSize, MacroBalance, EnergyLevel } from "@/types";

interface MealLoggerProps {
  isOpen: boolean;
  onClose: () => void;
}

const MEAL_TYPES: { value: MealType; emoji: string; label: string }[] = [
  { value: "breakfast", emoji: "🍳", label: "Breakfast" },
  { value: "lunch", emoji: "🥗", label: "Lunch" },
  { value: "dinner", emoji: "🍽️", label: "Dinner" },
  { value: "snack", emoji: "🍎", label: "Snack" },
];

const MEAL_SIZES: { value: MealSize; emoji: string; label: string }[] = [
  { value: "light", emoji: "🥒", label: "Light" },
  { value: "moderate", emoji: "🍱", label: "Moderate" },
  { value: "hearty", emoji: "🍖", label: "Hearty" },
];

const MACRO_TYPES: { value: MacroBalance; emoji: string; label: string }[] = [
  { value: "carb_heavy", emoji: "🍞", label: "Carb-heavy" },
  { value: "balanced", emoji: "⚖️", label: "Balanced" },
  { value: "protein_heavy", emoji: "🥩", label: "Protein-heavy" },
];

export function MealLogger({ isOpen, onClose }: MealLoggerProps) {
  const { eatingWindow, addMealLog } = useFuelTime();
  const [step, setStep] = useState<"type" | "details" | "success">("type");
  const [mealType, setMealType] = useState<MealType | null>(null);
  const [mealSize, setMealSize] = useState<MealSize>("moderate");
  const [macroBalance, setMacroBalance] = useState<MacroBalance>("balanced");
  const [energyBefore, setEnergyBefore] = useState<EnergyLevel>(3);
  const [showDetails, setShowDetails] = useState(false);
  const [logResult, setLogResult] = useState<{ score: number; withinWindow: boolean } | null>(null);

  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  const handleQuickLog = useCallback(
    (type: MealType) => {
      if (!eatingWindow) return;

      const currentTime = getCurrentTime();
      const timestamp = new Date().toISOString();

      // Get the appropriate meal window
      const mealWindow =
        type === "breakfast"
          ? eatingWindow.breakfast
          : type === "lunch"
          ? eatingWindow.lunch
          : type === "dinner"
          ? eatingWindow.dinner
          : eatingWindow.snacks[0] || eatingWindow.lunch;

      const withinWindow = isWithinWindow(currentTime, mealWindow);
      const timingScore = calculateMealTimingScore(currentTime, mealWindow.optimal);

      const log = addMealLog({
        timestamp,
        mealType: type,
        withinWindow,
        timingScore,
      });

      if (log) {
        setLogResult({ score: timingScore, withinWindow });
        setStep("success");
      }
    },
    [eatingWindow, addMealLog]
  );

  const handleDetailedLog = useCallback(() => {
    if (!eatingWindow || !mealType) return;

    const currentTime = getCurrentTime();
    const timestamp = new Date().toISOString();

    const mealWindow =
      mealType === "breakfast"
        ? eatingWindow.breakfast
        : mealType === "lunch"
        ? eatingWindow.lunch
        : mealType === "dinner"
        ? eatingWindow.dinner
        : eatingWindow.snacks[0] || eatingWindow.lunch;

    const withinWindow = isWithinWindow(currentTime, mealWindow);
    const timingScore = calculateMealTimingScore(currentTime, mealWindow.optimal);

    const log = addMealLog({
      timestamp,
      mealType,
      size: mealSize,
      macroBalance,
      energyBefore,
      withinWindow,
      timingScore,
    });

    if (log) {
      setLogResult({ score: timingScore, withinWindow });
      setStep("success");
    }
  }, [eatingWindow, mealType, mealSize, macroBalance, energyBefore, addMealLog]);

  const handleClose = () => {
    setStep("type");
    setMealType(null);
    setShowDetails(false);
    setLogResult(null);
    onClose();
  };

  const handleSelectType = (type: MealType) => {
    if (showDetails) {
      setMealType(type);
      setStep("details");
    } else {
      handleQuickLog(type);
    }
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
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-x-4 bottom-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md z-50"
          >
            <GlassCard variant="elevated" padding="none" className="overflow-hidden">
              <AnimatePresence mode="wait">
                {step === "type" && (
                  <motion.div
                    key="type"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Header */}
                    <div className="text-center pt-6 px-6 pb-4">
                      <span className="text-4xl">🍽️</span>
                      <h2 className="text-xl font-display font-semibold text-[var(--text-primary)] mt-2">
                        Log a Meal
                      </h2>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        What did you just eat?
                      </p>
                    </div>

                    {/* Meal Type Grid */}
                    <div className="px-4 pb-4">
                      <div className="grid grid-cols-2 gap-3">
                        {MEAL_TYPES.map((type) => (
                          <motion.button
                            key={type.value}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleSelectType(type.value)}
                            className="p-4 glass rounded-2xl transition-colors hover:bg-[var(--glass-bg-hover)]"
                          >
                            <span className="text-4xl block mb-2">{type.emoji}</span>
                            <span className="font-medium text-[var(--text-primary)]">
                              {type.label}
                            </span>
                          </motion.button>
                        ))}
                      </div>

                      {/* Toggle for detailed logging */}
                      <div className="mt-4 flex items-center justify-between p-3 glass rounded-xl">
                        <span className="text-sm text-[var(--text-secondary)]">
                          Add details (optional)
                        </span>
                        <button
                          onClick={() => setShowDetails(!showDetails)}
                          className={`
                            w-12 h-7 rounded-full transition-colors relative
                            ${showDetails
                              ? "bg-[var(--eating-primary)]"
                              : "bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                            }
                          `}
                        >
                          <motion.div
                            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md"
                            animate={{
                              left: showDetails ? "calc(100% - 24px)" : "4px",
                            }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Close button */}
                    <div className="px-4 pb-4">
                      <GlassButton variant="ghost" fullWidth onClick={handleClose}>
                        Cancel
                      </GlassButton>
                    </div>
                  </motion.div>
                )}

                {step === "details" && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Header with back button */}
                    <div className="flex items-center px-4 pt-4 pb-2">
                      <IconButton
                        icon={
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        }
                        label="Back"
                        variant="ghost"
                        onClick={() => setStep("type")}
                      />
                      <h2 className="flex-1 text-center text-lg font-display font-semibold text-[var(--text-primary)]">
                        {MEAL_TYPES.find((t) => t.value === mealType)?.emoji}{" "}
                        {MEAL_TYPES.find((t) => t.value === mealType)?.label}
                      </h2>
                      <div className="w-10" /> {/* Spacer for alignment */}
                    </div>

                    {/* Details form */}
                    <div className="px-4 py-4 space-y-6">
                      {/* Meal Size */}
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                          Portion Size
                        </p>
                        <div className="flex gap-2">
                          {MEAL_SIZES.map((size) => (
                            <button
                              key={size.value}
                              onClick={() => setMealSize(size.value)}
                              className={`
                                flex-1 p-3 rounded-xl border transition-all text-center
                                ${mealSize === size.value
                                  ? "bg-[var(--eating-muted)] border-[var(--eating-primary)]"
                                  : "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--glass-border-active)]"
                                }
                              `}
                            >
                              <span className="text-2xl block">{size.emoji}</span>
                              <span className="text-xs text-[var(--text-secondary)]">{size.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Macro Balance */}
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                          Macro Balance
                        </p>
                        <div className="flex gap-2">
                          {MACRO_TYPES.map((macro) => (
                            <button
                              key={macro.value}
                              onClick={() => setMacroBalance(macro.value)}
                              className={`
                                flex-1 p-3 rounded-xl border transition-all text-center
                                ${macroBalance === macro.value
                                  ? "bg-[var(--fasting-muted)] border-[var(--fasting-primary)]"
                                  : "bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--glass-border-active)]"
                                }
                              `}
                            >
                              <span className="text-2xl block">{macro.emoji}</span>
                              <span className="text-xs text-[var(--text-secondary)]">{macro.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Energy Level */}
                      <div>
                        <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                          Energy Level (Before Eating)
                        </p>
                        <div className="px-2">
                          {/* Custom slider */}
                          <div className="relative h-2 bg-[var(--glass-bg)] rounded-full">
                            <motion.div
                              className="absolute left-0 top-0 h-full bg-gradient-to-r from-[var(--fasting-primary)] to-[var(--eating-primary)] rounded-full"
                              initial={false}
                              animate={{ width: `${((energyBefore - 1) / 4) * 100}%` }}
                            />
                          </div>
                          <div className="flex justify-between mt-3">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <button
                                key={level}
                                onClick={() => setEnergyBefore(level as EnergyLevel)}
                                className={`
                                  w-8 h-8 rounded-full border transition-all flex items-center justify-center text-sm
                                  ${energyBefore === level
                                    ? "bg-[var(--eating-primary)] border-[var(--eating-primary)] text-[var(--text-inverse)]"
                                    : "bg-[var(--glass-bg)] border-[var(--glass-border)] text-[var(--text-secondary)]"
                                  }
                                `}
                              >
                                {level}
                              </button>
                            ))}
                          </div>
                          <div className="flex justify-between text-xs text-[var(--text-muted)] mt-2">
                            <span>😴 Low</span>
                            <span>😊 Medium</span>
                            <span>⚡ High</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="px-4 pb-4">
                      <GlassButton variant="eating" fullWidth size="lg" onClick={handleDetailedLog}>
                        Log Meal
                      </GlassButton>
                    </div>
                  </motion.div>
                )}

                {step === "success" && logResult && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 px-6"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", delay: 0.2 }}
                      className="text-6xl mb-4"
                    >
                      {logResult.withinWindow ? "🎉" : "👍"}
                    </motion.div>
                    <h2 className="text-xl font-display font-semibold text-[var(--text-primary)]">
                      Meal Logged!
                    </h2>
                    <div className="mt-4 p-4 glass rounded-2xl">
                      <p className="text-sm text-[var(--text-secondary)]">
                        Timing Score
                      </p>
                      <p
                        className={`text-4xl font-display font-semibold ${
                          logResult.score >= 80
                            ? "text-[var(--eating-primary)]"
                            : logResult.score >= 60
                            ? "text-[var(--accent-orange)]"
                            : "text-[var(--error)]"
                        }`}
                      >
                        {logResult.score}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)] mt-2">
                        {logResult.score >= 80
                          ? "Perfect timing! 🌟"
                          : logResult.score >= 60
                          ? "Good timing! Keep it up."
                          : "A bit off schedule, but that's okay."}
                      </p>
                    </div>
                    <div className="mt-6">
                      <GlassButton variant="eating" fullWidth onClick={handleClose}>
                        Done
                      </GlassButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
