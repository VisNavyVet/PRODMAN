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
- **Repository:** [repo name or path]
- **Relevant files / modules:** [List files the agent should focus on]
- **Tech stack:** [Languages, frameworks, relevant versions]
- **Related systems:** [APIs, databases, services the task touches]

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

---

## Requirements

### Must implement
- [ ] Search input renders above the order list
- [ ] Filtering is applied client-side using a debounced value (300ms)
- [ ] Filtering matches against order number, item name, seller name (case-insensitive)
- [ ] Empty state renders when results array is empty
- [ ] Clearing the search input restores the full order list

### Must NOT do
- [ ] Do NOT introduce a new route or page for search results
- [ ] Do NOT make additional API calls on each keystroke
- [ ] Do NOT modify any component outside the search feature

---

## Acceptance Criteria

Each item below must be true for the task to be considered complete:

- [ ] Search input renders on the Orders page, visually above the order list
- [ ] Typing in the search field filters the visible orders within 300ms (debounced)
- [ ] Filtering matches on order_number, item_name, and seller_name fields
- [ ] Matching is case-insensitive
- [ ] Empty state renders when the filtered results array is empty
- [ ] Clearing the input field restores the complete unfiltered order list
- [ ] Clear button is visible when the input has a value, hidden when empty
- [ ] All existing tests pass without modification
- [ ] New unit tests cover filtering logic, debounce behavior, and empty state

---

## Edge Cases to Handle

| Scenario | Expected behavior |
|----------|-------------------|
| Query matches zero orders | Empty state renders with query echoed in copy |
| Query is only whitespace | Treat as empty — show full list |
| Order has no seller_name | Skip that field in match; do not throw |

---

## Constraints

- **Do not change:** OrderCard.tsx, useOrders.ts, any backend files
- **Performance:** Filter must complete within 16ms for lists up to 200 orders
- **Accessibility:** Search input must have aria-label="Search orders"
- **Security:** No user input is sent to the backend in this feature

---

## Definition of Done

- [ ] All acceptance criteria above are met
- [ ] New tests written and passing
- [ ] No regressions in existing order test suites
- [ ] No new TypeScript errors

---

## Questions the Agent Should Flag (not solve)

If the agent encounters these situations, stop and ask the PM rather than making a decision:

- Search should persist across page refreshes — confirm before adding
- The Order type is missing item_name or seller_name fields — confirm correct field names
