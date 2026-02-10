/**
 * FuelTime Eating Window Calculator
 * 
 * Core algorithm for calculating optimal eating windows based on
 * chrononutrition science and user profile data.
 */

import { DateTime } from "luxon";
import type {
  CalculationInput,
  CalculationResult,
  EatingWindow,
  MealWindow,
  PerformanceZones,
  PerformanceZone,
  Chronotype,
  UserGoal,
} from "@/types";

// Constants for calculations
const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

// Window durations by goal (in hours)
const WINDOW_DURATIONS: Record<UserGoal, number> = {
  metabolic_health: 8,
  athletic_performance: 10,
  mental_performance: 10,
  energy_stability: 10,
  flexibility: 12,
};

// Chronotype adjustments (in minutes)
const CHRONOTYPE_ADJUSTMENTS: Record<Chronotype, number> = {
  morning: -30,
  intermediate: 0,
  evening: 30,
};

// Default meal flexibility (in minutes)
const MEAL_FLEXIBILITY = 30;

// Minimum fasting before sleep (in minutes)
const MIN_FAST_BEFORE_SLEEP = 180; // 3 hours

// Minimum breakfast delay from wake (in minutes)
const MIN_BREAKFAST_DELAY = 30;

// Optimal breakfast delay from wake (in minutes)
const OPTIMAL_BREAKFAST_DELAY = 60;

// Hours between meals
const BREAKFAST_TO_LUNCH_HOURS = 4;
const LUNCH_TO_SNACK_HOURS = 2.5;

// Metabolic switch occurs at this many hours into fast
const METABOLIC_SWITCH_HOURS = 12;

/**
 * Parse time string (HH:mm) to DateTime for today
 */
function parseTime(timeStr: string, referenceDate?: DateTime): DateTime {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const base = referenceDate || DateTime.now();
  return base.set({ hour: hours, minute: minutes, second: 0, millisecond: 0 });
}

/**
 * Format DateTime to HH:mm string
 */
function formatTime(dt: DateTime): string {
  return dt.toFormat("HH:mm");
}

/**
 * Add minutes to a time string, returning new time string
 */
function addMinutes(timeStr: string, minutes: number): string {
  const dt = parseTime(timeStr);
  return formatTime(dt.plus({ minutes }));
}

/**
 * Calculate minutes between two time strings
 * Handles overnight spans (e.g., 23:00 to 07:00)
 */
function minutesBetween(startTime: string, endTime: string): number {
  const start = parseTime(startTime);
  let end = parseTime(endTime);
  
  // If end is before start, it's the next day
  if (end < start) {
    end = end.plus({ days: 1 });
  }
  
  return end.diff(start, "minutes").minutes;
}

/**
 * Check if time1 is before time2
 */
function isBefore(time1: string, time2: string): boolean {
  const dt1 = parseTime(time1);
  const dt2 = parseTime(time2);
  return dt1 < dt2;
}

/**
 * Get the earlier of two times
 */
function minTime(time1: string, time2: string): string {
  return isBefore(time1, time2) ? time1 : time2;
}

/**
 * Create a MealWindow object
 */
function createMealWindow(optimal: string, flexibility: number = MEAL_FLEXIBILITY): MealWindow {
  return {
    start: addMinutes(optimal, -flexibility),
    end: addMinutes(optimal, flexibility),
    optimal,
    flexibility,
  };
}

/**
 * Calculate optimal eating window based on user profile
 */
export function calculateEatingWindow(input: CalculationInput): EatingWindow {
  const {
    wakeTime,
    sleepTime,
    chronotype,
    goal,
    windowDuration: customDuration,
  } = input;

  // Get window duration based on goal or custom setting
  const windowDuration = customDuration || WINDOW_DURATIONS[goal];
  
  // Calculate optimal breakfast time
  const chronotypeAdjust = CHRONOTYPE_ADJUSTMENTS[chronotype];
  const breakfastDelay = OPTIMAL_BREAKFAST_DELAY + chronotypeAdjust;
  
  // Ensure breakfast is at least 30 minutes after wake
  const actualBreakfastDelay = Math.max(breakfastDelay, MIN_BREAKFAST_DELAY);
  
  // Very early risers (before 5 AM): delay breakfast to at least 6 AM
  let optimalBreakfast = addMinutes(wakeTime, actualBreakfastDelay);
  const wakeHour = parseInt(wakeTime.split(":")[0]);
  if (wakeHour < 5) {
    const sixAM = "06:00";
    if (isBefore(optimalBreakfast, sixAM)) {
      optimalBreakfast = sixAM;
    }
  }
  
  // Calculate latest possible dinner time (3 hours before sleep)
  const maxDinnerTime = addMinutes(sleepTime, -MIN_FAST_BEFORE_SLEEP);
  
  // For very late sleepers, cap dinner at 10 PM
  const absoluteMaxDinner = "22:00";
  const adjustedMaxDinner = isBefore(maxDinnerTime, absoluteMaxDinner) 
    ? maxDinnerTime 
    : absoluteMaxDinner;
  
  // Calculate dinner based on window duration
  const calculatedDinner = addMinutes(optimalBreakfast, windowDuration * MINUTES_PER_HOUR);
  
  // Use the earlier of calculated dinner and max dinner
  const optimalDinner = minTime(calculatedDinner, adjustedMaxDinner);
  
  // Recalculate actual window duration if dinner was capped
  const actualWindowMinutes = minutesBetween(optimalBreakfast, optimalDinner);
  const actualWindowHours = actualWindowMinutes / MINUTES_PER_HOUR;
  
  // Calculate fasting duration
  const fastingHours = HOURS_PER_DAY - actualWindowHours;
  
  // Calculate lunch time (4 hours after breakfast)
  const optimalLunch = addMinutes(optimalBreakfast, BREAKFAST_TO_LUNCH_HOURS * MINUTES_PER_HOUR);
  
  // Calculate snack windows (only for windows >= 10 hours)
  const snacks: MealWindow[] = [];
  if (actualWindowHours >= 10) {
    // Morning snack: 2.5 hours after breakfast
    const morningSnack = addMinutes(optimalBreakfast, LUNCH_TO_SNACK_HOURS * MINUTES_PER_HOUR);
    snacks.push(createMealWindow(morningSnack, 20));
    
    // Afternoon snack: 2.5 hours after lunch
    const afternoonSnack = addMinutes(optimalLunch, LUNCH_TO_SNACK_HOURS * MINUTES_PER_HOUR);
    snacks.push(createMealWindow(afternoonSnack, 20));
  }
  
  // Calculate metabolic switch time (12 hours into fast from previous dinner)
  const metabolicSwitchTime = addMinutes(optimalDinner, METABOLIC_SWITCH_HOURS * MINUTES_PER_HOUR);

  return {
    breakfast: createMealWindow(optimalBreakfast),
    lunch: createMealWindow(optimalLunch),
    dinner: createMealWindow(optimalDinner),
    snacks,
    eatingWindowStart: optimalBreakfast,
    eatingWindowEnd: optimalDinner,
    windowDuration: Math.round(actualWindowHours * 10) / 10, // Round to 1 decimal
    fastingDuration: Math.round(fastingHours * 10) / 10,
    metabolicSwitchTime,
  };
}

/**
 * Calculate performance zones based on eating window
 */
export function calculatePerformanceZones(eatingWindow: EatingWindow): PerformanceZones {
  const { breakfast, lunch, dinner } = eatingWindow;
  
  // Peak Mental Clarity: 1-3 hours after breakfast
  const peakMentalClarity: PerformanceZone = {
    name: "Peak Mental Clarity",
    description: "Optimal time for demanding cognitive work. High glucose tolerance and sustained energy.",
    start: addMinutes(breakfast.optimal, 60),
    end: addMinutes(breakfast.optimal, 180),
    type: "mental",
    tips: [
      "Best time for complex problem-solving",
      "Schedule important meetings or creative work",
      "Brain is fueled and alert",
    ],
  };
  
  // Stable Energy: 30 min - 2 hours after lunch
  const stableEnergy: PerformanceZone = {
    name: "Stable Energy Period",
    description: "Sustained energy for steady-state work. Good for routine tasks and collaboration.",
    start: addMinutes(lunch.optimal, 30),
    end: addMinutes(lunch.optimal, 120),
    type: "physical",
    tips: [
      "Good for collaborative work",
      "Handle routine tasks efficiently",
      "Energy is stable but not peak",
    ],
  };
  
  // Athletic Performance: 2-4 hours before dinner (late afternoon)
  const athleticPerformance: PerformanceZone = {
    name: "Peak Athletic Performance",
    description: "Body temperature peaks, optimal for physical activity and exercise.",
    start: addMinutes(dinner.optimal, -240),
    end: addMinutes(dinner.optimal, -60),
    type: "physical",
    tips: [
      "Best time for exercise and workouts",
      "Reaction time is fastest",
      "Muscle strength peaks",
      "Lower injury risk",
    ],
  };
  
  // Post-Meal Dip: 30-90 min after lunch (avoid demanding work)
  const postMealDip: PerformanceZone = {
    name: "Post-Meal Recovery",
    description: "Natural dip in alertness after lunch. Best for light tasks or short rest.",
    start: addMinutes(lunch.optimal, 30),
    end: addMinutes(lunch.optimal, 90),
    type: "avoid",
    tips: [
      "Avoid demanding cognitive tasks",
      "Good time for a short walk",
      "Handle emails or admin tasks",
      "Light snack if energy drops significantly",
    ],
  };
  
  // Recovery Window: 1-2 hours after dinner
  const recoveryWindow: PerformanceZone = {
    name: "Evening Recovery",
    description: "Wind-down period. Prepare body for rest and overnight fasting.",
    start: dinner.optimal,
    end: addMinutes(dinner.optimal, 120),
    type: "recovery",
    tips: [
      "Light activity like walking is beneficial",
      "Avoid heavy exercise",
      "Begin relaxation routine",
      "Prepare for quality sleep",
    ],
  };

  return {
    peakMentalClarity,
    stableEnergy,
    athleticPerformance,
    postMealDip,
    recoveryWindow,
  };
}

/**
 * Generate personalized recommendations based on profile and goals
 */
export function generateRecommendations(input: CalculationInput, eatingWindow: EatingWindow): string[] {
  const recommendations: string[] = [];
  const { goal, chronotype } = input;
  const { windowDuration, fastingDuration } = eatingWindow;
  
  // Base recommendations
  recommendations.push(
    `Your ${Math.round(windowDuration)}-hour eating window optimizes for ${goal.replace(/_/g, " ")}.`
  );
  
  recommendations.push(
    `${Math.round(fastingDuration)}-hour overnight fast activates metabolic benefits.`
  );
  
  // Goal-specific recommendations
  switch (goal) {
    case "mental_performance":
      recommendations.push("Front-load carbohydrates to breakfast for best brain fuel.");
      recommendations.push("Avoid heavy meals 1-2 hours before important cognitive work.");
      recommendations.push("Keep lunch moderate to prevent afternoon mental fog.");
      break;
      
    case "energy_stability":
      recommendations.push("Maintain consistent meal times daily (within 30 minutes).");
      recommendations.push("Eat balanced meals with protein, carbs, and healthy fats.");
      recommendations.push("Avoid skipping meals to maintain steady energy.");
      break;
      
    case "metabolic_health":
      recommendations.push("Earlier eating improves insulin sensitivity and glucose control.");
      recommendations.push("Finish eating 3+ hours before bed for metabolic benefits.");
      recommendations.push("Your extended fast promotes cellular cleanup (autophagy).");
      break;
      
    case "athletic_performance":
      recommendations.push("Distribute protein across all meals for muscle synthesis.");
      recommendations.push("Pre-workout meal 1-2 hours before training.");
      recommendations.push("Post-workout: prioritize protein + carbs within 60 minutes.");
      break;
      
    case "flexibility":
      recommendations.push("Your 12-hour window offers social flexibility while maintaining benefits.");
      recommendations.push("Still aim for consistent timing when possible.");
      recommendations.push("Avoid late-night eating for better sleep quality.");
      break;
  }
  
  // Chronotype-specific recommendations
  if (chronotype === "evening") {
    recommendations.push("As a night owl, your schedule is shifted later but still optimized.");
    recommendations.push("Morning exposure to bright light can help shift your rhythm earlier.");
  } else if (chronotype === "morning") {
    recommendations.push("Your early schedule aligns well with natural circadian rhythms.");
    recommendations.push("Protect your earlier dinner time for optimal metabolic benefits.");
  }
  
  return recommendations;
}

/**
 * Main calculation function - combines all calculations
 */
export function calculateOptimalSchedule(input: CalculationInput): CalculationResult {
  const eatingWindow = calculateEatingWindow(input);
  const performanceZones = calculatePerformanceZones(eatingWindow);
  const recommendations = generateRecommendations(input, eatingWindow);
  
  return {
    eatingWindow,
    performanceZones,
    recommendations,
  };
}

/**
 * Calculate timing score for a single meal
 * Returns 0-100 based on how close actual time is to optimal
 */
export function calculateMealTimingScore(
  actualTime: string,
  optimalTime: string,
  flexibility: number = MEAL_FLEXIBILITY
): number {
  const deviationMinutes = Math.abs(minutesBetween(actualTime, optimalTime));
  
  // Perfect score within flexibility window
  if (deviationMinutes <= flexibility) {
    return 100;
  }
  
  // Gradual penalty: 2 points per minute past flexibility
  const penaltyMinutes = deviationMinutes - flexibility;
  const penalty = penaltyMinutes * 2;
  
  return Math.max(0, 100 - penalty);
}

/**
 * Check if a time falls within a meal window
 */
export function isWithinWindow(time: string, window: MealWindow): boolean {
  const timeMinutes = minutesBetween("00:00", time);
  const startMinutes = minutesBetween("00:00", window.start);
  const endMinutes = minutesBetween("00:00", window.end);
  
  return timeMinutes >= startMinutes && timeMinutes <= endMinutes;
}

/**
 * Get current eating status based on time and eating window
 */
export function getCurrentEatingStatus(
  currentTime: string,
  eatingWindow: EatingWindow
): {
  status: "fasting" | "eating" | "pre-breakfast" | "post-dinner";
  message: string;
  nextEvent: { name: string; time: string } | null;
} {
  const currentMinutes = minutesBetween("00:00", currentTime);
  const windowStartMinutes = minutesBetween("00:00", eatingWindow.eatingWindowStart);
  const windowEndMinutes = minutesBetween("00:00", eatingWindow.eatingWindowEnd);
  
  if (currentMinutes < windowStartMinutes) {
    // Before eating window
    const minutesUntilBreakfast = windowStartMinutes - currentMinutes;
    return {
      status: "pre-breakfast",
      message: `Fasting mode • ${Math.round(minutesUntilBreakfast)} minutes until breakfast window`,
      nextEvent: { name: "Breakfast window opens", time: eatingWindow.eatingWindowStart },
    };
  } else if (currentMinutes >= windowStartMinutes && currentMinutes <= windowEndMinutes) {
    // During eating window
    const minutesRemaining = windowEndMinutes - currentMinutes;
    return {
      status: "eating",
      message: `Eating window open • ${Math.round(minutesRemaining)} minutes remaining`,
      nextEvent: { name: "Eating window closes", time: eatingWindow.eatingWindowEnd },
    };
  } else {
    // After eating window
    return {
      status: "post-dinner",
      message: `Fasting mode • Overnight fast in progress`,
      nextEvent: { name: "Breakfast window opens", time: eatingWindow.eatingWindowStart },
    };
  }
}
