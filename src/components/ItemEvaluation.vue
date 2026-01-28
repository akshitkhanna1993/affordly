<template>
  <div class="max-w-2xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">
        Evaluate a Purchase
      </h2>
      <p class="text-gray-600 mb-8 text-center">
        Enter details about the item you're considering to get an affordability
        verdict.
      </p>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Item Details -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Price -->
          <div>
            <label
              for="price"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Item Price
            </label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >$</span
              >
              <input
                id="price"
                v-model.number="form.price"
                type="number"
                step="0.01"
                min="0"
                required
                class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="999.99"
              />
            </div>
          </div>

          <!-- Recurring Cost -->
          <div>
            <label
              for="recurring"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Monthly Recurring Cost
            </label>
            <div class="relative">
              <span
                class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >$</span
              >
              <input
                id="recurring"
                v-model.number="form.recurring"
                type="number"
                step="0.01"
                min="0"
                class="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>
            <p class="text-sm text-gray-500 mt-1">
              Monthly subscription, maintenance, etc.
            </p>
          </div>

          <!-- Lifespan -->
          <div>
            <label
              for="lifespan"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Expected Lifespan (months)
            </label>
            <input
              id="lifespan"
              v-model.number="form.lifespan_months"
              type="number"
              step="1"
              min="1"
              required
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="24"
            />
            <p class="text-sm text-gray-500 mt-1">
              How long will you use this item?
            </p>
          </div>

          <!-- Resale Value -->
          <div>
            <label
              for="resale"
              class="block text-sm font-medium text-gray-700 mb-2"
            >
              Resale Value (%)
            </label>
            <div class="relative">
              <input
                id="resale"
                v-model.number="form.resale_pct"
                type="number"
                step="0.01"
                min="0"
                max="1"
                class="w-full pr-8 pl-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.3"
              />
              <span
                class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >%</span
              >
            </div>
            <p class="text-sm text-gray-500 mt-1">
              What % of price can you recover? (30% = 0.30)
            </p>
          </div>
        </div>

        <!-- Usage Details -->
        <div class="border-t pt-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Usage Information
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            Provide either usage frequency or total hours to calculate
            cost-per-use or cost-per-hour.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Uses per Week -->
            <div>
              <label
                for="uses_per_week"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Uses per Week
              </label>
              <input
                id="uses_per_week"
                v-model.number="form.uses_per_week"
                type="number"
                step="0.1"
                min="0"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="5"
              />
              <p class="text-sm text-gray-500 mt-1">
                How often will you use this per week?
              </p>
            </div>

            <!-- Total Hours -->
            <div>
              <label
                for="hours_total"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Total Hours of Use
              </label>
              <input
                id="hours_total"
                v-model.number="form.hours_total"
                type="number"
                step="0.1"
                min="0"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="200"
              />
              <p class="text-sm text-gray-500 mt-1">
                Total hours you'll use this item
              </p>
            </div>
          </div>
        </div>

        <div class="flex justify-center space-x-4">
          <button
            type="button"
            @click="router.push('/profile')"
            class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Profile
          </button>
          <button
            type="submit"
            :disabled="!isFormValid"
            class="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Evaluate Purchase
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";
import type { PurchaseItem } from "@/types/financial";

const router = useRouter();

const form = reactive<Partial<PurchaseItem>>({
  price: 0,
  recurring: 0,
  lifespan_months: 24,
  uses_per_week: undefined,
  hours_total: undefined,
  resale_pct: 0,
});

const isFormValid = computed(() => {
  const hasPrice = form.price! > 0;
  const hasLifespan = form.lifespan_months! > 0;
  const hasUsage =
    (form.uses_per_week && form.uses_per_week > 0) ||
    (form.hours_total && form.hours_total > 0);

  return hasPrice && hasLifespan && hasUsage;
});

const handleSubmit = () => {
  if (isFormValid.value) {
    // Store the item data and navigate to results
    const itemData = {
      ...form,
      price: form.price!,
      recurring: form.recurring || 0,
      lifespan_months: form.lifespan_months!,
      resale_pct: form.resale_pct || 0,
    } as PurchaseItem;

    // Store in sessionStorage for the results page
    sessionStorage.setItem("affordly-item", JSON.stringify(itemData));
    router.push("/results");
  }
};
</script>
