# Order History Search — Brief

**Date:** 2026-03-01
**Author:** Alex Chen
**Status:** Approved

---

## Problem

Mobile users who place repeat orders cannot quickly locate a specific past order without scrolling their entire history. This causes two measurable harms: a 23% increase in support tickets from users who "can't find their order," and confirmed repeat purchases that users later return because they couldn't verify they hadn't already ordered the item. The friction is highest for users with 10+ orders.

## Solution

Add a keyword search field to the Orders page that filters the displayed list by order number, item name, or seller name. Results update in real time (debounced 300ms). No new page or route — inline filtering on the data already loaded in the browser.

## Success Metrics

| Metric | Baseline | Target | Timeframe |
|--------|----------|--------|-----------|
| Search-driven order views | 0% | ≥15% of Orders sessions | 30 days post-launch |
| Support tickets: "can't find order" | 47/week | ≤38/week (−20%) | 60 days post-launch |
| Order return rate (confirmed re-purchases) | 4.1% | ≤3.5% | 60 days post-launch |

## In Scope

- Search input above the order list on `/orders`
- Client-side filtering: order number, item name, seller name
- Empty state when no results
- Clear button inside the input

## Out of Scope

- Advanced filters (date range, price, status) — not needed for v1
- Search persistence across page refreshes — adds complexity for unclear benefit
- Backend search index — client-side covers current scale
- Order detail page changes

## Key Risks

1. **Performance at scale:** Users with 200+ orders may experience visible lag. Mitigation: profile before launch, add pagination gate if p95 > 100ms.
2. **Low adoption:** If users don't see the search field, they won't use it. Mitigation: consider a "Search your orders" tooltip on first visit.
