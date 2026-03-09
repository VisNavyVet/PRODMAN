# Direction Commitment — Order History Search

**Feature name:** order-history-search
**Date:** 2026-03-01
**PM:** Alex Chen
**Status:** Approved

---

## Problem Statement

Mobile checkout users cannot find a specific past order without scrolling through their entire order history, causing support escalations and repeat purchases they didn't intend.

## Who We're Solving For

**Primary:** Mobile checkout users who make more than 3 purchases per month and need to reference past orders for reordering, returns, or receipts.

**Not solving for:** New users (< 1 order), desktop-first users, or seller-side order management.

## Direction

Add keyword search to the Orders page that filters by order number, item name, or seller name. Results update in real time (debounced). No new page — search operates inline on the existing order list.

## Key Assumptions

1. Search can be done client-side with the existing order data already loaded in the page — no need for a new backend search index for the initial release.
2. Users primarily search by item name, not order number.
3. Debounce at 300ms is sufficient latency for perceived real-time filtering.

## Top Risks

1. Order list grows large (100+ orders) — client-side filter may be slow. Mitigation: profile at p95 before shipping.
2. Sellers with long product names may produce poor match quality — monitor search-no-results rate.

## Success Criteria

- Search-driven order views: ≥ 15% of Orders page sessions within 30 days of launch
- Support tickets for "can't find my order": −20% vs. baseline in 60 days

## Out of Scope

- Advanced filters (date range, price, status)
- Search persistence across page refreshes
- Order detail page changes
- Pagination changes
