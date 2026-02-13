<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">
        Set Up Your Financial Profile
      </h2>
      <p class="text-gray-600 mb-8 text-center">
        This information helps us determine if you can afford purchases while
        maintaining your financial health.
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Monthly Income -->
          <div>
            <label
              for="income"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Monthly Net Income
            </label>
            <input
              id="income"
              v-model.number="form.income_monthly"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="5000"
            />
            <p class="text-sm text-gray-500 mt-1">
              Your take-home pay after taxes
            </p>
          </div>

          <!-- Essential Expenses -->
          <div>
            <label
              for="essentials"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Monthly Essential Expenses
            </label>
            <input
              id="essentials"
              v-model.number="form.essentials"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="3000"
            />
            <p class="text-sm text-gray-500 mt-1">
              Rent, food, utilities, insurance, etc.
            </p>
          </div>

          <!-- Current Savings -->
          <div>
            <label
              for="savings"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Current Savings Balance
            </label>
            <input
              id="savings"
              v-model.number="form.savings"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="10000"
            />
            <p class="text-sm text-gray-500 mt-1">
              Your emergency fund and savings
            </p>
          </div>

          <!-- Savings Rate Floor -->
          <div>
            <label
              for="savings_rate"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Minimum Savings Rate
            </label>
            <div class="relative">
              <input
                id="savings_rate"
                v-model.number="form.savings_rate_floor"
                type="number"
                step="0.01"
                min="0"
                max="1"
                required
                class="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.20"
              />
              <span
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >%</span
              >
            </div>
            <p class="text-sm text-gray-500 mt-1">
              Minimum % of income to save (20% = 0.20)
            </p>
          </div>
        </div>

        <!-- Summary -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h3 class="font-semibold text-gray-900 mb-2">
            Your Financial Summary
          </h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Disposable Income:</span>
              <span class="font-medium ml-2">{{
                disposableIncome.toFixed(2)
              }}</span>
            </div>
            <div>
              <span class="text-gray-600">Monthly Savings Target:</span>
              <span class="font-medium ml-2">{{
                monthlySavingsTarget.toFixed(2)
              }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-center">
          <button
            type="submit"
            :disabled="!isFormValid"
            class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Save Profile & Continue
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import { useProfileStore } from "@/stores/profile";
import type { UserProfile } from "@/types/financial";

const router = useRouter();
const profileStore = useProfileStore();

const form = reactive<Partial<UserProfile>>({
  income_monthly: 0,
  essentials: 0,
  savings: 0,
  savings_rate_floor: 0.2,
});

const disposableIncome = computed(() => {
  const income = form.income_monthly || 0;
  const essentials = form.essentials || 0;
  return income - essentials;
});

const monthlySavingsTarget = computed(() => {
  const income = form.income_monthly || 0;
  const rate = form.savings_rate_floor || 0;
  return income * rate;
});

const isFormValid = computed(() => {
  return (
    form.income_monthly! > 0 &&
    form.essentials! > 0 &&
    form.savings! >= 0 &&
    form.savings_rate_floor! >= 0 &&
    form.savings_rate_floor! <= 1
  );
});

const handleSubmit = () => {
  if (isFormValid.value) {
    profileStore.saveProfile(form as UserProfile);
    router.push("/evaluate");
  }
};
</script>
