/**
 * Storage Module Tests
 * 
 * Tests for the localStorage persistence layer including
 * data CRUD operations, migrations, and import/export.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initializeStorage,
  loadStorageData,
  saveStorageData,
  addMealLog,
  updateMealLog,
  deleteMealLog,
  getMealLogsForDate,
  completeOnboarding,
  exportData,
  importData,
  clearAllData,
} from './storage';
import type { StorageData, MealLog } from '@/types';

describe('Storage Module', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('initializeStorage', () => {
    it('should return default data when storage is empty', () => {
      const data = initializeStorage();

      expect(data).toBeDefined();
      expect(data.version).toBe('1.0.0');
      expect(data.profile).toBeDefined();
      expect(data.preferences).toBeDefined();
      expect(data.onboardingCompleted).toBe(false);
    });

    it('should return existing data when present', () => {
      const existingData: StorageData = {
        version: '1.0.0',
        profile: {
          id: 'test-id',
          wakeTime: '06:00',
          sleepTime: '22:00',
          chronotype: 'morning',
          primaryGoal: 'mental_performance',
          workSchedule: 'standard',
          timezone: 'UTC',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        preferences: {
          windowDuration: 8,
          flexibility: 'strict',
          weekendAdjustment: 'same',
          notifications: {
            enabled: true,
            windowOpening: true,
            mealTimingSuggestions: true,
            windowClosingWarning: true,
            windowClosingWarningMinutes: 60,
            weeklySummary: true,
          },
          displayFormat: '24h',
          theme: 'dark',
        },
        eatingWindow: {
          breakfast: { start: '06:30', end: '07:30', optimal: '07:00', flexibility: 30 },
          lunch: { start: '11:30', end: '12:30', optimal: '12:00', flexibility: 30 },
          dinner: { start: '17:30', end: '18:30', optimal: '18:00', flexibility: 30 },
          snacks: [],
          eatingWindowStart: '07:00',
          eatingWindowEnd: '17:00',
          windowDuration: 10,
          fastingDuration: 14,
          metabolicSwitchTime: '05:00',
        },
        mealLogs: [],
        dailyScores: [],
        onboardingCompleted: true,
        tutorialDismissed: false,
        lastUpdated: new Date().toISOString(),
      };

      localStorage.setItem('fueltime_data', JSON.stringify(existingData));
      const data = initializeStorage();

      expect(data.profile.wakeTime).toBe('06:00');
      expect(data.onboardingCompleted).toBe(true);
    });
  });

  describe('saveStorageData and loadStorageData', () => {
    it('should save and load data correctly', () => {
      const data = initializeStorage();
      data.profile.wakeTime = '08:00';

      saveStorageData(data);
      const loaded = loadStorageData();

      expect(loaded).not.toBeNull();
      expect(loaded?.profile.wakeTime).toBe('08:00');
    });

    it('should update lastUpdated timestamp on save', () => {
      const data = initializeStorage();
      
      // Modify data and save
      data.profile.wakeTime = '09:00';
      saveStorageData(data);
      const loaded = loadStorageData();

      expect(loaded?.lastUpdated).toBeDefined();
      // The timestamp should be set on save
      expect(typeof loaded?.lastUpdated).toBe('string');
    });
  });

  describe('Meal Log Operations', () => {
    beforeEach(() => {
      initializeStorage();
    });

    describe('addMealLog', () => {
      it('should add a new meal log with generated ID', () => {
        const log = addMealLog({
          timestamp: new Date().toISOString(),
          mealType: 'breakfast',
          withinWindow: true,
          timingScore: 95,
        });

        expect(log).not.toBeNull();
        expect(log?.id).toBeDefined();
        expect(log?.mealType).toBe('breakfast');
      });

      it('should persist meal log to storage', () => {
        addMealLog({
          timestamp: new Date().toISOString(),
          mealType: 'lunch',
          withinWindow: true,
          timingScore: 85,
        });

        const data = loadStorageData();
        expect(data?.mealLogs.length).toBe(1);
        expect(data?.mealLogs[0].mealType).toBe('lunch');
      });

      it('should include optional meal details', () => {
        const log = addMealLog({
          timestamp: new Date().toISOString(),
          mealType: 'dinner',
          size: 'moderate',
          macroBalance: 'balanced',
          energyBefore: 3,
          notes: 'Test meal',
          withinWindow: true,
          timingScore: 90,
        });

        expect(log?.size).toBe('moderate');
        expect(log?.macroBalance).toBe('balanced');
        expect(log?.notes).toBe('Test meal');
      });
    });

    describe('updateMealLog', () => {
      it('should update existing meal log', () => {
        const log = addMealLog({
          timestamp: new Date().toISOString(),
          mealType: 'breakfast',
          withinWindow: true,
          timingScore: 95,
        });

        const updated = updateMealLog(log!.id, { notes: 'Updated note' });

        expect(updated?.notes).toBe('Updated note');
      });

      it('should return null for non-existent log', () => {
        const result = updateMealLog('non-existent-id', { notes: 'Test' });
        expect(result).toBeNull();
      });
    });

    describe('deleteMealLog', () => {
      it('should delete existing meal log', () => {
        const log = addMealLog({
          timestamp: new Date().toISOString(),
          mealType: 'breakfast',
          withinWindow: true,
          timingScore: 95,
        });

        const deleted = deleteMealLog(log!.id);
        const data = loadStorageData();

        expect(deleted).toBe(true);
        expect(data?.mealLogs.length).toBe(0);
      });

      it('should return false for non-existent log', () => {
        const deleted = deleteMealLog('non-existent-id');
        expect(deleted).toBe(false);
      });
    });

    describe('getMealLogsForDate', () => {
      it('should return logs for specific date', () => {
        const today = new Date().toISOString().split('T')[0];

        addMealLog({
          timestamp: new Date().toISOString(),
          mealType: 'breakfast',
          withinWindow: true,
          timingScore: 95,
        });

        addMealLog({
          timestamp: new Date().toISOString(),
          mealType: 'lunch',
          withinWindow: true,
          timingScore: 85,
        });

        const logs = getMealLogsForDate(today);
        expect(logs.length).toBe(2);
      });

      it('should return empty array for date with no logs', () => {
        const logs = getMealLogsForDate('2000-01-01');
        expect(logs.length).toBe(0);
      });
    });
  });

  describe('Onboarding', () => {
    it('should mark onboarding as completed', () => {
      initializeStorage();
      completeOnboarding();

      const data = loadStorageData();
      expect(data?.onboardingCompleted).toBe(true);
    });
  });

  describe('Export/Import', () => {
    it('should export data as JSON string', () => {
      initializeStorage();
      const exported = exportData();

      expect(exported).not.toBeNull();
      expect(typeof exported).toBe('string');

      const parsed = JSON.parse(exported!);
      expect(parsed.version).toBe('1.0.0');
    });

    it('should import valid JSON data', () => {
      initializeStorage();
      const exported = exportData();

      clearAllData();
      const imported = importData(exported!);

      expect(imported).not.toBeNull();
      expect(imported?.version).toBe('1.0.0');
    });

    it('should return null for invalid JSON', () => {
      const imported = importData('invalid json');
      expect(imported).toBeNull();
    });

    it('should return null for missing required fields', () => {
      const imported = importData('{}');
      expect(imported).toBeNull();
    });
  });

  describe('clearAllData', () => {
    it('should remove all stored data', () => {
      initializeStorage();
      addMealLog({
        timestamp: new Date().toISOString(),
        mealType: 'breakfast',
        withinWindow: true,
        timingScore: 95,
      });

      clearAllData();
      const data = loadStorageData();

      expect(data).toBeNull();
    });
  });
});
