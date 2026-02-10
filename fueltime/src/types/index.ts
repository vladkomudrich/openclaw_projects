// FuelTime Core Types

// User Profile Types
export type Chronotype = "morning" | "intermediate" | "evening";

export type UserGoal =
  | "mental_performance"
  | "energy_stability"
  | "athletic_performance"
  | "metabolic_health"
  | "flexibility";

export type WorkSchedule =
  | "standard" // 9-5
  | "shift_work"
  | "flexible"
  | "variable";

export interface UserProfile {
  id: string;
  wakeTime: string; // HH:mm format
  sleepTime: string; // HH:mm format
  chronotype: Chronotype;
  primaryGoal: UserGoal;
  workSchedule: WorkSchedule;
  shiftDetails?: ShiftDetails;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface ShiftDetails {
  shiftStart: string; // HH:mm
  shiftEnd: string; // HH:mm
  rotatingSchedule: boolean;
}

// Eating Window Types
export interface TimeWindow {
  start: string; // HH:mm format
  end: string; // HH:mm format
}

export interface MealWindow extends TimeWindow {
  optimal: string; // Optimal time within window
  flexibility: number; // Minutes of flexibility (e.g., 30)
}

export interface EatingWindow {
  breakfast: MealWindow;
  lunch: MealWindow;
  dinner: MealWindow;
  snacks: MealWindow[];
  eatingWindowStart: string;
  eatingWindowEnd: string;
  windowDuration: number; // Hours
  fastingDuration: number; // Hours
  metabolicSwitchTime: string; // When metabolic switch occurs (~12h into fast)
}

// Performance Zone Types
export interface PerformanceZone {
  name: string;
  description: string;
  start: string;
  end: string;
  type: "mental" | "physical" | "recovery" | "avoid";
  tips: string[];
}

export interface PerformanceZones {
  peakMentalClarity: PerformanceZone;
  stableEnergy: PerformanceZone;
  athleticPerformance: PerformanceZone;
  postMealDip: PerformanceZone;
  recoveryWindow: PerformanceZone;
}

// Meal Logging Types
export type MealType = "breakfast" | "lunch" | "dinner" | "snack";

export type MealSize = "light" | "moderate" | "hearty";

export type MacroBalance = "carb_heavy" | "balanced" | "protein_heavy";

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;

export interface MealLog {
  id: string;
  timestamp: string; // ISO string
  mealType: MealType;
  size?: MealSize;
  macroBalance?: MacroBalance;
  energyBefore?: EnergyLevel;
  energyAfter?: EnergyLevel;
  notes?: string;
  withinWindow: boolean; // Was this meal within the optimal window?
  timingScore: number; // 0-100 based on how close to optimal
}

// Timing Score Types
export interface DailyTimingScore {
  date: string; // YYYY-MM-DD
  overallScore: number; // 0-100
  breakfastScore: number;
  lunchScore: number;
  dinnerScore: number;
  windowAdherenceScore: number;
  mealsLogged: number;
  notes?: string;
}

// Pattern Recognition Types
export interface EatingPattern {
  averageBreakfastTime: string;
  averageLunchTime: string;
  averageDinnerTime: string;
  averageWindowStart: string;
  averageWindowEnd: string;
  weekdayPattern: PatternStats;
  weekendPattern: PatternStats;
  consistency: number; // 0-100
  drift: DriftAnalysis;
  insights: PatternInsight[];
}

export interface PatternStats {
  averageBreakfastTime: string;
  averageDinnerTime: string;
  windowDuration: number;
}

export interface DriftAnalysis {
  weekendDrift: number; // Minutes later on weekends
  progressiveDrift: number; // Minutes per week trend
  isStable: boolean;
}

export interface PatternInsight {
  type: "positive" | "warning" | "suggestion";
  title: string;
  description: string;
  actionable?: string;
}

// Contextual Advice Types
export interface ContextualTip {
  id: string;
  message: string;
  timeRelevance: TimeRelevance;
  goalRelevance: UserGoal[];
  priority: "high" | "medium" | "low";
  category: "timing" | "nutrition" | "performance" | "science";
}

export interface TimeRelevance {
  type: "time_of_day" | "meal_proximity" | "fasting_duration" | "window_status";
  conditions: Record<string, unknown>;
}

// User Preferences Types
export interface UserPreferences {
  windowDuration: 8 | 10 | 12;
  flexibility: "strict" | "moderate" | "flexible";
  weekendAdjustment: "same" | "plus_one_hour" | "custom";
  customWeekendDelay?: number; // Minutes
  notifications: NotificationPreferences;
  displayFormat: "12h" | "24h";
  theme: "light" | "dark" | "system";
}

export interface NotificationPreferences {
  enabled: boolean;
  windowOpening: boolean;
  mealTimingSuggestions: boolean;
  windowClosingWarning: boolean;
  windowClosingWarningMinutes: number;
  weeklySummary: boolean;
}

// Storage Types
export interface StorageData {
  version: string;
  profile: UserProfile;
  preferences: UserPreferences;
  eatingWindow: EatingWindow;
  mealLogs: MealLog[];
  dailyScores: DailyTimingScore[];
  patterns?: EatingPattern;
  onboardingCompleted: boolean;
  tutorialDismissed: boolean;
  lastUpdated: string;
}

// Calculation Input/Output Types
export interface CalculationInput {
  wakeTime: string;
  sleepTime: string;
  chronotype: Chronotype;
  goal: UserGoal;
  workSchedule: WorkSchedule;
  windowDuration?: 8 | 10 | 12;
}

export interface CalculationResult {
  eatingWindow: EatingWindow;
  performanceZones: PerformanceZones;
  recommendations: string[];
}

// Export default empty user profile for initialization
export const defaultUserProfile: Omit<UserProfile, "id" | "createdAt" | "updatedAt"> = {
  wakeTime: "07:00",
  sleepTime: "23:00",
  chronotype: "intermediate",
  primaryGoal: "energy_stability",
  workSchedule: "standard",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export const defaultPreferences: UserPreferences = {
  windowDuration: 10,
  flexibility: "moderate",
  weekendAdjustment: "same",
  notifications: {
    enabled: true,
    windowOpening: true,
    mealTimingSuggestions: true,
    windowClosingWarning: true,
    windowClosingWarningMinutes: 60,
    weeklySummary: true,
  },
  displayFormat: "12h",
  theme: "system",
};
