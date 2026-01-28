<template>
  <div class="max-w-4xl mx-auto p-6">
    <div class="bg-white rounded-lg shadow-lg p-8">
      <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">
        Affordability Analysis
      </h2>

      <!-- Verdict Card -->
      <div v-if="result" class="mb-8">
        <div :class="['rounded-lg p-6 text-center', verdictClass]">
          <div class="text-4xl mb-4">{{ verdictIcon }}</div>
          <h3 class="text-2xl font-bold mb-2">{{ result.verdict }}</h3>
          <p v-if="result.next_step" class="text-lg">{{ result.next_step }}</p>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="mb-8">
        <div class="rounded-lg p-6 text-center bg-gray-100">
          <div class="text-4xl mb-4">⏳</div>
          <h3 class="text-2xl font-bold mb-2">Analyzing...</h3>
          <p class="text-lg text-gray-600">Calculating affordability...</p>
        </div>
      </div>

      <!-- Reasons -->
      <div v-if="result && result.reasons.length > 0" class="mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Issues Found:</h3>
        <ul class="space-y-2">
          <li
            v-for="reason in result.reasons"
            :key="reason"
            class="flex items-center text-red-600"
          >
            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clip-rule="evenodd"
              />
            </svg>
            {{ reason }}
          </li>
        </ul>
      </div>

      <!-- Financial Breakdown -->
      <div v-if="result" class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <!-- Affordability Checks -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Affordability Checks
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Free Cashflow:</span>
              <span
                :class="[
                  'font-medium',
                  result.math.free_cashflow >= 0
                    ? 'text-green-600'
                    : 'text-red-600',
                ]"
              >
                ${{ result.math.free_cashflow.toFixed(2) }}
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Recurring Cost:</span>
              <span class="font-medium"
                >${{ result.math.recurring.toFixed(2) }}</span
              >
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Post-Purchase Savings:</span>
              <span
                :class="[
                  'font-medium',
                  result.math.post_savings_balance >= 0
                    ? 'text-green-600'
                    : 'text-red-600',
                ]"
              >
                ${{ result.math.post_savings_balance.toFixed(2) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Value Analysis -->
        <div class="bg-gray-50 rounded-lg p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Value Analysis
          </h3>
          <div class="space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Goal Score:</span>
              <span
                :class="[
                  'font-medium text-lg',
                  goalScore >= 80
                    ? 'text-green-600'
                    : goalScore >= 50
                    ? 'text-yellow-600'
                    : 'text-red-600',
                ]"
              >
                {{ goalScore.toFixed(0) }}/100
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Net Cost:</span>
              <span class="font-medium">${{ netCost.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-gray-600">Cost per Use/Hour:</span>
              <span
                :class="[
                  'font-medium',
                  result.math.cost_per_use_or_hour > 50
                    ? 'text-red-600'
                    : 'text-green-600',
                ]"
              >
                ${{ result.math.cost_per_use_or_hour.toFixed(2) }}
              </span>
            </div>
            <div
              v-if="item && item.uses_per_week"
              class="text-sm text-gray-500"
            >
              Based on {{ item.uses_per_week }} uses/week over
              {{ item.lifespan_months }} months
            </div>
            <div v-if="item && item.hours_total" class="text-sm text-gray-500">
              Based on {{ item.hours_total }} total hours of use
            </div>
          </div>
        </div>
      </div>

      <!-- Item Summary -->
      <div v-if="item" class="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Item Summary</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span class="text-gray-600">Price:</span>
            <div class="font-medium">${{ item.price.toFixed(2) }}</div>
          </div>
          <div>
            <span class="text-gray-600">Monthly Cost:</span>
            <div class="font-medium">${{ item.recurring.toFixed(2) }}</div>
          </div>
          <div>
            <span class="text-gray-600">Lifespan:</span>
            <div class="font-medium">{{ item.lifespan_months }} months</div>
          </div>
          <div>
            <span class="text-gray-600">Resale Value:</span>
            <div class="font-medium">
              {{ (item.resale_pct * 100).toFixed(0) }}%
            </div>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex justify-center space-x-4">
        <button
          @click="router.push('/evaluate')"
          class="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Evaluate Another Item
        </button>
        <button
          @click="router.push('/profile')"
          class="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          Update Profile
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useProfileStore } from "@/stores/profile";
import { useAffordabilityCalculator } from "@/composables/affordability";
import type { PurchaseItem, AffordabilityResult } from "@/types/financial";

const router = useRouter();
const profileStore = useProfileStore();

const item = ref<PurchaseItem | null>(null);
const result = ref<AffordabilityResult | null>(null);
const netCost = ref(0);
const goalScore = ref(0);

const verdictClass = computed(() => {
  if (!result.value) return "bg-gray-100";

  switch (result.value.verdict) {
    case "Buy now":
      return "bg-green-100 text-green-800";
    case "Don't buy now 🚫":
      return "bg-red-100 text-red-800";
    case "Affordable but poor value":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100";
  }
});

const verdictIcon = computed(() => {
  if (!result.value) return "❓";

  switch (result.value.verdict) {
    case "Buy now":
      return "✅";
    case "Don't buy now 🚫":
      return "🚫";
    case "Affordable but poor value":
      return "⚠️";
    default:
      return "❓";
  }
});

onMounted(() => {
  // Load item data from sessionStorage
  const itemData = sessionStorage.getItem("affordly-item");
  if (!itemData) {
    router.push("/evaluate");
    return;
  }

  try {
    item.value = JSON.parse(itemData);
  } catch (error) {
    console.error("Failed to parse item data:", error);
    router.push("/evaluate");
    return;
  }

  // Check if profile exists
  if (!profileStore.profile) {
    router.push("/profile");
    return;
  }

  // Calculate affordability
  if (item.value && profileStore.profile) {
    const {
      result: affordabilityResult,
      netCost: calculatedNetCost,
      goalScore: calculatedGoalScore,
    } = useAffordabilityCalculator(profileStore.profile, item.value);

    result.value = affordabilityResult.value;
    netCost.value = calculatedNetCost.value;
    goalScore.value = calculatedGoalScore.value;
  }
});
</script>
