# Changelog

## [0.2.0] - 2024-02-06

### Added - Quality Standards Refactor

This release applies our established development skill standards to FuelTime, making it a template for future projects.

#### Testing Infrastructure
- Added Vitest testing framework with React Testing Library
- Created comprehensive test suite (90 tests across 5 files)
  - `eating-window.test.ts` - 26 tests for chrononutrition algorithm
  - `storage.test.ts` - 19 tests for localStorage persistence
  - `time.test.ts` - 18 tests for time utilities
  - `schemas.test.ts` - 16 tests for validation schemas
  - `InsightCard.test.tsx` - 11 tests for component behavior
- Added test setup with localStorage, matchMedia, and ResizeObserver mocks
- Added test scripts: `test`, `test:run`, `test:coverage`, `test:ui`

#### Code Quality
- Added Zod validation schemas for runtime type safety
  - User profile validation
  - Meal log validation
  - Calculation input validation
  - Import/export data validation
- Created shared time utilities to eliminate code duplication
  - `formatTime12h()` - 12-hour time formatting
  - `timeToMinutes()` / `minutesToTime()` - Time conversions
  - `getCurrentTime()` / `getCurrentDate()` - Current time helpers
  - `minutesBetween()` - Duration calculations
  - `isTimeInRange()` - Range checking
- Added Error Boundary component for graceful error handling
  - `ErrorBoundary` class component with fallback UI
  - `ErrorSection` wrapper for specific sections
  - `withErrorBoundary` HOC for functional components

#### Architecture Improvements
- Centralized library exports in `lib/index.ts`
- Created `lib/utils/` directory for shared utilities
- Created `lib/validation/` directory for schemas
- Updated providers to wrap app with ErrorBoundary

#### Documentation
- Complete README rewrite with:
  - Architecture overview
  - Project structure documentation
  - Testing instructions
  - Deployment guide
  - Code standards
- Added `design.md` with comprehensive design system:
  - Color palette documentation
  - Typography scale
  - Component patterns
  - Spacing and layout tokens
- Added `TESTING.md` with:
  - Testing strategy
  - Test organization
  - Mocking patterns
  - Coverage goals

### Changed
- Updated `package.json` with test scripts
- Updated `tsconfig.json` to include Vitest globals
- Updated component index to export ErrorBoundary

### Technical Debt Addressed
- ✅ No tests → Comprehensive test suite
- ✅ No error boundaries → Global error handling
- ✅ No validation → Zod schemas
- ✅ Code duplication → Shared utilities
- ✅ Missing documentation → Full docs

---

## [0.1.0] - Initial Release

- Core chrononutrition algorithm
- Personalized eating window calculation
- Performance zone calculations
- Meal logging with timing scores
- PWA support
- Onboarding flow
- Settings panel
