// Sleep Entry - represents one night of sleep
export interface SleepEntry {
  id: string;
  date: string; // ISO date string (YYYY-MM-DD)
  bedtime: string; // ISO datetime string
  wakeTime: string; // ISO datetime string
  duration: number; // Duration in minutes
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string
}

// Productivity data point for the curve
export interface ProductivityPoint {
  time: string; // ISO datetime string or HH:MM format
  timestamp: number; // Unix timestamp in ms
  value: number; // Productivity value 0-100
  zone: ProductivityZone;
}

// Productivity zones
export type ProductivityZone = 
  | "sleep"      // User was asleep
  | "low"        // Low productivity (0-30%)
  | "moderate"   // Moderate productivity (30-60%)
  | "good"       // Good productivity (60-80%)
  | "peak"       // Peak productivity (80-100%)
  | "winddown";  // Wind down / melatonin window

// User settings stored in localStorage
export interface UserSettings {
  idealSleepDuration: number; // Ideal sleep duration in minutes (default 480 = 8 hours)
  notificationsEnabled: boolean;
  tutorialCompleted: boolean;
  onboardingCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// Sleep debt calculation result
export interface SleepDebt {
  totalDebt: number; // Total sleep debt in minutes (negative = debt, positive = surplus)
  averageSleep: number; // Average sleep in minutes over period
  idealSleep: number; // Ideal sleep in minutes
  daysTracked: number; // Number of days with data
  status: "debt" | "balanced" | "surplus";
}

// Melatonin window calculation result
export interface MelatoninWindow {
  startTime: string; // ISO datetime string
  endTime: string; // ISO datetime string
  durationMinutes: number;
}

// Key insights for the dashboard
export interface DayInsights {
  peakStartTime: string; // Best deep work start time
  peakEndTime: string; // Best deep work end time
  melatoninWindowStart: string;
  optimalBedtime: string;
  sleepDebt: SleepDebt;
  currentZone: ProductivityZone;
  currentProductivity: number;
}

// Complete productivity curve for a day
export interface ProductivityCurve {
  date: string; // ISO date string
  wakeTime: string; // When user woke up
  sleepEntry: SleepEntry;
  points: ProductivityPoint[];
  insights: DayInsights;
  melatoninWindow: MelatoninWindow;
}

// localStorage data structure
export interface StorageData {
  sleepEntries: SleepEntry[];
  userSettings: UserSettings;
  version: number; // For migration handling
}

// Advice content for contextual tips
export interface AdviceContent {
  zone: ProductivityZone;
  messages: string[];
}

// Time input state for sleep entry form
export interface TimeInput {
  hours: number;
  minutes: number;
  period: "AM" | "PM";
}

// Sleep entry form state
export interface SleepEntryForm {
  bedtime: TimeInput;
  wakeTime: TimeInput;
  date: string; // ISO date string for which day this sleep is for
}
