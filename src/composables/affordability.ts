import { computed } from "vue";
import type {
  UserProfile,
  PurchaseItem,
  AffordabilityResult,
  AffordabilityChecks,
} from "@/types/financial";

export function useAffordabilityCalculator(
  profile: UserProfile,
  item: PurchaseItem
) {
  // Calculate affordability checks
  const checks = computed((): AffordabilityChecks => {
    const free_cashflow =
      profile.income_monthly -
      profile.essentials -
      profile.savings_rate_floor * profile.income_monthly;
    const post_savings_balance = profile.savings - item.price;

    return {
      free_cashflow_pass: free_cashflow >= item.recurring,
      savings_floor_pass: post_savings_balance >= 3 * profile.essentials,
      free_cashflow,
      post_savings_balance,
    };
  });

  // Calculate net cost
  const netCost = computed(() => {
    const resaleValue = item.resale_pct ? item.price * item.resale_pct : 0;
    const recurringTotal = item.recurring * item.lifespan_months;
    return item.price - resaleValue + recurringTotal;
  });

  // Calculate cost per use or hour
  const costPerUseOrHour = computed(() => {
    if (item.uses_per_week) {
      const totalUses = item.uses_per_week * 4.3 * (item.lifespan_months / 12);
      return totalUses > 0 ? netCost.value / totalUses : 0;
    }
    if (item.hours_total) {
      return item.hours_total > 0 ? netCost.value / item.hours_total : 0;
    }
    return 0;
  });

  // Calculate goal-based scoring
  const goalScore = computed(() => {
    const goalYears = item.lifespan_months / 12;
    const costYears =
      netCost.value / (profile.income_monthly * profile.savings_rate_floor);
    const expToCostRatio = goalYears / costYears;

    // Calculate impact based on usage frequency
    let impact = 1;
    if (item.uses_per_week) {
      impact = Math.min(5, item.uses_per_week / 2); // Scale with usage frequency
    } else if (item.hours_total) {
      impact = Math.min(5, item.hours_total / 100); // Scale with total hours
    }

    return Math.min(100, expToCostRatio * impact);
  });

  // Determine verdict and reasons
  const result = computed((): AffordabilityResult => {
    const checkResults = checks.value;
    const reasons: string[] = [];
    let verdict: AffordabilityResult["verdict"];
    let next_step: string | undefined;

    // Simplified affordability check
    if (
      checkResults.free_cashflow < 0 ||
      checkResults.post_savings_balance < 3 * profile.essentials
    ) {
      verdict = "Don't buy now 🚫";

      if (checkResults.free_cashflow < 0) {
        reasons.push("Free cashflow too low");
      }
      if (checkResults.post_savings_balance < 3 * profile.essentials) {
        reasons.push("Savings floor violated");
        const shortfall =
          3 * profile.essentials - checkResults.post_savings_balance;
        const monthsToSave = Math.ceil(
          shortfall / (profile.income_monthly * profile.savings_rate_floor)
        );
        next_step = `Save for ${monthsToSave} months before buying`;
      }
    } else {
      // Goal-based scoring
      const score = goalScore.value;

      if (score >= 80) {
        verdict = "Buy now";
      } else if (score >= 50) {
        verdict = "Affordable but poor value";
        reasons.push("Low goal score - consider alternatives");
      } else {
        verdict = "Don't buy now 🚫";
        reasons.push("Very poor value - not recommended");
      }
    }

    return {
      verdict,
      reasons,
      math: {
        free_cashflow: checkResults.free_cashflow,
        recurring: item.recurring,
        post_savings_balance: checkResults.post_savings_balance,
        cost_per_use_or_hour: costPerUseOrHour.value,
      },
      next_step,
    };
  });

  return {
    checks,
    netCost,
    costPerUseOrHour,
    goalScore,
    result,
  };
}
