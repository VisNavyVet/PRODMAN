# ProdMan — VS Code Extension

AI-ready spec linting and agent brief launcher for VS Code.

---

## What It Does

ProdMan turns `agent-brief.md` into a machine-readable contract that AI coding agents can actually use. The extension runs the full tight loop inside VS Code:

1. **Lint** — 12 rules flag vague AC, missing escalation triggers, unfilled tech context, and more — as inline diagnostics, inline as you type
2. **Quick Fix** — one-click inserts section templates directly from lint errors
3. **Compile** — converts your brief into `compiled-spec.json` (machine-readable)
4. **Copy to clipboard** — assembled payload (spec + product context) ready to paste into any AI tool

---

## Quick Start

**Step 1: Initialize workspace**

Open the Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) and run:
```
ProdMan: Initialize Workspace
```

This creates `prodman-context/` with `product.md`, `users.md`, `constraints.md`, and `history.md`. Fill in `product.md` first — every command loads it automatically.

**Step 2: Create a feature brief**

```
ProdMan: Initialize Workspace → Create first feature brief
```

Or create `features/[feature-name]/agent-brief.md` manually.

**Step 3: Open the brief and work with lint**

Open `agent-brief.md`. The status bar shows:
```
PRODMAN ✓ Agent Ready — 12/12 rules passing
PRODMAN ⚠ Review Needed — 10/12 rules passing
PRODMAN ✗ Incomplete — 7/12 rules passing
```

Click a diagnostic → Apply Quick Fix to insert the missing section template.

**Step 4: Launch the agent**

Click `▶ Run with PRODMAN` in the CodeLens (top of file) or run:
```
ProdMan: Launch Agent from Brief
```

The compiled payload is copied to clipboard. Paste into Claude, GPT-4, or any AI tool.

---

## Commands

| Command | Description |
|---------|-------------|
| `ProdMan: Initialize Workspace` | Create `prodman-context/` with product, users, constraints, history |
| `ProdMan: Launch Agent from Brief` | Lint → compile → copy payload to clipboard |
| `ProdMan: Compile Spec → spec.json` | Lint + compile only (no clipboard) |
| `ProdMan: Preview Compiled Spec` | Open read-only webview of `compiled-spec.json` |
| `ProdMan: Capture Signal` | Append a product signal to `prodman-context/signals.md` |

---

## Sidebar Views

Open the ProdMan sidebar (activity bar icon) for:

- **Context Health** — see which `prodman-context/` files exist. Stack drift is flagged when frameworks detected in your codebase (`package.json`, `go.mod`, etc.) are not mentioned in `constraints.md`. Click `constraints.md` in the panel to open and update the Technical Constraints section.
- **Signal Inbox** — browse signals captured via `Capture Signal`, most recent first. Use the `+` button in the panel header to add a new signal without leaving the sidebar.
- **Feature Pipeline** — see all features in `features/`, their zone (derived from which files exist), and `agent-brief.md` readiness status at a glance.

---

## Lint Rules

| Rule | Description | Severity |
|------|-------------|----------|
| LNT-001 | Required sections present | Error |
| LNT-002 | Task summary ≥ 20 words | Error |
| LNT-003 | Relevant files listed | Warning |
| LNT-004 | In Scope has ≥ 1 item | Error |
| LNT-005 | Out of Scope has ≥ 1 item | Error |
| LNT-006 | Requirements has ≥ 3 items | Error |
| LNT-007 | Anti-requirements has ≥ 1 item | Warning |
| LNT-008 | Acceptance Criteria has ≥ 3 items | Error |
| LNT-009 | No vague language in AC | Warning |
| LNT-010 | Definition of Done has ≥ 3 items | Error |
| LNT-011 | Escalation Triggers has ≥ 1 item | Warning |
| LNT-012 | Technical Context is filled in | Error |

---

## Requirements

- VS Code 1.85+
- A workspace with at least one `features/**/agent-brief.md` or `prodman-context/product.md`

---

## Part of ProdMan

This extension is part of the [ProdMan framework](https://github.com/VisNavyVet/PRODMAN) — an open-source PM toolkit for teams building with AI agents.

- CLI: `@prodman/cli` — validate and compile specs from the terminal
- Core: `@prodman/core` — linter and compiler as a library
- Commands: 12 AI-agnostic slash commands for the full PM workflow (Claude Code, Cursor, any AI tool)
