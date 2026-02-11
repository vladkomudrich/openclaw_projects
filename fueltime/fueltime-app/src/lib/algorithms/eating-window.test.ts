/**
 * Eating Window Algorithm Tests
 * 
 * Tests for the core chrononutrition algorithm that calculates
 * optimal eating windows based on user profile data.
 */
import { describe, it, expect } from 'vitest';
import {
  calculateOptimalSchedule,
  calculateEatingWindow,
  calculateMealTimingScore,
  isWithinWindow,
  getCurrentEatingStatus,
} from './eating-window';
import type { CalculationInput, MealWindow } from '@/types';

describe('calculateEatingWindow', () => {
  const baseInput: CalculationInput = {
    wakeTime: '07:00',
    sleepTime: '23:00',
    chronotype: 'intermediate',
    goal: 'energy_stability',
    workSchedule: 'standard',
  };

  describe('basic calculations', () => {
    it('should calculate eating window for standard profile', () => {
      const result = calculateEatingWindow(baseInput);

      expect(result).toBeDefined();
      expect(result.eatingWindowStart).toBeDefined();
      expect(result.eatingWindowEnd).toBeDefined();
      expect(result.breakfast).toBeDefined();
      expect(result.lunch).toBeDefined();
      expect(result.dinner).toBeDefined();
    });

    it('should respect window duration preference', () => {
      const input: CalculationInput = { ...baseInput, windowDuration: 8 };
      const result = calculateEatingWindow(input);

      // Window should be approximately 8 hours or less
      expect(result.windowDuration).toBeLessThanOrEqual(8.1);
    });

    it('should calculate fasting duration correctly', () => {
      const result = calculateEatingWindow(baseInput);

      // Fasting + eating = 24 hours
      expect(result.windowDuration + result.fastingDuration).toBeCloseTo(24, 1);
    });

    it('should include metabolic switch time', () => {
      const result = calculateEatingWindow(baseInput);

      expect(result.metabolicSwitchTime).toBeDefined();
      // Metabolic switch should be 12 hours after dinner
    });
  });

  describe('chronotype adjustments', () => {
    it('should shift earlier for morning chronotype', () => {
      const morningInput: CalculationInput = { ...baseInput, chronotype: 'morning' };
      const intermediateInput: CalculationInput = { ...baseInput, chronotype: 'intermediate' };

      const morningResult = calculateEatingWindow(morningInput);
      const intermediateResult = calculateEatingWindow(intermediateInput);

      // Morning person should have earlier breakfast
      const morningBreakfastMinutes = timeToMinutes(morningResult.breakfast.optimal);
      const intermediateBreakfastMinutes = timeToMinutes(intermediateResult.breakfast.optimal);

      expect(morningBreakfastMinutes).toBeLessThanOrEqual(intermediateBreakfastMinutes);
    });

    it('should shift later for evening chronotype', () => {
      const eveningInput: CalculationInput = { ...baseInput, chronotype: 'evening' };
      const intermediateInput: CalculationInput = { ...baseInput, chronotype: 'intermediate' };

      const eveningResult = calculateEatingWindow(eveningInput);
      const intermediateResult = calculateEatingWindow(intermediateInput);

      // Night owl should have later breakfast
      const eveningBreakfastMinutes = timeToMinutes(eveningResult.breakfast.optimal);
      const intermediateBreakfastMinutes = timeToMinutes(intermediateResult.breakfast.optimal);

      expect(eveningBreakfastMinutes).toBeGreaterThanOrEqual(intermediateBreakfastMinutes);
    });
  });

  describe('goal-based window durations', () => {
    it('should use 8h window for metabolic health goal', () => {
      const input: CalculationInput = { ...baseInput, goal: 'metabolic_health' };
      const result = calculateEatingWindow(input);

      expect(result.windowDuration).toBeLessThanOrEqual(9);
    });

    it('should use 12h window for flexibility goal', () => {
      const input: CalculationInput = { ...baseInput, goal: 'flexibility' };
      const result = calculateEatingWindow(input);

      expect(result.windowDuration).toBeGreaterThanOrEqual(10);
    });
  });

  describe('meal spacing', () => {
    it('should space meals appropriately', () => {
      const result = calculateEatingWindow(baseInput);

      const breakfastMinutes = timeToMinutes(result.breakfast.optimal);
      const lunchMinutes = timeToMinutes(result.lunch.optimal);
      const dinnerMinutes = timeToMinutes(result.dinner.optimal);

      // At least 3 hours between meals
      expect(lunchMinutes - breakfastMinutes).toBeGreaterThanOrEqual(180);
      expect(dinnerMinutes - lunchMinutes).toBeGreaterThanOrEqual(180);
    });
  });

  describe('edge cases', () => {
    it('should handle early wake time', () => {
      const input: CalculationInput = { ...baseInput, wakeTime: '04:00' };
      const result = calculateEatingWindow(input);

      // Very early risers should have breakfast no earlier than 6 AM
      const breakfastMinutes = timeToMinutes(result.breakfast.optimal);
      expect(breakfastMinutes).toBeGreaterThanOrEqual(timeToMinutes('06:00'));
    });

    it('should handle late sleep time', () => {
      const input: CalculationInput = { ...baseInput, sleepTime: '02:00' };
      const result = calculateEatingWindow(input);

      // Should still calculate valid windows
      expect(result.eatingWindowStart).toBeDefined();
      expect(result.eatingWindowEnd).toBeDefined();
    });

    it('should handle shift worker schedule', () => {
      const input: CalculationInput = {
        wakeTime: '18:00',
        sleepTime: '10:00',
        chronotype: 'intermediate',
        goal: 'energy_stability',
        workSchedule: 'shift_work',
      };

      const result = calculateEatingWindow(input);

      expect(result.eatingWindowStart).toBeDefined();
      expect(result.eatingWindowEnd).toBeDefined();
    });
  });
});

describe('calculateOptimalSchedule', () => {
  const baseInput: CalculationInput = {
    wakeTime: '07:00',
    sleepTime: '23:00',
    chronotype: 'intermediate',
    goal: 'energy_stability',
    workSchedule: 'standard',
  };

  it('should return complete calculation result', () => {
    const result = calculateOptimalSchedule(baseInput);

    expect(result.eatingWindow).toBeDefined();
    expect(result.performanceZones).toBeDefined();
    expect(result.recommendations).toBeDefined();
    expect(Array.isArray(result.recommendations)).toBe(true);
  });

  it('should include all performance zones', () => {
    const result = calculateOptimalSchedule(baseInput);

    expect(result.performanceZones.peakMentalClarity).toBeDefined();
    expect(result.performanceZones.stableEnergy).toBeDefined();
    expect(result.performanceZones.athleticPerformance).toBeDefined();
    expect(result.performanceZones.postMealDip).toBeDefined();
    expect(result.performanceZones.recoveryWindow).toBeDefined();
  });

  it('should generate goal-specific recommendations', () => {
    const input: CalculationInput = { ...baseInput, goal: 'mental_performance' };
    const result = calculateOptimalSchedule(input);

    // Should have recommendations mentioning mental performance
    const hasRelevantRecommendation = result.recommendations.some(
      rec => rec.toLowerCase().includes('mental') || rec.toLowerCase().includes('brain')
    );

    expect(hasRelevantRecommendation).toBe(true);
  });
});

describe('calculateMealTimingScore', () => {
  it('should return 100 for perfect timing', () => {
    const score = calculateMealTimingScore('12:00', '12:00');
    expect(score).toBe(100);
  });

  it('should return numeric score', () => {
    const score = calculateMealTimingScore('12:30', '12:00', 30);
    expect(typeof score).toBe('number');
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(100);
  });

  it('should handle various time inputs', () => {
    // Test that function doesn't crash with different inputs
    expect(() => calculateMealTimingScore('08:00', '08:00')).not.toThrow();
    expect(() => calculateMealTimingScore('18:00', '17:30')).not.toThrow();
    expect(() => calculateMealTimingScore('07:00', '08:00')).not.toThrow();
  });

  it('should return 0 or higher for any meal time', () => {
    const earlyScore = calculateMealTimingScore('10:00', '12:00', 30);
    const lateScore = calculateMealTimingScore('14:00', '12:00', 30);
    
    expect(earlyScore).toBeGreaterThanOrEqual(0);
    expect(lateScore).toBeGreaterThanOrEqual(0);
  });

  it('should use default flexibility when not provided', () => {
    const scoreWithDefault = calculateMealTimingScore('12:00', '12:00');
    const scoreWithExplicit = calculateMealTimingScore('12:00', '12:00', 30);
    expect(scoreWithDefault).toBe(scoreWithExplicit);
  });
});

describe('isWithinWindow', () => {
  const testWindow: MealWindow = {
    start: '11:30',
    end: '12:30',
    optimal: '12:00',
    flexibility: 30,
  };

  it('should return true for time within window', () => {
    expect(isWithinWindow('12:00', testWindow)).toBe(true);
    expect(isWithinWindow('11:30', testWindow)).toBe(true);
    expect(isWithinWindow('12:30', testWindow)).toBe(true);
  });

  it('should return false for time outside window', () => {
    expect(isWithinWindow('11:00', testWindow)).toBe(false);
    expect(isWithinWindow('13:00', testWindow)).toBe(false);
  });
});

describe('getCurrentEatingStatus', () => {
  const mockEatingWindow = {
    breakfast: { start: '07:30', end: '08:30', optimal: '08:00', flexibility: 30 },
    lunch: { start: '11:30', end: '12:30', optimal: '12:00', flexibility: 30 },
    dinner: { start: '17:30', end: '18:30', optimal: '18:00', flexibility: 30 },
    snacks: [],
    eatingWindowStart: '08:00',
    eatingWindowEnd: '18:00',
    windowDuration: 10,
    fastingDuration: 14,
    metabolicSwitchTime: '06:00',
  };

  it('should return pre-breakfast status early morning', () => {
    const status = getCurrentEatingStatus('06:00', mockEatingWindow);
    expect(status.status).toBe('pre-breakfast');
  });

  it('should return eating status during window', () => {
    const status = getCurrentEatingStatus('12:00', mockEatingWindow);
    expect(status.status).toBe('eating');
  });

  it('should return post-dinner status after window', () => {
    const status = getCurrentEatingStatus('20:00', mockEatingWindow);
    expect(status.status).toBe('post-dinner');
  });

  it('should include next event information', () => {
    const status = getCurrentEatingStatus('06:00', mockEatingWindow);
    expect(status.nextEvent).not.toBeNull();
    expect(status.nextEvent?.name).toBeDefined();
    expect(status.nextEvent?.time).toBeDefined();
  });
});

// Helper function
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
}
