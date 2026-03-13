# ProdMan Backlog

---

## v0.2 (Drop 2) — `@prodman/vscode` Extension MVP

Scope: the tight loop — open brief → lint guides → quick fix repairs → run → preview → clipboard.

### Must Ship

| Component | Description |
|-----------|-------------|
| **Spec Linter** (`SpecDiagnosticsProvider`) | Ambient inline diagnostics for `agent-brief.md` using `@prodman/core` rules with line/column positions |
| **SpecReadinessBar** | Status bar: `PRODMAN ✓ Agent Ready — 11/11 rules passing` derived from actual lint results |
| **Agent Brief Launcher** | Lint → compile → assemble payload → copy to clipboard |
| **CodeLens Actions** | `Run with PRODMAN \| Validate Spec \| Preview Spec.json` inline at top of `agent-brief.md` |
| **Quick Fixes** | `CodeActionProvider` inserts section templates directly from lint errors |
| **Init Wizard** | On workspace open, if no context files detected, prompt to initialize — generates identical output to `/pm-import` |
| **Spec Preview** | Read-only webview of compiled `spec.json` with JSON highlighting and copy button |

### Core Updates Required (blocking extension work)
- `@prodman/core`: expose linter results with line/column positions
- `@prodman/core`: export canonical section templates (used by autocomplete + quick fixes)
- `@prodman/core`: verify compiler is importable as a TypeScript module in VS Code extension context

---

## v0.2 (Drop 2) — Command Clarity Backlog (carried from v0.1 review)

### High Priority

#### ~~[BL-01] Persist direction commitment to file after `/pm-commit`~~ ✓ Done
**Fix shipped:** `/pm-commit` now derives a feature name, confirms with PM, and writes `features/[feature-name]/commitment.md`. `/pm-ff [feature-name]` loads it automatically.

#### ~~[BL-02] Make `/pm-research` artifact mode selection explicit~~ ✓ Done
**Fix shipped:** Added explicit usage block at top of command (`/pm-research [interview|competitive|prioritize|survey]`). Valid mode in `$ARGUMENTS` generates immediately; empty args prompts with the four options.

---

### Medium Priority

#### ~~[BL-03] Clarify `/pm-agent-brief` use case vs `/pm-ff` agent-brief~~ ✓ Done
**Fix shipped:** Added "When to use this command" block at top of `/pm-agent-brief.md`. Repositioned as the primary fast path in README for PMs with existing docs. Decision tree added to Quick Start.

#### ~~[BL-05] Fix `/pm-retro` Step 3 — context update confirmation is a dead end~~ ✓ Done
**Fix shipped:** Step 3 now appends an actionable "Context Review Checklist" to `retro.md` with specific file references and direct-edit instructions. The dead-end "for PM confirmation" language is removed.

---

### Low Priority

#### ~~[BL-06] Add file-existence guard to `/pm-handoff`~~ ✓ Done
**Fix already present:** `/pm-handoff` already contains a file-existence check at lines 2–5. If `features/[feature-name]/` has no spec files, it responds: "No spec bundle found. Run `/pm-ff [feature-name]` first." Confirmed on review — no change needed.

#### [BL-07] Standardize `/pm-attach` zone placement
**Problem:** `pm-attach` appears in Zone 1's command table in the README but is listed as "Utility" in the Command Reference table.
**Fix:** Pick one. Recommended: keep it as Utility (alongside `/pm-import`) since it's usable across all zones, and remove it from the Zone 1 table.
**Impact:** Low — cosmetic inconsistency.

#### ~~[BL-08] Sharpen `/pm-import` Question 5~~ ✓ Done
**Fix already present:** `/pm-import` Q5 is already "What have you already built, ruled out, or committed to as a team? Include any pivots, feature bets, or explicit non-starters." Confirmed on review — no change needed.

---

## v0.3 (Drop 3) — Zone 1 Persistence + TechDetector + Marketplace

Outcome: The core promise ("every piece of product thinking becomes durable memory") holds end-to-end. Zone 1 thinking persists across sessions. Technical context auto-populates. Extension goes to Marketplace.

**Reordered from original plan:** Zone 1 persistence + TechDetector ship before marketplace polish. Publish with a product worth publishing.

---

### Phase 1 — Zone 1 Persistence (P1 — ships first)

Zone 1 currently produces no files between `/pm-signal` and `/pm-commit`. If a session closes, all thinking is lost. This phase adds intermediate files so context survives across sessions.

| Item | Description | Command Updated |
|------|-------------|-----------------|
| `signal.md` persistence | `/pm-signal` asks for a working feature name at end of dialogue; writes `features/[name]/signal.md` with signal type, clarified picture, key quotes | `pm-signal.md` ✓ |
| `framing.md` persistence | `/pm-frame` loads `signal.md` if present; writes `features/[name]/framing.md` with chosen framing + alternatives | `pm-frame.md` ✓ |
| `exploration.md` persistence | `/pm-explore` loads `signal.md` + `framing.md` if present; writes `features/[name]/exploration.md` with all 6 dimensions | `pm-explore.md` ✓ |
| `/pm-commit` context loading | `/pm-commit` loads `signal.md`, `framing.md`, `exploration.md` if present — full Zone 1 picture even in a new session | `pm-commit.md` ✓ |

**[BL-09] Zone 1 inter-command handoff files**
Elevated from Icebox → v0.3 P1. This is the single highest-impact fix for the core "persistent memory" promise.

---

### Phase 2 — TechDetector + LNT012 (P1 — ships with Phase 1)

`agent-brief.md` Technical Context section is currently a manual fill-in — the most critical field for agent code quality. This phase auto-populates it.

| Item | Description |
|------|-------------|
| **TechDetector** | Detect stack from `package.json`, `go.mod`, `requirements.txt`, etc.; auto-populate Technical Context in `agent-brief.md` |
| **LNT012: TechContextFilled** | New lint rule: block `agent-ready` status if Technical Context section contains placeholder text or is empty |
| **Init Wizard update** | Add "Technical Context Review" step — pre-fills from TechDetector output, prompts PM for confirmation before writing |

**[BL-10] TechDetector reprioritized from Phase 2 → Phase 1**
Original plan had TechDetector behind marketplace polish. Reprioritized: technical context is the most direct threat to agent output quality and PM trust in ProdMan.

**[BL-11] LNT012 — TechContextFilled lint rule**
New blocking lint rule: if Technical Context fields contain `[fill in]`, `[repo name]`, `[list files]`, or are empty, status is `review-needed` not `agent-ready`.

---

### Phase 3 — Marketplace Ready

| Item | Description | Blocks |
|------|-------------|--------|
| `packages/vscode/assets/icon.png` | 128×128px extension icon | VSIX packaging |
| `packages/vscode/.vscodeignore` | Exclude `src/`, `node_modules/`, `tsconfig.json` from VSIX | Clean packaging |
| `packages/vscode/README.md` | Extension-specific README for Marketplace listing | Marketplace publish |
| `CHANGELOG.md` | Root-level release history (v0, v0.1, v0.2 entries) | Marketplace + npm |
| `integrations/vscode-extension.md` | User guide for installing and using `@prodman/vscode` | Discoverability |

---

### Phase 4 — Extension Expansion (deferred from Drop 2)

**Pre-condition:** Write Signal Inbox mini-spec before Phase 4 starts. Define: UI surface (sidebar treeview), persistence (`signals.md` — already wired in `extension.ts`), and whether it feeds Phase 5 Brief Generator.

**Build sequence (items have dependencies — not all parallel):**
```
TechDetector → DriftDetector → Context Health Panel
Signal Inbox ─────────────────────────── (independent)
Pipeline Dashboard ───────────────────── (independent)
InitWizard alignment ─────────────────── (maintenance, no dependency)
```

| Component | Description | Design Note |
|-----------|-------------|-------------|
| DriftDetector | Flag when `constraints.md` is out of sync with detected stack | Build after TechDetector |
| Context Health Panel | Sidebar showing health of `prodman-context/` files | Displays TechDetector + DriftDetector output |
| Signal Inbox | Capture product signals in VS Code; persist to `prodman-context/signals.md` | Independent — build after mini-spec |
| Pipeline Dashboard | Webview showing all features and their readiness/zone state | Independent — uses FeatureScanner; priority surface for team visibility |
| Align InitWizard with `templates/context/` | Remove inline templates from `InitWizard.ts`; use `templates/context/` as source of truth | Maintenance |

---

### Phase 5 — Smart Authoring (deferred from Drop 2)

**Pre-condition:** Phase 4 Context Health Panel shipped. Drop-2 lint + quick-fix guardrails are active.

| Component | Description | Design Note |
|-----------|-------------|-------------|
| Feature Brief Generator | Generate `agent-brief.md` scaffold from natural language | Opens with diagnostics active; quick fixes guide completion |
| Spec Section Autocomplete | IntelliSense for spec section names with template expansion | Sources templates from `@prodman/core` `SECTION_TEMPLATES` |
| Folder → Feature Suggestion | Prompt to create brief when new module folders appear | Blocklist (`utils`, `types`, `hooks`, `helpers`, `constants`, `__tests__`) + dismissal persisted |
| Smart Suggestions | Context-aware nudges (e.g. `package.json` changed → update `constraints.md`) | One prompt per event; never repeat if dismissed |

---

**Drop-3 end state:** Zone 1 thinking persists across sessions. Technical context auto-populates. Install from Marketplace in one click → workspace context health visible in sidebar → create or generate briefs → lint + quick fixes guide completion → run agent → preview payload → paste into AI.

---

## v0.4 — Team Context + Integrations

### Team-Shareable Context

**~~[BL-12] Team Setup documentation + handoff-response.md template~~ ✓ Done**
All three items shipped:
- README "Team Setup" section added — shared-repo pattern, git workflow, Option A/B, handoff response loop diagram
- `templates/features/handoff-response.md` created — blockers table, scope change requests, answered questions, technical discoveries, updated DoD, notes for PM
- `/pm-ff` updated — loads `handoff-response.md` if present; incorporates answered questions, scope changes, technical discoveries, and blockers before generating spec bundle

### Integrations

**[BL-13] Linear/Jira push via CLI**
`tickets.md` is a dead-end artifact. `prodman push linear` (or `prodman push jira`) would make ProdMan essential, not optional. CLI already exists — this is an integration surface.

| Item | Description |
|------|-------------|
| `prodman push linear [feature-name]` | Auth via Linear API key; map tickets.md → Linear issue format; create issues in configured team |
| `prodman push jira [feature-name]` | Auth via Jira API token; map to Jira issue type schema |
| CLI `auth` subcommand | Store API keys securely (system keychain or env var) |

---

### Spec Intelligence

**[BL-16] Spec Coverage Score**
A numeric coverage score (0–100) added to `CompiledSpec` reflecting how *complete* a brief is, independent of lint validity. A brief can pass all 12 rules with 2 acceptance criteria — coverage penalizes thin specs. Displayed alongside readiness in the status bar. New lint rule LNT-013 warns if coverage < 60%.

Scoring dimensions: AC count (5–10 target), edge cases (3+ target), constraints filled (non-placeholder), escalation triggers present, out-of-scope items present.

**Touches:** `SpecMapper.ts` (scoring logic + new field), `compiled-spec-schema.json` (new field), `SpecReadinessBar.ts` (display), LNT-013 (new warning rule).

---

**[BL-17] Signals → Feature Suggestions**
Closes the discovery-to-execution loop. Captured signals in `prodman-context/signals.md` currently have no downstream action — they're an append log with no consumer. A "Create brief from signal" action in Signal Inbox generates a draft `agent-brief.md` with Task Summary pre-filled from the signal, Product Context pulled from `product.md`, and Technical Context auto-populated by TechDetector. Opens immediately with linter active to guide completion.

**Touches:** `SignalInboxPanel.ts` (new tree item action), `extension.ts` (new `prodman.createBriefFromSignal` command), `package.json` (command registration). Reuses existing `createFeatureBrief()` in `InitWizard.ts` with signal pre-fill.

---

## v1.0 — Platform Play

### compiled-spec.json as Emerging Standard

**[BL-14] Schema publication + ecosystem outreach**
Publish `compiled-spec-schema.json` at a stable URL. Outreach to AI coding tool developers (Cursor, GitHub Copilot Workspace, etc.) to consume the schema natively. If adopted, ProdMan becomes infrastructure rather than a tool.

| Item | Description |
|------|-------------|
| Schema hosted at `prodman.dev/schemas/compiled-spec/v1.json` | Stable, versioned URL |
| Schema versioning policy | Semver — breaking changes require v2 |
| Developer docs | How to consume `compiled-spec.json` in an AI coding agent or tool |

### Agent Feedback Loop

**[BL-15] agent-feedback.md → history.md loop**
Structured log where PMs record what the agent asked for / got wrong / needed clarified after each execution. `/pm-retro` reads `agent-feedback.md` and surfaces durable learnings as update candidates for `history.md`.

| Item | Description |
|------|-------------|
| `templates/features/agent-feedback.md` | Structured log: what agent asked, what it got wrong, what it needed |
| `/pm-retro` update | Read `agent-feedback.md` if present; surface top learnings in retro |
| `history.md` integration | Durable agent learnings auto-appended alongside feature learnings |

---

## Icebox (No Target Release)

- `/pm-ff` inline "all" response: warn PM that generating all four handoff views at once produces significant output
- Feature name sourcing: explicitly prompt for feature name at start of `/pm-ff` rather than deriving it implicitly

---

*Last updated: 2026-03-11. BL-06, BL-08 confirmed already shipped; BL-12 (handoff-response.md + Team Setup) shipped. BL-09 (Zone 1 persistence), BL-10 (TechDetector), BL-11 (LNT012) shipped in v0.3 Phase 1+2 work. BL-16 (Spec Coverage Score) and BL-17 (Signals → Feature Suggestions) added as v0.4 Spec Intelligence.*
