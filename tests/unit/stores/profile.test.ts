import { describe, it, expect, beforeEach, vi } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useProfileStore } from "@/stores/profile";
import { testProfile, createProfile } from "../../utils/test-data";
import type { UserProfile } from "@/types/financial";

describe("useProfileStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  describe("Profile Management", () => {
    it("should start with no profile", () => {
      const store = useProfileStore();
      expect(store.hasProfile).toBe(false);
      expect(store.profile).toBe(null);
    });

    it("should save profile to localStorage", () => {
      const store = useProfileStore();
      const profile = createProfile();

      store.saveProfile(profile);

      expect(store.profile).toEqual(profile);
      expect(store.hasProfile).toBe(true);
      expect(localStorage.getItem("affordly-profile")).toBe(
        JSON.stringify(profile)
      );
    });

    it("should load profile from localStorage on initialization", () => {
      const profile = createProfile();
      localStorage.setItem("affordly-profile", JSON.stringify(profile));

      const store = useProfileStore();

      expect(store.profile).toEqual(profile);
      expect(store.hasProfile).toBe(true);
    });

    it("should clear profile", () => {
      const store = useProfileStore();
      const profile = createProfile();

      store.saveProfile(profile);
      expect(store.hasProfile).toBe(true);

      store.clearProfile();

      expect(store.profile).toBe(null);
      expect(store.hasProfile).toBe(false);
      expect(localStorage.getItem("affordly-profile")).toBe(null);
    });

    it("should handle invalid JSON in localStorage gracefully", () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      
      localStorage.setItem("affordly-profile", "invalid json");

      const store = useProfileStore();

      expect(store.profile).toBe(null);
      expect(store.hasProfile).toBe(false);
      
      consoleSpy.mockRestore();
    });
  });

  describe("Computed Properties", () => {
    it("should calculate monthly savings target correctly", () => {
      const store = useProfileStore();
      const profile = createProfile({
        income_monthly: 5000,
        savings_rate_floor: 0.2,
      });

      store.saveProfile(profile);

      expect(store.monthlySavingsTarget).toBe(1000); // 5000 * 0.2
    });

    it("should return 0 for monthly savings target when no profile", () => {
      const store = useProfileStore();

      expect(store.monthlySavingsTarget).toBe(0);
    });

    it("should calculate disposable income correctly", () => {
      const store = useProfileStore();
      const profile = createProfile({
        income_monthly: 5000,
        essentials: 3000,
      });

      store.saveProfile(profile);

      expect(store.disposableIncome).toBe(2000); // 5000 - 3000
    });

    it("should return 0 for disposable income when no profile", () => {
      const store = useProfileStore();

      expect(store.disposableIncome).toBe(0);
    });

    it("should update computed properties when profile changes", () => {
      const store = useProfileStore();

      const profile1 = createProfile({
        income_monthly: 5000,
        essentials: 3000,
        savings_rate_floor: 0.2,
      });
      store.saveProfile(profile1);

      expect(store.monthlySavingsTarget).toBe(1000);
      expect(store.disposableIncome).toBe(2000);

      const profile2 = createProfile({
        income_monthly: 8000,
        essentials: 4000,
        savings_rate_floor: 0.25,
      });
      store.saveProfile(profile2);

      expect(store.monthlySavingsTarget).toBe(2000); // 8000 * 0.25
      expect(store.disposableIncome).toBe(4000); // 8000 - 4000
    });
  });

  describe("Edge Cases", () => {
    it("should handle zero income", () => {
      const store = useProfileStore();
      const profile = createProfile({
        income_monthly: 0,
        essentials: 0,
      });

      store.saveProfile(profile);

      expect(store.monthlySavingsTarget).toBe(0);
      expect(store.disposableIncome).toBe(0);
    });

    it("should handle very high savings rate", () => {
      const store = useProfileStore();
      const profile = createProfile({
        income_monthly: 5000,
        savings_rate_floor: 0.9,
      });

      store.saveProfile(profile);

      expect(store.monthlySavingsTarget).toBe(4500);
    });

    it("should handle profile with all zero values", () => {
      const store = useProfileStore();
      const profile: UserProfile = {
        income_monthly: 0,
        essentials: 0,
        savings: 0,
        savings_rate_floor: 0,
      };

      store.saveProfile(profile);

      expect(store.hasProfile).toBe(true);
      expect(store.monthlySavingsTarget).toBe(0);
      expect(store.disposableIncome).toBe(0);
    });
  });
});
