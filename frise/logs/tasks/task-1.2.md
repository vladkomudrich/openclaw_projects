# Task 1.2: Implement Two-Process Model calculations

## Completed: 2026-02-06T11:43:00Z

## Summary
Implemented core sleep science calculations based on Borbély's Two-Process Model.

## Files Created
- `src/lib/calculations/index.ts` - All calculation functions

## Functions Implemented

### Process S (Sleep Homeostasis)
- `calculateProcessS(hoursAwake, sleepDurationHours)`
- Models sleep pressure buildup during waking
- Uses exponential decay function
- Accounts for sleep debt

### Process C (Circadian Rhythm)
- `calculateProcessC(hourOfDay)`
- 24-hour sinusoidal rhythm
- Includes post-lunch dip (12-hour harmonic)
- Peak alertness around 10 AM and 6 PM

### Combined Productivity
- `calculateProductivity(hourOfDay, hoursAwake, sleepDurationHours)`
- Combines Process S and Process C
- Returns 0-100 normalized value
- Weighted combination (60% circadian, 40% homeostatic)

## Constants Used
- TAU = 24 hours (circadian period)
- Sleep pressure time constant = 4.2 hours
- Wake pressure time constant = 18.2 hours

## Acceptance Criteria Met
- [x] calculateProcessS function (sleep homeostasis)
- [x] calculateProcessC function (circadian rhythm)
- [x] Combined productivity formula implementation
- [x] Functions handle timezone correctly
