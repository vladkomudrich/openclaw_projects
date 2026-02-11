# FuelTime Chrononutrition Algorithms

## Scientific Foundation

### Core Principles

1. **Circadian Regulation of Metabolism**
   - Central clock (SCN in brain) controls sleep/wake cycles
   - Peripheral clocks (liver, pancreas, gut) regulate metabolism
   - Light entrains central clock, food timing entrains peripheral clocks
   - Misalignment causes metabolic dysfunction

2. **Glucose Tolerance Decline**
   - Highest in morning (7-10 AM): 100% baseline
   - Midday (12-2 PM): ~90% of morning
   - Evening (6-8 PM): ~70-80% of morning
   - Late night (10 PM+): ~50-60% of morning

3. **Insulin Sensitivity Pattern**
   - Peak: 7-10 AM
   - Gradual decline through day
   - Evening: 50%+ reduction from morning peak

4. **Time-Restricted Eating (TRE) Research**
   - 8-10 hour windows: Optimal adherence + benefits
   - <8 hours: Greater benefits but lower adherence
   - >12 hours: Minimal metabolic benefits
   - Consistency is critical

## Algorithm Formulas

### Eating Window Duration

```
windowDuration = getWindowDurationByGoal(goal)

where:
  metabolic_health → 8 hours
  athletic_performance → 10 hours
  mental_performance → 10 hours
  energy_stability → 10 hours
  flexibility → 12 hours
```

### Optimal Breakfast Time

```
optimalBreakfast = wakeTime + baseOffset + chronotypeAdjustment

where:
  baseOffset = 60 minutes (within 1-2 hours of wake)
  
  chronotypeAdjustment:
    morning → -30 minutes
    intermediate → 0 minutes
    evening → +30 minutes
```

### Optimal Dinner Time

```
maxDinnerTime = sleepTime - 180 minutes (3 hours before bed)
calculatedDinner = optimalBreakfast + windowDuration

optimalDinner = min(calculatedDinner, maxDinnerTime)
```

### Lunch Time Calculation

```
optimalLunch = optimalBreakfast + 240 minutes (4 hours after breakfast)

Lunch window: optimalLunch ± 30 minutes
```

### Snack Windows

```
if windowDuration >= 10:
  morningSnack = optimalBreakfast + 150 minutes (2.5h after breakfast)
  afternoonSnack = optimalLunch + 150 minutes (2.5h after lunch)
```

### Metabolic Switch Time

```
metabolicSwitchTime = previousDinner + 720 minutes (12 hours into fast)

This is when:
- Glycogen stores depleted
- Fat oxidation increases
- Autophagy begins
```

### Performance Zones

```
peakMentalClarity:
  start = optimalBreakfast + 60 minutes
  end = optimalBreakfast + 180 minutes
  (1-3 hours post-breakfast, high glucose tolerance)

stableEnergy:
  start = optimalLunch + 30 minutes
  end = optimalLunch + 120 minutes
  (Post-lunch sustained energy)

athleticPerformance:
  start = optimalDinner - 180 minutes
  end = optimalDinner - 60 minutes
  (Late afternoon, body temperature peak)

postMealDip:
  start = optimalLunch + 30 minutes
  end = optimalLunch + 90 minutes
  (Avoid demanding cognitive work)
```

### Timing Score Calculation

```
mealTimingScore = max(0, 100 - (deviationMinutes * penaltyPerMinute))

where:
  deviationMinutes = |actualTime - optimalTime|
  penaltyPerMinute = 2 (lose 2 points per minute deviation)
  
  Example: 15 minutes early = 100 - (15 * 2) = 70 points

dailyScore = weighted average of:
  - breakfastScore (weight: 0.35)
  - lunchScore (weight: 0.25)
  - dinnerScore (weight: 0.30)
  - windowAdherence (weight: 0.10)
```

### Window Adherence Score

```
windowAdherenceScore:
  100 = All meals within optimal windows
  80 = One meal slightly outside (within 30 min)
  60 = One meal significantly outside (30-60 min)
  40 = Multiple meals outside window
  20 = Eating outside designated window
```

## Goal-Specific Optimizations

### Mental Performance
- Earlier breakfast (maximize morning glucose tolerance)
- Lighter lunch (avoid afternoon cognitive dip)
- Front-load carbs to breakfast
- 3-5 hour meal spacing

### Energy Stability
- Consistent timing daily (±30 minutes)
- 4-5 eating episodes
- Balanced macros each meal
- Avoid large meals

### Metabolic Health
- 8-10 hour eating window
- Early eating (finish by 6-7 PM)
- 14-16 hour overnight fast
- Carbs primarily at breakfast/lunch

### Athletic Performance
- Protein distributed throughout day
- Pre-workout: 1-2 hours before
- Post-workout: Within 30-60 min
- Dinner: carb+protein for recovery

## Edge Cases

### Very Early Risers (4-5 AM)
- Delay breakfast to 6 AM minimum
- Body still warming up
- Digestive system not fully active

### Night Owls (Sleep after 1 AM)
- Maximum dinner time: 10 PM
- Even late sleepers need fasting period
- Recommend shifting schedule if possible

### Shift Workers
- Align eating with "active" period
- Even 12-hour windows better than random
- Consistency within shift type

## References

1. Chaix et al. (2019). "Time-restricted eating to prevent and manage chronic metabolic diseases." Annual Review of Nutrition
2. Leung et al. (2020). "Time of day difference in postprandial glucose and insulin responses." Chronobiology International
3. Adafer et al. (2020). "Food timing, circadian rhythm and chrononutrition." Nutrients
4. Manoogian et al. (2022). "Time-restricted eating for prevention and management of metabolic diseases." Endocrine Reviews
5. Panda, S. (2016). "Circadian physiology of metabolism." Science
