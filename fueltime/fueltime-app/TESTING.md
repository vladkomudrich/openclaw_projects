# Testing Strategy

FuelTime uses a comprehensive testing approach following the test pyramid principle.

## Test Stack

- **Vitest** - Fast test runner with native ESM support
- **React Testing Library** - Component testing focused on user behavior
- **@testing-library/jest-dom** - Custom DOM matchers

## Running Tests

```bash
# Watch mode (development)
npm test

# Run once (CI)
npm run test:run

# With coverage
npm run test:coverage

# Visual UI
npm run test:ui
```

## Test Organization

```
src/
├── __tests__/
│   └── setup.ts              # Test environment setup
├── lib/
│   ├── algorithms/
│   │   └── eating-window.test.ts  # Algorithm unit tests
│   ├── utils/
│   │   └── time.test.ts           # Utility function tests
│   ├── validation/
│   │   └── schemas.test.ts        # Validation schema tests
│   └── storage.test.ts            # Storage layer tests
└── components/
    └── dashboard/
        └── InsightCard.test.tsx   # Component tests
```

## Test Layers

### 1. Unit Tests (Fastest, Most Numerous)

Test individual functions in isolation:

```typescript
// Example: Testing time utilities
describe('formatTime12h', () => {
  it('should format morning times correctly', () => {
    expect(formatTime12h('08:30')).toBe('8:30 AM');
  });
});
```

**Coverage:**
- Algorithm calculations (eating-window.ts)
- Utility functions (time.ts)
- Validation schemas (schemas.ts)

### 2. Integration Tests (Moderate Speed)

Test interactions between modules:

```typescript
// Example: Testing storage operations
describe('Storage Module', () => {
  it('should persist meal logs across sessions', () => {
    addMealLog({ ... });
    const loaded = loadStorageData();
    expect(loaded.mealLogs).toHaveLength(1);
  });
});
```

**Coverage:**
- Storage CRUD operations
- Context state management
- Data flow through layers

### 3. Component Tests (Slower)

Test React components with user-centric assertions:

```typescript
// Example: Testing InsightCard
describe('InsightCard', () => {
  it('should render title and value', () => {
    render(<InsightCard title="Eating Window" value="10h" ... />);
    expect(screen.getByText('Eating Window')).toBeInTheDocument();
  });
});
```

**Coverage:**
- UI components render correctly
- User interactions work as expected
- Accessibility requirements met

## Test Data Patterns

### Factories

Create consistent test data:

```typescript
const createTestMealLog = (overrides = {}) => ({
  id: 'test-123',
  timestamp: new Date().toISOString(),
  mealType: 'breakfast',
  withinWindow: true,
  timingScore: 95,
  ...overrides,
});
```

### Fixtures

Common test scenarios:

```typescript
const baseInput: CalculationInput = {
  wakeTime: '07:00',
  sleepTime: '23:00',
  chronotype: 'intermediate',
  goal: 'energy_stability',
  workSchedule: 'standard',
};
```

## Mocking Patterns

### localStorage

Mocked in `setup.ts` with a memory-based implementation:

```typescript
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = value; },
    clear: () => { store = {}; },
    // ...
  };
})();
```

### Browser APIs

Common browser APIs mocked in setup:
- `localStorage`
- `matchMedia`
- `IntersectionObserver`
- `ResizeObserver`

## Writing Good Tests

### Naming Convention

```typescript
describe('ModuleName', () => {
  describe('functionName', () => {
    it('should [expected behavior] when [condition]', () => {
      // Arrange, Act, Assert
    });
  });
});
```

### AAA Pattern

```typescript
it('should calculate correct fasting duration', () => {
  // Arrange
  const input = createTestInput({ windowDuration: 10 });
  
  // Act
  const result = calculateEatingWindow(input);
  
  // Assert
  expect(result.fastingDuration).toBe(14);
});
```

### Testing Behavior, Not Implementation

```typescript
// ✅ Good - Tests behavior
it('should return high score for meals within window', () => {
  const score = calculateMealTimingScore('12:00', '12:00');
  expect(score).toBe(100);
});

// ❌ Bad - Tests implementation details
it('should call parseTime twice', () => {
  // This tests how, not what
});
```

## Coverage Goals

| Layer | Target |
|-------|--------|
| Algorithms | 90%+ |
| Utilities | 95%+ |
| Storage | 85%+ |
| Components | 70%+ |
| Overall | 80%+ |

## CI Integration

Tests run automatically on:
- Pull request creation
- Push to main branch

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm run test:run

- name: Upload coverage
  run: npm run test:coverage
```

## Future Improvements

- [ ] E2E tests with Playwright
- [ ] Visual regression tests
- [ ] Accessibility testing with axe-core
- [ ] Performance testing for algorithms
- [ ] Snapshot testing for complex UI
