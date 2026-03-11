# Changelog

All notable changes to ProdMan packages are documented here.

---

## [0.3.0] — 2026-03-11

### Added
- **Zone 1 persistence** — `/pm-signal`, `/pm-frame`, `/pm-explore`, `/pm-commit` now write intermediate files (`signal.md`, `framing.md`, `exploration.md`, `commitment.md`) so thinking survives across sessions
- **TechDetector** (`@prodman/vscode`) — auto-detects repo name and tech stack from `package.json`, `go.mod`, `requirements.txt`, `Cargo.toml`, `pom.xml`; pre-fills Technical Context in new agent briefs
- **LNT-012: TechContextFilled** (`@prodman/core`) — blocking lint rule: `agent-ready` status blocked if Technical Context contains placeholder text or is empty
- **DriftDetector** (`@prodman/vscode`) — detects when `constraints.md` is out of sync with the detected stack
- **Context Health Panel** — sidebar view showing health of all `prodman-context/` files; surfaces drift warnings
- **Signal Inbox Panel** — sidebar view for browsing captured product signals
- **Feature Pipeline Dashboard** — sidebar view showing all features, their zone, and agent-brief readiness

### Changed
- `InitWizard` now reads bundled context templates instead of inline strings; pre-fills detected tech stack on initialization
- `InitWizard` updated to accept `extensionUri` for template resolution

---

## [0.2.0] — 2026-02-14

### Added
- **`@prodman/vscode`** — VS Code extension (Drop 2)
  - `SpecDiagnosticsProvider` — ambient inline lint diagnostics for `agent-brief.md`
  - `SpecReadinessBar` — status bar item showing live rule pass/fail count
  - `AgentBriefLauncher` — lint → compile → assemble → copy to clipboard
  - `SpecCodeLensProvider` — CodeLens actions at top of `agent-brief.md`
  - `QuickFixProvider` — one-click section template insertion from lint errors
  - `SpecPreviewPanel` — read-only webview of compiled `spec.json`
  - `InitWizard` — multi-step workspace initialization
  - `TechDetector` — tech stack detection from workspace files
- **`@prodman/core`** — `SectionTemplates` export for use by quick fixes and autocomplete
- **`@prodman/core`** — `compileToSpec()` method for in-memory compilation (no disk writes)
- **`@prodman/core`** — line/column positions in lint diagnostics

---

## [0.1.0] — 2026-01-20

### Added
- **`@prodman/core`** — spec linter (11 rules, LNT-001–011), compiler, section parser
- **`@prodman/cli`** — `prodman validate` and `prodman compile` commands
- **GitHub Action** — `prodman/action` for CI validation
- 12 PM workflow commands: `pm-import`, `pm-signal`, `pm-frame`, `pm-explore`, `pm-commit`, `pm-ff`, `pm-research`, `pm-handoff`, `pm-agent-brief`, `pm-ship`, `pm-retro`, `pm-attach`
- `prodman-context/` template files: `product.md`, `users.md`, `constraints.md`, `history.md`
- `templates/features/` output templates: `brief.md`, `prd.md`, `approach.md`, `plan.md`
- `compiled-spec-schema.json` — machine-readable spec schema

---

## [0.0.1] — 2025-12-01

### Added
- Phase 0: example bundle, compiled-spec schema, spec standard v1
- `prodman-context/` concept and first templates
