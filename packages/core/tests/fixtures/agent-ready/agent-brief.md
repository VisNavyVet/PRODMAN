# Order History Search — Agent Brief

**Date:** 2026-03-02
**PM:** Alex Chen
**Target agent:** Claude Code / Cursor / General

---

## Task Summary

Add a keyword search field to the `/orders` page that filters the displayed order list by order number, item name, or seller name. Results update on each keystroke, debounced at 300ms. No new page or route — the search operates inline on the existing order list component.

## Context

### Product context
- **Product:** A mobile-first marketplace where buyers can purchase from independent sellers and manage their purchase history.
- **Affected users:** Mobile checkout users who place 3+ orders per month and need to locate specific past orders for reordering, returns, or receipts.

### Technical context
- **Repository:** `marketplace-web`
- **Relevant files / modules:**
  - `src/pages/orders/OrdersPage.tsx` — main page component; renders `<OrderList />`
  - `src/components/orders/OrderList.tsx` — renders the list of order cards
  - `src/components/orders/OrderCard.tsx` — individual order card (read-only, do not modify)
  - `src/hooks/useOrders.ts` — fetches and returns `Order[]`
  - `src/types/order.ts` — `Order` type definition
  - `GET /api/orders` — existing endpoint, returns all orders for current user
- **Tech stack:** React 18, TypeScript 5, Tailwind CSS, React Query, Jest + React Testing Library
- **Related systems:** The existing order list is already fully loaded on page mount via React Query. No new API endpoints needed for this release.

---

## Task Scope

### In scope
- Search input component rendered above the order list on `/orders`
- Client-side filtering of the order list on `order_number`, `item_name`, `seller_name` fields
- Debounce at 300ms
- Empty state when no results match the query
- Clear button inside the search input (appears when input has value)

### Out of scope (do not touch)
- Do NOT modify `OrderCard.tsx`
- Do NOT modify `GET /api/orders` or any backend code
- Do NOT add pagination changes
- Do NOT persist search state across page refreshes
- Do NOT add date, price, or status filters

---

## Requirements

### Must implement
- [ ] Search input renders above the order list in `OrdersPage.tsx`
- [ ] Filtering is applied client-side using a debounced value (300ms) of the search input
- [ ] Filtering matches against `order.order_number`, `order.item_name`, `order.seller_name` (case-insensitive, partial match)
- [ ] When results array is empty, render an `<EmptyState>` component with copy: "No orders match '[query]'. Try a different search."
- [ ] Clearing the search input (or clicking the clear button) restores the full order list
- [ ] The clear button (×) renders inside the input field when value is non-empty, and is hidden when value is empty

### Must NOT do
- [ ] Do NOT introduce a new route or page for search results
- [ ] Do NOT make additional API calls on each keystroke — filter the already-loaded data
- [ ] Do NOT modify any component outside `OrdersPage.tsx`, `OrderList.tsx`, and the new `SearchInput.tsx`
- [ ] Do NOT change the order list sorting

---

## Acceptance Criteria

Each item below must be true for the task to be considered complete:

- [ ] Search input renders on the Orders page, visually above the order list
- [ ] Typing in the search field filters the visible orders within 300ms (debounced)
- [ ] Filtering matches on `order_number` field: searching "ORD-1042" shows only orders with that number
- [ ] Filtering matches on `item_name` field: searching "wool coat" shows orders containing that item
- [ ] Filtering matches on `seller_name` field: searching "acme" shows orders from sellers whose name contains "acme"
- [ ] Matching is case-insensitive ("ACME" and "acme" both match)
- [ ] Empty state renders when the filtered results array is empty; copy includes the current query
- [ ] Clearing the input field or clicking ×  restores the complete unfiltered order list
- [ ] Clear button (×) is visible when the input has a value, hidden when empty
- [ ] All existing tests in `src/pages/orders/` and `src/components/orders/` pass without modification
- [ ] New unit tests cover: filtering logic, debounce behavior, empty state render, clear action

---

## Edge Cases to Handle

| Scenario | Expected behavior |
|----------|-------------------|
| Query matches zero orders | Empty state renders with query echoed in copy |
| Query is only whitespace | Treat as empty — show full list, do not trigger filter |
| Order has no `seller_name` (null/undefined) | Skip that field in match; do not throw |
| User types very fast (< 300ms between keystrokes) | Debounce resets; filter fires only after 300ms of inactivity |
| Order list is empty (user has no orders) | Existing empty state renders; search input does not render |
| Query is a single character | Filter applies normally |

---

## Constraints

- **Do not change:** `OrderCard.tsx`, `useOrders.ts`, `GET /api/orders`, any backend files
- **Style guide:** Use Tailwind CSS utility classes matching the existing component patterns. Do not introduce inline styles or new CSS files.
- **Performance:** Filter must complete within 16ms for lists up to 200 orders (1 render frame budget)
- **Accessibility:** Search input must have a visible label or `aria-label="Search orders"`. Clear button must have `aria-label="Clear search"`.
- **Security:** No user input is sent to the backend in this feature. No sanitization needed beyond treating input as a display string.

---

## Definition of Done

- [ ] All acceptance criteria above are met
- [ ] New tests written and passing: filtering logic, debounce, empty state, clear button
- [ ] No regressions in `src/pages/orders/` or `src/components/orders/` test suites
- [ ] No new TypeScript errors (`tsc --noEmit` passes)
- [ ] Analytics events instrumented:
  - `orders_search_query` fired when a debounced query is applied (include `query_length`, `result_count`)
  - `orders_search_cleared` fired when input is cleared

---

## Questions the Agent Should Flag (not solve)

If the agent encounters these situations, stop and ask the PM rather than making a decision:

- Search should persist across page refreshes (e.g., via URL param `?q=`) — this is NOT specified, confirm before adding
- Mobile layout needs different treatment than desktop (e.g., collapsible search bar) — not specified, do not add without confirmation
- The `Order` type is missing `item_name` or `seller_name` fields in `src/types/order.ts` — confirm correct field names before proceeding

---

## Reference Links

- PRD: `examples/order-history-search/prd.md`
- Eng handoff: `examples/order-history-search/handoff-eng.md` (not generated for this example)
- Commitment: `examples/order-history-search/commitment.md`
