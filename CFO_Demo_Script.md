# AskQ — CFO Demo Script: Manufacturing Financial Operations

> **Purpose:** Show how a manufacturing CFO uses AskQ to monitor financial health, spot risks, and make decisions — in under 2 minutes per scenario.
>
> **Demo Rule:** 1 primary question + 1 follow-up per scenario. CFO decides, then moves on.
>
> **Key Principle:** AskQ is a SQL agent — it queries real ERP data. No predictions, no forecasting. Instant answers from your financial database.

---

## Demo Flow (3 Scenarios, ~6 minutes total)

```
Scenario 1 → "How's the top line?"              → REVENUE & GROSS MARGIN
Scenario 2 → "Are we too dependent on anyone?"   → CUSTOMER REVENUE CONCENTRATION
Scenario 3 → "What do we owe?"                   → SUPPLIER PAYABLES EXPOSURE
```

---

## CFO-01: Period Revenue & Gross Margin – Last 6 Closed Months

> **CFO Context:** The CFO reviews monthly financial performance to see whether the business is on track, identify good and bad months, and communicate a clear narrative to the CEO and Board.

> **Pain Point:** Revenue and gross margin information is scattered across ERP modules and spreadsheets. Each new view by period or business unit requires manual extraction and reconciliation by finance, causing delays and inconsistency.

> **Why It's CFO-Level:** The CFO is accountable for top-line performance and profitability and must quickly spot deteriorating months (e.g., a sudden negative margin). Waiting on ad-hoc reports reduces responsiveness and weakens the CFO's ability to challenge revenue quality and margin.

### Question 1 (The Big Picture)
> **"How did our revenue and gross margin perform over the last 6 closed months?"**

**Validated Result:**
- 5 months of data (Aug 2025 – Dec 2025)
- Total sales revenue: $126.9M
- October 2025 peaked at $33.3M
- December 2025 dropped to $19.0M — a 43% decline from October

*What the CFO sees:* Monthly revenue trend with a clear peak in October and a sharp decline into December. The CFO immediately spots the drop.

### Question 2 (Drill-Down — driven by Q1 answer)
> **"December looks off — what drove the margin drop? Break it down by product family."**

*Drill-Down Insight:* The "Components" product family incurred a **$3.0M negative margin** in December, driving the entire company's margin drop. This is a specific cost/pricing failure in one product line, not a general market downturn.

### CFO Decision
> *"December dropped 43% because the Components product line lost $3M. I need a full audit of component costs and pricing by tomorrow morning. Something is broken in that specific business unit."*

### Demo Talking Point
> "The CFO didn't ask for a revenue report — they asked how the business performed. In one question they spotted a 43% decline and immediately asked why. That's executive-speed decision making."

### In Scope / Out of Scope
- **In scope (core):** Company-wide sales and gross margin by month for the last 6 closed months at consolidated level.
- **In scope (drill-down):** For a specific month, sales and gross margin by product family.
- **Out of scope:** Year-on-year comparisons, automated driver analysis (price/volume/mix), SKU-level drill-down.

---

## CFO-02: Customer Revenue Concentration — Dependency Risk

> **CFO Context:** The CFO needs to understand how concentrated revenue is among top customers. Over-dependency on a few large accounts creates risk — if one customer leaves, revenue drops dramatically.

> **Pain Point:** Customer revenue data exists in the sales module, but getting a ranked view of revenue concentration requires custom reporting. Worse, the CFO rarely sees this alongside operational data (like delivery performance), so they can't connect revenue importance to service risk.

> **Why It's CFO-Level:** Revenue concentration is a board-level risk metric. If the top 5 customers represent 60%+ of revenue, the business is fragile. The CFO needs to know this to guide pricing strategy, customer diversification, and to flag at-risk relationships to the CEO. A financial analyst tracks numbers; the CFO makes strategic decisions about customer dependency.

### Question 1 (The Big Picture)
> **"Who are our biggest customers by revenue?"**

**Validated Result:**
- 625 total customers
- Patrick Industries: $69.0M
- Forest River: $62.1M
- MJB Tableros Y Maderas: $54.5M
- Smart Cabinetry: $49.1M
- Steelcase: $48.3M
- Jayco: $40.6M
- Top 10 customers represent a massive share of total revenue

*What the CFO sees:* Revenue is heavily concentrated in a handful of customers — classic concentration risk. And two familiar names jump out.

### Question 2 (The Risk — driven by Q1 answer + COO context)
> **"Forest River is our second-largest customer at $62M. They also have 102 late orders. What's their order trend over the last 6 months?"**

*Why this follow-up is powerful:* The CFO connects **financial data** (revenue) with **operational data** (late orders from the COO scenario). Forest River generates $62M in revenue — and we're delivering late on 102 of their orders. That's a relationship at risk.

### CFO Decision
> *"Forest River is $62M in revenue and we have 102 late orders with them. If they leave, that's a 15% revenue hit. I need the VP of Sales to call them this week and the Ops Director to prioritize their orders."*

### Demo Talking Point
> "This is where AskQ shines — the CFO connected a financial fact (Forest River = $62M) with an operational fact (102 late orders) in two questions. No BI tool surfaces that connection automatically. The CFO just identified a $62M account at risk."

### In Scope / Out of Scope
- **In scope (core):** Top customers ranked by total revenue.
- **In scope (drill-down):** Specific customer order trend or performance detail.
- **Out of scope:** Customer profitability analysis, churn prediction, lifetime value scoring.

---

## CFO-03: Supplier Payables Exposure — What Do We Owe?

> **CFO Context:** The CFO needs to understand the company's payment obligations to suppliers — how much is overdue and whether delayed payments are putting supplier relationships or credit terms at risk.

> **Pain Point:** Payable data lives across purchase orders, goods receipts, and invoice matching in the ERP. Getting a consolidated view of what's owed and what's overdue requires manual querying by the AP team and often lags behind reality.

> **Why It's CFO-Level:** The CFO manages cash deployment — when to pay, whom to prioritize, and how to protect supplier relationships without burning cash. Overdue payables risk late payment penalties, loss of early payment discounts, and supplier escalations. This is a cash management decision, not a bookkeeping task.

### Question 1 (The Big Picture)
> **"How much do we owe suppliers right now, and how much of that is overdue?"**

**Validated Result:**
- 713 overdue records
- Total overdue: $7,823,456.66
- Top exposure: Arauco North America at $2.58M (RV and Transportation)
- CoorsTek at $689K, U.S. Customs at $337K
- Arauco appears 3 times in top 10 across different business units

*What the CFO sees:* $7.8M overdue, with one supplier showing up repeatedly. Immediate concentration risk flag.

### Question 2 (The Exposure — driven by Q1 answer)
> **"How much do we owe Arauco North America in total across all business units?"**

**Validated Result:**
- 56 records for Arauco
- Total owed: $3,456,721.47
- Largest single item: $2.58M (RV and Transportation)
- Remaining $876K spread across Fixtures & Furniture and Millwork
- That's 44% of ALL overdue payables concentrated in one supplier

*What the CFO sees:* Nearly half of all overdue payables are to one supplier — massive supply chain and financial risk if that relationship deteriorates.

### CFO Decision
> *"We owe $3.5M to Arauco — that's 44% of our total overdue. If they put us on credit hold, RV production stops. Run a payment batch for Arauco today and set up a call with their account team."*

### Demo Talking Point
> "In two questions, the CFO went from '$7.8M overdue' to 'Arauco is 44% of the problem.' That's executive-level pattern recognition powered by instant data access. The CFO just made a payment decision that protects a critical supplier relationship."

### In Scope / Out of Scope
- **In scope (core):** Total outstanding payable and overdue amount at consolidated level.
- **In scope (drill-down):** Single supplier total exposure across all business units.
- **Out of scope:** Cash flow forecasting, payment optimization modeling, discount capture analysis.

---

## Demo Script — Presenter Notes

### Opening (30 seconds)
> "Imagine you're the CFO of a manufacturing company. Before your Monday leadership meeting, you need answers to 3 questions: Is revenue on track? Are we too dependent on any one customer? And are we paying our suppliers on time? Let's see how AskQ answers those."

### Between Scenarios (10 seconds each)
> "The CFO made a decision and delegated action. Now let's move to the next financial concern."

### Closing (30 seconds)
> "In under 6 minutes, the CFO discovered:
> - A 43% revenue decline from October to December
> - That Forest River — a $62M customer — has 102 late orders and is at risk
> - That $3.5M of overdue payables are concentrated with one supplier
>
> Three questions, three follow-ups, three decisions. No spreadsheets, no report requests, no analyst. That's financial visibility on demand."

### Cross-Scenario Connection (Bonus Talking Point)
> "Notice something powerful: the CFO scenario revealed that Forest River is a $62M customer at risk — and the COO scenario showed 102 late orders for the same customer. AskQ doesn't just answer questions in isolation — it lets leaders connect financial and operational data in real time."

---

## Important Notes

1. **Keep it at CFO altitude.** The CFO asks about totals, trends, and top-N — not individual invoices or line items.
2. **The follow-up must feel reactive.** The second question should feel like a natural response to what the first answer revealed — not a pre-scripted drill-down.
3. **Narrate the decision.** After each follow-up, say what the CFO would do. That's what makes it feel real.
4. **No forecasting.** AskQ answers from data in the database. Never imply prediction or projection capability.
5. **Connect to the P&L.** Everything the CFO asks ultimately ties to revenue, margin, or cash flow. Make that connection explicit.
6. **Cross-reference COO + CFO.** The Forest River connection (revenue + late orders) is a killer demo moment. Don't miss it.
