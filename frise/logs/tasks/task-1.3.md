# Task 1.3: Create productivity curve generator

## Completed: 2026-02-06T11:44:00Z

## Summary
Implemented productivity curve generation with 5-minute granularity from 5 AM to 1 AM.

## Files Modified
- `src/lib/calculations/index.ts` - Added curve generation functions

## Functions Implemented
- `calculateProductivityCurve(sleepEntry, targetDate)` - Main curve generator
- `getProductivityZone(value, isAsleep)` - Zone classification
- `findPeakWindow(points)` - Find best productivity window
- `getCurrentProductivity(points, currentTime)` - Get current position

## Curve Specifications
- Time range: 5 AM - 1 AM (20-hour window)
- Granularity: 5-minute intervals (240 points)
- Values: 0-100 normalized productivity
- Zones: sleep, low, moderate, good, peak, winddown

## Zone Thresholds
- Peak: 80-100%
- Good: 60-80%
- Moderate: 30-60%
- Low: 0-30%

## Acceptance Criteria Met
- [x] Returns array of ProductivityPoints for 5 AM - 1 AM
- [x] 5-minute interval granularity
- [x] Productivity values 0-100 normalized
- [x] Handles various sleep patterns
