import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { UserProfile } from "@/types/financial";

const STORAGE_KEY = "affordly-profile";

export const useProfileStore = defineStore("profile", () => {
  const profile = ref<UserProfile | null>(null);

  // Load profile from localStorage on store initialization
  const loadProfile = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        profile.value = JSON.parse(stored);
      } catch (error) {
        console.error("Failed to load profile from localStorage:", error);
        profile.value = null;
      }
    }
  };

  // Save profile to localStorage
  const saveProfile = (newProfile: UserProfile) => {
    profile.value = newProfile;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
  };

  // Clear profile
  const clearProfile = () => {
    profile.value = null;
    localStorage.removeItem(STORAGE_KEY);
  };

  // Computed properties
  const hasProfile = computed(() => profile.value !== null);

  const monthlySavingsTarget = computed(() => {
    if (!profile.value) return 0;
    return profile.value.income_monthly * profile.value.savings_rate_floor;
  });

  const disposableIncome = computed(() => {
    if (!profile.value) return 0;
    return profile.value.income_monthly - profile.value.essentials;
  });

  // Initialize store
  loadProfile();

  return {
    profile,
    hasProfile,
    monthlySavingsTarget,
    disposableIncome,
    loadProfile,
    saveProfile,
    clearProfile,
  };
});
