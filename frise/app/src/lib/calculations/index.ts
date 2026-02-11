import { 
  SleepEntry, 
  ProductivityPoint, 
  ProductivityZone, 
  SleepDebt, 
  MelatoninWindow,
  DayInsights,
  ProductivityCurve
} from "@/types";
import { 
  ZONE_THRESHOLDS,
  CURVE_START_HOUR,
  CURVE_END_HOUR,
  CURVE_INTERVAL_MINUTES,
  MELATONIN_WINDOW_HOURS_BEFORE_IDEAL_BEDTIME,
  OPTIMAL_BEDTIME_OFFSET_HOURS,
  DEFAULT_IDEAL_SLEEP_DURATION,
  TAU,
  SLEEP_PRESSURE_TIME_CONSTANT,
  WAKE_PRESSURE_TIME_CONSTANT
} from "@/lib/constants";
import { 
  parseISO, 
  format, 
  addMinutes, 
  differenceInMinutes, 
  setHours, 
  setMinutes,
  isBefore,
  isAfter,
  startOfDay,
  addDays
} from "date-fns";

/**
 * Calculate Process S (Sleep Homeostasis / Sleep Pressure)
 * 
 * Sleep pressure accumulates during waking and dissipates during sleep.
 * Based on Borbély's Two-Process Model.
 * 
 * Key insight: Sleep pressure modulates energy but shouldn't override
 * the circadian rhythm's biphasic pattern.
 * 
 * @param hoursAwake - Hours since waking up
 * @param sleepDurationHours - How long the person slept
 * @returns Sleep pressure value (0-1, higher = more tired)
 */
export function calculateProcessS(hoursAwake: number, sleepDurationHours: number): number {
  const idealSleepHours = 8;
  const sleepDebtFactor = Math.max(0, (idealSleepHours - sleepDurationHours) / idealSleepHours);
  
  // Initial pressure based on sleep debt (0.05 - 0.25)
  const initialPressure = 0.05 + (sleepDebtFactor * 0.2);
  
  // Slow exponential buildup - reaches ~0.7 after 16 hours awake
  const timeConstant = 18;
  const pressure = 1 - (1 - initialPressure) * Math.exp(-hoursAwake / timeConstant);
  
  return Math.min(1, Math.max(0, pressure));
}

/**
 * Calculate biphasic alertness based on hours since waking
 * 
 * Scientific basis (from sleep research):
 * - Peak 1: ~2-4 hours after waking (morning peak)
 * - Dip: ~6-8 hours after waking (post-lunch dip, 12-hour harmonic)
 * - Peak 2: ~9-11 hours after waking (afternoon/evening peak)
 * - Decline: ~12+ hours after waking (toward sleep)
 * 
 * The pattern is driven by HOURS AWAKE, not clock time.
 * 
 * @param hoursAwake - Hours since waking up
 * @returns Alertness value (0-1, higher = more alert)
 */
export function calculateCircadianAlertness(hoursAwake: number): number {
  // Clamp to reasonable range (0-20 hours awake)
  const h = Math.max(0, Math.min(20, hoursAwake));
  
  // Model the biphasic pattern using a combination of functions
  // Based on: "Modeling Napping, Post-Lunch Dip" (Bes et al., 2009)
  
  // Component 1: Morning ramp-up (peaks around 3 hours after waking)
  // Gaussian-like curve centered at h=3
  const morningPeak = Math.exp(-Math.pow(h - 3, 2) / 8);
  
  // Component 2: Afternoon peak (peaks around 10 hours after waking)
  // Gaussian-like curve centered at h=10, slightly lower amplitude
  const afternoonPeak = 0.85 * Math.exp(-Math.pow(h - 10, 2) / 12);
  
  // Component 3: Post-lunch dip (centered around 7 hours after waking)
  // Negative Gaussian to create dip
  const postLunchDip = 0.35 * Math.exp(-Math.pow(h - 7, 2) / 4);
  
  // Component 4: Evening decline (starts ~13 hours after waking)
  // Sigmoid-like decline toward sleep
  const eveningDecline = h > 12 ? 0.15 * (1 - Math.exp(-(h - 12) / 3)) : 0;
  
  // Component 5: Sleep inertia (first 30-60 min after waking)
  const sleepInertia = h < 1 ? 0.2 * (1 - h) : 0;
  
  // Combine components
  const alertness = Math.max(morningPeak, afternoonPeak) - postLunchDip - eveningDecline - sleepInertia;
  
  // Normalize to 0-1 range
  return Math.min(1, Math.max(0.1, alertness));
}

/**
 * Calculate productivity at a given time
 * 
 * Based on the Two-Process Model (Borbély):
 * - Productivity = Circadian alertness × (1 - Sleep pressure modifier)
 * 
 * Creates the scientifically-accurate biphasic pattern:
 * - Morning ramp-up → Morning peak (~2-4h after waking)
 * - Post-lunch dip (~6-8h after waking) 
 * - Afternoon peak (~9-11h after waking)
 * - Evening decline (toward melatonin window)
 * 
 * @param hourOfDay - Hour of the day (unused but kept for API compatibility)
 * @param hoursAwake - Hours since waking
 * @param sleepDurationHours - How long the person slept
 * @returns Productivity value 0-100
 */
export function calculateProductivity(
  hourOfDay: number, 
  hoursAwake: number, 
  sleepDurationHours: number
): number {
  // Get base circadian alertness (the biphasic curve)
  const circadianAlertness = calculateCircadianAlertness(hoursAwake);
  
  // Get sleep pressure (modulates but doesn't override)
  const sleepPressure = calculateProcessS(hoursAwake, sleepDurationHours);
  
  // Combine: circadian drives the shape, sleep pressure dampens overall
  // Sleep pressure effect is reduced (0.25 multiplier) to preserve peaks
  const rawProductivity = circadianAlertness * (1 - sleepPressure * 0.25);
  
  // Scale to 0-100
  const scaled = rawProductivity * 100;
  
  return Math.round(Math.min(100, Math.max(0, scaled)));
}

/**
 * Legacy function for backwards compatibility
 * Now delegates to calculateCircadianAlertness
 */
export function calculateProcessC(hourOfDay: number): number {
  // This is kept for any code that might still call it
  // But the new model is based on hours awake, not clock time
  // Assume 7 AM wake time for backwards compatibility
  const assumedWakeHour = 7;
  const hoursAwake = (hourOfDay - assumedWakeHour + 24) % 24;
  return calculateCircadianAlertness(hoursAwake);
}

/**
 * Determine productivity zone based on value
 */
export function getProductivityZone(value: number, isAsleep: boolean = false): ProductivityZone {
  if (isAsleep) return "sleep";
  if (value >= ZONE_THRESHOLDS.good) return "peak";
  if (value >= ZONE_THRESHOLDS.moderate) return "good";
  if (value >= ZONE_THRESHOLDS.low) return "moderate";
  return "low";
}

/**
 * Generate productivity curve for a day
 * 
 * @param sleepEntry - The sleep entry for the day
 * @param targetDate - The date to generate the curve for (defaults to today)
 * @returns Array of ProductivityPoints from 5 AM to 1 AM
 */
export function calculateProductivityCurve(
  sleepEntry: SleepEntry,
  targetDate?: Date
): ProductivityPoint[] {
  const points: ProductivityPoint[] = [];
  const date = targetDate || new Date();
  const dayStart = startOfDay(date);
  
  const wakeTime = parseISO(sleepEntry.wakeTime);
  const bedtime = parseISO(sleepEntry.bedtime);
  const sleepDurationHours = sleepEntry.duration / 60;
  
  // Generate points from 5 AM to 1 AM (next day)
  for (let hour = CURVE_START_HOUR; hour < CURVE_END_HOUR; hour++) {
    for (let minute = 0; minute < 60; minute += CURVE_INTERVAL_MINUTES) {
      const actualHour = hour >= 24 ? hour - 24 : hour;
      const pointDate = hour >= 24 ? addDays(dayStart, 1) : dayStart;
      
      let pointTime = setHours(setMinutes(pointDate, minute), actualHour);
      
      // Check if user was asleep at this time
      const isAsleep = isBefore(pointTime, wakeTime);
      
      // Calculate hours awake
      const hoursAwake = isAsleep ? 0 : differenceInMinutes(pointTime, wakeTime) / 60;
      
      // Calculate productivity
      const productivity = isAsleep ? 0 : calculateProductivity(
        actualHour + minute / 60,
        hoursAwake,
        sleepDurationHours
      );
      
      const zone = getProductivityZone(productivity, isAsleep);
      
      points.push({
        time: format(pointTime, "HH:mm"),
        timestamp: pointTime.getTime(),
        value: productivity,
        zone,
      });
    }
  }
  
  return points;
}

/**
 * Calculate melatonin window
 * 
 * Melatonin typically starts rising 2 hours before natural sleep onset.
 * We calculate this based on the user's ideal sleep duration and recent patterns.
 * 
 * @param idealBedtime - The ideal bedtime for the user
 * @returns MelatoninWindow object
 */
export function calculateMelatoninWindow(idealBedtime: Date): MelatoninWindow {
  const startTime = addMinutes(idealBedtime, -MELATONIN_WINDOW_HOURS_BEFORE_IDEAL_BEDTIME * 60);
  const endTime = idealBedtime;
  
  return {
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
    durationMinutes: MELATONIN_WINDOW_HOURS_BEFORE_IDEAL_BEDTIME * 60,
  };
}

/**
 * Calculate optimal bedtime for tonight
 * 
 * Based on melatonin window and ideal sleep duration.
 * 
 * @param wakeTime - When user woke up today
 * @param idealSleepMinutes - Ideal sleep duration in minutes
 * @returns Optimal bedtime as Date
 */
export function calculateOptimalBedtime(
  wakeTime: Date,
  idealSleepMinutes: number = DEFAULT_IDEAL_SLEEP_DURATION
): Date {
  // For optimal sleep, bedtime should allow for ideal sleep duration
  // before the desired wake time tomorrow
  
  // Assume user wants to wake up at similar time tomorrow
  const targetWakeTime = addDays(wakeTime, 1);
  
  // Calculate bedtime: wake time - ideal sleep duration
  const bedtime = addMinutes(targetWakeTime, -idealSleepMinutes);
  
  return bedtime;
}

/**
 * Calculate sleep debt over a period
 * 
 * @param sleepEntries - Array of sleep entries
 * @param idealSleepMinutes - Ideal sleep duration in minutes
 * @returns SleepDebt object
 */
export function calculateSleepDebt(
  sleepEntries: SleepEntry[],
  idealSleepMinutes: number = DEFAULT_IDEAL_SLEEP_DURATION
): SleepDebt {
  if (sleepEntries.length === 0) {
    return {
      totalDebt: 0,
      averageSleep: 0,
      idealSleep: idealSleepMinutes,
      daysTracked: 0,
      status: "balanced",
    };
  }
  
  const totalSleep = sleepEntries.reduce((sum, entry) => sum + entry.duration, 0);
  const averageSleep = totalSleep / sleepEntries.length;
  const totalIdeal = idealSleepMinutes * sleepEntries.length;
  const totalDebt = totalSleep - totalIdeal; // Positive = surplus, negative = debt
  
  let status: "debt" | "balanced" | "surplus";
  if (totalDebt < -30) {
    status = "debt";
  } else if (totalDebt > 30) {
    status = "surplus";
  } else {
    status = "balanced";
  }
  
  return {
    totalDebt: Math.round(totalDebt),
    averageSleep: Math.round(averageSleep),
    idealSleep: idealSleepMinutes,
    daysTracked: sleepEntries.length,
    status,
  };
}

/**
 * Find peak productivity window
 * 
 * @param points - Array of ProductivityPoints
 * @returns Object with start and end times of best productivity window
 */
export function findPeakWindow(
  points: ProductivityPoint[]
): { startTime: string; endTime: string } {
  // Find the longest continuous window above 80% productivity
  const threshold = ZONE_THRESHOLDS.good;
  
  let bestStart = 0;
  let bestLength = 0;
  let currentStart = 0;
  let currentLength = 0;
  
  for (let i = 0; i < points.length; i++) {
    if (points[i].value >= threshold) {
      if (currentLength === 0) {
        currentStart = i;
      }
      currentLength++;
    } else {
      if (currentLength > bestLength) {
        bestStart = currentStart;
        bestLength = currentLength;
      }
      currentLength = 0;
    }
  }
  
  // Check final window
  if (currentLength > bestLength) {
    bestStart = currentStart;
    bestLength = currentLength;
  }
  
  // If no window found, find the single highest point
  if (bestLength === 0) {
    let maxValue = 0;
    let maxIndex = 0;
    for (let i = 0; i < points.length; i++) {
      if (points[i].value > maxValue) {
        maxValue = points[i].value;
        maxIndex = i;
      }
    }
    bestStart = maxIndex;
    bestLength = 1;
  }
  
  return {
    startTime: points[bestStart].time,
    endTime: points[Math.min(bestStart + bestLength - 1, points.length - 1)].time,
  };
}

/**
 * Get current productivity based on curve
 * 
 * @param points - Array of ProductivityPoints
 * @param currentTime - Current time (defaults to now)
 * @returns Current productivity point or null
 */
export function getCurrentProductivity(
  points: ProductivityPoint[],
  currentTime?: Date
): ProductivityPoint | null {
  const now = currentTime || new Date();
  const currentTimeStr = format(now, "HH:mm");
  
  // Find the closest point
  let closest = points[0];
  let minDiff = Infinity;
  
  for (const point of points) {
    const diff = Math.abs(
      timeStringToMinutes(point.time) - timeStringToMinutes(currentTimeStr)
    );
    if (diff < minDiff) {
      minDiff = diff;
      closest = point;
    }
  }
  
  return closest;
}

/**
 * Generate complete insights for the day
 */
export function generateDayInsights(
  sleepEntry: SleepEntry,
  allEntries: SleepEntry[],
  idealSleepMinutes: number
): DayInsights {
  const curve = calculateProductivityCurve(sleepEntry);
  const wakeTime = parseISO(sleepEntry.wakeTime);
  const optimalBedtime = calculateOptimalBedtime(wakeTime, idealSleepMinutes);
  const melatoninWindow = calculateMelatoninWindow(optimalBedtime);
  const sleepDebt = calculateSleepDebt(allEntries, idealSleepMinutes);
  const peakWindow = findPeakWindow(curve);
  const currentPoint = getCurrentProductivity(curve);
  
  return {
    peakStartTime: peakWindow.startTime,
    peakEndTime: peakWindow.endTime,
    melatoninWindowStart: format(parseISO(melatoninWindow.startTime), "h:mm a"),
    optimalBedtime: format(optimalBedtime, "h:mm a"),
    sleepDebt,
    currentZone: currentPoint?.zone || "moderate",
    currentProductivity: currentPoint?.value || 50,
  };
}

/**
 * Generate complete productivity curve with all related data
 */
export function generateProductivityCurve(
  sleepEntry: SleepEntry,
  allEntries: SleepEntry[],
  idealSleepMinutes: number
): ProductivityCurve {
  const points = calculateProductivityCurve(sleepEntry);
  const wakeTime = parseISO(sleepEntry.wakeTime);
  const optimalBedtime = calculateOptimalBedtime(wakeTime, idealSleepMinutes);
  const melatoninWindow = calculateMelatoninWindow(optimalBedtime);
  const insights = generateDayInsights(sleepEntry, allEntries, idealSleepMinutes);
  
  return {
    date: sleepEntry.date,
    wakeTime: sleepEntry.wakeTime,
    sleepEntry,
    points,
    insights,
    melatoninWindow,
  };
}

// Helper function
function timeStringToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}
