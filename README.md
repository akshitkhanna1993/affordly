# Affordly 💰

**Your Personal Financial Gatekeeper** - Make smart purchasing decisions based on your actual financial situation.

Affordly is a privacy-first web application that helps you determine if you can truly afford a purchase by analyzing your income, expenses, savings, and the item's value proposition. All data stays in your browser - no accounts, no external services, no data collection.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [How It Works](#how-it-works)
- [Demo Scenarios](#demo-scenarios)
- [Installation](#installation)
- [Usage Guide](#usage-guide)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Development](#development)

---

## 🎯 Overview

Affordly uses a two-step decision process to help you make informed purchasing decisions:

1. **Affordability Check**: Ensures you can afford the purchase without compromising your financial health
2. **Value Assessment**: Calculates a goal-based score to determine if the purchase provides good value

The app analyzes:

- Your monthly income and essential expenses
- Current savings balance
- Minimum savings rate goals
- Item price, recurring costs, and expected lifespan
- Usage frequency or total hours of use
- Potential resale value

---

## ✨ Features

- 💰 **Smart Financial Analysis** - Analyzes income, expenses, and savings to determine true affordability
- 📊 **Value Calculation** - Calculates cost-per-use or cost-per-hour to understand true value
- 🎯 **Goal-Based Scoring** - Provides a 0-100 score based on expected lifespan vs. cost recovery time
- 🔒 **Privacy First** - All data stored locally in your browser (localStorage)
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ⚡ **Fast & Modern** - Built with Vue 3 and Vite for optimal performance
- 🧪 **Fully Tested** - Comprehensive test suite with unit, component, and integration tests

---

## 🛠 Tech Stack

### Core Framework

- **Vue 3** (v3.5.13) - Progressive JavaScript framework with Composition API
- **TypeScript** (v5.8.3) - Type-safe JavaScript for better code quality
- **Vite** (v6.3.5) - Next-generation build tool and dev server

### Styling & UI

- **Tailwind CSS** (v4.1.6) - Utility-first CSS framework
- **@tailwindcss/vite** - Tailwind integration for Vite
- **tw-animate-css** - Animation utilities

### State Management & Routing

- **Pinia** (v3.0.2) - Official Vue state management
- **pinia-plugin-persistedstate** (v4.3.0) - Persist Pinia state to localStorage
- **Vue Router** (v4.5.1) - Official router for Vue.js

### Form Validation

- **VeeValidate** (v4.15.1) - Form validation library
- **@vee-validate/zod** - Zod integration for VeeValidate
- **Zod** (v3.25.67) - TypeScript-first schema validation

### UI Components & Utilities

- **reka-ui** (v2.4.0) - Component library
- **lucide-vue-next** (v0.510.0) - Icon library
- **vue-sonner** (v2.0.0) - Toast notifications
- **@vueuse/core** (v13.5.0) - Collection of Vue composition utilities
- **class-variance-authority** - Component variant management
- **clsx** & **tailwind-merge** - Conditional class utilities

### Testing

- **Vitest** (v2.1.8) - Fast unit test framework
- **@vue/test-utils** (v2.4.6) - Vue component testing utilities
- **@testing-library/vue** (v8.1.0) - Testing Library for Vue
- **jsdom** (v25.0.1) - DOM implementation for Node.js

### Development Tools

- **ESLint** (v9.27.0) - Code linting
- **@antfu/eslint-config** - Opinionated ESLint config
- **vue-tsc** (v2.2.10) - TypeScript type checking for Vue

### Mobile (Capacitor)

- **@capacitor/core** (v7.2.0) - Cross-platform native runtime
- **@capacitor/android** & **@capacitor/ios** - Platform-specific implementations

---

## 🧮 How It Works

### Step 1: Affordability Check

The app first checks if you can afford the purchase:

```
Free Cashflow = Income - Essentials - (Savings Rate × Income)
Post-Purchase Savings = Current Savings - Item Price
```

**Rules:**

- ✅ Free Cashflow must be ≥ recurring monthly cost
- ✅ Post-Purchase Savings must be ≥ 3 × Essential Expenses (emergency fund)

If either check fails → **"Don't buy now 🚫"**

### Step 2: Value Assessment (Goal Score)

If affordability checks pass, the app calculates a goal-based score:

```
Net Cost = Price - (Resale % × Price) + (Recurring × Lifespan Months)
Goal Years = Lifespan Months / 12
Cost Years = Net Cost / (Monthly Income × Savings Rate)
Expected-to-Cost Ratio = Goal Years / Cost Years
Impact = Usage Frequency Multiplier (capped at 5)
Goal Score = min(100, Expected-to-Cost Ratio × Impact)
```

**Verdict Based on Score:**

- **Score ≥ 80**: "Buy now" ✅
- **Score 50-79**: "Affordable but poor value" ⚠️
- **Score < 50**: "Don't buy now" 🚫

### Impact Calculation

- **If uses_per_week provided**: `Impact = min(5, uses_per_week / 2)`
- **If hours_total provided**: `Impact = min(5, hours_total / 100)`
- **Default**: `Impact = 1`

---

## 🎬 Demo Scenarios

Here are three complete scenarios demonstrating different outcomes. Use these exact values to test the app:

### Scenario A: Don't Buy Now 🚫 (Fails Savings Floor)

**Profile Setup:**

```
Monthly Net Income: $6,000
Monthly Essential Expenses: $3,500
Current Savings Balance: $12,000
Minimum Savings Rate: 0.20 (20%)
```

**Item Evaluation:**

```
Item Price: $7,000
Monthly Recurring Cost: $0
Expected Lifespan: 24 months
Uses per Week: 3
Resale Value: 0.10 (10%)
```

**Expected Result:**

- **Verdict**: "Don't buy now 🚫"
- **Reason**: Savings floor violated
- **Post-Purchase Savings**: $5,000 (below $10,500 minimum)
- **Next Step**: "Save for X months before buying"

---

### Scenario B: Affordable but Poor Value ⚠️

**Profile Setup:**

```
Monthly Net Income: $6,000
Monthly Essential Expenses: $3,500
Current Savings Balance: $15,000 (increased for affordability)
Minimum Savings Rate: 0.20 (20%)
```

**Item Evaluation:**

```
Item Price: $800
Monthly Recurring Cost: $0
Expected Lifespan: 120 months (10 years)
Uses per Week: 6
Resale Value: 0.20 (20%)
```

**Expected Result:**

- **Verdict**: "Affordable but poor value"
- **Reason**: Low goal score - consider alternatives
- **Goal Score**: Between 50-79
- **Affordability**: ✅ Passes both checks

---

### Scenario C: Buy Now ✅

**Profile Setup:**

```
Monthly Net Income: $6,000
Monthly Essential Expenses: $3,500
Current Savings Balance: $15,000 (increased for affordability)
Minimum Savings Rate: 0.20 (20%)
```

**Item Evaluation:**

```
Item Price: $800
Monthly Recurring Cost: $0
Expected Lifespan: 120 months (10 years)
Uses per Week: 10
Resale Value: 0.20 (20%)
```

**Expected Result:**

- **Verdict**: "Buy now"
- **Goal Score**: ≥ 80
- **Affordability**: ✅ Passes both checks
- **Value**: Excellent cost-per-use ratio

---

## 📦 Installation

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn**

### Setup Steps

1. **Clone the repository** (or navigate to the project directory)

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000`

### Available Scripts

| Command                 | Description                              |
| ----------------------- | ---------------------------------------- |
| `npm run dev`           | Start development server with hot reload |
| `npm run build`         | Build for production                     |
| `npm run preview`       | Preview production build locally         |
| `npm run lint`          | Run ESLint to check code quality         |
| `npm run lint:fix`      | Automatically fix ESLint errors          |
| `npm run test`          | Run tests in watch mode                  |
| `npm run test:ui`       | Run tests with interactive UI            |
| `npm run test:run`      | Run tests once (CI mode)                 |
| `npm run test:coverage` | Generate test coverage report            |

---

## 📖 Usage Guide

### Step 1: Set Up Your Financial Profile

1. Navigate to the home page
2. Click "Set Up Your Profile"
3. Enter your financial information:

   - **Monthly Net Income**: Your take-home pay after taxes
   - **Monthly Essential Expenses**: Rent, food, utilities, insurance, etc.
   - **Current Savings Balance**: Your emergency fund and savings
   - **Minimum Savings Rate**: Percentage of income you want to save (e.g., 0.20 for 20%)

4. Review the financial summary
5. Click "Save Profile & Continue"

### Step 2: Evaluate a Purchase

1. Click "Evaluate a Purchase"
2. Enter item details:

   - **Item Price**: One-time purchase cost
   - **Monthly Recurring Cost**: Subscription, maintenance, etc. (if any)
   - **Expected Lifespan**: How long you'll use the item (in months)
   - **Resale Value**: Percentage of price you can recover (e.g., 0.30 for 30%)
   - **Usage Information**: Either "Uses per Week" OR "Total Hours of Use"

3. Click "Evaluate Purchase"

### Step 3: Review Results

The results page shows:

- **Verdict**: Buy now / Don't buy now / Affordable but poor value
- **Issues Found**: Reasons if purchase is not recommended
- **Affordability Checks**: Free cashflow, recurring cost, post-purchase savings
- **Value Analysis**: Goal score, net cost, cost per use/hour
- **Item Summary**: Overview of the item details

---

## 📁 Project Structure

```
affordly/
├── src/
│   ├── components/          # Vue components
│   │   ├── ProfileSetup.vue      # Profile setup form
│   │   ├── ItemEvaluation.vue    # Item evaluation form
│   │   └── ResultsDisplay.vue    # Results display
│   ├── views/               # Page components
│   │   └── Home.vue              # Home page
│   ├── router/              # Vue Router configuration
│   │   └── index.ts
│   ├── stores/              # Pinia stores
│   │   └── profile.ts            # Profile state management
│   ├── composables/         # Vue composables
│   │   └── affordability.ts     # Affordability calculation logic
│   ├── types/               # TypeScript type definitions
│   │   └── financial.ts
│   ├── assets/              # Static assets
│   ├── App.vue              # Root component
│   ├── main.ts              # Application entry point
│   └── style.css            # Global styles
├── tests/                   # Test files
│   ├── setup.ts                  # Test configuration
│   ├── utils/
│   │   └── test-data.ts          # Test data helpers
│   ├── unit/                 # Unit tests
│   │   ├── composables/
│   │   └── stores/
│   ├── components/          # Component tests
│   └── integration/         # Integration tests
├── public/                   # Public assets
├── index.html               # HTML template
├── vite.config.ts           # Vite configuration
├── vitest.config.ts          # Vitest configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── eslint.config.js         # ESLint configuration
└── package.json             # Dependencies and scripts
```

---

## 🧪 Testing

The project includes a comprehensive test suite covering:

- **Unit Tests**: Core affordability logic and store management
- **Component Tests**: Form validation and user interactions
- **Integration Tests**: Complete user flows

### Running Tests

```bash
# Run tests in watch mode
npm run test

# Run tests with UI
npm run test:ui

# Run tests once (for CI)
npm run test:run

# Generate coverage report
npm run test:coverage
```

### Test Coverage

The test suite includes:

- ✅ All three demo scenarios (A, B, C)
- ✅ Edge cases (zero values, extreme inputs)
- ✅ localStorage/sessionStorage mocking
- ✅ Component interaction testing
- ✅ Integration flow validation

See [tests/README.md](./tests/README.md) for detailed testing documentation.

---

## 🚀 Development

### Code Style

- Uses **ESLint** with Antfu's config for code quality
- Follows **Vue 3 Composition API** best practices
- **TypeScript** for type safety
- **Prettier**-compatible formatting

### Key Principles

1. **Privacy First**: All data stays in the browser (localStorage)
2. **Type Safety**: Full TypeScript coverage
3. **Test Coverage**: Comprehensive test suite
4. **User Experience**: Clean, intuitive interface
5. **Performance**: Optimized with Vite and Vue 3

### Contributing

1. Follow the existing code style
2. Write tests for new features
3. Ensure all tests pass
4. Update documentation as needed

---

## 🚀 Deployment

Ready to deploy your app? See the [Deployment Guide](./docs/DEPLOYMENT.md) for step-by-step instructions.

**Quick Deploy Options:**

- **Vercel** (Recommended): Zero-config deployment with automatic HTTPS
- **Netlify**: Great for static sites with form handling
- **Cloudflare Pages**: Fast global CDN
- **GitHub Pages**: Free hosting for public repos

**Quick Checklist:** See [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) for a step-by-step checklist.

---

## 📝 License

This project is private and proprietary.

---

## 🙏 Acknowledgments

- Built with [Vue.js](https://vuejs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Tested with [Vitest](https://vitest.dev/)

---

**Made with ❤️ for smarter financial decisions**
