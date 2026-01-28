<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="container mx-auto px-4 py-16">
      <div class="text-center mb-16">
        <h1 class="text-6xl font-bold text-gray-900 mb-6">Affordly</h1>
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">
          Your personal financial gatekeeper. Make smart purchasing decisions
          based on your actual financial situation.
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <!-- Features Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="text-4xl mb-4">💰</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              Smart Analysis
            </h3>
            <p class="text-gray-600">
              Analyzes your income, expenses, and savings to determine if you
              can truly afford a purchase.
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="text-4xl mb-4">📊</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              Value Calculation
            </h3>
            <p class="text-gray-600">
              Calculates cost-per-use or cost-per-hour to help you understand
              the true value of your purchase.
            </p>
          </div>

          <div class="bg-white rounded-lg shadow-lg p-6 text-center">
            <div class="text-4xl mb-4">🔒</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              Privacy First
            </h3>
            <p class="text-gray-600">
              All data stays in your browser. No accounts, no external services,
              no data collection.
            </p>
          </div>
        </div>

        <!-- Profile Status -->
        <div class="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
            Get Started
          </h2>

          <div v-if="!profileStore.hasProfile" class="text-center">
            <p class="text-gray-600 mb-6">
              First, set up your financial profile so we can make accurate
              affordability assessments.
            </p>
            <button
              @click="router.push('/profile')"
              class="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-lg"
            >
              Set Up Your Profile
            </button>
          </div>

          <div v-else class="text-center">
            <div class="mb-6">
              <div class="text-green-600 text-4xl mb-2">✅</div>
              <p class="text-gray-600">Your profile is set up and ready!</p>
            </div>
            <div class="flex justify-center space-x-4">
              <button
                @click="router.push('/evaluate')"
                class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Evaluate a Purchase
              </button>
              <button
                @click="router.push('/profile')"
                class="px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>

        <!-- How It Works -->
        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 text-center">
            How It Works
          </h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div
                class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">Set Your Profile</h3>
              <p class="text-gray-600 text-sm">
                Enter your monthly income, essential expenses, current savings,
                and savings goals.
              </p>
            </div>

            <div class="text-center">
              <div
                class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">
                Enter Item Details
              </h3>
              <p class="text-gray-600 text-sm">
                Describe the item: price, recurring costs, expected lifespan,
                and usage patterns.
              </p>
            </div>

            <div class="text-center">
              <div
                class="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4"
              >
                <span class="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">Get Your Verdict</h3>
              <p class="text-gray-600 text-sm">
                Receive a clear recommendation: Buy now, Don't buy now, or
                Affordable but poor value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useProfileStore } from "@/stores/profile";

const router = useRouter();
const profileStore = useProfileStore();
</script>
