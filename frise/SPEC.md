# Frise - Project Documentation

> **Your sleep-powered productivity forecast**

## Table of Contents
1. [Project Overview](#project-overview)
2. [Core Concept](#core-concept)
3. [Business Philosophy](#business-philosophy)
4. [Target Audience](#target-audience)
5. [Technical Architecture](#technical-architecture)
6. [Feature Specifications](#feature-specifications)
7. [User Experience Flows](#user-experience-flows)
8. [Design System](#design-system)
9. [Implementation Roadmap](#implementation-roadmap)
10. [Future Enhancements](#future-enhancements)
11. [Success Metrics](#success-metrics)

---

## Project Overview

**Frise** is a free, web-based productivity forecasting application inspired by the Rise sleep tracker. It predicts daily productivity peaks and valleys based on user sleep patterns, helping users optimize their day according to their natural circadian rhythms.

### Vision Statement
Motivate users to discover and leverage their natural productivity patterns by providing personalized, science-based forecasts that they can test and validate through their own experience.

### Key Differentiators
- **Instant value**: Predictions from first sleep entry
- **No barriers**: No authentication required initially
- **Privacy-first**: All data stored locally
- **Beautiful simplicity**: Calm, zen aesthetic
- **Science-backed**: Two-Process Model circadian calculations

---

## Core Concept

### The Psychology of Motivation
Frise creates a self-reinforcing cycle:
1. User enters sleep data
2. App predicts productivity peaks/valleys
3. User tests predictions throughout their day
4. Predictions prove accurate (self-fulfilling prophecy effect)
5. User returns daily for continued optimization

### Core Output
Based on sleep input, Frise calculates and displays:
- **Productivity curve**: Hour-by-hour energy and focus levels
- **Peak performance windows**: Best times for deep work
- **Energy dips**: When to schedule lighter tasks
- **Melatonin window**: Natural wind-down period begins
- **Optimal bedtime**: Calculated for next night
- **Sleep debt**: Cumulative sleep balance

---

## Business Philosophy

### Taleb-Inspired Principles

**Antifragility**
- Learn from aggregated user patterns to improve predictions
- App gets better with more usage data

**Skin in the Game**
- Focus on product excellence first, monetization second
- Earn user trust before adding revenue streams

**Multiple Revenue Streams** (Future)
- Display advertising
- Rise app affiliate/referral links
- Premium features (when authentication added)

**Limited Downside**
- Minimal infrastructure costs (local storage, no auth)
- PWA reduces app store dependencies
- Static hosting possible

**Remove Complexity**
- Start with simplest viable version
- Progressive feature disclosure
- No unnecessary configuration

### Monetization Strategy (Deferred)
First priority: Build a product users love and use daily.

**Future monetization options:**
- Tasteful banner/native ads (post-product-market fit)
- Rise app referral program for advanced features
- Potential premium tier (multi-device sync, advanced analytics)

**Success metrics before monetization:**
- Strong user retention (>40% Week 1)
- Daily active usage patterns
- Organic growth through sharing

---

## Target Audience

### Primary Users
- **Productivity enthusiasts**: People optimizing their routines
- **Knowledge workers**: Remote workers, developers, writers, designers
- **Students**: Managing study schedules and peak learning times
- **Health-conscious individuals**: Already tracking sleep/fitness
- **Early adopters**: Interested in quantified self movement

### User Needs
- Understanding when they're naturally most focused
- Optimizing work schedules around energy levels
- Improving sleep habits through awareness
- Data-driven personal productivity insights
- Simple, non-intrusive tracking tools

---

## Technical Architecture

### Tech Stack

#### Frontend Framework
- **Next.js 14+** (App Router)
  - Server-side rendering for SEO (blog)
  - Easy future auth integration
  - API routes for future backend needs

#### UI Framework
- **Hero UI v2** (formerly NextUI)
  - Built on Tailwind CSS
  - Beautiful, accessible components
  - Calm, zen aesthetic achievable
  - Excellent mobile responsiveness

#### Styling
- **Tailwind CSS** (via Hero UI)
- Custom theme configuration for brand colors
- Smooth animations and transitions

#### State Management
- **React Hooks**: useState, useEffect, useContext
- **Context Providers**: Theme, Settings, Sleep Data
- No external state library needed initially

#### Data Persistence
- **localStorage API**
  - JSON serialization of sleep entries
  - Rolling 14-day data window
  - Import/export functionality
  - No server/database costs

#### Charts & Visualization
- **Recharts** or custom SVG implementation
  - Smooth, animated productivity curves
  - Interactive tooltips
  - Thermal color gradient support

#### Date/Time Handling
- **date-fns** or **Luxon**
  - Time zone aware calculations
  - Date arithmetic for sleep cycles
  - Formatting and parsing

#### PWA Configuration
- **next-pwa** package
  - Service worker generation
  - Offline capability
  - App manifest
  - Install prompts

#### Future Analytics (Post-Launch)
- **Firebase Analytics** or **Google Analytics 4**
  - User behavior tracking
  - Retention metrics
  - Feature usage patterns

### Sleep Science Implementation

#### Two-Process Model
Based on Borbély's sleep regulation model:

**Process S (Sleep Homeostasis)**
- Sleep pressure accumulates during waking
- Dissipates during sleep
- Exponential decay function

**Process C (Circadian Process)**
- 24-hour biological rhythm
- Independent of sleep/wake
- Sinusoidal function based on internal clock

**Combined Model**
```
Productivity(t) = C(t) - S(t)

Where:
- C(t) = Circadian alertness at time t
- S(t) = Sleep pressure at time t
- Higher values = better productivity
```

#### Calculation Inputs
**Minimum (Day 1):**
- Last night's bedtime
- Last night's wake time

**Optimal (14 days):**
- Historical sleep patterns
- Consistency metrics
- User's ideal sleep duration

#### Key Outputs
1. **Productivity Curve**: 5-minute granularity, 5 AM - 1 AM
2. **Melatonin Window**: Typically 2 hours before ideal bedtime
3. **Optimal Bedtime**: Melatonin window start - 1 hour
4. **Sleep Debt**: Cumulative hours vs. ideal sleep need

---

## Feature Specifications

### MVP Features (Version 1.0)

#### 1. Onboarding Flow

**Welcome Screen**
- **Headline**: "Discover when you'll be at your best today"
- **Subheadline**: "Based on sleep science, get your personal productivity forecast"
- **Visual**: Abstract, calming illustration
- **CTA**: "Enter last night's sleep" button

**Sleep Input (Step 1)**
- **Primary Input**: Range slider with two handles
  - Bedtime handle (left)
  - Wake time handle (right)
  - Shows duration automatically ("7h 30m")
  - Touch-friendly on mobile
  
- **Secondary Input**: Dual wheel time pickers
  - Side-by-side: "Bedtime" | "Wake time"
  - Syncs with slider above
  - For users preferring precise input

**Validation**
- Auto-detect if bedtime > wake time (assumes previous day)
- Gentle warnings for unusual durations (<3h or >14h)
- Confirmation dialog: "You slept from 11:00 PM (Feb 4) to 7:00 AM (Feb 5) - 8 hours. Correct?"

**Instant Gratification**
- Immediately show productivity curve after first entry
- User sees value in <30 seconds

**Progressive Onboarding**
- After 10-15 seconds viewing curve, slide-in prompt appears
- "Want to track sleep debt?" → Ask ideal sleep duration
- Dismissible, can set later in settings

**Notification Permission**
- "Get morning reminders to log your sleep?"
- Request browser notification permission
- Optional, non-blocking

**Interactive Tutorial**
Five-step guided overlay (dismissible, shows once):
1. "This is your productivity forecast"
2. "Warmer colors = peak energy, cooler = low energy"
3. "Tap anywhere for detailed insights"
4. "Purple zone = your natural wind-down time"
5. "Come back daily to track your rhythm"

Duration: 15-20 seconds total, skippable at any step

#### 2. Main Dashboard

**Hero Section: Productivity Curve**

*Visual Specifications:*
- **Time Range**: 5 AM - 1 AM (20-hour fixed window)
- **Granularity**: 5-minute intervals for smooth curve
- **Color Gradient**: Thermal spectrum
  - Blue → Cyan (low productivity, 0-30%)
  - Cyan → Yellow (moderate, 30-60%)
  - Yellow → Orange (good, 60-80%)
  - Orange → Red (peak, 80-100%)

*Labeled Zones:*
- "Peak Focus" (highest productivity window)
- "Energy Dip" (post-lunch slump)
- "Second Wind" (evening recovery)
- "Wind Down" (pre-sleep period)

*Melatonin Window:*
- Semi-transparent purple overlay
- Label: "Melatonin Window" with 🌙 icon
- Typically 2 hours before ideal bedtime

*Current Time Indicator:*
- Vertical line in bright accent color
- Small label at top: "NOW 2:35 PM"
- Subtle pulsing animation (1.5s interval)

*Pre-Wake Hours (before user woke up):*
- Grayed out or minimal styling
- Indicates "asleep" state
- Less visually prominent

*Animation:*
- Smooth draw-in effect on load (left-to-right, ~1 second)
- Re-animates when switching between historical days

*Interactivity:*
- **Hover/Tap** on curve shows tooltip:
  - Specific time (e.g., "10:15 AM")
  - Productivity percentage (e.g., "87% capacity")
  - Zone label (e.g., "Peak Focus Zone")
  - Context-aware mini-advice

**Key Insights Panel**

Prominent display of actionable information:
- 🎯 **Best time for deep work**: "9:30 AM - 11:45 AM"
- 🌙 **Melatonin window starts**: "9:15 PM"
- 🛏️ **Optimal bedtime tonight**: "10:30 PM"

Calculated as: Melatonin start - 1 hour

**Sleep Debt Widget**

Separate card/section showing:
- Hours above/below ideal sleep need
- Visual indicator (battery-style, progress bar, or +/- display)
- Examples:
  - "Sleep balance: -2.5 hours" (red/orange)
  - "Well rested! +0.5 hours" (green)
  - "Perfect balance: 0 hours" (neutral)

**Contextual Advice Section**

Dynamic content based on current time position in curve:
- Changes as day progresses
- Pre-generated advice with 5 variations per zone
- Rotates randomly to prevent repetition

*Example advice for "Peak Focus Zone":*
1. "Your brain is firing on all cylinders - tackle your hardest problem now"
2. "This is your superpower hour - schedule important decisions here"
3. "Peak performance mode - do the work that requires deep thinking"
4. "Your focus is sharpest now - protect this time from interruptions"
5. "Mental clarity at its best - handle complex tasks before this window closes"

*Example advice for "Energy Dip":*
1. "Natural lull time - perfect for routine tasks and emails"
2. "Take a mindful break or short walk to recharge"
3. "Your body wants rest - honor the dip with lighter work"
4. "Creative tasks work better now than analytical ones"
5. "If possible, this is your ideal power nap window"

Tone: Calm, encouraging, non-judgmental

#### 3. Sleep Entry (Daily)

**Morning Prompt**
- Timezone-aware detection of morning hours
- Dashboard shows prompt: "Log today's sleep to see your forecast"
- Browser push notification (if permission granted): "Good morning! Ready to log your sleep?"

**Missing Data Handling**

*Current day not logged:*
- Grayed-out placeholder curve on dashboard
- Clear CTA: "Log today's sleep to see your forecast"
- No functionality blocked, just no prediction

*Historical gap (skipped days):*
- Current day curve displays normally
- Small yellow info banner: "⚠️ Missing Feb 3rd sleep data - add it for better accuracy"
- Tappable to quick-fill missing day
- Non-blocking, dismissible

**Data Entry Interface**
- Same dual input as onboarding (slider + wheels)
- Quick access from dashboard
- Can edit previous entries (up to 14 days back)

#### 4. Data Management

**Local Storage Strategy**
- Rolling 14-day window
- Automatic cleanup of older entries
- JSON structure:
```json
{
  "sleepEntries": [
    {
      "date": "2025-02-05",
      "bedtime": "2025-02-04T23:30:00Z",
      "wakeTime": "2025-02-05T07:00:00Z",
      "duration": 450
    }
  ],
  "userSettings": {
    "idealSleepDuration": 480,
    "notificationsEnabled": true
  }
}
```

**Export Functionality**
- Button in Settings: "Export My Data"
- Downloads JSON file: `frise-sleep-data-2025-02-05.json`
- Includes all 14 days + settings
- For backup or device migration

**Import Functionality**
- Upload JSON file to restore data
- Validates file structure before importing
- Merge strategy: keeps newer entries if conflict

**Health Data Import (v1.1)**
- Manual file upload approach:
  - Apple Health: XML export
  - Google Fit: JSON export
- Client-side parsing (no server upload)
- Extracts last 14 days of sleep sessions
- Populates sleep entry history
- Privacy-preserving (stays in browser)

#### 5. Settings

Simple configuration screen:
- **Ideal sleep duration**: Hours and minutes picker
- **Notifications**: Toggle for morning reminders
- **Data management**: Export button
- **About**: Version info, privacy policy link

#### 6. Learn Section

Educational content explaining:
- How circadian rhythms work
- Two-Process Model overview
- Why sleep timing matters for productivity
- Understanding your chronotype
- Tips for sleep consistency

Format: Simple, scannable articles with visuals

#### 7. Blog (SEO Content)

Topics include:
- "Best times to do deep work based on science"
- "Understanding your natural energy curve"
- "How sleep affects productivity: the research"
- "Morning person vs night owl: what's your chronotype?"
- "Optimizing your work schedule around circadian rhythms"

Built with Next.js for SEO optimization

---

### Future Features (Post-MVP)

#### Phase 2 (v1.1-1.3)
- Historical sleep chart (7-day, 30-day views)
- Trend analysis: "Your bedtime is getting more consistent!"
- Sleep quality tracking (optional input)
- Weekend vs weekday pattern comparison
- Chronotype identification (automatically detected)

#### Phase 3 (v2.0)
- Authentication system (shared across app ecosystem)
- Cloud sync across devices
- Personalized advice refinement based on feedback
- Integration with separate nutrition/calorie tracking app

#### Phase 4 (v3.0)
- Social features (anonymized pattern sharing)
- Community insights ("Most productive hours globally")
- Advanced analytics dashboard
- Export to PDF reports

---

## User Experience Flows

### First-Time User Journey

```
1. Land on welcome screen
   ↓
2. Read value proposition (5 seconds)
   ↓
3. Tap "Enter last night's sleep"
   ↓
4. Adjust range slider for bedtime/wake time
   ↓
5. Submit → See productivity curve immediately (wow moment!)
   ↓
6. Interact with curve (hover/tap, read advice)
   ↓
7. Tutorial overlay appears (optional, 15 seconds)
   ↓
8. Prompted for ideal sleep duration (optional)
   ↓
9. Asked for notification permission (optional)
   ↓
10. Return to dashboard → Install PWA prompt
```

**Total time to value: <60 seconds**

### Daily Returning User Journey

```
1. Morning notification: "Log your sleep"
   ↓
2. Open app (or tap notification)
   ↓
3. Quick slider adjustment (10 seconds)
   ↓
4. Submit → See today's forecast
   ↓
5. Glance at key insights
   ↓
6. Plan day around peak hours
   ↓
7. Close app
   ↓
[Throughout day]
8. Quick checks to see current productivity zone
9. Validate predictions with actual experience
   ↓
[Evening]
10. Check optimal bedtime
11. Receive bedtime reminder (future feature)
```

**Daily engagement: 2-3 minutes**

### Missing Day Recovery Flow

```
User returns after 2-3 days without logging
   ↓
Dashboard shows: "No recent data"
   ↓
Prompt: "Add your sleep data to see forecast"
   ↓
User logs today's sleep
   ↓
Banner: "Missing Feb 3-4 data - add for better accuracy"
   ↓
User optionally fills gaps OR dismisses
   ↓
Forecast displays with available data
```

---

## Design System

### Brand Identity: Calm/Zen

**Core Values**
- Peace
- Clarity  
- Natural rhythm
- Trustworthy
- Approachable

### Color Palette

**Primary Colors**
- **Soft Purple**: `#9B8FD9` - Melatonin window, primary actions
- **Lavender**: `#C5BEE6` - Lighter accents, backgrounds
- **Deep Purple**: `#6B5FA6` - Text on light backgrounds

**Thermal Gradient (Productivity Curve)**
- **Low (0-30%)**: `#4A90E2` → `#5FC4E8` (Cool blues)
- **Moderate (30-60%)**: `#5FC4E8` → `#F5DD90` (Cyan to yellow)
- **Good (60-80%)**: `#F5DD90` → `#F5A962` (Yellow to orange)
- **Peak (80-100%)**: `#F5A962` → `#E85D4A` (Orange to warm red)

**Neutral Palette**
- **Background**: `#FDFBF7` (Warm off-white)
- **Surface**: `#FFFFFF` (Pure white for cards)
- **Border**: `#E8E5E0` (Soft gray)
- **Text Primary**: `#3D3D3D` (Soft charcoal)
- **Text Secondary**: `#7A7A7A` (Medium gray)

**Accent Colors**
- **Success/Positive**: `#7AC142` (Soft green)
- **Warning**: `#F5A962` (Warm orange)
- **Error**: `#E85D4A` (Muted red)
- **Info**: `#5FC4E8` (Bright cyan)

**Current Time Indicator**: `#E85D4A` (Warm red for visibility)

### Typography

**Font Family**
- **Primary**: Inter, system-ui, sans-serif
- **Alternative**: Outfit (if more rounded feel desired)

**Type Scale**
- **Heading 1**: 36px / 2.25rem, weight 600
- **Heading 2**: 28px / 1.75rem, weight 600
- **Heading 3**: 22px / 1.375rem, weight 600
- **Body Large**: 18px / 1.125rem, weight 400
- **Body**: 16px / 1rem, weight 400
- **Body Small**: 14px / 0.875rem, weight 400
- **Caption**: 12px / 0.75rem, weight 400

**Line Height**
- Headings: 1.2
- Body: 1.6 (generous for readability)

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

**Component Padding**:
- Cards: 24px (lg)
- Buttons: 12px 24px (vertical: md, horizontal: lg)
- Page margins: 16px mobile, 32px desktop

### Component Styling

**Buttons**
- **Primary**: Purple background, white text, rounded-lg
- **Secondary**: Outline, purple border, purple text
- **Ghost**: No background, purple text on hover
- **Padding**: 12px 24px
- **Border radius**: 8px
- **Hover**: Slight opacity change (0.9), smooth transition

**Cards**
- **Background**: White
- **Border**: 1px solid #E8E5E0
- **Border radius**: 12px
- **Shadow**: Subtle, 0 2px 8px rgba(0,0,0,0.08)
- **Padding**: 24px

**Inputs**
- **Border**: 1px solid #E8E5E0
- **Border radius**: 8px
- **Focus**: Purple border, subtle glow
- **Padding**: 12px 16px

**Curve Container**
- **Background**: White card
- **Aspect ratio**: 16:9 on desktop, responsive on mobile
- **Padding**: 16px
- **Interactive areas**: Minimum 44px touch target

### Animation Principles

**Timing**
- **Fast**: 150ms (micro-interactions, hovers)
- **Medium**: 300ms (page transitions, modals)
- **Slow**: 500ms (curve drawing, significant changes)

**Easing**
- **Default**: ease-in-out
- **Entrance**: ease-out
- **Exit**: ease-in

**Key Animations**
- Curve draw-in: Left-to-right, 1000ms
- Current time pulse: Scale 1 → 1.1, 1500ms loop
- Tooltip appearance: Fade + slight translate, 150ms
- Page transitions: Fade, 300ms
- Button hover: Opacity, 150ms

**Accessibility**
- Respect `prefers-reduced-motion` media query
- Disable decorative animations if preference set
- Keep critical animations for functionality

### Responsive Design

**Breakpoints**
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px  
- **Desktop**: > 1024px

**Layout Adaptations**

*Mobile (< 640px):*
- Single column layout
- Full-width curve
- Stacked insights cards
- Bottom-fixed navigation (if needed)
- Larger touch targets (minimum 44px)

*Tablet (640px - 1024px):*
- Two-column grid for insights
- Slightly larger curve container
- Comfortable reading width for content

*Desktop (> 1024px):*
- Max-width constraint (1200px) for readability
- Centered layout with side padding
- Curve maintains optimal aspect ratio
- Multi-column blog layouts

### Accessibility

**Color Contrast**
- WCAG AA compliance minimum
- Text contrast ratios: 4.5:1 for body, 3:1 for large text
- Interactive elements clearly distinguishable

**Keyboard Navigation**
- All interactive elements focusable
- Clear focus indicators (purple outline)
- Logical tab order

**Screen Readers**
- Semantic HTML elements
- ARIA labels where needed
- Alt text for all images
- Curve data available in table format (hidden, screen-reader only)

**Touch Targets**
- Minimum 44x44px for mobile
- Adequate spacing between tappable elements

---

## Implementation Roadmap

### Phase 0: Setup & Foundation (Week 1)

**Project Initialization**
- [ ] Set up Next.js 14+ project with App Router
- [ ] Install Hero UI and configure Tailwind
- [ ] Set up project structure (components, utils, hooks)
- [ ] Configure PWA with next-pwa
- [ ] Create design tokens (colors, spacing, typography)
- [ ] Set up version control (Git)

**Design System**
- [ ] Create UI kit in Figma/design tool (optional but recommended)
- [ ] Build reusable components:
  - Button variants
  - Card component
  - Input components
  - Modal/overlay
  - Tooltip
- [ ] Implement theme provider (light mode initially)

### Phase 1: Core Sleep Calculation (Week 2)

**Sleep Science Implementation**
- [ ] Research and implement Two-Process Model
  - Process S (sleep homeostasis) calculations
  - Process C (circadian rhythm) calculations
  - Combined productivity formula
- [ ] Create utility functions:
  - `calculateProductivityCurve(sleepData, currentTime)`
  - `calculateMelatoninWindow(sleepData)`
  - `calculateOptimalBedtime(melatoninStart)`
  - `calculateSleepDebt(sleepHistory, idealDuration)`
- [ ] Unit test all calculations
- [ ] Validate against known sleep science papers

**Data Models**
- [ ] Define TypeScript interfaces for:
  - SleepEntry
  - ProductivityPoint
  - UserSettings
  - SleepDebt
- [ ] Create localStorage service:
  - Save/load functions
  - 14-day rolling window logic
  - Data validation
  - Migration handling

### Phase 2: Onboarding & Sleep Input (Week 3)

**Welcome Experience**
- [ ] Build welcome screen
  - Hero message
  - Value proposition
  - CTA button
- [ ] Create sleep input interface:
  - Range slider component (dual-handle)
  - Wheel time picker component
  - Real-time duration calculation
  - Validation logic
- [ ] Implement progressive onboarding:
  - Ideal sleep duration prompt (timed)
  - Notification permission request
  - Interactive tutorial overlay (5 steps)

**Form Handling**
- [ ] Build form submission logic
- [ ] Error handling and validation
- [ ] Confirmation dialogs for unusual inputs
- [ ] Save to localStorage

### Phase 3: Dashboard & Visualization (Week 4)

**Productivity Curve**
- [ ] Build curve visualization component
  - SVG or Recharts implementation
  - Thermal gradient coloring
  - 5-minute granularity
  - Smooth animations
- [ ] Add interactive features:
  - Hover/tap tooltips
  - Current time indicator
  - Zone labels
- [ ] Implement melatonin window overlay

**Key Insights Panel**
- [ ] Display calculated insights:
  - Best deep work time
  - Melatonin window start
  - Optimal bedtime
- [ ] Create sleep debt widget
- [ ] Build contextual advice system
  - Pre-generate advice sets
  - Rotation logic
  - Time-based switching

**Dashboard Layout**
- [ ] Compose full dashboard
- [ ] Responsive layout implementation
- [ ] Loading states
- [ ] Empty states

### Phase 4: Daily Usage Features (Week 5)

**Morning Prompt**
- [ ] Implement timezone detection
- [ ] Create dashboard prompt for missing data
- [ ] Build browser notification system
  - Permission request flow
  - Morning reminder scheduling
  - Notification click handling

**Data Management**
- [ ] Historical data view (simple list)
- [ ] Edit previous entries
- [ ] Handle missing data gaps
  - Warning banners
  - Quick-fill interface
- [ ] Delete entry functionality

**Settings Page**
- [ ] Build settings interface
  - Ideal sleep duration editor
  - Notification toggles
  - Export data button
- [ ] Implement data export
  - Generate JSON file
  - Download trigger
- [ ] Import functionality (JSON upload)

### Phase 5: Content & Polish (Week 6)

**Learn Section**
- [ ] Write educational content
  - Circadian rhythms explained
  - Two-Process Model overview
  - Chronotypes
  - Sleep consistency tips
- [ ] Build article layout templates
- [ ] Add illustrations/diagrams

**Blog Setup**
- [ ] Create blog post structure
- [ ] Write initial 3-5 SEO articles
- [ ] Implement blog index page
- [ ] Individual post pages
- [ ] Basic SEO optimization (meta tags, Open Graph)

**PWA Configuration**
- [ ] Design app icons (multiple sizes)
- [ ] Create splash screens
- [ ] Configure manifest.json
- [ ] Test install flow (mobile & desktop)
- [ ] Implement offline fallback page

### Phase 6: Testing & Optimization (Week 7)

**Testing**
- [ ] Manual testing across devices
  - iOS Safari
  - Android Chrome
  - Desktop browsers (Chrome, Firefox, Safari)
- [ ] Accessibility audit
  - Keyboard navigation
  - Screen reader testing
  - Color contrast validation
- [ ] Performance optimization
  - Lighthouse scores (>90 target)
  - Code splitting
  - Image optimization
  - Bundle size analysis

**Bug Fixes & Refinements**
- [ ] Address all critical bugs
- [ ] UI/UX refinements based on testing
- [ ] Animation smoothness
- [ ] Edge case handling

### Phase 7: Soft Launch (Week 8)

**Pre-Launch**
- [ ] Privacy policy page
- [ ] Terms of service (if needed)
- [ ] Contact/feedback mechanism
- [ ] Error logging setup (Sentry or similar)

**Launch**
- [ ] Deploy to production (Vercel recommended)
- [ ] Set up custom domain
- [ ] Share with friends/family for initial feedback
- [ ] Monitor for issues
- [ ] Collect qualitative feedback

**Iteration Based on Feedback**
- [ ] Prioritize top user requests
- [ ] Quick bug fixes
- [ ] UI tweaks based on usage

---

### Post-MVP Development Priorities

#### Version 1.1 (Month 2)
- Health data import (Apple Health XML, Google Fit JSON)
- Historical sleep chart visualization
- Basic trend indicators ("Consistency improving!")
- Sleep quality rating (optional daily input)

#### Version 1.2 (Month 3)
- Advanced analytics dashboard
- Week-over-week comparisons
- Chronotype automatic detection
- Weekend vs weekday patterns

#### Version 2.0 (Month 4-5)
- Shared authentication service
- Cloud sync across devices
- Premium features planning
- Integration with nutrition tracking app

#### Version 3.0 (Month 6+)
- Advanced personalization
- Machine learning refinements
- Community features
- Comprehensive premium tier

---

## Success Metrics

### Phase 1: Product-Market Fit (Months 1-3)

**Primary Metrics**
- **User Retention**:
  - Day 1: >60% return
  - Week 1: >40% return
  - Month 1: >20% return
- **Daily Active Users (DAU)**: Steady growth
- **Sleep Entries Per User**: Avg >4 per week
- **PWA Install Rate**: >15% of visitors

**Secondary Metrics**
- Time spent in app: 2-5 minutes daily
- Curve interactions: Avg >3 taps per session
- Export usage: Growing trend (indicates value)
- Settings changes: Indicates engagement

**Qualitative Metrics**
- User feedback sentiment (surveys, testimonials)
- Feature requests volume/themes
- Share rate (word-of-mouth growth)
- Support queries (indicates confusion points)

### Phase 2: Growth (Months 4-6)

**Growth Metrics**
- **User Acquisition**: 100-500 new users per month
- **Organic Traffic**: Blog driving SEO visitors
- **Referral Rate**: Users sharing with friends
- **Social Media Mentions**: Growing awareness

**Engagement Metrics**
- **Streak Tracking**: Users with 7+ day streaks
- **Blog Readership**: Pageviews on articles
- **Learn Section**: Content engagement
- **Feature Adoption**: Health import usage, etc.

### Phase 3: Monetization Readiness (Months 6+)

**Prerequisites for Monetization**
- 1,000+ active users
- >30% Week 1 retention
- Strong Net Promoter Score (NPS > 40)
- Low churn rate

**Early Monetization Metrics**
- **Ad Revenue**: First dollar earned milestone
- **Rise Referrals**: Click-through rate
- **Premium Interest**: Survey responses
- **ARPU (Average Revenue Per User)**: Initial benchmarks

---

## Future Enhancements

### Short-Term (v1.x)

**Historical Visualization**
- Line chart of sleep duration over time
- Consistency score calculations
- Trend detection ("You're sleeping 30min earlier on average")

**Enhanced Predictions**
- Weather-adjusted predictions (if location shared)
- Learned personal variations
- Confidence intervals on predictions

**Quality of Life**
- Dark mode toggle
- Multiple time format options (12h/24h)
- Language localization (starting with English, Spanish, French)

### Medium-Term (v2.x)

**Authentication & Sync**
- Shared auth service for app ecosystem
- Multi-device sync
- Cloud backup of sleep history
- Account management portal

**Advanced Analytics**
- Monthly/yearly sleep reports
- Downloadable PDF summaries
- Sleep efficiency calculations
- Chronotype detailed analysis

**Integration**
- Connect with nutrition tracking app
- Shared productivity insights across apps
- Unified dashboard (future)

### Long-Term (v3.x)

**Social Features**
- Anonymized aggregate insights
- Compare your patterns to population averages
- Sleep challenges with friends
- Community tips and stories

**AI Personalization**
- Machine learning model per user
- Adaptive advice based on feedback
- Prediction accuracy improvements
- Anomaly detection (potential health alerts)

**Premium Features**
- Advanced analytics suite
- Unlimited cloud storage
- Priority support
- Early access to new features
- Ad-free experience

**Native Apps**
- iOS app (native HealthKit integration)
- Android app (native Google Fit integration)
- Automatic background sync
- Better notification control

---

## Development Best Practices

### Code Organization

```
/frise
├── /app                  # Next.js App Router
│   ├── /api             # API routes (future)
│   ├── /blog            # Blog posts
│   ├── /learn           # Educational content
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Home/dashboard
├── /components
│   ├── /dashboard       # Dashboard-specific
│   ├── /onboarding      # Onboarding flow
│   ├── /sleep           # Sleep input components
│   ├── /ui              # Reusable UI (Hero UI wrappers)
│   └── /visualization   # Curve, charts
├── /hooks               # Custom React hooks
│   ├── useLocalStorage.ts
│   ├── useSleepData.ts
│   └── useNotifications.ts
├── /lib                 # Utilities & core logic
│   ├── /calculations    # Sleep science formulas
│   ├── /storage         # localStorage service
│   └── /constants       # App constants
├── /public
│   ├── /icons           # PWA icons
│   └── /images          # Static images
├── /styles
│   └── globals.css      # Tailwind imports
└── /types               # TypeScript definitions
```

### Git Workflow
- **Main branch**: Production-ready code
- **Develop branch**: Integration branch
- **Feature branches**: Individual features (`feature/curve-visualization`)
- Commit often with clear messages
- PR reviews before merge (even solo project, self-review)

### Testing Strategy
- **Unit tests**: Critical calculation functions (Jest)
- **Component tests**: Key UI components (React Testing Library)
- **E2E tests**: Critical user flows (Playwright, post-MVP)
- **Manual testing**: Cross-browser and device testing

### Performance Targets
- **Lighthouse Score**: >90 across all categories
- **First Contentful Paint**: <1.5s
- **Time to Interactive**: <3s
- **Bundle Size**: <200KB gzipped

### Security Considerations
- **Input validation**: All user inputs sanitized
- **XSS prevention**: React handles by default, careful with `dangerouslySetInnerHTML`
- **Content Security Policy**: Implement CSP headers
- **HTTPS**: Required for PWA and notifications

---

## Appendix

### Resources & References

**Sleep Science**
- Borbély, A. A. (1982). "A two process model of sleep regulation"
- Walker, M. (2017). "Why We Sleep"
- Circadian rhythm research from NIH/NHLBI

**Development Documentation**
- Next.js: https://nextjs.org/docs
- Hero UI: https://heroui.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- PWA Best Practices: https://web.dev/progressive-web-apps/

**Design Inspiration**
- Sleep Cycle app
- Rise Science app
- Calm app (aesthetic reference)
- Oura Ring dashboard (data visualization)

### Competitor Analysis

**Rise (Primary inspiration)**
- Strengths: Detailed energy schedule, beautiful UI, research-backed
- Weaknesses: Expensive subscription, complex onboarding
- Our advantage: Free, instant value, simpler

**Sleep Cycle**
- Strengths: Established brand, smart alarm
- Weaknesses: Focus on sleep tracking, not productivity
- Our advantage: Day-time productivity focus

**Oura Ring**
- Strengths: Hardware integration, comprehensive health tracking
- Weaknesses: Requires $300+ ring purchase
- Our advantage: No hardware needed, web-based

---

## Contact & Feedback

**Project Owner**: Vlad
**Project Name**: Frise
**Repository**: [To be created]
**Live URL**: [To be deployed]

**Feedback Channels** (post-launch):
- In-app feedback form
- Email: feedback@frise.app (example)
- Twitter/X: @friseapp (example)

---

## Changelog

### v1.0.0 - Initial Documentation (February 2025)
- Complete project specification
- Technical architecture defined
- 8-week implementation roadmap
- Design system documented
- Success metrics established

---

**Last Updated**: February 6, 2026
**Document Version**: 1.0.0
**Status**: Pre-Development
