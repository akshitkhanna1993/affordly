# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to `http://localhost:3000`

### 4. Test the App

Use these exact values to see all three scenarios:

#### Scenario A: Don't Buy Now 🚫
**Profile:**
- Income: $6,000
- Essentials: $3,500
- Savings: $12,000
- Savings Rate: 0.20

**Item:**
- Price: $7,000
- Recurring: $0
- Lifespan: 24 months
- Uses/Week: 3
- Resale: 0.10

#### Scenario B: Affordable but Poor Value ⚠️
**Profile:**
- Income: $6,000
- Essentials: $3,500
- Savings: $15,000
- Savings Rate: 0.20

**Item:**
- Price: $800
- Recurring: $0
- Lifespan: 120 months
- Uses/Week: 6
- Resale: 0.20

#### Scenario C: Buy Now ✅
**Profile:**
- Income: $6,000
- Essentials: $3,500
- Savings: $15,000
- Savings Rate: 0.20

**Item:**
- Price: $800
- Recurring: $0
- Lifespan: 120 months
- Uses/Week: 10
- Resale: 0.20

---

## 📊 Understanding the Results

### Verdict Types

1. **"Buy now"** ✅
   - Passes affordability checks
   - Goal score ≥ 80
   - Excellent value proposition

2. **"Affordable but poor value"** ⚠️
   - Passes affordability checks
   - Goal score 50-79
   - Consider alternatives

3. **"Don't buy now 🚫"**
   - Fails affordability checks OR
   - Goal score < 50
   - Not recommended

### Key Metrics Explained

- **Free Cashflow**: Income - Essentials - (Savings Rate × Income)
- **Post-Purchase Savings**: Current Savings - Item Price
- **Net Cost**: Price - Resale Value + (Recurring × Lifespan)
- **Goal Score**: 0-100 based on expected lifespan vs. cost recovery time
- **Cost per Use/Hour**: Net Cost divided by total uses or hours

---

## 🛠 Common Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run lint             # Check code quality
npm run lint:fix         # Auto-fix issues

# Testing
npm run test             # Run tests (watch mode)
npm run test:run         # Run tests once
npm run test:coverage    # Generate coverage report
```

---

## 📁 Key Files

- `src/composables/affordability.ts` - Core calculation logic
- `src/stores/profile.ts` - Profile state management
- `src/components/ProfileSetup.vue` - Profile form
- `src/components/ItemEvaluation.vue` - Item evaluation form
- `src/components/ResultsDisplay.vue` - Results display

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Tests Failing
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build Errors
```bash
# Check TypeScript errors
npm run build
# Fix any type errors shown
```

---

## 📚 Next Steps

1. Read the full [README.md](../README.md) for detailed documentation
2. Check [tests/README.md](../tests/README.md) for testing guide
3. Explore the codebase starting with `src/composables/affordability.ts`

---

**Happy Coding! 🎉**
