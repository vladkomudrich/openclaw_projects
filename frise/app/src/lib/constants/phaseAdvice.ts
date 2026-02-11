/**
 * Phase Advice Mappings
 * Defines all productivity phases and their human-sounding advice messages.
 * These are punchy, direct, no fluff — NOT generic AI slop.
 */

// Productivity phase types - more granular than zone types
export type ProductivityPhase =
  | "rising"             // Energy climbing in the morning
  | "approaching_peak"   // Almost at peak performance
  | "peak"               // Maximum cognitive capacity
  | "declining"          // Coming down from peak
  | "dip"                // Natural energy dip (often afternoon)
  | "second_wind"        // Evening energy boost
  | "wind_down"          // Preparing for sleep
  | "melatonin_window";  // Body preparing for sleep, melatonin rising

// Phase metadata for display
export interface PhaseConfig {
  name: string;
  shortName: string;
  icon: string;
  gradient: string;
  glowColor: string;
}

// Phase configurations with visual styling
export const PHASE_CONFIGS: Record<ProductivityPhase, PhaseConfig> = {
  rising: {
    name: "Energy Rising",
    shortName: "Rising",
    icon: "🌅",
    gradient: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
    glowColor: "rgba(91, 141, 239, 0.3)",
  },
  approaching_peak: {
    name: "Approaching Peak",
    shortName: "Almost Peak",
    icon: "📈",
    gradient: "linear-gradient(135deg, var(--accent-purple), var(--accent-gold))",
    glowColor: "rgba(123, 104, 238, 0.3)",
  },
  peak: {
    name: "Peak Performance",
    shortName: "Peak",
    icon: "🔥",
    gradient: "linear-gradient(135deg, var(--accent-gold), #F59E0B)",
    glowColor: "rgba(255, 179, 71, 0.4)",
  },
  declining: {
    name: "Energy Declining",
    shortName: "Declining",
    icon: "📉",
    gradient: "linear-gradient(135deg, #F59E0B, var(--accent-purple))",
    glowColor: "rgba(245, 158, 11, 0.3)",
  },
  dip: {
    name: "Energy Dip",
    shortName: "Dip",
    icon: "😴",
    gradient: "linear-gradient(135deg, var(--thermal-low), var(--accent-blue))",
    glowColor: "rgba(74, 85, 104, 0.3)",
  },
  second_wind: {
    name: "Second Wind",
    shortName: "2nd Wind",
    icon: "⚡",
    gradient: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
    glowColor: "rgba(91, 141, 239, 0.35)",
  },
  wind_down: {
    name: "Winding Down",
    shortName: "Wind Down",
    icon: "🌆",
    gradient: "linear-gradient(135deg, var(--accent-purple), var(--thermal-low))",
    glowColor: "rgba(123, 104, 238, 0.25)",
  },
  melatonin_window: {
    name: "Sleep Window",
    shortName: "Melatonin",
    icon: "🌙",
    gradient: "linear-gradient(135deg, #6366F1, #4F46E5)",
    glowColor: "rgba(99, 102, 241, 0.3)",
  },
};

// Phase advice messages - punchy, direct, no fluff
export const PHASE_ADVICE: Record<ProductivityPhase, string[]> = {
  rising: [
    "Energy climbing. Ease into focus work.",
    "Morning ramp-up. Don't force it yet.",
    "Building momentum. Light tasks first.",
    "Warming up. Review today's priorities.",
    "Rising energy. Set up your workspace.",
  ],
  approaching_peak: [
    "Peak incoming. Queue your hardest task.",
    "Almost there. Get ready for deep work.",
    "T-minus to peak. Prep your focus session.",
    "About to hit max. Clear distractions now.",
    "Approaching peak. Final chance to prep.",
  ],
  peak: [
    "Peak zone. Do the hard thing now.",
    "You're at max capacity. Use it.",
    "This is your power hour.",
    "Maximum brainpower. Make it count.",
    "Prime time. Tackle the scary task.",
  ],
  declining: [
    "Coming down. Wrap up deep work.",
    "Energy fading. Switch to lighter tasks.",
    "Peak's over. Coast into admin work.",
    "Descending. Finish up current focus.",
    "Easing off. Good time for emails.",
  ],
  dip: [
    "Energy dip. Take a walk or rest.",
    "Natural slump. Don't fight it.",
    "Low point. Perfect for a break.",
    "In the valley. Light work only.",
    "Dip zone. Recharge, don't grind.",
  ],
  second_wind: [
    "Second wind kicking in.",
    "Evening energy boost. Use it wisely.",
    "Bonus focus time. Don't waste it.",
    "Unexpected peak. Grab a quick win.",
    "Rally time. One more deep session.",
  ],
  wind_down: [
    "Winding down. Avoid new projects.",
    "Brain's clocking out. Wrap things up.",
    "Time to decelerate.",
    "Evening mode. Light tasks only.",
    "Powering down. Plan tomorrow instead.",
  ],
  melatonin_window: [
    "Melatonin rising. Head to bed soon.",
    "Sleep window open. Don't miss it.",
    "Body's prepping for sleep.",
    "Dim the lights. Sleep chemistry active.",
    "Bedtime approaching. Start your routine.",
  ],
};

/**
 * Get a random advice message for a phase.
 * Uses seeded random based on current minute to avoid flicker on re-renders
 * but still change periodically.
 */
export function getPhaseAdvice(phase: ProductivityPhase, seed?: number): string {
  const messages = PHASE_ADVICE[phase];
  const index = seed !== undefined 
    ? seed % messages.length 
    : Math.floor(Date.now() / 60000) % messages.length; // Changes every minute
  return messages[index];
}

/**
 * Get phase config with advice
 */
export function getPhaseWithAdvice(phase: ProductivityPhase, seed?: number) {
  return {
    ...PHASE_CONFIGS[phase],
    phase,
    advice: getPhaseAdvice(phase, seed),
  };
}

/**
 * Determine the current phase based on productivity value, time of day, and context
 */
export function determinePhase(
  currentValue: number,
  previousValue: number | null,
  hourOfDay: number,
  isInMelatoninWindow: boolean
): ProductivityPhase {
  // Melatonin window takes priority
  if (isInMelatoninWindow) {
    return "melatonin_window";
  }

  // Late evening wind-down (after 9 PM, before melatonin)
  if (hourOfDay >= 21 && currentValue < 60) {
    return "wind_down";
  }

  // Determine trend
  const isRising = previousValue !== null && currentValue > previousValue + 2;
  const isFalling = previousValue !== null && currentValue < previousValue - 2;

  // Peak zone
  if (currentValue >= 80) {
    if (isRising) return "approaching_peak";
    return "peak";
  }

  // Good zone with context
  if (currentValue >= 60) {
    if (isRising) return "approaching_peak";
    if (isFalling) return "declining";
    // Evening second wind
    if (hourOfDay >= 17 && hourOfDay < 21) return "second_wind";
    return "declining";
  }

  // Moderate zone
  if (currentValue >= 40) {
    if (isRising && hourOfDay < 12) return "rising";
    if (isFalling) return "declining";
    if (hourOfDay >= 17) return "wind_down";
    return "dip";
  }

  // Low zone
  if (currentValue >= 20) {
    if (isRising) return "rising";
    return "dip";
  }

  // Very low
  if (hourOfDay < 10) return "rising";
  return "dip";
}
