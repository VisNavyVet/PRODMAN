#!/usr/bin/env bash
# ProdMan Drop 1 Demo — Terminal Commands
# Run these in order during recording.
# Pause 1-2 seconds after each output before running next command.

# ============================================================
# SETUP (do before recording — not on camera)
# ============================================================

# 1. Install CLI globally (if not already installed from npm)
#    After publish: npm install -g @prodman/cli
#    Before publish (local dev): alias prodman="node /path/to/packages/cli/dist/index.js"

# 2. Create a feature with intentional spec issues
mkdir -p features/checkout-v2
cat > features/checkout-v2/agent-brief.md << 'EOF'
# Agent Brief — Checkout v2

**Date:** 2026-03-09

---

## Task Summary

Rebuild the checkout flow with a new payment form that collects card details and
processes payment via Stripe. The current checkout is slow and losing users at
the payment step.

## Context

### Product context
- **Product:** Mobile-first e-commerce marketplace
- **Affected users:** Mobile checkout users

### Technical context
- **Repository:** storefront-web
- **Relevant files / modules:**
  - `src/pages/checkout/CheckoutPage.tsx`
  - `src/components/payment/PaymentForm.tsx`
- **Tech stack:** Next.js 14, TypeScript, Stripe
- **Related systems:** POST /api/payment/charge

---

## Task Scope

### In scope
- New payment form UI

### Out of scope (do not touch)
- Do NOT modify the backend payment processor

---

## Requirements

### Must implement
- [ ] Payment form renders on checkout page

### Must NOT do
- [ ] Do NOT store card numbers in the frontend

---

## Acceptance Criteria

- [ ] Payment form renders on the checkout page
- [ ] The payment flow works correctly after submission
- [ ] The UI looks good on mobile
- [ ] Clearing the form resets to empty state

---

## Edge Cases to Handle

| Scenario | Expected behavior |
|----------|-------------------|
| Card declined | Show declined message |

---

## Constraints

- **Do not change:** Backend payment service
- **Style guide:** Tailwind CSS
- **Performance:** Form renders within 200ms
- **Accessibility:** aria-labels required
- **Security:** PCI DSS — no card data in logs

---

## Definition of Done

- [ ] All acceptance criteria are met
- [ ] New tests written and passing
- [ ] No regressions in checkout test suite

---

## Questions the Agent Should Flag

EOF

echo "Setup complete. Ready to record."

# ============================================================
# ON CAMERA — run these during recording
# ============================================================

# --- SHOT 1: Show install (already installed, just show version) ---
prodman --version

# --- SHOT 2: Validate bad spec ---
prodman validate checkout-v2

# Expected output:
# features/checkout-v2/agent-brief.md
#   ✗ [LNT-010] Line 37: Definition of Done must contain at least 3 items (found 3... wait actually 3 items)
#   ⚠ [LNT-009] Line 27: Vague AC: "works correctly"
#   ⚠ [LNT-009] Line 28: Vague AC: "looks good"
#   ⚠ [LNT-011] No escalation triggers defined
#   Status: ⚠ Review Needed (0 errors, 3 warnings)

# --- SHOT 3: Fix the spec ---
# Edit features/checkout-v2/agent-brief.md:
# 1. Change "works correctly" line to: "- [ ] Payment confirms within 3s and user sees order confirmation page"
# 2. Change "looks good on mobile" to: "- [ ] Form is usable on 375px viewport — inputs stack vertically, CTA is full-width"
# 3. Add under "Questions the Agent Should Flag":
#    "- Stop if payment integration requires changes to the backend auth service"

# --- SHOT 4: Re-validate ---
prodman validate checkout-v2

# Expected:
# features/checkout-v2/agent-brief.md
#   ✓ No issues
#   Status: ✓ Agent Ready

# --- SHOT 5: Compile ---
prodman compile checkout-v2

# Expected:
# ✓ Compiled features/checkout-v2/compiled-spec.json (v1)

# Show the JSON
cat features/checkout-v2/compiled-spec.json

# --- SHOT 6: CI snippet — show action.yml ---
cat << 'YAML'
# .github/workflows/spec-check.yml
- uses: prodman/prodman-validate@v1
  with:
    fail-on: incomplete
YAML

# --- SHOT 7: Status overview (optional polish shot) ---
prodman status
