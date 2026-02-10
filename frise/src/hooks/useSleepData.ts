"use client";

import { useState, useEffect, useCallback } from "react";
import { SleepEntry, UserSettings, ProductivityCurve, DayInsights } from "@/types";
import {
  getSleepEntries,
  saveSleepEntry,
  deleteSleepEntry as deleteEntry,
  getUserSettings,
  saveUserSettings,
  getTodaySleepEntry,
  findMissingDates,
  getRecentEntries,
} from "@/lib/storage";
import { generateProductivityCurve, generateDayInsights } from "@/lib/calculations";
import { format } from "date-fns";

export function useSleepData() {
  const [entries, setEntries] = useState<SleepEntry[]>([]);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [todayEntry, setTodayEntry] = useState<SleepEntry | null>(null);
  const [productivityCurve, setProductivityCurve] = useState<ProductivityCurve | null>(null);
  const [insights, setInsights] = useState<DayInsights | null>(null);
  const [missingDates, setMissingDates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = useCallback(() => {
    setIsLoading(true);
    
    const loadedEntries = getSleepEntries();
    const loadedSettings = getUserSettings();
    const today = getTodaySleepEntry();
    const missing = findMissingDates(7);
    
    setEntries(loadedEntries);
    setSettings(loadedSettings);
    setTodayEntry(today || null);
    setMissingDates(missing);
    
    // Generate curve if we have today's entry
    if (today && loadedSettings) {
      const recentEntries = getRecentEntries(14);
      const curve = generateProductivityCurve(
        today,
        recentEntries,
        loadedSettings.idealSleepDuration
      );
      setProductivityCurve(curve);
      setInsights(curve.insights);
    }
    
    setIsLoading(false);
  }, []);

  const addSleepEntry = useCallback((
    entry: Omit<SleepEntry, "id" | "createdAt" | "updatedAt">
  ): SleepEntry => {
    const savedEntry = saveSleepEntry(entry);
    loadData(); // Reload all data
    return savedEntry;
  }, [loadData]);

  const deleteSleepEntry = useCallback((date: string) => {
    deleteEntry(date);
    loadData();
  }, [loadData]);

  const updateSettings = useCallback((newSettings: Partial<UserSettings>) => {
    const updated = saveUserSettings(newSettings);
    setSettings(updated);
    
    // Recalculate curve if we have today's entry
    if (todayEntry) {
      const recentEntries = getRecentEntries(14);
      const curve = generateProductivityCurve(
        todayEntry,
        recentEntries,
        updated.idealSleepDuration
      );
      setProductivityCurve(curve);
      setInsights(curve.insights);
    }
  }, [todayEntry]);

  const hasTodayData = Boolean(todayEntry);
  const hasCompletedOnboarding = settings?.onboardingCompleted ?? false;
  const hasCompletedTutorial = settings?.tutorialCompleted ?? false;

  return {
    // Data
    entries,
    settings,
    todayEntry,
    productivityCurve,
    insights,
    missingDates,
    
    // State
    isLoading,
    hasTodayData,
    hasCompletedOnboarding,
    hasCompletedTutorial,
    
    // Actions
    addSleepEntry,
    deleteSleepEntry,
    updateSettings,
    refreshData: loadData,
  };
}
