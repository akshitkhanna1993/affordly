import { describe, it, expect, beforeEach } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useProfileStore } from "@/stores/profile";
import { useAffordabilityCalculator } from "@/composables/affordability";
import {
  testProfile,
  scenarioAItem,
  scenarioBItem,
  scenarioCItem,
} from "../utils/test-data";

describe("User Flow Integration Tests", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    sessionStorage.clear();
  });

  describe("Complete User Journey", () => {
    it("should complete full flow: Profile Setup → Item Evaluation → Results (Scenario A)", () => {
      // Step 1: Setup Profile
      const store = useProfileStore();
      store.saveProfile(testProfile);

      expect(store.hasProfile).toBe(true);
      expect(store.profile).toEqual(testProfile);

      // Step 2: Evaluate Item (Scenario A)
      const { result } = useAffordabilityCalculator(testProfile, scenarioAItem);

      // Step 3: Verify Results
      expect(result.value.verdict).toBe("Don't buy now 🚫");
      expect(result.value.reasons).toContain("Savings floor violated");
      expect(result.value.math.post_savings_balance).toBeLessThan(
        3 * testProfile.essentials
      );
    });

    it("should complete full flow: Profile Setup → Item Evaluation → Results (Scenario B)", () => {
      // Step 1: Setup Profile with higher savings
      const profile = { ...testProfile, savings: 15000 };
      const store = useProfileStore();
      store.saveProfile(profile);

      expect(store.hasProfile).toBe(true);

      // Step 2: Evaluate Item (Scenario B)
      const { result, goalScore } = useAffordabilityCalculator(
        profile,
        scenarioBItem
      );

      // Step 3: Verify Results
      expect(result.value.math.free_cashflow).toBeGreaterThanOrEqual(0);
      expect(result.value.math.post_savings_balance).toBeGreaterThanOrEqual(
        3 * profile.essentials
      );
      expect(goalScore.value).toBeGreaterThanOrEqual(50);
      expect(goalScore.value).toBeLessThan(80);
      expect(result.value.verdict).toBe("Affordable but poor value");
    });

    it("should complete full flow: Profile Setup → Item Evaluation → Results (Scenario C)", () => {
      // Step 1: Setup Profile with higher savings
      const profile = { ...testProfile, savings: 15000 };
      const store = useProfileStore();
      store.saveProfile(profile);

      expect(store.hasProfile).toBe(true);

      // Step 2: Evaluate Item (Scenario C)
      const { result, goalScore } = useAffordabilityCalculator(
        profile,
        scenarioCItem
      );

      // Step 3: Verify Results
      expect(result.value.math.free_cashflow).toBeGreaterThanOrEqual(0);
      expect(result.value.math.post_savings_balance).toBeGreaterThanOrEqual(
        3 * profile.essentials
      );
      expect(goalScore.value).toBeGreaterThanOrEqual(80);
      expect(result.value.verdict).toBe("Buy now");
    });
  });

  describe("Data Persistence", () => {
    it("should persist profile across page reloads", () => {
      const store1 = useProfileStore();
      store1.saveProfile(testProfile);

      // Simulate page reload by creating new store instance
      const store2 = useProfileStore();
      store2.loadProfile();

      expect(store2.profile).toEqual(testProfile);
      expect(store2.hasProfile).toBe(true);
    });

    it("should maintain computed properties after profile load", () => {
      const store = useProfileStore();
      store.saveProfile(testProfile);

      expect(store.monthlySavingsTarget).toBe(
        testProfile.income_monthly * testProfile.savings_rate_floor
      );
      expect(store.disposableIncome).toBe(
        testProfile.income_monthly - testProfile.essentials
      );
    });
  });

  describe("Multiple Evaluations", () => {
    it("should handle multiple item evaluations with same profile", () => {
      const store = useProfileStore();
      const profile = { ...testProfile, savings: 15000 };
      store.saveProfile(profile);

      // Evaluate first item
      const result1 = useAffordabilityCalculator(profile, scenarioBItem);
      expect(result1.result.value.verdict).toBe("Affordable but poor value");

      // Evaluate second item
      const result2 = useAffordabilityCalculator(profile, scenarioCItem);
      expect(result2.result.value.verdict).toBe("Buy now");

      // Profile should remain unchanged
      expect(store.profile).toEqual(profile);
    });
  });

  describe("Edge Cases in User Flow", () => {
    it("should handle profile update and re-evaluation", () => {
      const store = useProfileStore();
      store.saveProfile(testProfile);

      // Initial evaluation
      const result1 = useAffordabilityCalculator(testProfile, scenarioAItem);
      expect(result1.result.value.verdict).toBe("Don't buy now 🚫");

      // Update profile with more savings
      const updatedProfile = { ...testProfile, savings: 20000 };
      store.saveProfile(updatedProfile);

      // Re-evaluate same item
      const result2 = useAffordabilityCalculator(updatedProfile, scenarioAItem);
      // Should still fail affordability but for different reasons potentially
      expect(result2.result.value).toBeDefined();
    });
  });
});
