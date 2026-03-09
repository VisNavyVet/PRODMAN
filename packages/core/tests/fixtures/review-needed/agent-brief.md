# Review Needed Example — Agent Brief

**Date:** 2026-03-02

---

## Task Summary

Add a keyword search field to the /orders page that filters the displayed order list. Results update as the user types.

## Context

### Product context
- **Product:** Mobile-first marketplace.
- **Affected users:** Mobile checkout repeat buyers.

### Technical context
- **Repository:** marketplace-web
- **Relevant files / modules:**
  - `src/pages/orders/OrdersPage.tsx`
  - `src/components/orders/OrderList.tsx`
- **Tech stack:** React 18, TypeScript
- **Related systems:** GET /api/orders

---

## Task Scope

### In scope
- Search input above the order list

### Out of scope (do not touch)
- Do NOT modify backend code

---

## Requirements

### Must implement
- [ ] Search input renders above order list

### Must NOT do
- [ ] Do NOT make additional API calls

---

## Acceptance Criteria

- [ ] Search input renders on the Orders page
- [ ] Typing filters visible orders — it works correctly after input
- [ ] The UI looks good across all screen sizes
- [ ] Clearing the input restores the full list

---

## Edge Cases to Handle

| Scenario | Expected behavior |
|----------|-------------------|
| Query matches zero orders | Empty state renders |

---

## Constraints

- **Do not change:** Backend files
- **Style guide:** Tailwind CSS
- **Performance:** Filter must complete within 16ms
- **Accessibility:** aria-label required
- **Security:** None

---

## Definition of Done

- [ ] All acceptance criteria are met
- [ ] New tests written and passing
- [ ] No regressions in related test suites
- [ ] tsc --noEmit passes

---

## Reference Links

- PRD: `examples/order-history-search/prd.md`

---

## Questions the Agent Should Flag

<!-- Intentionally left empty to trigger LNT-011 warning -->
