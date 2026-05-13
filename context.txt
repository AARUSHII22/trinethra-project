# Domain context — Supervisor Feedback Analyzer (Trinethra)

This document supports psychology interns who score **Fellow** performance from **supervisor phone transcripts**. Use it together with `rubric.json`.

## Fellow model (short)

A **Fellow** is a full-time DeepThought operator embedded for 3–6 months inside an Indian manufacturing MSME. They structure daily work, build accountability systems, and leave behind repeatable habits—not one-off heroics. Supervisors are often founders, COOs, or plant heads; their language may be informal, anecdotal, or biased.

## How to read supervisor language

- **Recency bias**: Over-weighting last week vs the full placement.
- **Halo / horns**: One strong story coloring the whole picture.
- **Politeness**: Vague praise that hides discomfort—look for absence of concrete examples.
- **Role confusion**: Crediting the Fellow for founder decisions or vice versa.

## The eight business KPIs

When mapping transcript content to KPIs, use **only these eight**. If the supervisor did not imply a KPI, mark it as **not_evident** in your internal reasoning; the UI will show connections only where there is support.

| ID | KPI | What “good” sounds like in a transcript |
|----|-----|----------------------------------------|
| `on_time_delivery` | On-time delivery / dispatch reliability | Fewer line stoppages, predictable dispatch, fewer “fire drills.” |
| `throughput_productivity` | Throughput and labor productivity | Output per shift, reduced idle time, smoother handoffs. |
| `quality_rework` | Quality and rework | Fewer customer returns, first-pass yield, less sorting/rework. |
| `inventory_material` | Inventory and material flow | Cleaner stores, lower stock-outs, better FG/WIP discipline. |
| `cost_waste` | Cost and waste | Scrap reduction, utility discipline, consumables control. |
| `safety_compliance` | Safety and compliance | Near-miss reporting, PPE, statutory cadence without last-minute panic. |
| `cash_working_capital` | Cash and working capital | Faster billing support, receivable follow-ups tied to dispatch proof. |
| `people_accountability` | People and accountability | Morning meetings, clear owners, escalation paths that actually get used. |

## Rubric usage

- Scores are **suggestions**; the intern reconciles with behavioral evidence and client context.
- Prefer **verbatim or near-verbatim quotes** for evidence; do not invent dialogue.
- **Gap analysis** is about **dimensions and KPIs not substantiated** in the transcript—not generic “areas to improve” unless tied to missing coverage.

## Sample scoring notes (for calibration)

- **Mixed transcript**: May still land mid-band if reliability is strong but systems-building is never mentioned—note gaps explicitly.
- **Negative tone**: Separate **supervisor frustration** from **verified behavioral facts**; weight facts over tone.
- **Short call**: Fewer quotes are acceptable; widen gap analysis if coverage is thin.
