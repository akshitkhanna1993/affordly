# Affordly Test Suite

This directory contains the comprehensive test suite for the Affordly financial gatekeeper application.

## Test Structure

```
tests/
├── setup.ts                 # Test configuration and mocks
├── utils/
│   └── test-data.ts         # Test data helpers and scenarios
├── unit/
│   ├── composables/
│   │   └── affordability.test.ts  # Core affordability logic tests
│   └── stores/
│       └── profile.test.ts         # Profile store tests
├── components/
│   ├── ProfileSetup.test.ts        # Profile setup form tests
│   ├── ItemEvaluation.test.ts      # Item evaluation form tests
│   └── ResultsDisplay.test.ts     # Results display tests
└── integration/
    └── user-flows.test.ts          # End-to-end user flow tests
```

## Running Tests

### Run all tests
```bash
npm run test
```

### Run tests in watch mode
```bash
npm run test
# Press 'a' to run all tests
```

### Run tests with UI
```bash
npm run test:ui
```

### Run tests once (CI mode)
```bash
npm run test:run
```

### Run tests with coverage
```bash
npm run test:coverage
```

## Test Scenarios

The test suite includes tests for all three demo scenarios:

1. **Scenario A**: Don't buy now (fails savings floor)
2. **Scenario B**: Affordable but poor value (mid-range goal score)
3. **Scenario C**: Buy now (high goal score)

## Test Coverage

- ✅ Unit tests for core affordability calculations
- ✅ Store tests for profile management and localStorage
- ✅ Component tests for form validation and user interactions
- ✅ Integration tests for complete user flows
- ✅ Edge case handling

## Writing New Tests

When adding new features:

1. Add unit tests for business logic in `tests/unit/`
2. Add component tests for UI components in `tests/components/`
3. Add integration tests for user flows in `tests/integration/`
4. Update test data helpers in `tests/utils/test-data.ts` if needed

## Test Data

Test data helpers are available in `tests/utils/test-data.ts`:
- `testProfile`: Standard test profile
- `scenarioAItem`, `scenarioBItem`, `scenarioCItem`: Demo scenario items
- `createProfile()`: Helper to create custom profiles
- `createItem()`: Helper to create custom items
