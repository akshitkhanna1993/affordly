export interface UserProfile {
  income_monthly: number;
  essentials: number;
  savings: number;
  savings_rate_floor: number; // as decimal (0.2 = 20%)
}

export interface PurchaseItem {
  price: number;
  recurring: number; // monthly recurring cost
  lifespan_months: number;
  uses_per_week?: number;
  hours_total?: number;
  resale_pct?: number; // as decimal (0.3 = 30%)
}

export interface AffordabilityResult {
  verdict: "Buy now" | "Don't buy now 🚫" | "Affordable but poor value";
  reasons: string[];
  math: {
    free_cashflow: number;
    recurring: number;
    post_savings_balance: number;
    cost_per_use_or_hour: number;
  };
  next_step?: string;
}

export interface AffordabilityChecks {
  free_cashflow_pass: boolean;
  savings_floor_pass: boolean;
  free_cashflow: number;
  post_savings_balance: number;
}
