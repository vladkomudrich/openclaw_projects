/**
 * FuelTime Local Storage Management
 * 
 * Handles all data persistence using browser localStorage.
 * Includes versioning, migration, and export/import functionality.
 */

import type {
  StorageData,
  UserProfile,
  UserPreferences,
  EatingWindow,
  MealLog,
  DailyTimingScore,
  EatingPattern,
  defaultUserProfile,
  defaultPreferences,
} from "@/types";

const STORAGE_KEY = "fueltime_data";
const CURRENT_VERSION = "1.0.0";
const MAX_MEAL_LOGS_DAYS = 30;

/**
 * Check if localStorage is available
 */
function isStorageAvailable(): boolean {
  if (typeof window === "undefined") return false;
  
  try {
    const test = "__storage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

/**
 * Generate a unique ID
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get default empty storage data
 */
function getDefaultStorageData(): StorageData {
  const now = new Date().toISOString();
  
  return {
    version: CURRENT_VERSION,
    profile: {
      id: generateId(),
      wakeTime: "07:00",
      sleepTime: "23:00",
      chronotype: "intermediate",
      primaryGoal: "energy_stability",
      workSchedule: "standard",
      timezone: typeof Intl !== "undefined" 
        ? Intl.DateTimeFormat().resolvedOptions().timeZone 
        : "UTC",
      createdAt: now,
      updatedAt: now,
    },
    preferences: {
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
    },
    eatingWindow: {
      breakfast: { start: "07:30", end: "08:30", optimal: "08:00", flexibility: 30 },
      lunch: { start: "11:30", end: "12:30", optimal: "12:00", flexibility: 30 },
      dinner: { start: "17:30", end: "18:30", optimal: "18:00", flexibility: 30 },
      snacks: [],
      eatingWindowStart: "08:00",
      eatingWindowEnd: "18:00",
      windowDuration: 10,
      fastingDuration: 14,
      metabolicSwitchTime: "06:00",
    },
    mealLogs: [],
    dailyScores: [],
    onboardingCompleted: false,
    tutorialDismissed: false,
    lastUpdated: now,
  };
}

/**
 * Load all data from storage
 */
export function loadStorageData(): StorageData | null {
  if (!isStorageAvailable()) return null;
  
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    
    const data = JSON.parse(raw) as StorageData;
    
    // Migrate if needed
    if (data.version !== CURRENT_VERSION) {
      return migrateData(data);
    }
    
    return data;
  } catch (error) {
    console.error("Error loading storage data:", error);
    return null;
  }
}

/**
 * Save all data to storage
 */
export function saveStorageData(data: StorageData): boolean {
  if (!isStorageAvailable()) return false;
  
  try {
    const toSave: StorageData = {
      ...data,
      lastUpdated: new Date().toISOString(),
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    return true;
  } catch (error) {
    console.error("Error saving storage data:", error);
    return false;
  }
}

/**
 * Initialize storage with default data or load existing
 */
export function initializeStorage(): StorageData {
  const existing = loadStorageData();
  if (existing) return existing;
  
  const defaultData = getDefaultStorageData();
  saveStorageData(defaultData);
  return defaultData;
}

/**
 * Update user profile
 */
export function updateProfile(profile: Partial<UserProfile>): StorageData | null {
  const data = loadStorageData();
  if (!data) return null;
  
  data.profile = {
    ...data.profile,
    ...profile,
    updatedAt: new Date().toISOString(),
  };
  
  saveStorageData(data);
  return data;
}

/**
 * Update user preferences
 */
export function updatePreferences(preferences: Partial<UserPreferences>): StorageData | null {
  const data = loadStorageData();
  if (!data) return null;
  
  data.preferences = {
    ...data.preferences,
    ...preferences,
  };
  
  saveStorageData(data);
  return data;
}

/**
 * Update eating window
 */
export function updateEatingWindow(eatingWindow: EatingWindow): StorageData | null {
  const data = loadStorageData();
  if (!data) return null;
  
  data.eatingWindow = eatingWindow;
  saveStorageData(data);
  return data;
}

/**
 * Add a meal log
 */
export function addMealLog(log: Omit<MealLog, "id">): MealLog | null {
  const data = loadStorageData();
  if (!data) return null;
  
  const newLog: MealLog = {
    ...log,
    id: generateId(),
  };
  
  data.mealLogs.push(newLog);
  
  // Clean up old logs (keep last 30 days)
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - MAX_MEAL_LOGS_DAYS);
  data.mealLogs = data.mealLogs.filter(
    (l) => new Date(l.timestamp) >= cutoffDate
  );
  
  saveStorageData(data);
  return newLog;
}

/**
 * Update a meal log
 */
export function updateMealLog(id: string, updates: Partial<MealLog>): MealLog | null {
  const data = loadStorageData();
  if (!data) return null;
  
  const index = data.mealLogs.findIndex((l) => l.id === id);
  if (index === -1) return null;
  
  data.mealLogs[index] = {
    ...data.mealLogs[index],
    ...updates,
  };
  
  saveStorageData(data);
  return data.mealLogs[index];
}

/**
 * Delete a meal log
 */
export function deleteMealLog(id: string): boolean {
  const data = loadStorageData();
  if (!data) return false;
  
  const initialLength = data.mealLogs.length;
  data.mealLogs = data.mealLogs.filter((l) => l.id !== id);
  
  if (data.mealLogs.length < initialLength) {
    saveStorageData(data);
    return true;
  }
  
  return false;
}

/**
 * Get meal logs for a specific date
 */
export function getMealLogsForDate(date: string): MealLog[] {
  const data = loadStorageData();
  if (!data) return [];
  
  return data.mealLogs.filter((log) => {
    const logDate = new Date(log.timestamp).toISOString().split("T")[0];
    return logDate === date;
  });
}

/**
 * Get meal logs for date range
 */
export function getMealLogsForRange(startDate: string, endDate: string): MealLog[] {
  const data = loadStorageData();
  if (!data) return [];
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return data.mealLogs.filter((log) => {
    const logDate = new Date(log.timestamp);
    return logDate >= start && logDate <= end;
  });
}

/**
 * Save daily timing score
 */
export function saveDailyScore(score: DailyTimingScore): boolean {
  const data = loadStorageData();
  if (!data) return false;
  
  // Remove existing score for same date
  data.dailyScores = data.dailyScores.filter((s) => s.date !== score.date);
  
  // Add new score
  data.dailyScores.push(score);
  
  // Keep only last 30 days
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - MAX_MEAL_LOGS_DAYS);
  const cutoffStr = cutoffDate.toISOString().split("T")[0];
  data.dailyScores = data.dailyScores.filter((s) => s.date >= cutoffStr);
  
  saveStorageData(data);
  return true;
}

/**
 * Get daily scores for date range
 */
export function getDailyScoresForRange(startDate: string, endDate: string): DailyTimingScore[] {
  const data = loadStorageData();
  if (!data) return [];
  
  return data.dailyScores.filter(
    (score) => score.date >= startDate && score.date <= endDate
  );
}

/**
 * Mark onboarding as completed
 */
export function completeOnboarding(): boolean {
  const data = loadStorageData();
  if (!data) return false;
  
  data.onboardingCompleted = true;
  saveStorageData(data);
  return true;
}

/**
 * Mark tutorial as dismissed
 */
export function dismissTutorial(): boolean {
  const data = loadStorageData();
  if (!data) return false;
  
  data.tutorialDismissed = true;
  saveStorageData(data);
  return true;
}

/**
 * Export all data as JSON
 */
export function exportData(): string | null {
  const data = loadStorageData();
  if (!data) return null;
  
  return JSON.stringify(data, null, 2);
}

/**
 * Import data from JSON
 */
export function importData(jsonString: string): StorageData | null {
  try {
    const data = JSON.parse(jsonString) as StorageData;
    
    // Validate required fields
    if (!data.version || !data.profile || !data.preferences) {
      throw new Error("Invalid data format");
    }
    
    // Migrate if needed
    const migratedData = data.version !== CURRENT_VERSION 
      ? migrateData(data) 
      : data;
    
    if (migratedData) {
      saveStorageData(migratedData);
    }
    
    return migratedData;
  } catch (error) {
    console.error("Error importing data:", error);
    return null;
  }
}

/**
 * Clear all stored data
 */
export function clearAllData(): boolean {
  if (!isStorageAvailable()) return false;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing data:", error);
    return false;
  }
}

/**
 * Migrate data from older versions
 */
function migrateData(oldData: StorageData): StorageData | null {
  // For now, just update version and return
  // Future migrations would go here
  return {
    ...oldData,
    version: CURRENT_VERSION,
  };
}

/**
 * Get storage usage info
 */
export function getStorageInfo(): { used: number; available: number } | null {
  if (!isStorageAvailable()) return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY) || "";
    const used = new Blob([data]).size;
    
    // localStorage typically has 5-10MB limit
    const available = 5 * 1024 * 1024; // Assume 5MB
    
    return { used, available };
  } catch {
    return null;
  }
}
