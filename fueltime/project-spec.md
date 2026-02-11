# FuelTime - Project Documentation

> **Fuel your peak performance with science-based meal timing**

## Table of Contents
1. [Project Overview](#project-overview)
2. [Core Concept](#core-concept)
3. [Scientific Foundation](#scientific-foundation)
4. [Business Philosophy](#business-philosophy)
5. [Target Audience](#target-audience)
6. [Technical Architecture](#technical-architecture)
7. [Feature Specifications](#feature-specifications)
8. [User Experience Flows](#user-experience-flows)
9. [Design System](#design-system)
10. [Implementation Roadmap](#implementation-roadmap)
11. [Future Enhancements](#future-enhancements)
12. [Success Metrics](#success-metrics)

---

## Project Overview

**FuelTime** is a free, web-based meal timing optimizer that helps users align their eating patterns with their circadian rhythms for peak performance, energy, and metabolic health. Using chrononutrition science, it provides personalized eating windows and meal timing recommendations.

### Vision Statement
Empower users to optimize their energy, cognitive performance, and metabolic health by eating at the right times—making chrononutrition accessible, actionable, and effortless.

### Key Differentiators
- **Science-backed**: Based on chrononutrition research and circadian rhythm science
- **Instant recommendations**: Personalized eating windows from first input
- **Performance-focused**: Optimizes for energy and cognitive function, not just weight
- **No tracking required**: Focus on when, not what or how much
- **Privacy-first**: Local storage, no authentication initially

---

## Core Concept

### The Chrononutrition Revolution
FuelTime applies cutting-edge chrononutrition research showing that **when** you eat is as important as **what** you eat. By aligning meals with your body's natural circadian rhythms, users can:

- Boost cognitive performance and focus
- Stabilize energy throughout the day
- Improve metabolic health and glucose control
- Enhance sleep quality
- Optimize athletic performance

### Core Outputs
Based on user input (wake time, sleep time, chronotype, goals), FuelTime calculates:

- **Optimal eating window**: 8-12 hour time-restricted eating period
- **Meal timing recommendations**: Best times for breakfast, lunch, dinner, snacks
- **Performance zones**: When to eat for mental clarity, physical energy, or recovery
- **Glucose-friendly schedule**: Optimal carbohydrate timing
- **Fasting benefits**: Extended overnight fast duration and metabolic switch timing

### The Science in Simple Terms
Your body's internal clock controls:
- When you're most insulin-sensitive (morning = best glucose tolerance)
- When digestive enzymes peak (midday)
- When metabolism slows (evening/night)

Eating against these rhythms leads to poor metabolic health, energy crashes, and decreased performance. FuelTime realigns your eating with your biology.

---

## Scientific Foundation

### Chrononutrition Research Base

**Key Scientific Principles:**

1. **Circadian Regulation of Metabolism**
   - Central clock (SCN in brain) and peripheral clocks (liver, pancreas, gut)
   - Light entrains central clock, food timing entrains peripheral clocks
   - Misalignment causes metabolic dysfunction

2. **Glucose Tolerance Declines Through Day**
   - Highest in morning (7-10 AM)
   - Decreases steadily afternoon and evening
   - Same meal eaten at night causes higher glucose spike than morning

3. **Insulin Sensitivity Follows Circadian Pattern**
   - Peak in morning hours
   - Declines 50%+ by evening
   - Late eating impairs insulin response

4. **Time-Restricted Eating (TRE) Benefits**
   - 8-10 hour eating windows show optimal adherence and benefits
   - Shorter windows (6 hours) = greater weight loss but lower adherence
   - 12+ hour windows show minimal benefits
   - Consistency is critical—irregular eating worse than no restriction

5. **Cognitive Performance and Meal Timing**
   - Breakfast eating improves memory, attention, executive function
   - Breakfast skipping impairs cognitive performance by 15-20%
   - Large meals impair subsequent cognitive tasks
   - Balanced protein+complex carbs sustain mental performance

6. **Early vs Late Eating**
   - Early TRE (8 AM - 4 PM) superior for metabolic health
   - Late TRE (12 PM - 8 PM) less effective but more practical
   - Evening eating associated with worse sleep, higher fat storage

### Research-Based Recommendations

**Optimal Daily Eating Pattern:**
- **Breakfast**: Within 1-2 hours of waking (critical for glucose control)
- **Lunch**: Midday (12-1 PM) when digestive capacity peaks
- **Dinner**: Early evening (6-7 PM), at least 2-3 hours before bed
- **Eating Window**: 8-10 hours for most people
- **Overnight Fast**: Minimum 12 hours, optimal 14-16 hours

**Performance-Optimized Timing:**
- **Mental tasks**: Morning (post-breakfast, high glucose tolerance)
- **Physical performance**: Late afternoon (body temperature peak)
- **Protein for muscle**: Distributed throughout day
- **Carbohydrates**: Front-load to morning/midday
- **Large meals**: Avoid within 3 hours of important cognitive work

---

## Business Philosophy

### Taleb-Inspired Principles

**Antifragility**
- Help users build resilient eating patterns that adapt to life
- Learn from deviations to improve recommendations
- Benefit from stress (occasional schedule disruptions teach flexibility)

**Skin in the Game**
- Product must deliver real performance improvements users can feel
- Transparent science—explain the "why" behind recommendations
- Monetize only after proving value

**Multiple Revenue Streams** (Future)
- Meal kit delivery partnerships (aligned with optimal timing)
- Nutrition supplement affiliate (personalized to their schedule)
- Premium features (advanced analytics, coach integration)
- Corporate wellness programs

**Limited Downside**
- No calorie counting = less psychological burden
- Focus on timing = simpler than macro tracking
- Local storage = no server costs
- Progressive web app = no app store dependencies

**Remove Complexity**
- Simplest intervention: when, not what
- No food logging required initially
- One daily input: when did you eat?
- Automatic recommendations

### Monetization Strategy (Deferred)

**Phase 1 (Months 1-6): Product-Market Fit**
- Free app, build engaged user base
- Focus on retention and habit formation
- Collect user feedback and success stories

**Phase 2 (Months 6-12): Soft Monetization**
- Affiliate partnerships:
  - Meal kit services (HelloFresh, Factor) with timing-optimized delivery
  - Nutrition brands (protein powders, supplements matched to schedule)
  - Fitness trackers (Oura Ring, Whoop) integration partnerships
- Non-intrusive banner ads
- "Powered by FuelTime" scheduling for restaurants

**Phase 3 (Year 2+): Premium Features**
- Advanced analytics and trends
- Integration with Frise (sleep + meals holistic view)
- Nutrition coaching marketplace
- Custom meal plans with recipes
- Corporate wellness licensing

---

## Target Audience

### Primary Users

**Performance Optimizers**
- Knowledge workers wanting better focus
- Students optimizing study performance
- Entrepreneurs maximizing productivity
- Athletes improving training outcomes

**Health-Conscious Individuals**
- People struggling with energy crashes
- Intermittent fasting practitioners
- Metabolic health improvers (pre-diabetes, insulin resistance)
- Weight management seekers

**Shift Workers & Travelers**
- People with irregular schedules
- Frequent flyers managing jet lag
- Night shift workers optimizing eating
- Remote workers with flexible schedules

### User Needs
- Stable energy without crashes
- Better mental clarity and focus
- Simple, sustainable eating structure
- Science-backed without being overwhelming
- Flexibility for social life and special occasions

### User Pain Points FuelTime Solves
- "I eat healthy but still crash at 2 PM"
- "I don't know when to eat for best performance"
- "Calorie counting is exhausting"
- "I skip breakfast but feel sluggish"
- "I eat late and sleep poorly"
- "My energy is unpredictable"

---

## Technical Architecture

### Tech Stack

#### Frontend Framework
- **Next.js 14+** (App Router)
  - SEO optimization for educational content
  - Server-side rendering for blog
  - Easy future backend integration
  - API routes for future meal kit API connections

#### UI Framework
- **Hero UI v2**
  - Modern, clean components
  - Excellent form controls for time inputs
  - Responsive out of the box
  - Accessible by default

#### Styling
- **Tailwind CSS** (via Hero UI)
- **Color Palette**: Energizing, food-inspired
  - Primary: Vibrant greens (growth, health, energy)
  - Accents: Warm oranges (energy, vitality)
  - Gradients: Sunrise/sunset themes (circadian alignment)

#### State Management
- **React Hooks**: useState, useEffect, useContext
- **Context Providers**: Eating schedule, user preferences, goals
- Minimal complexity initially

#### Data Persistence
- **localStorage API**
  - Store user schedule and preferences
  - Meal timing history (30 days)
  - No backend initially
  - Export/import functionality

#### Visualization
- **Recharts** or custom SVG
  - Daily eating window timeline
  - Weekly pattern views
  - Performance correlation charts (future)

#### Date/Time Handling
- **Luxon** or **date-fns**
  - Timezone calculations
  - Meal time scheduling
  - Window duration math

#### PWA Configuration
- **next-pwa**
  - Installable app
  - Offline meal schedule access
  - Push notifications for meal timing

#### Future Integrations (Post-MVP)
- **Meal Kit APIs**: HelloFresh, Factor, Freshly
- **Nutrition APIs**: USDA FoodData Central (future food logging)
- **Fitness APIs**: Oura, Whoop, Apple Health (cross-app optimization)

### Chrononutrition Calculation Engine

**Input Variables:**
- Wake time
- Sleep time
- Chronotype (morning person, night owl, intermediate)
- Primary goal (performance, weight management, metabolic health, energy)
- Work schedule type (standard, shift work, flexible)
- Exercise timing (if relevant)

**Calculation Logic:**
```javascript
// Pseudocode for optimal eating window calculation
function calculateOptimalEatingWindow(userProfile) {
  const { wakeTime, sleepTime, chronotype, goal } = userProfile;
  
  // Base calculation: align with circadian rhythm
  const optimalBreakfast = wakeTime + 1hour; // Within 1-2 hours of wake
  
  // Determine eating window duration based on goal
  let windowDuration;
  if (goal === 'metabolic_health') windowDuration = 8; // Aggressive TRE
  if (goal === 'performance') windowDuration = 10; // Balanced
  if (goal === 'flexibility') windowDuration = 12; // Minimal restriction
  
  // Calculate end of eating window
  const dinnerTime = optimalBreakfast + windowDuration;
  
  // Adjust for chronotype
  if (chronotype === 'morning') {
    optimalBreakfast -= 30min;
    dinnerTime -= 30min;
  } else if (chronotype === 'evening') {
    optimalBreakfast += 30min;
    dinnerTime += 30min;
  }
  
  // Ensure dinner is 3+ hours before sleep
  const maxDinner = sleepTime - 3hours;
  const adjustedDinner = Math.min(dinnerTime, maxDinner);
  
  // Calculate meal timings
  return {
    breakfastWindow: [optimalBreakfast - 30min, optimalBreakfast + 30min],
    lunchWindow: [optimalBreakfast + 4hours, optimalBreakfast + 5hours],
    dinnerWindow: [adjustedDinner - 1hour, adjustedDinner],
    snackWindows: calculateSnackTimings(),
    eatingWindowStart: optimalBreakfast,
    eatingWindowEnd: adjustedDinner,
    fastingDuration: 24 - windowDuration,
    metabolicSwitchTime: optimalBreakfast - 2hours // ~12 hours into fast
  };
}

function calculatePerformanceZones(eatingWindow) {
  return {
    peakMentalClarity: eatingWindow.breakfast + [1hour, 3hours],
    stableEnergy: eatingWindow.lunch + [30min, 2hours],
    athleticPerformance: eatingWindow.dinner - 2hours,
    avoidCognitiveWork: eatingWindow.dinner + [0, 2hours] // Post-meal dip
  };
}
```

**Optimization Factors:**
- Earlier eating windows prioritized for metabolic health
- Meal spacing of 3-5 hours for glucose stability
- Carb-heavy meals earlier in day
- Protein distributed throughout eating window
- Pre-bed fasting minimum 3 hours

---

## Feature Specifications

### MVP Features (Version 1.0)

#### 1. Onboarding Flow

**Welcome Screen**
- **Headline**: "Eat at the right time, feel amazing all day"
- **Subheadline**: "Science-based meal timing for peak energy and performance"
- **Visual**: Clean food/clock iconography, energizing colors
- **CTA**: "Get my eating schedule"

**Quick Profile (Progressive)**

**Step 1: Schedule Basics**
- "When do you usually wake up?" (time picker)
- "When do you usually go to sleep?" (time picker)
- Auto-calculates current eating window duration

**Step 2: Your Chronotype** (Optional, skip to defaults)
- "Are you a morning person or night owl?"
- ☀️ Morning person (wake naturally before 7 AM, peak energy AM)
- 🌤️ Somewhere in between
- 🌙 Night owl (prefer late nights, peak energy PM)

**Step 3: Your Primary Goal**
- What's most important to you?
- 🎯 Better focus and mental performance
- ⚡ Stable energy throughout the day
- 🏃 Athletic performance
- 💪 Metabolic health / weight management
- 🧘 Overall wellness

**Step 4: Work Schedule** (Optional)
- Standard 9-5
- Shift work (specify shifts)
- Flexible schedule
- Variable / no set schedule

**Instant Results**
- Immediately show personalized eating window after Step 1
- Refine with optional steps 2-4
- Can skip and adjust in settings later

**Tutorial Overlay** (Dismissible, 15 seconds total)
1. "This is your optimal eating window"
2. "Green zones = best times to eat"
3. "Tap any meal for timing tips"
4. "Track one meal today to see your pattern"

#### 2. Main Dashboard

**Hero Section: Eating Window Timeline**

*Visual Design:*
- **24-Hour Timeline**: Horizontal bar from midnight to midnight
- **Sleep Zones**: Grayed out (before wake, after sleep)
- **Fasting Zone**: Cool blue gradient (metabolic benefits)
- **Eating Window**: Warm green-to-orange gradient (active fueling)
- **Current Time**: Animated vertical indicator with label

*Key Markers:*
- 🌅 **Breakfast Window**: Highlighted zone with icon
- 🥗 **Lunch Window**: Highlighted zone with icon
- 🍽️ **Dinner Window**: Highlighted zone with icon
- 🍎 **Snack Windows**: Smaller markers (if applicable)
- 🔥 **Metabolic Switch**: Small badge at ~12-hour fast mark

*Interactive Elements:*
- **Tap/Hover Zones**: Shows detailed info
  - Breakfast: "Peak glucose tolerance—best time for complex carbs"
  - Lunch: "Midday energy maintenance—balanced meal"
  - Dinner: "Light dinner for better sleep—stop 3 hours before bed"
  - Fasting: "Autophagy active—fat burning mode"

**Performance Insights Cards**

Stacked cards showing:

**🧠 Mental Performance Zone**
- "Best focus time: 9:30 AM - 12:30 PM"
- "Avoid heavy meals 1 hour before deep work"

**⚡ Energy Stability**
- "Eating window: 8 AM - 6 PM (10 hours)"
- "Fasting: 6 PM - 8 AM (14 hours)"
- "Metabolic switch: 6 AM ✓"

**🎯 Today's Timing Score**
- Visual indicator (0-100)
- "Great! 92% aligned with circadian rhythm"
- Based on user's logged meals (if tracking)

**📊 Week Overview** (Future)
- Mini calendar showing consistency
- Streak indicators

**Quick Actions**

Simple logging interface:
- "Log a meal" button
  - Quick tap: Mark meal time as "now"
  - Custom: Pick specific time
  - Meal type: Breakfast / Lunch / Dinner / Snack
  - Optional: Add note (energy level, hunger, performance)

**Contextual Advice Feed**

Rotating science-backed tips:
- "Eating breakfast within 2 hours of waking improves mental performance by 15-20%"
- "Your glucose tolerance is highest right now—perfect time for complex carbs"
- "3 hours until dinner window closes—plan your last meal"
- "You're approaching 12 hours fasted—metabolic benefits active!"

Personalized, time-aware, educational

#### 3. Meal Logging (Optional But Encouraged)

**Simple Meal Tracker**

Philosophy: Track timing, not calories
- **Quick Log**: "Ate breakfast" → timestamp
- **Detailed** (optional):
  - Meal size (light/moderate/hearty)
  - Dominant macros (carb-heavy/balanced/protein-heavy)
  - How you felt (energy level 1-5)

**Why Log?**
- See patterns between timing and energy
- Get timing accuracy score
- Unlock weekly insights
- Future: correlate with sleep data (Frise integration)

**Pattern Recognition** (After 7+ days)
- "You tend to eat dinner late on weekends—notice any differences in sleep?"
- "Your energy is highest when breakfast is 8-9 AM"
- "Eating window drift detected—try alarm reminders"

#### 4. Educational Content

**Learn Section**

Bite-sized science articles:
- "What is chrononutrition?"
- "Why breakfast timing matters for your brain"
- "The metabolic switch: what happens during fasting"
- "Early vs late eating: what the research shows"
- "Optimizing performance with meal timing"
- "Your chronotype and optimal eating schedule"

Clean, visual, scannable format

**Timing Tips Library**

Searchable database:
- Best times for different nutrients
- Pre-workout nutrition timing
- Post-workout refueling window
- Study session fueling
- Travel and jet lag eating
- Shift work nutrition strategies

#### 5. Settings & Customization

**Profile Management**
- Adjust wake/sleep times
- Update chronotype
- Change primary goal
- Work schedule modifications

**Eating Window Preferences**
- Duration: 8 / 10 / 12 hours
- Flexibility: Strict / Moderate / Flexible
- Weekend adjustment: Same as weekdays / +1 hour / Custom

**Notifications**
- Eating window opening reminder
- Meal timing suggestions
- Window closing warning (1 hour before)
- Weekly summary

**Data Management**
- Export eating history (JSON/CSV)
- Import previous data
- Clear all data
- Privacy settings

#### 6. Recommendations Engine

**Meal Timing Recommendations** (Based on goals)

For **Mental Performance**:
- Breakfast within 1 hour of wake
- Light snack before focus sessions
- Avoid large lunches (causes afternoon slump)
- Front-load carbs to morning

For **Energy Stability**:
- Consistent meal times daily (±30 min)
- 4-5 eating episodes
- Balanced macros each meal
- 3-5 hour spacing

For **Metabolic Health**:
- 8-10 hour eating window
- Early eating (finish by 6-7 PM)
- 14-16 hour overnight fast
- Carbs primarily at breakfast/lunch

For **Athletic Performance**:
- Protein distributed throughout day
- Pre-workout: 1-2 hours before
- Post-workout: Within 30-60 min
- Dinner: carb+protein for recovery

**Smart Adjustments**

The app learns and suggests:
- "Your meetings often run into lunch—shift window 30 min later?"
- "Weekend eating drifts 2 hours later—adjust schedule or stick to weekday timing?"
- "Noticed low energy after late dinners—try moving dinner earlier?"

---

### Future Features (Post-MVP)

#### Phase 2 (v1.1-1.3)
- **Meal planning integration**
  - Recipe suggestions timed to windows
  - Grocery lists
  - Meal prep scheduling
- **Advanced analytics**
  - Energy pattern correlation
  - Performance tracking
  - Sleep quality crossover (Frise integration)
- **Social features**
  - Share your schedule
  - Eating window challenges with friends
  - Community insights

#### Phase 3 (v2.0)
- **Full food logging** (optional)
  - Photo-based logging
  - Macro tracking aligned with timing
  - Nutrient distribution optimization
- **Meal kit partnerships**
  - Delivery timed to your windows
  - Recipes matched to meal timing goals
  - Automated ordering
- **Coach marketplace**
  - Connect with nutrition coaches
  - Personalized timing strategies
  - Accountability partnerships

#### Phase 4 (v3.0)
- **Frise Integration**
  - Unified sleep + meal timing optimization
  - Circadian rhythm master view
  - Cross-influence insights ("late eating impacting your sleep debt")
- **Fitness tracker sync**
  - Oura Ring, Whoop, Apple Watch
  - Exercise timing optimization
  - Recovery meal timing
- **Corporate wellness**
  - Team challenges
  - Company-wide optimization
  - Productivity metrics

---

## User Experience Flows

### First-Time User Journey

```
1. Land on welcome screen
↓
2. "Get my eating schedule" CTA (5 seconds)
↓
3. Enter wake time → sleep time
↓
4. See eating window visualization IMMEDIATELY (wow moment!)
↓
5. Optional: Chronotype question
↓
6. Optional: Primary goal selection
↓
7. Personalized dashboard appears
↓
8. Tutorial overlay (15 seconds, skippable)
↓
9. "Log your next meal to start tracking"
↓
10. Notification permission request (optional)
```

**Time to value: <30 seconds**

### Daily Returning User Journey

**Morning**
```
1. Wake up
↓
2. Notification: "Breakfast window opening in 30 minutes"
↓
3. Open app → Check eating window
↓
4. See "optimal breakfast time: 7:30-8:30 AM"
↓
5. Eat breakfast at 8:00 AM
↓
6. Quick log: "Breakfast" button
```

**Throughout Day**
```
Check app periodically:
- "Am I in a good eating window?"
- "Should I have a snack now?"
- "When should I stop eating tonight?"

Quick glances at timeline for guidance
```

**Evening**
```
1. Notification: "Eating window closes in 1 hour"
↓
2. Plan last meal
↓
3. Log dinner
↓
4. See fasting timer begin
↓
5. "Great job! 14-hour fast until breakfast"
```

**Daily engagement: 2-4 minutes**

### Scenario: Business Traveler

**Before Trip**
```
User: "I'm traveling to Tokyo next week"
↓
App: Shows jet lag eating strategy
↓
- 2 days before: Start shifting eating window 1 hour earlier
- Flight day: Eat according to destination time
- Arrival: Immediate alignment with local breakfast
```

**During Trip**
```
User sets new timezone
↓
App recalculates eating window for local time
↓
Provides adjusted meal timing
↓
Helps minimize jet lag impact
```

---

## Design System

### Brand Identity: Energizing & Natural

**Core Values**
- Vitality
- Clarity
- Natural rhythms
- Scientific credibility
- Empowerment

### Color Palette

**Primary Colors**
- **Fresh Green**: `#4CAF50` - Growth, health, eating window
- **Energy Green**: `#66BB6A` - Active fueling zones
- **Vibrant Lime**: `#9CCC65` - Peak performance markers

**Accent Colors**
- **Sunrise Orange**: `#FF9800` - Morning energy, breakfast
- **Golden Yellow**: `#FFC107` - Midday vitality, lunch
- **Sunset Orange**: `#FF5722` - Evening meals, dinner

**Fasting/Recovery**
- **Deep Blue**: `#1976D2` - Overnight fasting zone
- **Calm Blue**: `#42A5F5` - Metabolic switch, recovery
- **Ice Blue**: `#64B5F6` - Rest and restoration

**Neutral Palette**
- **Background**: `#FAFAFA` (Off-white)
- **Surface**: `#FFFFFF` (Pure white cards)
- **Border**: `#E0E0E0` (Soft gray)
- **Text Primary**: `#212121` (Deep charcoal)
- **Text Secondary**: `#757575` (Medium gray)

**Status Colors**
- **On Track**: `#4CAF50` (Green - aligned with schedule)
- **Warning**: `#FF9800` (Orange - eating outside window)
- **Needs Attention**: `#F44336` (Red - pattern concerns)

**Timeline Gradients**
- Eating window: `linear-gradient(90deg, #4CAF50, #FF9800)` (green to orange)
- Fasting zone: `linear-gradient(90deg, #1976D2, #42A5F5)` (deep to calm blue)

### Typography

**Font Family**
- **Primary**: Poppins, system-ui, sans-serif (modern, friendly)
- **Alternative**: Inter (for data-heavy sections)

**Type Scale**
- **Heading 1**: 40px / 2.5rem, weight 700
- **Heading 2**: 32px / 2rem, weight 600
- **Heading 3**: 24px / 1.5rem, weight 600
- **Body Large**: 18px / 1.125rem, weight 400
- **Body**: 16px / 1rem, weight 400
- **Body Small**: 14px / 0.875rem, weight 400
- **Caption**: 12px / 0.75rem, weight 400

**Line Height**
- Headings: 1.3
- Body: 1.6

### Spacing System

**Base unit**: 4px

**Scale**:
- `xs`: 4px
- `sm`: 8px
- `md`: 16px
- `lg`: 24px
- `xl`: 32px
- `2xl`: 48px
- `3xl`: 64px

### Component Styling

**Timeline Component**
- **Height**: 120px on mobile, 160px on desktop
- **Sections**: Sleep (gray), Fast (blue), Eat (green-orange), Current time (red line)
- **Meal Markers**: Circular icons (24px) on timeline
- **Interactive**: Tap zones expand with tooltip

**Insight Cards**
- **Background**: White
- **Border**: None or 1px `#E0E0E0`
- **Border radius**: 16px (more rounded than Frise)
- **Shadow**: `0 4px 12px rgba(0,0,0,0.1)`
- **Padding**: 20px
- **Icon size**: 32px

**Buttons**
- **Primary**: Green background (#4CAF50), white text
- **Secondary**: Outline, green border
- **Quick Action**: Large, rounded, shadow on press
- **Padding**: 14px 28px
- **Border radius**: 12px

**Meal Log Button (Floating)**
- **Position**: Bottom-right (mobile), sidebar (desktop)
- **Style**: Circular, green, shadow, pulse animation
- **Icon**: Plus or utensils
- **Size**: 56px diameter

### Animation Principles

**Timing**
- **Instant**: <100ms (taps, toggles)
- **Fast**: 200ms (cards, tooltips)
- **Medium**: 400ms (page transitions)
- **Slow**: 600ms (timeline draws)

**Easing**
- **Default**: ease-in-out
- **Bouncy**: spring(1, 80, 10) for celebrations

**Key Animations**
- Timeline initial draw: Left-to-right fill, 600ms
- Current time indicator: Smooth slide + pulse (2s loop)
- Meal logged: Success checkmark + card bounce
- Window closing warning: Gentle shake + color shift
- Streak milestone: Confetti burst

**Micro-interactions**
- Button press: Scale 0.95 + shadow reduce
- Card tap: Lift (translateY -4px) + shadow increase
- Notification badge: Subtle pulse
- Timer countdown: Number flip animation

### Responsive Design

**Breakpoints**
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

**Layout Adaptations**

*Mobile (< 640px):*
- Vertical timeline (12-hour segments stacked)
- Single-column insight cards
- Floating action button for meal log
- Bottom navigation (Home, Log, Learn, Profile)
- Full-width components

*Tablet (640px - 1024px):*
- Horizontal timeline (full 24-hour view)
- Two-column insight grid
- Sidebar navigation option
- Comfortable spacing

*Desktop (> 1024px):*
- Max-width: 1400px, centered
- Three-column insight layout
- Persistent sidebar (Timeline always visible)
- Hover states more prominent
- Larger interactive areas

### Accessibility

**Color Contrast**
- WCAG AAA compliance goal
- 7:1 contrast for body text
- 4.5:1 for large text
- Never rely on color alone (use icons + text)

**Keyboard Navigation**
- Logical tab order
- Skip to main content link
- Focus indicators (2px green outline)
- Keyboard shortcuts for common actions:
  - `L`: Log meal
  - `T`: View timeline
  - `?`: Help/tips

**Screen Readers**
- Semantic HTML throughout
- ARIA labels for timeline zones
- Timeline data available in table format (visually hidden)
- Time announcements for meal windows

**Touch Targets**
- Minimum 48x48px on mobile
- 16px spacing between interactive elements
- Enlarged hit areas for small icons

**Time Display**
- User's preferred format (12h/24h)
- Timezone awareness
- Clear time zone indicators for travelers

---

## Implementation Roadmap

### Phase 0: Setup & Research (Week 1)

**Project Initialization**
- [ ] Set up Next.js 14+ with App Router
- [ ] Install Hero UI, configure Tailwind
- [ ] Set up folder structure
- [ ] Configure PWA (next-pwa)
- [ ] Create design tokens file
- [ ] Initialize Git repository

**Scientific Research Deep-Dive**
- [ ] Compile chrononutrition research papers
- [ ] Document calculation formulas
- [ ] Create scientific advisory board (optional)
- [ ] Validate assumptions with nutrition experts

### Phase 1: Core Algorithm (Week 2)

**Chrononutrition Engine**
- [ ] Implement eating window calculation algorithm
  - Input: wake, sleep, chronotype, goals
  - Output: optimal breakfast, lunch, dinner, snack times
- [ ] Create TypeScript interfaces:
  - UserProfile
  - EatingWindow
  - MealTiming
  - PerformanceZone
- [ ] Build meal timing optimizer
  - Circadian rhythm alignment logic
  - Goal-specific adjustments
  - Chronotype modifications
- [ ] Unit test all calculations
- [ ] Validate against research papers

**Data Models**
- [ ] localStorage schema design
- [ ] Meal log data structure
- [ ] User preferences model
- [ ] Export/import format (JSON)

### Phase 2: Onboarding & Profile (Week 3)

**Welcome Experience**
- [ ] Design and build welcome screen
  - Hero messaging
  - Value proposition
  - Visual identity
- [ ] Create onboarding flow:
  - Step 1: Wake/sleep time input
  - Step 2: Chronotype selector
  - Step 3: Goal selection
  - Step 4: Work schedule (optional)
- [ ] Build time pickers (Hero UI)
- [ ] Instant eating window preview
- [ ] Tutorial overlay system
- [ ] Skip/back navigation

**Profile Management**
- [ ] Settings page
- [ ] Profile edit functionality
- [ ] Preference adjustments
- [ ] Data export button

### Phase 3: Dashboard & Timeline (Week 4)

**Main Timeline Visualization**
- [ ] Build 24-hour timeline component
  - SVG or Canvas rendering
  - Responsive scaling
  - Sleep/Fast/Eat zones
- [ ] Add meal markers (breakfast, lunch, dinner)
- [ ] Current time indicator (animated)
- [ ] Metabolic switch badge
- [ ] Interactive zones (tap/hover tooltips)

**Performance Insights**
- [ ] Mental performance zone card
- [ ] Energy stability indicator
- [ ] Timing score calculation
- [ ] Weekly streak tracker (future)

**Contextual Advice**
- [ ] Advice engine (time-aware tips)
- [ ] Rotate through 20+ tips
- [ ] Personalization based on goals

### Phase 4: Meal Logging (Week 5)

**Simple Logger**
- [ ] "Log meal" floating button
- [ ] Quick log (timestamp only)
- [ ] Detailed log (optional):
  - Meal type selector
  - Size indicator
  - Energy level rating
- [ ] Meal history view
- [ ] Edit/delete logged meals

**Pattern Recognition** (Basic)
- [ ] Calculate timing consistency score
- [ ] Detect eating window drift
- [ ] Simple insights ("You usually eat breakfast at 8:15 AM")

### Phase 5: Education & Content (Week 6)

**Learn Section**
- [ ] Create article templates
- [ ] Write 5-7 core articles:
  - Chrononutrition basics
  - Why breakfast timing matters
  - Metabolic switch explained
  - Performance optimization
  - Travel/jet lag strategies
- [ ] Build article navigation
- [ ] Add visual diagrams

**Blog for SEO**
- [ ] Set up blog infrastructure
- [ ] Write 3 initial SEO posts:
  - "Best Times to Eat for Focus and Energy"
  - "The Science of Meal Timing"
  - "Time-Restricted Eating Guide"
- [ ] Basic SEO optimization (meta tags, OG)

**Tips Library**
- [ ] Compile 50+ timing tips
- [ ] Categorize by meal type, goal
- [ ] Search/filter functionality

### Phase 6: Polish & PWA (Week 7)

**PWA Configuration**
- [ ] Design app icons (all sizes)
- [ ] Create splash screens
- [ ] Configure manifest.json
- [ ] Service worker setup
- [ ] Offline functionality
- [ ] Install prompt customization

**Notifications**
- [ ] Browser push notifications
- [ ] Permission request flow
- [ ] Meal window reminders
- [ ] Window closing warnings
- [ ] Weekly summary notifications

**Animations & Micro-interactions**
- [ ] Timeline draw animation
- [ ] Success states (meal logged)
- [ ] Loading skeletons
- [ ] Transitions between views

### Phase 7: Testing & Launch (Week 8)

**Testing**
- [ ] Cross-browser testing
  - Chrome, Safari, Firefox
  - Mobile Safari, Chrome Android
- [ ] Accessibility audit
  - Keyboard navigation
  - Screen reader testing
  - Color contrast validation
- [ ] Performance optimization
  - Lighthouse scores >90
  - Bundle size optimization
  - Image optimization

**Pre-Launch**
- [ ] Privacy policy page
- [ ] About page
- [ ] FAQ section
- [ ] Feedback mechanism
- [ ] Error logging (Sentry)

**Soft Launch**
- [ ] Deploy to Vercel
- [ ] Custom domain setup
- [ ] Share with beta testers (20-50 people)
- [ ] Collect initial feedback
- [ ] Monitor for critical issues

**Iteration**
- [ ] Address top feedback items
- [ ] Bug fixes
- [ ] UI refinements
- [ ] Analytics setup (Firebase/GA4)

---

### Post-MVP Priorities

#### Version 1.1 (Month 2)
- Advanced analytics dashboard
- Energy correlation tracking
- Food photo logging (optional)
- Weekly pattern insights
- Social sharing features

#### Version 1.2 (Month 3)
- Meal planning integration
- Recipe suggestions by timing
- Grocery list generation
- Calendar integration

#### Version 2.0 (Month 4-6)
- Full nutrition tracking (optional)
- Meal kit partnerships
- Affiliate integrations
- Premium tier features
- Corporate wellness pilot

#### Version 3.0 (Month 6-12)
- Frise integration (sleep + meals unified)
- Fitness tracker sync
- Advanced ML personalization
- Nutrition coach marketplace
- Enterprise licensing

---

## Success Metrics

### Phase 1: Product Validation (Months 1-3)

**Primary Metrics**
- **User Retention**:
  - Day 7: >50% (critical—habit formation)
  - Week 2: >40%
  - Month 1: >25%
- **Daily Active Users (DAU)**: Steady growth week-over-week
- **Eating Window Adherence**: Avg >70% days within window
- **Meal Logs**: Avg 4+ logs per week per active user

**Secondary Metrics**
- Time in app: 3-5 minutes daily
- Timeline interactions: Avg 5+ per session
- Tutorial completion: >60%
- Notification opt-in: >40%
- PWA install rate: >20%

**Qualitative Metrics**
- User testimonials about energy improvements
- Self-reported performance changes
- Ease of use feedback (NPS)
- Feature requests (signals engagement)

### Phase 2: Growth & Engagement (Months 4-6)

**Growth Metrics**
- **New Users**: 200-1,000 per month
- **Organic Discovery**: Blog traffic contributing 30%+ new users
- **Referral Rate**: >15% of users invite friends
- **Social Mentions**: Growing awareness

**Engagement Metrics**
- **7-Day Streaks**: 30%+ of users
- **30-Day Streaks**: 10%+ of users
- **Learn Section**: 40% of users read 1+ article
- **Weekly Summaries**: Opened by 50%+ of users

**Behavior Metrics**
- Eating window consistency improving over time
- Breakfast eating increasing (compared to baseline)
- Late-night eating decreasing
- User-reported energy stability

### Phase 3: Monetization Readiness (Months 6-12)

**Business Metrics**
- **Active User Base**: 2,000-5,000 engaged users
- **Week 1 Retention**: >40%
- **NPS Score**: >50 (excellent)
- **Upgrade Intent**: 20%+ willing to pay for premium

**Revenue Potential**
- **Meal Kit Referral CTR**: >5%
- **Affiliate Link Clicks**: >10% of users
- **Premium Interest Survey**: 15-25% interested
- **Corporate Inquiries**: 3-5 companies interested

**Platform Health**
- Low churn rate (<10% monthly)
- High session frequency (5+ days/week)
- Strong word-of-mouth (viral coefficient >0.5)
- Positive press mentions

---

## Future Enhancements

### Short-Term (v1.x)

**Advanced Analytics**
- Energy level correlation with meal timing
- Performance tracking dashboard
- Sleep quality integration (via Frise)
- Personalized pattern insights

**Enhanced Logging**
- Photo-based meal logging
- Quick templates ("My usual breakfast")
- Voice logging ("Log breakfast")
- Apple Health / Google Fit import

**Social Features**
- Share your eating schedule
- Challenges with friends
- Community best practices
- Anonymous aggregate insights

### Medium-Term (v2.x)

**Meal Planning**
- Recipe database filtered by timing
- Automatic grocery lists
- Meal prep scheduling
- Integration with meal kit delivery

**Nutrition Depth** (Optional)
- Full macro tracking
- Micronutrient timing optimization
- Supplement timing recommendations
- Blood glucose simulation (future)

**Partnerships**
- HelloFresh, Factor timing-optimized delivery
- Supplement brand affiliates
- Fitness app integrations (Oura, Whoop)
- Nutrition coach marketplace

### Long-Term (v3.x)

**Ecosystem Integration**
- **Frise + FuelTime**: Unified circadian health platform
- Sleep-meal optimization feedback loops
- Holistic wellness dashboard
- Single authentication across apps

**AI Personalization**
- Machine learning meal timing suggestions
- Adaptive window adjustments
- Predictive energy forecasting
- Personalized advice generation

**Enterprise Features**
- Corporate wellness programs
- Team challenges and leaderboards
- Productivity metrics
- Subsidized meal kits for employees

**Advanced Science**
- Continuous glucose monitor integration
- Genetic chronotype analysis (future)
- Biomarker-based optimization
- Research partnerships

---

## Competitor Analysis

### Direct Competitors

**Zero (Fasting App)**
- **Strengths**: Beautiful UI, large user base, fasting focus
- **Weaknesses**: No meal timing optimization, no performance focus
- **Our Advantage**: Performance-first, detailed timing guidance, science education

**Ate (Visual Food Diary)**
- **Strengths**: Photo logging, mindful eating
- **Weaknesses**: No timing optimization, focuses on "what" not "when"
- **Our Advantage**: Timing science, no food judgment, performance correlation

**MyCircadianClock**
- **Strengths**: Research-backed, Dr. Panda's team
- **Weaknesses**: Dated UI, research-focused not consumer-friendly
- **Our Advantage**: Modern UX, actionable insights, progressive disclosure

### Adjacent Competitors

**MyFitnessPal**
- **Strengths**: Huge database, comprehensive tracking
- **Weaknesses**: Calorie-focused, complex, time-consuming
- **Our Advantage**: Simple timing focus, no calorie counting, faster value

**Noom**
- **Strengths**: Behavior psychology, coaching
- **Weaknesses**: Expensive, weight-loss only, requires intensive logging
- **Our Advantage**: Free initially, performance-focused, minimal logging

### Market Positioning

**FuelTime's Unique Value:**
- Only app focused purely on **when** not **what**
- Performance and energy optimization (not just weight)
- Science-backed but user-friendly
- No judgment, no deprivation
- Complements any diet (keto, vegan, paleo, etc.)

---

## Appendix

### Scientific References

**Key Research Papers:**
- Chaix et al. (2019). "Time-restricted eating to prevent and manage chronic metabolic diseases." *Annual Review of Nutrition*
- Leung et al. (2020). "Time of day difference in postprandial glucose and insulin responses." *Chronobiology International*
- Adafer et al. (2020). "Food timing, circadian rhythm and chrononutrition." *Nutrients*
- Manoogian et al. (2022). "Time-restricted eating for the prevention and management of metabolic diseases." *Endocrine Reviews*

**Institutions:**
- Salk Institute (Dr. Satchin Panda - TRE research)
- Harvard Medical School (Circadian biology)
- NIH/NHLBI (Chrononutrition research)
- Johns Hopkins (Meal timing and metabolism)

### Development Resources
- **Next.js**: https://nextjs.org/docs
- **Hero UI**: https://heroui.com/docs
- **Chrononutrition Science**: https://www.ifm.org/articles/chrononutrition-food-timing
- **TRE Research**: https://www.foundmyfitness.com/topics/time-restricted-eating

### Design Inspiration
- **Oura Ring App**: Clean data visualization
- **Whoop App**: Performance insights
- **Zero App**: Fasting timer aesthetics
- **Headspace**: Calm, approachable wellness

---

## Final Notes

### Core Principles
1. **Timing over tracking**: Focus on when, not what or how much
2. **Science-backed**: Every recommendation rooted in research
3. **Performance-first**: Energy and cognition, not just weight
4. **Sustainable**: Easy to follow long-term
5. **Complementary**: Works with any diet or lifestyle

### Success Philosophy
FuelTime succeeds when users:
- Feel noticeably better energy throughout the day
- Experience improved mental clarity and focus
- Build consistent, sustainable eating patterns
- Understand the science behind their schedule
- Recommend the app to friends and family

### Development Mantra
**"Make eating timing effortless"**

Every feature should:
- Reduce friction
- Provide instant value
- Educate without overwhelming
- Respect user autonomy
- Build healthy habits

---

**Last Updated**: February 6, 2026  
**Document Version**: 1.0.0  
**Status**: Pre-Development  
**Project Owner**: Vlad

---

**Next Steps:**
1. Validate core algorithm with nutrition experts
2. Build minimal prototype (Week 1-2)
3. Test with 10 beta users
4. Iterate based on feedback
5. Launch MVP (Week 8)
6. Monitor metrics and improve

**Let's revolutionize how people think about eating!** 🚀🍽️⚡