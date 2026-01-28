# Affordability Calculation Logic

This document provides a detailed explanation of the affordability calculation logic used in Affordly.

---

## 📐 Calculation Formulas

### 1. Free Cashflow Calculation

```
Free Cashflow = Income_Monthly - Essentials - (Savings_Rate_Floor × Income_Monthly)
```

**Example:**
- Income: $6,000
- Essentials: $3,500
- Savings Rate: 0.20 (20%)
- Free Cashflow = $6,000 - $3,500 - ($6,000 × 0.20) = $1,300

**Purpose:** Determines available monthly cash after essentials and savings goals.

---

### 2. Post-Purchase Savings Balance

```
Post_Purchase_Savings = Current_Savings - Item_Price
```

**Example:**
- Current Savings: $12,000
- Item Price: $7,000
- Post-Purchase Savings = $12,000 - $7,000 = $5,000

**Purpose:** Calculates remaining savings after purchase.

---

### 3. Net Cost Calculation

```
Resale_Value = Item_Price × Resale_Percentage
Recurring_Total = Monthly_Recurring × Lifespan_Months
Net_Cost = Item_Price - Resale_Value + Recurring_Total
```

**Example:**
- Item Price: $1,000
- Resale Percentage: 0.30 (30%)
- Monthly Recurring: $10
- Lifespan: 24 months
- Net Cost = $1,000 - ($1,000 × 0.30) + ($10 × 24) = $940

**Purpose:** Calculates the true total cost of ownership.

---

### 4. Cost Per Use Calculation

```
Total_Uses = Uses_Per_Week × 4.3 × (Lifespan_Months / 12)
Cost_Per_Use = Net_Cost / Total_Uses
```

**Example:**
- Uses Per Week: 5
- Lifespan: 12 months
- Net Cost: $1,000
- Total Uses = 5 × 4.3 × (12/12) = 21.5
- Cost Per Use = $1,000 / 21.5 = $46.51

**Note:** 4.3 is the average weeks per month.

---

### 5. Cost Per Hour Calculation

```
Cost_Per_Hour = Net_Cost / Total_Hours
```

**Example:**
- Net Cost: $1,000
- Total Hours: 200
- Cost Per Hour = $1,000 / 200 = $5.00

---

### 6. Goal Score Calculation

```
Goal_Years = Lifespan_Months / 12
Cost_Years = Net_Cost / (Income_Monthly × Savings_Rate_Floor)
Expected_To_Cost_Ratio = Goal_Years / Cost_Years

Impact = 
  IF Uses_Per_Week provided:
    min(5, Uses_Per_Week / 2)
  ELSE IF Hours_Total provided:
    min(5, Hours_Total / 100)
  ELSE:
    1

Goal_Score = min(100, Expected_To_Cost_Ratio × Impact)
```

**Example:**
- Lifespan: 120 months (10 years)
- Net Cost: $640
- Income: $6,000
- Savings Rate: 0.20
- Uses Per Week: 10

**Calculation:**
- Goal Years = 120 / 12 = 10
- Cost Years = $640 / ($6,000 × 0.20) = $640 / $1,200 = 0.533
- Expected-to-Cost Ratio = 10 / 0.533 = 18.75
- Impact = min(5, 10 / 2) = 5
- Goal Score = min(100, 18.75 × 5) = 93.75

**Purpose:** Measures value proposition by comparing expected usage duration to cost recovery time.

---

## ✅ Affordability Rules

### Rule 1: Free Cashflow Check

```
IF Free_Cashflow < 0 OR Free_Cashflow < Monthly_Recurring_Cost:
  FAIL → "Don't buy now 🚫"
  Reason: "Free cashflow too low"
ELSE:
  PASS
```

### Rule 2: Savings Floor Check

```
Minimum_Savings_Floor = 3 × Essential_Expenses

IF Post_Purchase_Savings < Minimum_Savings_Floor:
  FAIL → "Don't buy now 🚫"
  Reason: "Savings floor violated"
  Next_Step: Calculate months to save
ELSE:
  PASS
```

**Savings Floor Calculation:**
```
Shortfall = Minimum_Savings_Floor - Post_Purchase_Savings
Monthly_Savings = Income_Monthly × Savings_Rate_Floor
Months_To_Save = ceil(Shortfall / Monthly_Savings)
```

---

## 🎯 Verdict Logic

### Decision Tree

```
IF Affordability Check FAILS:
  Verdict = "Don't buy now 🚫"
  Reasons = [Affordability failures]
  Next_Step = "Save for X months before buying" (if savings floor violated)

ELSE:
  Calculate Goal_Score
  
  IF Goal_Score >= 80:
    Verdict = "Buy now" ✅
  
  ELSE IF Goal_Score >= 50:
    Verdict = "Affordable but poor value" ⚠️
    Reasons = ["Low goal score - consider alternatives"]
  
  ELSE:
    Verdict = "Don't buy now" 🚫
    Reasons = ["Very poor value - not recommended"]
```

---

## 📊 Score Interpretation

| Score Range | Verdict | Meaning |
|------------|---------|---------|
| 80-100 | Buy now ✅ | Excellent value, highly recommended |
| 50-79 | Affordable but poor value ⚠️ | Can afford but consider alternatives |
| 0-49 | Don't buy now 🚫 | Poor value, not recommended |

---

## 🔢 Impact Multiplier

The impact multiplier rewards frequent usage:

### Uses Per Week
- **Formula**: `min(5, Uses_Per_Week / 2)`
- **Examples**:
  - 2 uses/week → Impact = 1.0
  - 5 uses/week → Impact = 2.5
  - 10 uses/week → Impact = 5.0 (capped)
  - 20 uses/week → Impact = 5.0 (capped)

### Total Hours
- **Formula**: `min(5, Hours_Total / 100)`
- **Examples**:
  - 50 hours → Impact = 0.5
  - 200 hours → Impact = 2.0
  - 500 hours → Impact = 5.0 (capped)
  - 1000 hours → Impact = 5.0 (capped)

**Purpose:** Items used more frequently get higher scores, reflecting better value.

---

## 💡 Example Calculations

### Example 1: High-Value Purchase

**Input:**
- Income: $6,000/month
- Essentials: $3,500/month
- Savings: $15,000
- Savings Rate: 0.20
- Item Price: $800
- Recurring: $0
- Lifespan: 120 months
- Uses/Week: 10
- Resale: 0.20

**Calculations:**
1. Free Cashflow = $6,000 - $3,500 - $1,200 = $1,300 ✅
2. Post-Purchase Savings = $15,000 - $800 = $14,200 ✅ (≥ $10,500)
3. Net Cost = $800 - $160 + $0 = $640
4. Goal Years = 10
5. Cost Years = $640 / $1,200 = 0.533
6. Ratio = 10 / 0.533 = 18.75
7. Impact = min(5, 10/2) = 5
8. Goal Score = min(100, 18.75 × 5) = 93.75

**Result:** ✅ "Buy now" (Score: 93.75)

---

### Example 2: Unaffordable Purchase

**Input:**
- Income: $6,000/month
- Essentials: $3,500/month
- Savings: $12,000
- Savings Rate: 0.20
- Item Price: $7,000
- Recurring: $0
- Lifespan: 24 months
- Uses/Week: 3
- Resale: 0.10

**Calculations:**
1. Free Cashflow = $1,300 ✅
2. Post-Purchase Savings = $12,000 - $7,000 = $5,000 ❌ (< $10,500)

**Result:** 🚫 "Don't buy now" (Savings floor violated)

---

### Example 3: Poor Value Purchase

**Input:**
- Income: $6,000/month
- Essentials: $3,500/month
- Savings: $15,000
- Savings Rate: 0.20
- Item Price: $800
- Recurring: $0
- Lifespan: 120 months
- Uses/Week: 2
- Resale: 0.20

**Calculations:**
1. Free Cashflow = $1,300 ✅
2. Post-Purchase Savings = $14,200 ✅
3. Net Cost = $640
4. Goal Years = 10
5. Cost Years = 0.533
6. Ratio = 18.75
7. Impact = min(5, 2/2) = 1.0
8. Goal Score = min(100, 18.75 × 1.0) = 18.75

**Result:** 🚫 "Don't buy now" (Score: 18.75 < 50)

---

## 🔍 Edge Cases

### Zero Values
- **Zero Income**: All calculations return 0 or fail gracefully
- **Zero Essentials**: Free cashflow equals income minus savings
- **Zero Savings**: Fails savings floor check
- **Zero Lifespan**: Goal score calculation handles division by zero

### Extreme Values
- **Very High Price**: May fail savings floor check
- **Very Long Lifespan**: Increases goal score significantly
- **Very High Usage**: Impact capped at 5
- **Very High Resale**: Reduces net cost significantly

### Missing Data
- **No Uses Per Week or Hours**: Impact defaults to 1
- **No Resale Value**: Treated as 0
- **No Recurring Cost**: Treated as 0

---

## 📝 Notes

1. **Savings Floor**: The 3× essentials rule ensures users maintain an emergency fund equivalent to 3 months of essential expenses.

2. **Goal Score Capping**: Scores are capped at 100 to prevent extreme values from skewing results.

3. **Impact Capping**: Impact multiplier is capped at 5 to prevent over-weighting usage frequency.

4. **Weeks Per Month**: Uses 4.3 as the average weeks per month (52 weeks / 12 months).

5. **Precision**: All monetary calculations use 2 decimal places for display, but maintain full precision internally.

---

**Last Updated:** 2024
