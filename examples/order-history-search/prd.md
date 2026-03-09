# Order History Search — PRD

**Date:** 2026-03-01
**PM:** Alex Chen
**Status:** Approved for development
**Feature folder:** `order-history-search`

---

## Problem

Mobile checkout users cannot find a specific past order without scrolling their entire order history. For users with 10+ orders this creates meaningful friction — support tickets for "can't find my order" run at 47/week, and the team has confirmed a subset of returns are repeat purchases the user made because they couldn't verify their order history.

**Root cause:** The Orders page is a flat, chronological list with no filtering mechanism. Users know what they're looking for but have no way to narrow to it.

---

## Goals

1. Let users locate a specific past order by typing any part of the order number, item name, or seller name.
2. Reduce "can't find order" support volume by 20% within 60 days.
3. Reduce confirmed-repurchase return rate from 4.1% → ≤3.5% within 60 days.

## Non-Goals

- Advanced filter UI (date range, price, status) — scope for a future iteration
- Persistent search state (URL param / session storage) — adds complexity, low signal that users need it
- Server-side search index — current scale is well within client-side filter limits
- Changes to the Order Detail page

---

## Users

**Primary segment:** Mobile checkout repeat buyers — users with 3+ orders who access order history to reorder, track, return, or obtain receipts. They know what they're looking for and experience friction when they can't find it quickly.

**Not in scope:** First-time buyers (single order, no search need), desktop-primary users, seller-side order management.

---

## User Stories

### P0
1. As a repeat buyer, I want to search for a specific item I ordered, so I can quickly find the order to reorder it or check its status without scrolling.
2. As a repeat buyer, I want to search by seller name, so I can see all my orders from a specific shop in one view.
3. As a repeat buyer, I want to clear my search and see all orders again, so I can browse normally after narrowing.

### P1
4. As a repeat buyer, I want to search by order number, so I can locate a specific order when I have a reference number from a receipt or email.

---

## Requirements

### Must Have
- Search input rendered above the order list on `/orders`
- Client-side filtering across `order_number`, `item_name`, `seller_name` fields (case-insensitive, partial match)
- 300ms debounce — no filter fires on every individual keystroke
- Empty state when results array is empty, copy includes the query
- Clear button (×) inside the input — visible when input has value, hidden when empty
- Accessible: `aria-label="Search orders"` on input, `aria-label="Clear search"` on clear button

### Must Not Have
- New route or page for results
- Additional API calls on keystroke
- Changes to `OrderCard.tsx`, `useOrders.ts`, or `GET /api/orders`
- Sorting changes

---

## Success Metrics

| Metric | Baseline | Target | Measurement window |
|--------|----------|--------|--------------------|
| Search-driven order views / Orders sessions | 0% | ≥15% | 30 days post-launch |
| Support tickets: "can't find order" | 47/week | ≤38/week | 60 days post-launch |
| Confirmed-repurchase return rate | 4.1% | ≤3.5% | 60 days post-launch |

**Instrumentation required:**
- `orders_search_query` — fire on each debounced query; include `query_length`, `result_count`
- `orders_search_cleared` — fire when input is cleared

---

## Edge Cases

| Scenario | Expected behavior |
|----------|-------------------|
| Query matches zero orders | Empty state: "No orders match '[query]'. Try a different search." |
| Query is only whitespace | Treat as empty — show full list |
| Order has null/undefined `seller_name` | Skip field in match, no throw |
| User types faster than 300ms | Debounce resets; filter fires only after 300ms idle |
| Order list is empty (0 orders) | Existing empty state; search input does not render |

---

## Open Questions

| Question | Owner | Priority | Status |
|----------|-------|----------|--------|
| Should search field be visible on mobile as a collapsed icon vs. always-open? | Design | P1 | Open — not blocking v1; default to always-open |
| At what order list size do we need server-side search? | Eng | P1 | Open — profile at p95 before launch |

---

## Dependencies

- No backend changes required
- Design: search input component spec (using existing design system)
- Analytics: confirm `orders_search_query` event is wired to the existing analytics pipeline
