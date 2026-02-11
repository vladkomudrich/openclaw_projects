/**
 * Validation Schemas Tests
 */
import { describe, it, expect } from 'vitest';
import {
  chronotypeSchema,
  userGoalSchema,
  mealTypeSchema,
  timeSchema,
  validateMealLog,
  validateCalculationInput,
} from './schemas';

// Import the time schema for testing
const timeSchemaForTest = timeSchema;

describe('Time Schema', () => {
  it('should accept valid time formats', () => {
    expect(timeSchemaForTest.safeParse('00:00').success).toBe(true);
    expect(timeSchemaForTest.safeParse('12:30').success).toBe(true);
    expect(timeSchemaForTest.safeParse('23:59').success).toBe(true);
  });

  it('should reject invalid time formats', () => {
    expect(timeSchemaForTest.safeParse('24:00').success).toBe(false);
    expect(timeSchemaForTest.safeParse('12:60').success).toBe(false);
    expect(timeSchemaForTest.safeParse('1:30').success).toBe(false);
    expect(timeSchemaForTest.safeParse('12:3').success).toBe(false);
    expect(timeSchemaForTest.safeParse('invalid').success).toBe(false);
  });
});

describe('Chronotype Schema', () => {
  it('should accept valid chronotypes', () => {
    expect(chronotypeSchema.safeParse('morning').success).toBe(true);
    expect(chronotypeSchema.safeParse('intermediate').success).toBe(true);
    expect(chronotypeSchema.safeParse('evening').success).toBe(true);
  });

  it('should reject invalid chronotypes', () => {
    expect(chronotypeSchema.safeParse('early').success).toBe(false);
    expect(chronotypeSchema.safeParse('night').success).toBe(false);
  });
});

describe('User Goal Schema', () => {
  it('should accept valid goals', () => {
    expect(userGoalSchema.safeParse('mental_performance').success).toBe(true);
    expect(userGoalSchema.safeParse('energy_stability').success).toBe(true);
    expect(userGoalSchema.safeParse('athletic_performance').success).toBe(true);
    expect(userGoalSchema.safeParse('metabolic_health').success).toBe(true);
    expect(userGoalSchema.safeParse('flexibility').success).toBe(true);
  });

  it('should reject invalid goals', () => {
    expect(userGoalSchema.safeParse('weight_loss').success).toBe(false);
    expect(userGoalSchema.safeParse('muscle_gain').success).toBe(false);
  });
});

describe('Meal Type Schema', () => {
  it('should accept valid meal types', () => {
    expect(mealTypeSchema.safeParse('breakfast').success).toBe(true);
    expect(mealTypeSchema.safeParse('lunch').success).toBe(true);
    expect(mealTypeSchema.safeParse('dinner').success).toBe(true);
    expect(mealTypeSchema.safeParse('snack').success).toBe(true);
  });

  it('should reject invalid meal types', () => {
    expect(mealTypeSchema.safeParse('brunch').success).toBe(false);
    expect(mealTypeSchema.safeParse('supper').success).toBe(false);
  });
});

describe('validateMealLog', () => {
  it('should validate a complete meal log', () => {
    const result = validateMealLog({
      id: 'test-123',
      timestamp: new Date().toISOString(),
      mealType: 'breakfast',
      size: 'moderate',
      macroBalance: 'balanced',
      energyBefore: 3,
      withinWindow: true,
      timingScore: 95,
    });

    expect(result.success).toBe(true);
  });

  it('should validate a minimal meal log', () => {
    const result = validateMealLog({
      id: 'test-123',
      timestamp: new Date().toISOString(),
      mealType: 'lunch',
      withinWindow: true,
      timingScore: 85,
    });

    expect(result.success).toBe(true);
  });

  it('should reject meal log with invalid timing score', () => {
    const result = validateMealLog({
      id: 'test-123',
      timestamp: new Date().toISOString(),
      mealType: 'dinner',
      withinWindow: false,
      timingScore: 150, // Invalid: > 100
    });

    expect(result.success).toBe(false);
  });

  it('should reject meal log with invalid energy level', () => {
    const result = validateMealLog({
      id: 'test-123',
      timestamp: new Date().toISOString(),
      mealType: 'snack',
      energyBefore: 10, // Invalid: > 5
      withinWindow: true,
      timingScore: 80,
    });

    expect(result.success).toBe(false);
  });
});

describe('validateCalculationInput', () => {
  it('should validate valid calculation input', () => {
    const result = validateCalculationInput({
      wakeTime: '07:00',
      sleepTime: '23:00',
      chronotype: 'intermediate',
      goal: 'energy_stability',
      workSchedule: 'standard',
    });

    expect(result.success).toBe(true);
  });

  it('should validate input with optional window duration', () => {
    const result = validateCalculationInput({
      wakeTime: '06:00',
      sleepTime: '22:00',
      chronotype: 'morning',
      goal: 'metabolic_health',
      workSchedule: 'standard',
      windowDuration: 8,
    });

    expect(result.success).toBe(true);
  });

  it('should reject invalid wake time format', () => {
    const result = validateCalculationInput({
      wakeTime: '7:00', // Invalid: should be 07:00
      sleepTime: '23:00',
      chronotype: 'intermediate',
      goal: 'energy_stability',
      workSchedule: 'standard',
    });

    expect(result.success).toBe(false);
  });

  it('should reject invalid window duration', () => {
    const result = validateCalculationInput({
      wakeTime: '07:00',
      sleepTime: '23:00',
      chronotype: 'intermediate',
      goal: 'energy_stability',
      workSchedule: 'standard',
      windowDuration: 16, // Invalid: not 8, 10, or 12
    });

    expect(result.success).toBe(false);
  });
});
