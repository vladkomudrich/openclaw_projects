import { 
  SleepEntry, 
  UserSettings, 
  StorageData 
} from "@/types";
import { 
  STORAGE_KEY, 
  STORAGE_VERSION, 
  DATA_RETENTION_DAYS,
  DEFAULT_IDEAL_SLEEP_DURATION 
} from "@/lib/constants";
import { subDays, parseISO, isAfter, format, startOfDay } from "date-fns";

// Default settings
const defaultSettings: UserSettings = {
  idealSleepDuration: DEFAULT_IDEAL_SLEEP_DURATION,
  notificationsEnabled: false,
  tutorialCompleted: false,
  onboardingCompleted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Default storage data
const defaultStorageData: StorageData = {
  sleepEntries: [],
  userSettings: defaultSettings,
  version: STORAGE_VERSION,
};

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
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
 * Get all data from localStorage
 */
export function getStorageData(): StorageData {
  if (!isLocalStorageAvailable()) {
    return defaultStorageData;
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return defaultStorageData;
    }

    const parsed = JSON.parse(data) as StorageData;
    
    // Handle version migrations if needed
    if (parsed.version !== STORAGE_VERSION) {
      return migrateData(parsed);
    }

    return parsed;
  } catch {
    console.error("Error reading from localStorage");
    return defaultStorageData;
  }
}

/**
 * Save all data to localStorage
 */
export function saveStorageData(data: StorageData): void {
  if (!isLocalStorageAvailable()) {
    console.warn("localStorage not available");
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

/**
 * Get all sleep entries
 */
export function getSleepEntries(): SleepEntry[] {
  const data = getStorageData();
  return cleanupOldEntries(data.sleepEntries);
}

/**
 * Get a specific sleep entry by date
 */
export function getSleepEntryByDate(date: string): SleepEntry | undefined {
  const entries = getSleepEntries();
  return entries.find(entry => entry.date === date);
}

/**
 * Get today's sleep entry
 */
export function getTodaySleepEntry(): SleepEntry | undefined {
  const today = format(new Date(), "yyyy-MM-dd");
  return getSleepEntryByDate(today);
}

/**
 * Save a sleep entry (creates or updates)
 */
export function saveSleepEntry(entry: Omit<SleepEntry, "id" | "createdAt" | "updatedAt">): SleepEntry {
  const data = getStorageData();
  const now = new Date().toISOString();
  
  // Check if entry for this date already exists
  const existingIndex = data.sleepEntries.findIndex(e => e.date === entry.date);
  
  let savedEntry: SleepEntry;
  
  if (existingIndex >= 0) {
    // Update existing entry
    savedEntry = {
      ...data.sleepEntries[existingIndex],
      ...entry,
      updatedAt: now,
    };
    data.sleepEntries[existingIndex] = savedEntry;
  } else {
    // Create new entry
    savedEntry = {
      ...entry,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    data.sleepEntries.push(savedEntry);
  }
  
  // Sort by date descending
  data.sleepEntries.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Cleanup old entries
  data.sleepEntries = cleanupOldEntries(data.sleepEntries);
  
  saveStorageData(data);
  return savedEntry;
}

/**
 * Delete a sleep entry by date
 */
export function deleteSleepEntry(date: string): void {
  const data = getStorageData();
  data.sleepEntries = data.sleepEntries.filter(e => e.date !== date);
  saveStorageData(data);
}

/**
 * Get user settings
 */
export function getUserSettings(): UserSettings {
  const data = getStorageData();
  return data.userSettings;
}

/**
 * Save user settings (partial update)
 */
export function saveUserSettings(settings: Partial<UserSettings>): UserSettings {
  const data = getStorageData();
  data.userSettings = {
    ...data.userSettings,
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  saveStorageData(data);
  return data.userSettings;
}

/**
 * Export all data as JSON string
 */
export function exportData(): string {
  const data = getStorageData();
  return JSON.stringify(data, null, 2);
}

/**
 * Import data from JSON string
 */
export function importData(jsonString: string): boolean {
  try {
    const imported = JSON.parse(jsonString) as StorageData;
    
    // Validate structure
    if (!imported.sleepEntries || !imported.userSettings) {
      throw new Error("Invalid data structure");
    }
    
    // Merge with existing data (newer entries take precedence)
    const existing = getStorageData();
    
    // Create a map of existing entries by date
    const entryMap = new Map<string, SleepEntry>();
    existing.sleepEntries.forEach(e => entryMap.set(e.date, e));
    
    // Add/update with imported entries (imported takes precedence if newer)
    imported.sleepEntries.forEach(e => {
      const existingEntry = entryMap.get(e.date);
      if (!existingEntry || new Date(e.updatedAt) > new Date(existingEntry.updatedAt)) {
        entryMap.set(e.date, e);
      }
    });
    
    const mergedData: StorageData = {
      sleepEntries: Array.from(entryMap.values()),
      userSettings: {
        ...existing.userSettings,
        ...imported.userSettings,
      },
      version: STORAGE_VERSION,
    };
    
    saveStorageData(mergedData);
    return true;
  } catch (error) {
    console.error("Error importing data:", error);
    return false;
  }
}

/**
 * Clear all data
 */
export function clearAllData(): void {
  if (isLocalStorageAvailable()) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Get entries for the last N days (for calculations)
 */
export function getRecentEntries(days: number = DATA_RETENTION_DAYS): SleepEntry[] {
  const entries = getSleepEntries();
  const cutoffDate = startOfDay(subDays(new Date(), days));
  
  return entries.filter(entry => 
    isAfter(parseISO(entry.date), cutoffDate) || 
    entry.date === format(cutoffDate, "yyyy-MM-dd")
  );
}

/**
 * Check for gaps in sleep data
 */
export function findMissingDates(days: number = 7): string[] {
  const entries = getSleepEntries();
  const entryDates = new Set(entries.map(e => e.date));
  const missing: string[] = [];
  
  const today = startOfDay(new Date());
  
  for (let i = 1; i <= days; i++) {
    const date = format(subDays(today, i), "yyyy-MM-dd");
    if (!entryDates.has(date)) {
      missing.push(date);
    }
  }
  
  return missing;
}

// Helper functions

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function cleanupOldEntries(entries: SleepEntry[]): SleepEntry[] {
  const cutoffDate = startOfDay(subDays(new Date(), DATA_RETENTION_DAYS));
  
  return entries.filter(entry => {
    const entryDate = parseISO(entry.date);
    return isAfter(entryDate, cutoffDate) || 
           entry.date === format(cutoffDate, "yyyy-MM-dd");
  });
}

function migrateData(oldData: StorageData): StorageData {
  // Handle migrations based on version
  // For now, just update the version and return
  return {
    ...defaultStorageData,
    ...oldData,
    version: STORAGE_VERSION,
  };
}
