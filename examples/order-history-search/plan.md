# Order History Search — Implementation Plan

**Date:** 2026-03-01
**PM:** Alex Chen
**Target launch:** Sprint 14 (2026-03-15)

---

## Delivery Phases

### Phase 1 — Core filter (Days 1–3)
> Goal: Working filter in dev. No polish yet.

| Task | Owner | Notes |
|------|-------|-------|
| Verify `Order` type fields (`item_name`, `seller_name`) in `src/types/order.ts` | Eng | Flag to PM if fields are named differently |
| Create `src/hooks/useDebounce.ts` (if not already present) | Eng | ~10 lines |
| Create `src/components/orders/SearchInput.tsx` | Eng | Input + clear button; basic styling |
| Wire filter logic in `OrdersPage.tsx` | Eng | `useMemo` filter + pass `filteredOrders` to `OrderList` |
| Unit tests: filter logic, debounce, clear action | Eng | Jest + RTL |

### Phase 2 — Empty state + accessibility (Day 4)
> Goal: Handles all edge cases, accessible.

| Task | Owner | Notes |
|------|-------|-------|
| Render `<EmptyState>` when `filteredOrders.length === 0` | Eng | Copy: "No orders match '[query]'. Try a different search." |
| Add `aria-label` to input and clear button | Eng | See agent brief for exact labels |
| Handle null `seller_name` gracefully in filter | Eng | Already in filter logic — verify test covers it |
| Test: empty state render, whitespace query, null fields | Eng | |

### Phase 3 — Analytics + QA (Day 5)
> Goal: Instrumented, tested on device.

| Task | Owner | Notes |
|------|-------|-------|
| Instrument `orders_search_query` event | Eng | Include `query_length`, `result_count` |
| Instrument `orders_search_cleared` event | Eng | |
| Manual QA on 375px, 390px, 428px viewports | PM + Eng | Check layout, clear button tap target |
| Profile filter with 200-order fixture | Eng | Fail if p95 > 100ms |
| PM sign-off on staging | PM | |

---

## Milestones

| Milestone | Date |
|-----------|------|
| Phase 1 complete (filter working in dev) | 2026-03-10 |
| Phase 2 complete (edge cases + a11y) | 2026-03-11 |
| Phase 3 complete (analytics + QA) | 2026-03-13 |
| Staging sign-off | 2026-03-14 |
| Launch | 2026-03-15 |

---

## Launch Checklist

- [ ] All acceptance criteria in `agent-brief.md` are met
- [ ] Unit tests passing: filter logic, debounce, empty state, clear, null fields
- [ ] No regressions in `src/pages/orders/` or `src/components/orders/`
- [ ] `tsc --noEmit` passes
- [ ] Analytics events verified in staging event log
- [ ] Mobile QA on 375px viewport
- [ ] Performance: filter p95 < 100ms at 200 orders
- [ ] PM sign-off on staging

---

## Post-Launch Monitoring (30 days)

- Track `orders_search_query` volume — watch for low adoption (< 5% of sessions → investigate discoverability)
- Track `result_count = 0` rate — high no-results rate may indicate a field name mismatch or low-quality matching
- Monitor support ticket volume for "can't find order" topic — target: −20% by day 60
- Flag to PM at day 30 if order lists at p95 are approaching 200 items (server-side search threshold)
