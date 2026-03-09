# Order History Search — Approach

**Date:** 2026-03-01
**PM:** Alex Chen

---

## Chosen Direction

**Client-side inline filter, no new route.**

Add a `<SearchInput>` component above `<OrderList>`. On each debounced keystroke, filter the already-loaded `Order[]` array in `OrdersPage.tsx` and pass the result down to `<OrderList>`. No new pages, no backend changes.

---

## Options Considered

### Option A — Client-side inline filter ✅ Chosen
Filter the order array already in memory. Match against `order_number`, `item_name`, `seller_name`.

**Pros:** Zero backend work, ships fast, no latency, works offline.
**Cons:** Breaks at very large order histories (200+ orders may hit perf ceiling). Acceptable for v1 — profile before launch, gate on pagination if needed.

### Option B — URL param search (`/orders?q=query`)
Drive filter state from the URL so search is shareable and persists on refresh.

**Why not now:** Adds routing complexity for a feature where persistence has no confirmed user need. Revisit in v2 if analytics show users abandoning mid-search.

### Option C — Backend search endpoint
New `GET /api/orders/search?q=` endpoint with server-side text matching or search index.

**Why not now:** Current scale doesn't need it. Introduces backend scope, latency, and API versioning risk. Revisit when order lists regularly exceed 500 items.

---

## Technical Approach

### Component structure
```
OrdersPage.tsx
  ├── SearchInput.tsx      ← new
  └── OrderList.tsx        ← receives filtered orders[]
```

### State
- `searchQuery: string` — raw input value, lives in `OrdersPage`
- `debouncedQuery: string` — 300ms debounced, derived via `useDebounce` hook
- `filteredOrders: Order[]` — derived from `orders` + `debouncedQuery`

### Filter logic
```ts
const filteredOrders = useMemo(() => {
  if (!debouncedQuery.trim()) return orders
  const q = debouncedQuery.toLowerCase()
  return orders.filter(o =>
    o.order_number?.toLowerCase().includes(q) ||
    o.item_name?.toLowerCase().includes(q) ||
    o.seller_name?.toLowerCase().includes(q)
  )
}, [orders, debouncedQuery])
```

### Debounce
Use a simple `useDebounce(value, 300)` hook. If the project already has one, use it. If not, create `src/hooks/useDebounce.ts` — ~10 lines.

---

## Risk Register

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|-----------|
| Filter is slow at 200+ orders | Low | Medium | Profile with `performance.now()` before launch; gate on pagination if p95 > 100ms |
| `item_name` field doesn't exist on `Order` type | Low | High | Verify `src/types/order.ts` before writing filter — agent brief flags this as an escalation trigger |
| Search input disrupts existing layout on small screens | Medium | Low | Use existing Tailwind responsive classes; test on 375px viewport |

---

## Not Doing (and why)

- **Date/price/status filters:** Each requires a distinct UI pattern (date picker, range slider). Separate feature if metrics show demand.
- **Highlight matched text in results:** Nice to have, adds render complexity, not needed for the core job.
- **"Recent searches":** No evidence users need persistence across sessions; adds storage concerns.
