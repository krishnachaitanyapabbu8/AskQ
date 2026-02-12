# AskQ — Executive Demo Script
## Manufacturing Operations & Financial Intelligence

> **Demo Duration:** ~12 minutes (6 min COO + 6 min CFO)
> **Demo Rule:** Each scenario has 1 primary question + 1 follow-up. The executive decides, then moves on.
> **Key Principle:** AskQ is a SQL agent that queries real ERP data. No predictions, no forecasting — instant answers from your live database.

---

# PART 1: COO FLOW — Operational Intelligence

> **Persona:** Chief Operating Officer
> **Setting:** Monday morning. Customer complaints about late deliveries are escalating. The COO needs to find what's broken and where.

## Narrative Arc

```
Scenario 1: DETECT   → "Fulfillment is declining — how bad is it?"
Scenario 2: LOCATE   → "Is this a production problem? Where?"
Scenario 3: TRACE    → "Are suppliers starving our production lines?"
```

> Each scenario peels back one layer of the problem. By the end, the COO has traced late deliveries → production delays → supplier failures in under 6 minutes.

---

### COO Scenario 1: Order Fulfillment Decline

> **Context:** *"I'm hearing from the sales team that customers are complaining about late deliveries. I need to see if this is getting worse."*

**━━━ Question 1 ━━━**

> **"What is the order fulfillment rate trend over the last 6 months?"**

**Expected Answer:**
- 7 months of data (Aug 2025 – Feb 2026)
- 11,273 total shipments delivered, 9,161 orders fulfilled
- October 2025 was peak volume month (3,029 shipments)

**What the COO sees:** Monthly trend showing whether fulfillment is stable or deteriorating — the operational health baseline.

> **Presenter Note:** *Pause here. Let the audience absorb the trend. Then say: "The COO sees the trend. Now they want to know — who's affected?"*

---

**━━━ Question 2 (Follow-Up) ━━━**

> **"Which customers have the highest number of late or pending orders in the last 3 months?"**

**Expected Answer:**
- 133 customers with late/pending orders
- Forest River: 102 late/pending orders
- Jayco, Inc.: 100 late/pending orders
- Grand Design: 38, Steelcase Inc.: 38

**What the COO sees:** The two largest accounts — Forest River and Jayco — have 100+ late orders each.

---

**COO Decision:**
> *"Forest River and Jayco have 100+ late orders each. I need the Ops Director to do a root cause analysis on these two accounts by end of day. Set up a call."*

**Demo Talking Point:**
> *"Notice how the COO went from a broad trend to a specific customer problem in two questions — no analyst needed, no waiting for a report."*

---

**━━━ Transition to Scenario 2 ━━━**
> *"Fulfillment is declining and our biggest customers are affected. The COO's next instinct: is this a production problem?"*

---

### COO Scenario 2: Production Execution Crisis

> **Context:** *"We're missing delivery dates and I suspect production is behind schedule. Let me check the status of our work orders."*

**━━━ Question 1 ━━━**

> **"How many production work orders are currently open, and how many are overdue?"**

**Expected Answer:**
- 232 open production work orders
- 227 are overdue (**97.8%**)

**What the COO sees:** Nearly every open work order is overdue — this is a systemic production failure, not a one-off.

> **Presenter Note:** *Let the 97.8% sink in. Say: "97.8% — that means almost nothing is shipping on time from the production floor. Now the COO needs to know WHERE."*

---

**━━━ Question 2 (Follow-Up) ━━━**

> **"Which manufacturing locations have the most overdue production work orders? Show location names."**

**Expected Answer:**
- MJB Anniston: **106 overdue**
- MJB Cedar Hill: **87 overdue**
- MJB Clio: 44 overdue
- MJB Bristol: 44 overdue
- MJB El Dorado: 38 overdue

**What the COO sees:** MJB Anniston and MJB Cedar Hill are the clear bottlenecks.

---

**COO Decision:**
> *"Cedar Hill and Anniston are drowning — nearly 200 overdue work orders between them. Get me the plant managers on a call in 30 minutes. I want to know what's blocking production."*

**Demo Talking Point:**
> *"227 out of 232 work orders overdue — that's 97.8%. Without AskQ, this would take days of report pulling from the ERP. The COO got the answer in seconds and knows exactly which plants to focus on."*

---

**━━━ Transition to Scenario 3 ━━━**
> *"97.8% of work orders are overdue. The COO's next question: are we starving the production line? Are suppliers even delivering what we ordered?"*

---

### COO Scenario 3: Supplier Performance & Material Risk

> **Context:** *"If production is behind and fulfillment is slipping, I need to check if our suppliers are even delivering what we ordered."*

**━━━ Question 1 ━━━**

> **"How many purchase orders are currently overdue and not yet fully received?"**

**Expected Answer:**
- **51,347 purchase orders are overdue**
- Mix of POs with no goods receipt at all and POs received weeks late
- Some POs dating back to Aug 2023

**What the COO sees:** A staggering 51,347 overdue POs — clear systemic procurement issue.

> **Presenter Note:** *Say: "51,347 overdue POs. But the COO is smart — they know some of these were eventually received, just late. The real risk is the ones that were NEVER delivered."*

---

**━━━ Question 2 (Follow-Up) ━━━**

> **"Of the overdue purchase orders, how many have not been received at all?"**

**Expected Answer:**
- **8,435 purchase orders have no goods receipt recorded**
- These items have never been delivered or processed

**What the COO sees:** 8,435 POs with zero delivery — this is active, unresolved exposure feeding production delays.

---

**COO Decision:**
> *"8,435 purchase orders with no delivery at all. I need procurement to give me the dollar value of this exposure and the top 5 worst suppliers by end of day. We may need to activate backup suppliers."*

**Demo Talking Point:**
> *"The COO connected the dots — late deliveries to customers, overdue production work orders, and now 8,435 undelivered purchase orders. AskQ didn't just answer three separate questions — it revealed a connected operational breakdown in under 6 minutes."*

---

### COO Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│  DETECT: Fulfillment declining, 133 customers affected      │
│      ↓                                                      │
│  LOCATE: 97.8% of work orders overdue → Cedar Hill (87),    │
│          Anniston (78) are the worst                        │
│      ↓                                                      │
│  TRACE:  51,347 overdue POs, 8,435 never received at all   │
│                                                             │
│  ROOT CAUSE: Suppliers not delivering → Production stuck     │
│              → Customers getting late shipments              │
└─────────────────────────────────────────────────────────────┘
```

---
---

# PART 2: CFO FLOW — Financial Intelligence

> **Persona:** Chief Financial Officer
> **Setting:** Before a leadership meeting. The CFO needs to check revenue health, identify financial risks, and ensure the company can meet its obligations.

## Narrative Arc

```
Scenario 1: PERFORM  → "Is revenue and margin on track?"
Scenario 2: PROTECT  → "Are we too dependent on anyone?"
Scenario 3: PAY      → "Can we meet our supplier obligations?"
```

> The CFO scans three financial health dimensions: top-line performance, revenue fragility, and cash obligations.

---

### CFO Scenario 1: Period Revenue & Gross Margin

> **Context:** *"I need to review our monthly financial performance before the board meeting. Are we on track?"*

**━━━ Question 1 ━━━**

> **"For the last 6 closed months, show total sales and gross margin by month."**

**Expected Answer:**
- 5 months of data (Aug 2025 – Dec 2025)
- Total sales revenue: **$126.9M**
- October 2025 peaked at **$33.3M**
- December 2025 dropped to **$19.0M** — a **43% decline** from October

**What the CFO sees:** Monthly revenue trend with a clear peak in October and a sharp December drop. Immediate question: what happened?

> **Presenter Note:** *Point to the October-to-December decline. Say: "A 43% drop in two months. The CFO can't present this to the board without understanding why."*

---

**━━━ Question 2 (Optional Follow-Up) ━━━**

> **"In December 2025, show total sales and gross margin by Product family."**

**What the CFO sees:** The "Components" product family incurred a **$3.0M negative margin** in December, driving the entire company's margin drop. This is a specific cost/pricing failure in one product line.

---

**CFO Decision:**
> *"December dropped 43% because the Components product line lost $3M. I need a full audit of component costs and pricing by tomorrow morning. Something is broken in that specific business unit."*

**Demo Talking Point:**
> *"The CFO didn't ask for a revenue report — they asked how the business performed. In one question they spotted a 43% decline and immediately asked why. That's executive-speed decision making."*

---

**━━━ Transition to Scenario 2 ━━━**
> *"Revenue is declining. The CFO's next concern: if a major customer leaves on top of this decline, how bad does it get?"*

---

### CFO Scenario 2: Customer Revenue Concentration — Dependency Risk

> **Context:** *"I need to understand how fragile our revenue base is. Are we too dependent on a few large accounts?"*

**━━━ Question 1 ━━━**

> **"Who are our biggest customers by revenue?"**

**Expected Answer:**
- **625 total customers**
- Patrick Industries: **$69.0M**
- Forest River: **$62.1M**
- MJB Tableros Y Maderas: $54.5M
- Smart Cabinetry: $49.1M
- Steelcase: $48.3M
- Jayco: $40.6M
- Top 10 represents a massive share of total revenue

**What the CFO sees:** Revenue is heavily concentrated in a handful of customers. And two familiar names stand out — Forest River and Jayco.

> **Presenter Note:** *Say: "Notice Forest River at $62M and Jayco at $41M — these are the same customers the COO identified with 100+ late orders each. The CFO is now seeing financial risk on top of operational risk."*

---

**━━━ Question 2 (Optional Follow-Up) ━━━**

> **"Forest River is our second-largest customer at $62M. They also have 102 late orders. What is their order trend over the last 6 months?"**

**What the CFO sees:** Whether the Forest River relationship is stable or deteriorating — combining financial revenue data with operational delivery data in one question.

---

**CFO Decision:**
> *"Forest River is $62M in revenue and we have 102 late orders with them. If they leave, that's a 15% revenue hit. I need the VP of Sales to call them this week and the Ops Director to prioritize their orders."*

**Demo Talking Point:**
> *"This is where AskQ shines — the CFO connected a financial fact ($62M revenue) with an operational fact (102 late orders) in two questions. No BI tool surfaces that connection automatically. The CFO just identified a $62M account at risk."*

---

**━━━ Transition to Scenario 3 ━━━**
> *"Revenue is concentrated and our biggest customers are at risk. Now the CFO checks the other side of the ledger — what do we owe?"*

---

### CFO Scenario 3: Supplier Payables Exposure — Cash & Supply Chain Risk

> **Context:** *"I need to understand our current payment obligations to suppliers. How much is overdue and are we exposed to any single supplier?"*

**━━━ Question 1 ━━━**

> **"How much do we owe suppliers right now, and how much of that is overdue?"**

**Expected Answer:**
- **713 overdue records**
- Total overdue: **$7,823,456.66**
- Top exposure: Arauco North America at $2.58M (RV and Transportation)
- CoorsTek at $689K, U.S. Customs at $337K
- **Arauco appears 3 times in the top 10** across different business units

**What the CFO sees:** $7.8M overdue, with one supplier showing up repeatedly — immediate concentration risk flag.

> **Presenter Note:** *Say: "Notice Arauco North America appears 3 times in the top 10 — RV and Transportation, Fixtures and Furniture. The CFO spots a pattern. That's the next question."*

---

**━━━ Question 2 (Optional Follow-Up) ━━━**

> **"How much do we owe Arauco North America in total across all business units?"**

**Expected Answer:**
- **56 records** for Arauco
- Total owed: **$3,456,721.47**
- Largest single item: $2.58M (RV and Transportation)
- Remaining $876K spread across Fixtures & Furniture and Millwork
- That's **44% of ALL overdue payables** concentrated in one supplier

**What the CFO sees:** Nearly half of all overdue payables are owed to one supplier. If Arauco cuts them off, multiple production lines halt.

---

**CFO Decision:**
> *"We owe $3.5M to Arauco — that's 44% of our total overdue. If they put us on credit hold, RV production stops. Run a payment batch for Arauco today and set up a call with their account team."*

**Demo Talking Point:**
> *"In two questions, the CFO went from '$7.8M overdue' to 'Arauco is 44% of the problem.' That's executive-level pattern recognition powered by instant data access. The CFO just made a payment decision that protects a critical supplier relationship."*

---

### CFO Flow Summary

```
┌─────────────────────────────────────────────────────────────┐
│  PERFORM: Revenue peaked at $33M in Oct, dropped 43% by Dec │
│      ↓                                                       │
│  PROTECT: Top 2 customers ($69M, $62M) have 100+ late       │
│           orders — $62M account at risk                      │
│      ↓                                                       │
│  PAY:     $7.8M overdue to suppliers, $3.5M (44%) to one    │
│           supplier — Arauco is a single point of failure     │
└──────────────────────────────────────────────────────────────┘
```

---
---

# COMBINED DEMO — Presenter Guide

## Opening (30 seconds)
> *"AskQ turns your ERP into a conversation. Today, we'll show two executive personas — a COO managing operations and a CFO managing financial health — both getting instant answers from the same manufacturing ERP database. No reports, no analysts, no SQL. Just questions and decisions."*

## Part 1: COO (6 minutes)
> *"Let's start with the COO. It's Monday morning. Customer complaints are rising."*

Run all 3 COO scenarios in sequence (Fulfillment → Production → Procurement).

## Transition (15 seconds)
> *"In 6 minutes, the COO traced a connected operational breakdown from customer deliveries to production to suppliers. Now let's switch to the CFO perspective."*

## Part 2: CFO (6 minutes)
> *"The CFO has a leadership meeting in 2 hours. They need answers on revenue, risk, and cash."*

Run all 3 CFO scenarios in sequence (Revenue → Concentration → Payables).

## The Cross-Persona Moment (30 seconds)
> *"Here's what makes AskQ powerful for the entire leadership team. Remember Forest River? The COO saw 102 late orders. The CFO sees $62M in revenue. Same customer, two perspectives, one connected truth. AskQ doesn't just answer questions — it connects operational and financial data in real time."*

## Closing (30 seconds)
> *"In 12 minutes, two executives uncovered:
> - 133 customers with late orders, led by Forest River and Jayco
> - 227 out of 232 work orders overdue, concentrated at Cedar Hill and Anniston
> - 8,435 purchase orders never received from suppliers
> - A 43% revenue decline from October to December
> - A $62M customer at risk of leaving
> - $3.5M in overdue payables to a single critical supplier
>
> Six scenarios. Twelve questions. Six executive decisions. Zero reports requested. That's AskQ."*

---

## Important Notes for Presenters

1. **Don't over-drill.** 2 questions max per scenario. The executive decides and moves on.
2. **Narrate the decision.** After each follow-up, pause and say what the executive would do. That's what makes it feel real.
3. **Speed matters.** The demo should feel fast. If AskQ takes > 5 seconds, fill with narration.
4. **Connect the story.** COO scenarios form a causal chain (fulfillment → production → suppliers). CFO scenarios form a financial health scan (revenue → risk → cash). Make these flows explicit.
5. **The Forest River moment.** The cross-persona connection ($62M revenue + 102 late orders) is the highlight of the entire demo. Don't rush it.
6. **Adapt on the fly.** If a question returns unexpected data, use it — say *"This is what makes real-time data powerful — you see what's actually happening, not what a static report showed last week."*
