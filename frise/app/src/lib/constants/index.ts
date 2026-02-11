import { AdviceContent } from "@/types";

// Re-export phase advice mappings
export * from "./phaseAdvice";

// Time constants
export const MINUTES_PER_HOUR = 60;
export const HOURS_PER_DAY = 24;
export const MINUTES_PER_DAY = MINUTES_PER_HOUR * HOURS_PER_DAY;

// Curve display constants
export const CURVE_START_HOUR = 5; // 5 AM
export const CURVE_END_HOUR = 25; // 1 AM next day (25 = 1 + 24)
export const CURVE_INTERVAL_MINUTES = 5; // 5-minute granularity

// Default user settings
export const DEFAULT_IDEAL_SLEEP_DURATION = 480; // 8 hours in minutes
export const MIN_SLEEP_DURATION = 180; // 3 hours - warning threshold
export const MAX_SLEEP_DURATION = 840; // 14 hours - warning threshold

// Sleep science constants (Two-Process Model)
export const TAU = 24; // Circadian period in hours
export const SLEEP_PRESSURE_TIME_CONSTANT = 4.2; // hours (τS for decay)
export const WAKE_PRESSURE_TIME_CONSTANT = 18.2; // hours (τW for buildup)

// Productivity zone thresholds
export const ZONE_THRESHOLDS = {
  low: 30,
  moderate: 60,
  good: 80,
  peak: 100,
};

// Melatonin window configuration
export const MELATONIN_WINDOW_HOURS_BEFORE_IDEAL_BEDTIME = 2;
export const OPTIMAL_BEDTIME_OFFSET_HOURS = 1; // 1 hour before melatonin window start

// localStorage keys
export const STORAGE_KEY = "frise-data";
export const STORAGE_VERSION = 1;

// Rolling window for data retention
export const DATA_RETENTION_DAYS = 14;

// Contextual advice content
export const ADVICE_CONTENT: AdviceContent[] = [
  {
    zone: "peak",
    messages: [
      "Your brain is firing on all cylinders — tackle your hardest problem now",
      "This is your superpower hour — schedule important decisions here",
      "Peak performance mode — do the work that requires deep thinking",
      "Your focus is sharpest now — protect this time from interruptions",
      "Mental clarity at its best — handle complex tasks before this window closes",
    ],
  },
  {
    zone: "good",
    messages: [
      "Great energy levels — solid time for focused work",
      "You're in a productive zone — keep the momentum going",
      "Good time for creative tasks or problem-solving",
      "Your mind is active — use this for meaningful work",
      "Strong focus window — make it count",
    ],
  },
  {
    zone: "moderate",
    messages: [
      "Moderate energy — good for routine tasks and planning",
      "Steady productivity — tackle your to-do list",
      "Balanced focus — administrative work fits well here",
      "A good time for meetings or collaborative work",
      "Solid energy for structured tasks",
    ],
  },
  {
    zone: "low",
    messages: [
      "Natural lull time — perfect for routine tasks and emails",
      "Take a mindful break or short walk to recharge",
      "Your body wants rest — honor the dip with lighter work",
      "Creative tasks work better now than analytical ones",
      "If possible, this is your ideal power nap window",
    ],
  },
  {
    zone: "winddown",
    messages: [
      "Your body is preparing for sleep — wind down gradually",
      "Melatonin is rising — avoid bright screens if possible",
      "Perfect time for relaxing activities or light reading",
      "Start your evening routine — your body will thank you",
      "Gentle activities only — save the intense work for tomorrow",
    ],
  },
  {
    zone: "sleep",
    messages: [
      "You were asleep during this time",
      "Rest time — your body was recovering",
      "Sleep period — essential for tomorrow's productivity",
    ],
  },
];

// Colors for thermal gradient
export const THERMAL_COLORS = {
  low: "#4A90E2",
  lowMid: "#5FC4E8",
  mid: "#F5DD90",
  high: "#F5A962",
  peak: "#E85D4A",
};

// Animation durations (in ms)
export const ANIMATION_DURATION = {
  fast: 150,
  medium: 300,
  slow: 500,
  curve: 1000,
  pulse: 1500,
};

// Tutorial steps
export const TUTORIAL_STEPS = [
  {
    id: 1,
    title: "This is your productivity forecast",
    description: "See your energy levels throughout the day based on your sleep.",
    target: "curve",
  },
  {
    id: 2,
    title: "Warmer colors = peak energy",
    description: "Red/orange means high productivity, blue means low energy.",
    target: "gradient",
  },
  {
    id: 3,
    title: "Tap anywhere for details",
    description: "Touch the curve to see your productivity percentage at any time.",
    target: "interaction",
  },
  {
    id: 4,
    title: "Purple zone = wind-down time",
    description: "This is when melatonin rises and you should prepare for sleep.",
    target: "melatonin",
  },
  {
    id: 5,
    title: "Come back daily",
    description: "Log your sleep each morning to track your patterns over time.",
    target: "daily",
  },
];
