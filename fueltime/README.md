# FuelTime 🍽️⏰

**Science-based meal timing optimizer using chrononutrition principles.**

FuelTime helps you optimize your eating windows for better energy, mental clarity, and metabolic health by aligning your meals with your circadian rhythm.

## 🌟 Features

- **Personalized Eating Windows** - Calculate optimal eating times based on your wake/sleep schedule
- **Chronotype Awareness** - Adjustments for morning people, night owls, and everyone in between
- **Performance Zones** - Know when your brain and body perform best
- **Meal Logging** - Track your meals and see timing scores
- **Science-Based Tips** - Contextual advice based on chrononutrition research
- **PWA Support** - Install on any device, works offline

## 📱 Screenshots

<!-- Add screenshots here -->

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🏗️ Architecture

### Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI Library:** HeroUI + Tailwind CSS
- **Animation:** Framer Motion
- **Date/Time:** Luxon
- **Charts:** Recharts
- **Validation:** Zod
- **Testing:** Vitest + React Testing Library
- **Storage:** localStorage (client-side only)

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Main app entry point
│   ├── providers.tsx      # Context providers
│   └── globals.css        # Global styles & design tokens
│
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   │   ├── Dashboard.tsx  # Main dashboard view
│   │   ├── Timeline.tsx   # Visual timeline component
│   │   └── InsightCard.tsx# Insight/stat display cards
│   ├── meal-log/          # Meal logging components
│   ├── onboarding/        # Onboarding flow components
│   ├── settings/          # Settings panel
│   ├── ui/                # Shared UI components
│   ├── icons/             # Custom icons
│   └── ErrorBoundary.tsx  # Error boundary wrapper
│
├── contexts/              # React Context providers
│   └── FuelTimeContext.tsx # Main app state management
│
├── lib/                   # Core business logic
│   ├── algorithms/        # Chrononutrition algorithms
│   │   ├── eating-window.ts      # Core calculation logic
│   │   └── eating-window.test.ts # Algorithm tests
│   ├── storage.ts         # localStorage persistence
│   ├── storage.test.ts    # Storage tests
│   ├── utils/             # Shared utilities
│   │   ├── time.ts        # Time formatting utilities
│   │   └── time.test.ts   # Time utility tests
│   └── validation/        # Zod validation schemas
│       └── schemas.ts     # Data validation
│
├── types/                 # TypeScript type definitions
│   └── index.ts           # All app types
│
├── hooks/                 # Custom React hooks
│   └── useServiceWorker.ts # PWA service worker hook
│
└── __tests__/             # Test configuration
    └── setup.ts           # Test environment setup
```

### Core Concepts

#### 1. Eating Window Calculation

The algorithm calculates optimal eating windows based on:
- Wake/sleep times (circadian anchor points)
- Chronotype (morning/intermediate/evening)
- Health goal (mental performance, energy stability, etc.)
- Window duration preference (8h, 10h, or 12h)

```typescript
// Example usage
const input: CalculationInput = {
  wakeTime: '07:00',
  sleepTime: '23:00',
  chronotype: 'intermediate',
  goal: 'energy_stability',
  workSchedule: 'standard',
  windowDuration: 10,
};

const result = calculateOptimalSchedule(input);
// Returns: eating window times, performance zones, recommendations
```

#### 2. State Management

FuelTime uses React Context with useReducer for state management:

```typescript
const {
  profile,           // User profile data
  preferences,       // User preferences
  eatingWindow,      // Calculated eating window
  mealLogs,          // Logged meals
  updateProfile,     // Update profile
  addMealLog,        // Log a new meal
  // ... more actions
} = useFuelTime();
```

#### 3. Data Persistence

All data is stored in localStorage with versioned schema:

```typescript
interface StorageData {
  version: string;
  profile: UserProfile;
  preferences: UserPreferences;
  eatingWindow: EatingWindow;
  mealLogs: MealLog[];
  dailyScores: DailyTimingScore[];
  onboardingCompleted: boolean;
  tutorialDismissed: boolean;
  lastUpdated: string;
}
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests in watch mode
npm test

# Run tests once
npm run test:run

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Test Structure

- **Unit Tests:** Algorithm functions, utilities
- **Integration Tests:** Storage operations, context actions
- **Component Tests:** (Coming soon) React component behavior

### Writing Tests

```typescript
describe('calculateEatingWindow', () => {
  it('should calculate eating window for standard profile', () => {
    const input: CalculationInput = {
      wakeTime: '07:00',
      sleepTime: '23:00',
      chronotype: 'intermediate',
      goal: 'energy_stability',
      workSchedule: 'standard',
    };

    const result = calculateEatingWindow(input);

    expect(result.eatingWindowStart).toBeDefined();
    expect(result.windowDuration).toBeGreaterThan(0);
  });
});
```

## 🎨 Design System

### Colors

FuelTime uses a custom color palette defined as CSS variables:

| Color | Variable | Usage |
|-------|----------|-------|
| Green | `--fueltime-green-500` | Primary actions, eating window |
| Orange | `--fueltime-orange-500` | Accents, warmth indicators |
| Blue | `--fueltime-blue-500` | Fasting zones, information |
| Gray | `--fueltime-gray-*` | Text, backgrounds, borders |

### Typography

- **Headings:** Poppins (600-700 weight)
- **Body:** Inter (400-500 weight)

### Components

All UI components use HeroUI as a base with custom styling:

```tsx
<Button
  className="bg-[var(--fueltime-green-500)] hover:bg-[var(--fueltime-green-600)] text-white"
  onPress={handleClick}
>
  Log Meal
</Button>
```

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Static Export

```bash
# Build static export
npm run build

# Files will be in .next/standalone
```

### PWA Configuration

The app is configured as a PWA with:
- Service worker for offline support
- Manifest for installability
- Icon set for various platforms

## 🔧 Configuration

### Environment Variables

Currently no environment variables required (fully client-side).

### TypeScript Configuration

Strict mode enabled with path aliases:

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`npm run test:run`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Code Standards

- TypeScript strict mode
- Zod validation for runtime data
- Tests for all business logic
- Error boundaries for UI components
- Accessibility (ARIA labels, keyboard navigation)

## 📚 Learn More

### Chrononutrition Research

- [Time-Restricted Eating and Metabolic Health](https://www.cell.com/cell-metabolism/fulltext/S1550-4131(18)30253-5)
- [Circadian Rhythms and Meal Timing](https://academic.oup.com/advances/article/10/suppl_4/S293/5624059)

### Technical Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [HeroUI Components](https://heroui.com)
- [Framer Motion](https://www.framer.com/motion/)

## 📄 License

MIT License - see LICENSE file for details.

---

Built with ❤️ for better health through meal timing science.
