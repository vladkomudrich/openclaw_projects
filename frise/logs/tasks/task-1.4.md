# Task 1.4: Create supporting calculation functions

## Completed: 2026-02-06T11:45:00Z

## Summary
Implemented supporting calculations for melatonin window, optimal bedtime, and sleep debt.

## Files Modified
- `src/lib/calculations/index.ts` - Added supporting functions

## Functions Implemented

### Melatonin Window
- `calculateMelatoninWindow(idealBedtime)`
- Returns start and end times
- 2 hours before ideal bedtime

### Optimal Bedtime
- `calculateOptimalBedtime(wakeTime, idealSleepMinutes)`
- Calculates based on ideal sleep duration
- Uses next day's wake time as reference

### Sleep Debt
- `calculateSleepDebt(sleepEntries, idealSleepMinutes)`
- Cumulative calculation over entry history
- Returns total debt, average sleep, status

### Day Insights
- `generateDayInsights(sleepEntry, allEntries, idealSleepMinutes)`
- Combines all calculations into dashboard insights

## Acceptance Criteria Met
- [x] calculateMelatoninWindow returns start/end times
- [x] calculateOptimalBedtime based on melatonin window
- [x] calculateSleepDebt with 14-day history support
- [x] Functions return sensible defaults
