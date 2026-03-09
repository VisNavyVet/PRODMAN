# ProdMan Demo Script — Drop 1 Launch

**Target length:** 45–60 seconds
**Hook:** "Agents generate correct code for the wrong product."

---

## Opening (0–5s)

> "AI coding agents ship code fast. But they build what you *say*, not what you *mean*."

*Show: messy terminal with an agent building the wrong thing*

---

## Problem Setup (5–12s)

> "The root issue is the spec. Vague acceptance criteria, missing scope boundaries, no escalation triggers — and agents just... proceed."

*Show: an `agent-brief.md` with highlighted vague text — "works correctly", empty escalation section*

---

## Step 1: Install (12–17s)

```bash
npm install -g @prodman/cli
```

> "ProdMan ships a CLI that validates specs before any agent sees them."

---

## Step 2: Validate a bad spec (17–28s)

```bash
prodman validate checkout-v2
```

*Show: output with red errors*

```
checkout-v2/agent-brief.md
  ✗ [LNT-011] No escalation triggers — agent will make unauthorized decisions
  ⚠ [LNT-009] Vague AC: "works correctly" on line 34
  Status: ✗ Incomplete (1 error, 1 warning)
```

> "Two problems caught before the agent touches your codebase."

---

## Step 3: Fix and re-validate (28–36s)

*Show: quick edit to agent-brief.md — add escalation trigger, sharpen AC*

```bash
prodman validate checkout-v2
```

```
checkout-v2/agent-brief.md
  ✓ No issues
  Status: ✓ Agent Ready
```

> "Agent Ready. Now compile."

---

## Step 4: Compile to machine-readable spec (36–46s)

```bash
prodman compile checkout-v2
```

```
✓ Compiled features/checkout-v2/compiled-spec.json (v1)
```

*Scroll through compiled-spec.json — show task_summary, acceptance_criteria, escalation_triggers fields*

> "The compiled spec is a machine-readable contract. 12 fields. Every requirement verifiable."

---

## Step 5: Add to CI (46–52s)

*Show: GitHub Action YAML snippet*

```yaml
- uses: prodman/prodman-validate@v1
  with:
    fail-on: incomplete
```

> "Drop it into CI. Bad specs never reach an agent."

---

## Close (52–60s)

> "ProdMan turns product specs into contracts AI agents can actually execute."

*Show: terminal with `✓ Agent Ready` + compiled JSON side by side*

**CTA:** `npm install -g @prodman/cli` · github.com/VisNavyVet/PRODMAN

---

## Narrator Notes

- Terminal font: JetBrains Mono, 16px
- Theme: dark (Catppuccin Mocha or One Dark)
- No music — terminal audio only
- Zoom into diagnostics output (they need to be readable)
- Keep cursor movements deliberate, no fast scrolling
- Record at 1440p, export at 1080p
