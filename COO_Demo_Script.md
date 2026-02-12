# AskQ — COO Demo Script: Manufacturing Operations

> **Purpose:** Show how a manufacturing COO uses AskQ to monitor operations, spot problems, and make decisions — in under 2 minutes per scenario.
>
> **Demo Rule:** 1 primary question + 1 follow-up per scenario. COO decides, then moves on.
>
> **Key Principle:** AskQ is a SQL agent — it queries real data. No predictions, no forecasting. Just instant answers from your ERP database.

---

## Demo Flow (3 Scenarios, ~6 minutes total)

```
Scenario 1 → "Are we shipping on time?"       → ORDER FULFILLMENT
Scenario 2 → "Is production on track?"         → WORK ORDER EXECUTION
Scenario 3 → "Are our suppliers delivering?"   → PROCUREMENT RISK
```

---

## Scenario 1: Order Fulfillment Decline

> **COO Context:** "I'm hearing from the sales team that customers are complaining about late deliveries. I need to see if this is getting worse."

### Question 1 (The Big Picture)

> **"What is the order fulfillment rate trend over the last 6 months?"**

**Expected Result:**
- 7 months of data (Aug 2025 – Feb 2026)
- 11,273 total shipments delivered, 9,161 orders fulfilled
- Fulfillment rates consistently above 100% (multiple shipments per order)
- Oct 2025 was peak volume month (3,029 shipments)

*What the COO sees:* Monthly trend showing fulfillment volume and rates — overall operations health at a glance.

### Question 2 (The Impact — driven by Q1 answer)

> **"Which customers have the most late or pending orders in the last 3 months?"**

**Expected Result:**
- 133 customers with late/pending orders
- Forest River: 102 late/pending orders
- Jayco, Inc.: 100 late/pending orders
- Grand Design: 38, Steelcase Inc.: 38

*What the COO sees:* Two major customers with 100+ late orders each — immediate escalation needed.

### COO Decision
> *"Forest River and Jayco have 100+ late orders each. I need the Ops Director to do a root cause analysis on these two accounts by end of day. Set up a call."*

### Demo Talking Point
> "Notice how the COO went from a broad trend to a specific customer problem in just two questions — no analyst needed, no waiting for a report."

---

## Scenario 2: Production Execution Crisis

> **COO Context:** "We're missing delivery dates and I suspect production is behind schedule. Let me check the status of our work orders."

### Question 1 (The Big Picture)

> **"How many production work orders are currently open, and how many are overdue?"**

**Expected Result:**
- 232 open production work orders
- 227 are overdue (97.8%)

*What the COO sees:* Nearly every open work order is overdue — this is a systemic production problem, not a one-off.

### Question 2 (The Location — driven by Q1 answer)

> **"Which manufacturing locations have the most overdue production work orders? Show location names."**

**Expected Result:**
- MJB Anniston: 106 overdue
- MJB Cedar Hill: 87 overdue
- MJB Clio: 44 overdue
- MJB Bristol: 44 overdue
- MJB El Dorado: 38 overdue

*What the COO sees:* MJB Anniston and MJB Cedar Hill account for the majority of the problem locations — clear targets for intervention.

### COO Decision
> *"Cedar Hill and Anniston are drowning — nearly 200 overdue work orders between them. Get me the plant managers on a call in 30 minutes. I want to know what's blocking production."*

### Demo Talking Point
> "227 out of 232 work orders overdue — that's 97.8%. Without AskQ, this would take days of report pulling from the ERP. The COO got the answer in seconds and knows exactly which plants to focus on."

---

## Scenario 3: Procurement & Supplier Risk

> **COO Context:** "If production is behind and fulfillment is slipping, I need to check if our suppliers are even delivering what we ordered."

### Question 1 (The Big Picture)

> **"Which purchase orders are currently overdue and haven't been received yet?"**

**Expected Result:**
- 51,347 purchase orders are overdue
- Data shows POs with no goods receipt at all, and POs received weeks late
- Some POs dating back to Aug 2023

*What the COO sees:* A staggering 51,347 overdue POs — clear systemic procurement issue.

### Question 2 (The Real Risk — driven by Q1 answer)

> **"Out of the 51,347 overdue purchase orders, how many have not been received at all?"**

**Expected Result:**
- 8,435 purchase orders have no goods receipt recorded
- These items have never been delivered or processed

*What the COO sees:* 8,435 POs with zero delivery — this is active, unresolved exposure that's likely feeding the production delays.

### COO Decision
> *"8,435 purchase orders with no delivery at all. I need procurement to give me the dollar value of this exposure and the top 5 worst suppliers by end of day. We may need to activate backup suppliers."*

### Demo Talking Point
> "The COO connected the dots — late deliveries to customers, overdue production work orders, and now 8,435 undelivered purchase orders. AskQ didn't just answer three separate questions — it revealed a connected operational breakdown in under 6 minutes."

---

## Demo Script — Presenter Notes

### Opening (30 seconds)
> "Imagine you're the COO of a manufacturing company. It's Monday morning. You have 3 things you need visibility on: How is our order fulfillment? Is production on track? Are our suppliers delivering? Let's see how AskQ answers those in under 6 minutes."

### Between Scenarios (10 seconds each)
> "The COO made a decision and delegated action. Now let's move to the next concern."

### Closing (30 seconds)
> "In 6 minutes, the COO uncovered a connected operational breakdown:
> - 133 customers with late orders, led by Forest River and Jayco
> - 227 out of 232 work orders overdue, concentrated at Cedar Hill and Anniston
> - 8,435 purchase orders never received from suppliers
>
> Three questions, three follow-ups, three decisions — all without a single report request, no SQL, no analyst. That's the power of AskQ."

---

## Important Notes

1. **Don't over-drill.** 2 questions max per scenario. The COO decides and moves on.
2. **Narrate the decision.** After each follow-up, pause and say what the COO would do. That's what makes it feel real.
3. **Speed matters.** The demo should feel fast. If AskQ takes > 5 seconds, fill with narration.
4. **Connect the story.** The 3 scenarios are connected — late fulfillment ← overdue production ← suppliers not delivering. Make this connection explicit in the demo.
5. **The follow-up is data-driven.** Emphasize that the second question in each scenario was inspired by the first answer — not pre-scripted. That shows AskQ enables real analytical thinking.
