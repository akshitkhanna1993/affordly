import { describe, it, expect } from "vitest";
import { useAffordabilityCalculator } from "@/composables/affordability";
import type { PurchaseItem } from "@/types/financial";
import {
  testProfile,
  scenarioAItem,
  scenarioBItem,
  scenarioCItem,
  createProfile,
  createItem,
} from "../../utils/test-data";

describe("useAffordabilityCalculator", () => {
  describe("Affordability Checks", () => {
    it("should fail when free cashflow is negative", () => {
      const profile = createProfile({
        income_monthly: 3000,
        essentials: 2500,
        savings_rate_floor: 0.2,
      });
      const item = createItem({ price: 1000, recurring: 100 });

      const { result } = useAffordabilityCalculator(profile, item);

      expect(result.value.verdict).toBe("Don't buy now 🚫");
      expect(result.value.reasons).toContain("Free cashflow too low");
      expect(result.value.math.free_cashflow).toBeLessThan(0);
    });

    it("should fail when savings floor is violated", () => {
      const profile = createProfile({ savings: 10000 });
      const item = createItem({ price: 7000 });

      const { result } = useAffordabilityCalculator(profile, item);

      expect(result.value.verdict).toBe("Don't buy now 🚫");
      expect(result.value.reasons).toContain("Savings floor violated");
      expect(result.value.math.post_savings_balance).toBeLessThan(
        3 * profile.essentials
      );
      expect(result.value.next_step).toContain("Save for");
    });

    it("should pass when both checks are satisfied", () => {
      const profile = createProfile({ savings: 15000 });
      const item = createItem({ price: 1000, recurring: 50 });

      const { result } = useAffordabilityCalculator(profile, item);

      expect(result.value.verdict).not.toBe("Don't buy now 🚫");
      expect(result.value.math.free_cashflow).toBeGreaterThanOrEqual(0);
      expect(result.value.math.post_savings_balance).toBeGreaterThanOrEqual(
        3 * profile.essentials
      );
    });
  });

  describe("Net Cost Calculation", () => {
    it("should calculate net cost correctly with resale value", () => {
      const item = createItem({
        price: 1000,
        recurring: 10,
        lifespan_months: 12,
        resale_pct: 0.3,
      });

      const { netCost } = useAffordabilityCalculator(testProfile, item);

      // Net cost = price - resale + recurring total
      // 1000 - 300 + (10 * 12) = 700 + 120 = 820
      expect(netCost.value).toBe(820);
    });

    it("should calculate net cost without resale value", () => {
      const item = createItem({
        price: 1000,
        recurring: 20,
        lifespan_months: 6,
        resale_pct: 0,
      });

      const { netCost } = useAffordabilityCalculator(testProfile, item);

      // Net cost = 1000 + (20 * 6) = 1120
      expect(netCost.value).toBe(1120);
    });
  });

  describe("Cost Per Use/Hour Calculation", () => {
    it("should calculate cost per use correctly", () => {
      const item = createItem({
        price: 1000,
        recurring: 0,
        lifespan_months: 12,
        uses_per_week: 5,
        resale_pct: 0,
      });

      const { costPerUseOrHour, netCost } = useAffordabilityCalculator(
        testProfile,
        item
      );

      const totalUses = 5 * 4.3 * (12 / 12); // 21.5 uses
      const expectedCostPerUse = netCost.value / totalUses;

      expect(costPerUseOrHour.value).toBeCloseTo(expectedCostPerUse, 2);
    });

    it("should calculate cost per hour correctly", () => {
      // Create item without uses_per_week to test hours_total calculation
      const item: PurchaseItem = {
        price: 1000,
        recurring: 0,
        lifespan_months: 12,
        hours_total: 200,
        resale_pct: 0,
      };

      const { costPerUseOrHour, netCost } = useAffordabilityCalculator(
        testProfile,
        item
      );

      const expectedCostPerHour = netCost.value / 200;
      expect(costPerUseOrHour.value).toBeCloseTo(expectedCostPerHour, 2);
    });
  });

  describe("Goal Score Calculation", () => {
    it("should calculate goal score correctly", () => {
      const item = createItem({
        price: 800,
        recurring: 0,
        lifespan_months: 120,
        uses_per_week: 10,
        resale_pct: 0.2,
      });

      const { goalScore, netCost } = useAffordabilityCalculator(
        testProfile,
        item
      );

      const goalYears = 120 / 12; // 10 years
      const costYears = netCost.value / (testProfile.income_monthly * testProfile.savings_rate_floor);
      const expToCostRatio = goalYears / costYears;
      const impact = Math.min(5, 10 / 2); // 5
      const expectedScore = Math.min(100, expToCostRatio * impact);

      expect(goalScore.value).toBeCloseTo(expectedScore, 1);
    });

    it("should cap goal score at 100", () => {
      const item = createItem({
        price: 100,
        recurring: 0,
        lifespan_months: 240,
        uses_per_week: 20,
        resale_pct: 0,
      });

      const { goalScore } = useAffordabilityCalculator(testProfile, item);

      expect(goalScore.value).toBeLessThanOrEqual(100);
    });
  });

  describe("Scenario A: Don't Buy Now (Savings Floor)", () => {
    it("should return 'Don't buy now 🚫' for scenario A", () => {
      const { result } = useAffordabilityCalculator(testProfile, scenarioAItem);

      expect(result.value.verdict).toBe("Don't buy now 🚫");
      expect(result.value.reasons).toContain("Savings floor violated");
      expect(result.value.math.post_savings_balance).toBeLessThan(
        3 * testProfile.essentials
      );
    });
  });

  describe("Scenario B: Affordable but Poor Value", () => {
    it("should return 'Affordable but poor value' for scenario B", () => {
      const profile = createProfile({ savings: 15000 }); // Ensure affordability passes
      const { result, goalScore } = useAffordabilityCalculator(
        profile,
        scenarioBItem
      );

      // Should pass affordability checks
      expect(result.value.math.free_cashflow).toBeGreaterThanOrEqual(0);
      expect(result.value.math.post_savings_balance).toBeGreaterThanOrEqual(
        3 * profile.essentials
      );

      // Goal score should be between 50-79
      expect(goalScore.value).toBeGreaterThanOrEqual(50);
      expect(goalScore.value).toBeLessThan(80);
      expect(result.value.verdict).toBe("Affordable but poor value");
    });
  });

  describe("Scenario C: Buy Now", () => {
    it("should return 'Buy now' for scenario C", () => {
      const profile = createProfile({ savings: 15000 }); // Ensure affordability passes
      const { result, goalScore } = useAffordabilityCalculator(
        profile,
        scenarioCItem
      );

      // Should pass affordability checks
      expect(result.value.math.free_cashflow).toBeGreaterThanOrEqual(0);
      expect(result.value.math.post_savings_balance).toBeGreaterThanOrEqual(
        3 * profile.essentials
      );

      // Goal score should be >= 80
      expect(goalScore.value).toBeGreaterThanOrEqual(80);
      expect(result.value.verdict).toBe("Buy now");
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero recurring cost", () => {
      const item = createItem({ recurring: 0 });
      const { result } = useAffordabilityCalculator(testProfile, item);

      expect(result.value.math.recurring).toBe(0);
    });

    it("should handle zero resale value", () => {
      const item = createItem({ resale_pct: 0 });
      const { netCost } = useAffordabilityCalculator(testProfile, item);

      expect(netCost.value).toBeGreaterThan(0);
    });

    it("should handle very short lifespan", () => {
      const item = createItem({ lifespan_months: 1 });
      const { goalScore } = useAffordabilityCalculator(testProfile, item);

      expect(goalScore.value).toBeGreaterThanOrEqual(0);
    });

    it("should handle very high usage frequency", () => {
      const item = createItem({ uses_per_week: 100 });
      const { goalScore } = useAffordabilityCalculator(testProfile, item);

      // Impact should be capped at 5
      expect(goalScore.value).toBeLessThanOrEqual(100);
    });
  });
});
