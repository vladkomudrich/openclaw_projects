/**
 * Validation Schemas
 * 
 * Zod schemas for runtime validation of user input and data.
 * Ensures data integrity and provides clear error messages.
 */
import { z } from 'zod';

// Time format validation (HH:mm)
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
  message: 'Time must be in HH:mm format (00:00 - 23:59)',
});

// User Profile Schemas
export const chronotypeSchema = z.enum(['morning', 'intermediate', 'evening']);

export const userGoalSchema = z.enum([
  'mental_performance',
  'energy_stability',
  'athletic_performance',
  'metabolic_health',
  'flexibility',
]);

export const workScheduleSchema = z.enum(['standard', 'shift_work', 'flexible', 'variable']);

export const userProfileSchema = z.object({
  id: z.string().min(1),
  wakeTime: timeSchema,
  sleepTime: timeSchema,
  chronotype: chronotypeSchema,
  primaryGoal: userGoalSchema,
  workSchedule: workScheduleSchema,
  shiftDetails: z
    .object({
      shiftStart: timeSchema,
      shiftEnd: timeSchema,
      rotatingSchedule: z.boolean(),
    })
    .optional(),
  timezone: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
}).refine(
  (data) => {
    // Validate that sleep time allows for reasonable sleep duration
    const wakeMinutes = timeToMinutes(data.wakeTime);
    const sleepMinutes = timeToMinutes(data.sleepTime);
    
    // Calculate awake hours
    let awakeHours: number;
    if (wakeMinutes < sleepMinutes) {
      awakeHours = (sleepMinutes - wakeMinutes) / 60;
    } else {
      awakeHours = (24 * 60 - wakeMinutes + sleepMinutes) / 60;
    }
    
    // Awake period should be between 12-20 hours
    return awakeHours >= 12 && awakeHours <= 20;
  },
  {
    message: 'Wake and sleep times must allow for 4-12 hours of sleep',
  }
);

// Meal Log Schemas
export const mealTypeSchema = z.enum(['breakfast', 'lunch', 'dinner', 'snack']);
export const mealSizeSchema = z.enum(['light', 'moderate', 'hearty']);
export const macroBalanceSchema = z.enum(['carb_heavy', 'balanced', 'protein_heavy']);
export const energyLevelSchema = z.union([
  z.literal(1),
  z.literal(2),
  z.literal(3),
  z.literal(4),
  z.literal(5),
]);

export const mealLogSchema = z.object({
  id: z.string().min(1),
  timestamp: z.string().datetime(),
  mealType: mealTypeSchema,
  size: mealSizeSchema.optional(),
  macroBalance: macroBalanceSchema.optional(),
  energyBefore: energyLevelSchema.optional(),
  energyAfter: energyLevelSchema.optional(),
  notes: z.string().max(500).optional(),
  withinWindow: z.boolean(),
  timingScore: z.number().min(0).max(100),
});

export const createMealLogSchema = mealLogSchema.omit({ id: true });

// User Preferences Schemas
export const windowDurationSchema = z.union([z.literal(8), z.literal(10), z.literal(12)]);
export const flexibilitySchema = z.enum(['strict', 'moderate', 'flexible']);
export const weekendAdjustmentSchema = z.enum(['same', 'plus_one_hour', 'custom']);
export const displayFormatSchema = z.enum(['12h', '24h']);
export const themeSchema = z.enum(['light', 'dark', 'system']);

export const notificationPreferencesSchema = z.object({
  enabled: z.boolean(),
  windowOpening: z.boolean(),
  mealTimingSuggestions: z.boolean(),
  windowClosingWarning: z.boolean(),
  windowClosingWarningMinutes: z.number().min(15).max(120),
  weeklySummary: z.boolean(),
});

export const userPreferencesSchema = z.object({
  windowDuration: windowDurationSchema,
  flexibility: flexibilitySchema,
  weekendAdjustment: weekendAdjustmentSchema,
  customWeekendDelay: z.number().min(0).max(180).optional(),
  notifications: notificationPreferencesSchema,
  displayFormat: displayFormatSchema,
  theme: themeSchema,
});

// Eating Window Schemas
export const mealWindowSchema = z.object({
  start: timeSchema,
  end: timeSchema,
  optimal: timeSchema,
  flexibility: z.number().min(0).max(60),
});

export const eatingWindowSchema = z.object({
  breakfast: mealWindowSchema,
  lunch: mealWindowSchema,
  dinner: mealWindowSchema,
  snacks: z.array(mealWindowSchema),
  eatingWindowStart: timeSchema,
  eatingWindowEnd: timeSchema,
  windowDuration: z.number().min(6).max(14),
  fastingDuration: z.number().min(10).max(18),
  metabolicSwitchTime: timeSchema,
});

// Calculation Input Schema
export const calculationInputSchema = z.object({
  wakeTime: timeSchema,
  sleepTime: timeSchema,
  chronotype: chronotypeSchema,
  goal: userGoalSchema,
  workSchedule: workScheduleSchema,
  windowDuration: windowDurationSchema.optional(),
});

// Import/Export Schemas
export const storageDataSchema = z.object({
  version: z.string(),
  profile: userProfileSchema,
  preferences: userPreferencesSchema,
  eatingWindow: eatingWindowSchema,
  mealLogs: z.array(mealLogSchema),
  dailyScores: z.array(z.object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    overallScore: z.number().min(0).max(100),
    breakfastScore: z.number().min(0).max(100),
    lunchScore: z.number().min(0).max(100),
    dinnerScore: z.number().min(0).max(100),
    windowAdherenceScore: z.number().min(0).max(100),
    mealsLogged: z.number().min(0),
    notes: z.string().optional(),
  })),
  onboardingCompleted: z.boolean(),
  tutorialDismissed: z.boolean(),
  lastUpdated: z.string().datetime(),
});

// Type exports inferred from schemas
export type ValidatedUserProfile = z.infer<typeof userProfileSchema>;
export type ValidatedMealLog = z.infer<typeof mealLogSchema>;
export type ValidatedUserPreferences = z.infer<typeof userPreferencesSchema>;
export type ValidatedCalculationInput = z.infer<typeof calculationInputSchema>;
export type ValidatedStorageData = z.infer<typeof storageDataSchema>;

// Validation helper functions
export function validateUserProfile(data: unknown) {
  return userProfileSchema.safeParse(data);
}

export function validateMealLog(data: unknown) {
  return mealLogSchema.safeParse(data);
}

export function validateUserPreferences(data: unknown) {
  return userPreferencesSchema.safeParse(data);
}

export function validateCalculationInput(data: unknown) {
  return calculationInputSchema.safeParse(data);
}

export function validateStorageData(data: unknown) {
  return storageDataSchema.safeParse(data);
}

// Helper function
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
