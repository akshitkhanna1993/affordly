import type { UserProfile, PurchaseItem } from "@/types/financial";

// Standard test profile
export const testProfile: UserProfile = {
  income_monthly: 6000,
  essentials: 3500,
  savings: 12000,
  savings_rate_floor: 0.2,
};

// Scenario A: Don't buy now (fails savings floor)
export const scenarioAItem: PurchaseItem = {
  price: 7000,
  recurring: 0,
  lifespan_months: 24,
  uses_per_week: 3,
  resale_pct: 0.1,
};

// Scenario B: Affordable but poor value
export const scenarioBItem: PurchaseItem = {
  price: 800,
  recurring: 0,
  lifespan_months: 120,
  uses_per_week: 6,
  resale_pct: 0.2,
};

// Scenario C: Buy now (high score)
export const scenarioCItem: PurchaseItem = {
  price: 800,
  recurring: 0,
  lifespan_months: 120,
  uses_per_week: 10,
  resale_pct: 0.2,
};

// Helper to create custom profiles
export const createProfile = (overrides?: Partial<UserProfile>): UserProfile => ({
  ...testProfile,
  ...overrides,
});

// Helper to create custom items
export const createItem = (overrides?: Partial<PurchaseItem>): PurchaseItem => ({
  price: 1000,
  recurring: 0,
  lifespan_months: 12,
  uses_per_week: 1,
  resale_pct: 0,
  ...overrides,
});
