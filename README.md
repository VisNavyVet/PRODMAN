# ProdMan

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![AI Agnostic](https://img.shields.io/badge/AI-Agnostic-green)](integrations/universal.md)
[![Works with Claude Code](https://img.shields.io/badge/Works%20with-Claude%20Code-blue)](https://claude.ai/code)
[![Works with Cursor](https://img.shields.io/badge/Works%20with-Cursor-black)](https://cursor.sh)
[![Version](https://img.shields.io/badge/version-0.3.2-brightgreen)]()
[![npm @prodman/cli](https://img.shields.io/badge/npm-%40prodman%2Fcli-red)](https://www.npmjs.com/package/@prodman/cli)
[![VS Code Extension](https://img.shields.io/badge/VS%20Code-%40prodman%2Fvscode-007ACC)](https://marketplace.visualstudio.com/items?itemName=prodman.prodman)

**An open-source PM framework for teams building with AI agents.**
Structured thinking. Persistent product memory. Agent-ready output — from signal to ship.

**[→ Visual walkthrough](https://visnavyvet.github.io/PRODMAN/)** — user journey, pain points, LLM vs ProdMan, agentic benefits.

---

## The Problem

You're building with AI agents. Your workflow looks like this:

> You re-explain your product to the AI. Every. Single. Session.
> You paste a PRD into Claude Code and hope the agent figures out scope.
> You write specs in Notion, tickets in Linear, briefs for engineers, 1-pagers for execs — all manually, all for the same feature.
> Retro learnings go into a doc nobody reads again.
> The next feature starts as cold as the first one.

**The problem isn't AI capability. It's that nothing connects.**

ProdMan connects it.

---

## Why Not Just Use Notion or ChatGPT?

You can. But three things break at scale:

**1. Memory loss.** Every new session starts cold. You re-explain your product, your users, your constraints. The AI gives generic advice. ProdMan loads `prodman-context/` before every command — the AI already knows your product before you type.

**2. Agent handoff risk.** Pasting a Notion PRD into Claude Code works until the agent overengineers, misses scope, or makes silent decisions it shouldn't. An `agent-brief.md` gives the agent bounded scope, explicit must-NOT-do lists, and escalation triggers — so it knows when to stop and ask.

**3. Audience rewrites.** You write one spec, then manually rewrite it for engineers, designers, and execs. ProdMan generates 5 audience-ready views from one source on demand.

---

## How It Works

ProdMan is two things working together: **12 AI command prompts** for the PM workflow, and a **CLI + compiler** that validates specs and turns them into machine-readable contracts.

```
/pm-import          ← Run once. Generates your persistent product memory.
     ↓
/pm-signal          ← Drop a raw signal. AI asks before it prescribes.
/pm-frame           ← 2–3 distinct problem framings to react against.
/pm-explore         ← 6-dimension deep-dive, one question at a time.
/pm-commit          ← Lock direction. Writes commitment.md to disk.
     ↓
/pm-ff              ← Full spec bundle in one shot. Agent brief is primary output.
     ↓
prodman validate    ← 12 lint rules catch vague AC, missing escalation triggers, unfilled tech context, etc.
prodman compile     ← Compiles agent-brief.md → compiled-spec.json (machine-readable)
     ↓
/pm-handoff         ← engineer / designer / exec / tickets — each gets their view.
     ↓
/pm-ship            ← Launch checklist + comms plan.
/pm-retro           ← Retrospective → auto-updates history.md → next feature smarter.
     ↑_______________________________________________|
```

`prodman-context/` is your persistent product brain. Every command loads it automatically. The more features you ship, the smarter it gets.

---

## Quick Start

No prerequisites. Clone and go. Claude Code gives you native slash commands — but any AI tool works.

```bash
git clone https://github.com/VisNavyVet/PRODMAN.git
cd PRODMAN
```

Both paths below end at the same place: a validated `agent-brief.md` that passes all 12 lint rules, ready for any AI coding agent.

---

### Path A — Starting from a signal

**Who:** Technical founders, PMs with a fuzzy problem that needs thinking through.
**Time:** 2–3 short sessions. **Commands:** 5.

```
Step 0  /pm-import          Bootstrap product memory once
        ↓
Step 1  /pm-signal          Drop raw signal → ProdMan asks one question at a time
        ↓                   Writes features/[name]/signal.md
Step 2  /pm-frame           3 framings to react against
        /pm-explore         6-dimension deep-dive — both persist across sessions
        ↓
Step 3  /pm-commit          Lock direction → writes commitment.md
        ↓
Step 4  /pm-ff              Full spec bundle: brief + PRD + approach + plan + agent-brief.md
        ↓
        Fix lint errors → status bar shows ✓ 12/12 → launch agent
```

**Start here:** `/pm-signal [your signal]`

---

### Path B — Already have a PRD ⚡

**Who:** Any PM with an existing PRD from Claude, ChatGPT, Notion, Jira, Linear, or rough notes.
**Time:** ~15 minutes. **Commands:** 1.

```
Step 0  /pm-import          Bootstrap product memory once (paste existing docs to skip)
        ↓
Step 1  /pm-agent-brief     Paste your PRD → ProdMan extracts scope, requirements, AC
                            Fills gaps through targeted questions only
        ↓
Step 2  Fix lint errors      Red squiggles show what's missing → Quick Fix inserts templates
        ↓
        Status bar shows ✓ 12/12 → launch agent
```

PRDs are written for humans. Agent briefs are written for agents. `/pm-agent-brief` converts between the two.

**Start here:** `/pm-agent-brief [feature-name]` — then paste your PRD when prompted.

**Works with:** Claude/ChatGPT output · Notion · Jira · Linear · Google Docs · rough notes

---

## What Success Looks Like

After running `/pm-ff`, your feature folder looks like this:

```
features/checkout-v2/
├── agent-brief.md ★     ← ready for your coding agent
├── prd.md
├── brief.md
└── ...
```

Your status bar shows:

```
PRODMAN ✓ Agent Ready — 12/12 rules passing
```

And a snippet of your `agent-brief.md`:

```markdown
## In Scope
- Guest checkout flow (no account required)
- Save card option (opt-in only)

## Must NOT Do
- Do not modify the existing logged-in checkout path
- Do not add upsell prompts

## Escalation Triggers
- Stop if payment provider API returns undocumented errors
- Stop if cart total exceeds $10,000 (fraud risk — escalate to PM)
```

That's what the agent receives. Bounded. Testable. No guessing.

---

## VS Code Extension

`@prodman/vscode` brings the ProdMan spec quality loop directly into your editor. No command palette hunting. No context switching. The tight loop — open brief → lint guides → quick fix repairs → run → preview → clipboard — happens inline.

| Feature | What it does |
|---------|-------------|
| **Spec Linter** | Ambient inline diagnostics on `agent-brief.md` as you type — powered by all 12 `@prodman/core` rules |
| **Readiness Bar** | Status bar shows `PRODMAN ✓ Agent Ready — 12/12 rules passing` at all times |
| **Agent Brief Launcher** | Lint → compile → assemble payload → copy to clipboard in one click |
| **CodeLens Actions** | `▶ Run with PRODMAN \| Validate Spec \| Preview Spec.json` inline at the top of every brief |
| **Quick Fixes** | Click a lint error → section template inserted automatically |
| **Init Wizard** | Detects missing workspace context on startup, generates `prodman-context/` with a prompt; auto-fills stack from codebase |
| **Spec Preview** | Read-only webview of the compiled `spec.json` with syntax highlighting and Copy JSON button |
| **Context Health** | Sidebar panel showing health of all `prodman-context/` files; flags stack drift when `constraints.md` is out of sync with detected tech stack |
| **Signal Inbox** | Sidebar panel showing captured signals from `prodman-context/signals.md`, most recent first |
| **Feature Pipeline** | Sidebar dashboard showing all features, their zone, and `agent-brief.md` readiness at a glance |

**Extension activates when your workspace contains:**
- `CLAUDE.md`
- `prodman-context/product.md`
- `features/**/agent-brief.md`

**Install:**

```bash
# From Marketplace (recommended):
code --install-extension prodman.prodman
# Or search "ProdMan" in the VS Code Extensions panel

# From source:
cd packages/vscode
npm install && npm run build
# Extensions → Install from VSIX
```

---

## CLI — Validate and Compile Specs

ProdMan ships a CLI (`@prodman/cli`) that validates specs against 12 lint rules and compiles them to machine-readable JSON contracts. Use it locally or in CI.

```bash
npm install -g @prodman/cli
```

**Validate a spec (shows readiness + all issues):**

```bash
prodman validate checkout-v2
# ✗ [LNT-011] Missing escalation triggers — agent will make unauthorized decisions
# ⚠ [LNT-009] Vague AC: "works correctly"
# Status: ✗ Incomplete (1 error, 1 warning)

# After fixing:
prodman validate checkout-v2
# ✓ Agent Ready
```

**Validate all features:**

```bash
prodman validate --all
```

**Compile to machine-readable spec.json:**

```bash
prodman compile checkout-v2
# → features/checkout-v2/compiled-spec.json (v1)
```

**See all features and their status:**

```bash
prodman status
# Feature               Zone  Files  Readiness       Last Updated
# checkout-v2           2     5/6    ✓ Agent Ready   1 day ago
# notification-center   1     1/6    ✗ Incomplete    14 days ago
```

**Add to CI — block merges on incomplete specs:**

Run `prodman validate --all` in your CI pipeline to catch incomplete specs before merge. GitHub Action coming soon.

The core library (`@prodman/core`) is zero-dependency and importable directly in any Node.js project:

```typescript
import { Linter, Compiler } from '@prodman/core'

const linter = new Linter()
const result = linter.lintFile('features/checkout-v2/agent-brief.md')
console.log(result.readiness) // 'agent-ready' | 'review-needed' | 'incomplete'
```

---

## Pain Points — What ProdMan Fixes at Each Step

| Stage | Without ProdMan | With ProdMan |
|---|---|---|
| **Every session** | Re-explain product, users, constraints from scratch | `prodman-context/` loads automatically — AI knows your product before you type |
| **Signal intake** | Describe a problem → AI immediately writes a solution | Reflects back first, asks ONE question, separates symptom from root cause |
| **Problem framing** | Stuck in your own framing, LLM validates whatever angle you bring | 2–3 distinct root hypotheses — at least one challenges the obvious read |
| **Exploration** | Surface-level answers, misses who's affected and what's been tried | 6-dimension structured exploration with periodic synthesis |
| **Direction** | Fuzzy scope, PM and team have different mental models | Falsifiable problem statement, explicit "NOT solving for," written out-of-scope |
| **Spec writing** | Manual, inconsistent, every PM does it differently | 5-file bundle in one shot — agent brief as primary output |
| **Agent handoff** | PRD dump — agent guesses scope, overengineers, can't self-verify | Bounded, testable, explicit must-NOT-do list, escalation triggers |
| **Audience output** | Same doc for engineers, designers, execs — PM rewrites manually | One spec → 5 audience-ready views on demand |
| **Team memory** | Learnings die when the tab closes | `/pm-retro` auto-appends to `history.md` — every future session starts warm |

---

## Direct LLM vs ProdMan

Same AI. Radically different outcomes. The gap is structure, memory, and what happens before the AI speaks.

| | Direct LLM | ProdMan |
|---|---|---|
| Product context | ✗ Re-explained every session | ✓ Auto-loaded from `prodman-context/` |
| Starting point | ✗ Cold start every feature | ✓ Warm — history of decisions loaded |
| Problem framing | ✗ Validates your framing | ✓ Generates alternatives, challenges assumptions |
| Dialogue style | ✗ Answers immediately | ✓ Questions before prescribing |
| Spec quality | ✗ Format varies by session | ✓ Consistent 5-file bundle every time |
| Agent handoff | ✗ PRD dump — agent guesses | ✓ Bounded brief with explicit scope + escalation triggers |
| Audience output | ✗ One doc, manual reformatting | ✓ 5 audience-ready views from one source |
| Team memory | ✗ Dies when the tab closes | ✓ Grows with every retro |
| Learning loop | ✗ None | ✓ Retro → `history.md` → next feature |
| Scope governance | ✗ Agent interprets intent | ✓ Explicit in/out scope + must NOT do |

---

## Agentic Benefits

> ProdMan is agent-first. The primary output of `/pm-ff` is not a human archive — it's a structured context package for an AI coding agent about to build.

The `agent-brief.md` is built on 6 principles:

| Principle | What it means for the agent |
|---|---|
| **Bounded** | Exact start/stop points. Agent knows what to build and what to leave alone. |
| **Testable** | Acceptance criteria are observable and verifiable. Agent can self-check before delivering. |
| **Contextual** | Product + technical context embedded. Agent builds for the right user with the right constraints. |
| **Explicit "Must NOT Do"** | Stop list prevents overengineering and unauthorized scope expansion. |
| **Clear escalation** | Agent knows exactly when to stop and ask vs. when to proceed. No silent failures. |
| **Reproducible** | Any agent, any session, any model — picks up the same brief and produces consistent output. |

**Agent brief fields:**

```
task_summary          ← 1–3 sentences. Agent knows the job before reading anything else.
product_context       ← Who it's for and why. Agent builds for the right user.
technical_context     ← Stack, patterns, constraints. Agent doesn't contradict your architecture.
in_scope              ← Hard list. Build exactly this.
out_of_scope          ← Hard list. Touch none of this.
anti_requirements     ← Explicit stop list. Prevents scope creep and overengineering.
acceptance_criteria   ← Observable, verifiable. Agent self-checks before delivering.
edge_cases            ← Pre-enumerated. Agent handles them consistently, not by guessing.
constraints           ← Style, perf, accessibility, security. Non-negotiable requirements.
definition_of_done    ← Agent knows when to stop, not just when to ship.
escalation_triggers   ← Stop and ask if: [explicit conditions]. No silent failures.
```

These 11 fields map directly to `compiled-spec.json` — the machine-readable contract produced by `prodman compile`. See [`specs/prodman-spec-v1.md`](specs/prodman-spec-v1.md) for the full spec standard and [`schemas/compiled-spec-schema.json`](schemas/compiled-spec-schema.json) for the JSON schema.

---

## Command Reference

### Utility

| Command | What it does |
|---|---|
| `/pm-import` | 5-question interview → generates `prodman-context/`. Run once per product. Paste existing docs to skip ahead. |
| `/pm-attach` | Load a file (image, PDF, spreadsheet) into context. Usable at any zone. Surfaces relevant signals, not just summaries. |

### Zone 1 — Materialization
*Turn raw signals into committed, falsifiable direction. AI questions before it prescribes.*

| Command | What it does |
|---|---|
| `/pm-signal` | Capture any signal — complaint, metric, idea. Socratic dialogue, one question at a time. |
| `/pm-frame` | Generate 2–3 distinct problem framings with different root hypotheses. React and choose. |
| `/pm-explore` | Deep-dive the chosen framing across 6 dimensions. Synthesizes after each answer. |
| `/pm-commit` | Lock direction. Writes `features/[name]/commitment.md` so `/pm-ff` works across sessions. |

### Zone 2 — Planning
*One command. Five files. Agent brief is always the primary output.*

| Command | What it does |
|---|---|
| `/pm-ff [name]` | Generates `agent-brief.md` + `brief.md` + `prd.md` + `approach.md` + `plan.md`. Loads `commitment.md` automatically. Prompts for audience views inline. |

### Zone 3 — Research
*Validate before or alongside spec work.*

| Command | What it does |
|---|---|
| `/pm-research interview` | User interview guide — screener, core questions, probes |
| `/pm-research competitive` | Competitive benchmarking matrix — structured around your positioning |
| `/pm-research prioritize` | RICE scoring table — pre-filled with your candidates |
| `/pm-research survey` | Validation survey — built to test your specific hypothesis |

### Zone 4 — Handover
*One spec. Five audience-ready views. Generate any on demand.*

| Command | Output | For |
|---|---|---|
| `/pm-handoff engineer` | `handoff-eng.md` | User stories, AC, edge cases, DoD — kickoff-ready |
| `/pm-handoff designer` | `handoff-design.md` | JTBD, current→target journey, UX constraints |
| `/pm-handoff stakeholder` | `stakeholder-brief.md` | Exec 1-pager — outcome-first, no implementation detail |
| `/pm-handoff tickets` | `tickets.md` | FEAT + STORY tickets — paste into Linear or Jira |
| `/pm-agent-brief` | `agent-brief.md` | Standalone brief — for existing docs or brief regeneration |

### Zone 5 — Ship & Learn
*Launch coordination and living product memory.*

| Command | What it does |
|---|---|
| `/pm-ship` | Pre/launch/post checklists + communication plan + rollout phases |
| `/pm-retro` | Retrospective → auto-appends learning block to `history.md` → loads before every future command |

---

## Output Files

```
prodman-context/              ← persistent memory, loads before every command
├── product.md                ← what your product is
├── users.md                  ← user segments and personas
├── constraints.md            ← tech, legal, org constraints
└── history.md                ← decisions + retro learnings — auto-grows via /pm-retro

features/[feature-name]/      ← generated per feature
├── signal.md                 ← Zone 1: raw signal + clarifications (written by /pm-signal)
├── framing.md                ← Zone 1: chosen problem framing (written by /pm-frame)
├── exploration.md            ← Zone 1: 6-dimension exploration (written by /pm-explore)
├── commitment.md             ← direction lock (written by /pm-commit)
├── agent-brief.md ★          ← primary output — for AI coding agents
├── brief.md                  ← 1-page PM summary
├── prd.md                    ← full requirements (P0/P1/P2)
├── approach.md               ← decision rationale, options considered
├── plan.md                   ← milestones, work breakdown, risks
├── compiled-spec.json ◆      ← machine-readable contract (written by prodman compile)
├── handoff-eng.md            ← engineering kickoff package
├── handoff-design.md         ← design brief
├── stakeholder-brief.md      ← exec 1-pager
├── tickets.md                ← Linear / Jira tickets
├── handoff-response.md       ← eng/design feedback — /pm-ff reads this on regen
└── retro.md                  ← retrospective
```

---

## Team Setup

`prodman-context/` is plain Markdown committed to your repo. Every command loads it automatically. Sharing it across your team is git — nothing else needed.

**Option A — Shared repo (recommended for product teams)**

Check `prodman-context/` into your product repo. Everyone on the team gets the same product memory:

```bash
# In your product repo
git add prodman-context/
git commit -m "Add ProdMan product context"
```

Each PM works in their own branch; context updates (from `/pm-retro` or manual edits) are merged via PR like any other doc change.

**Option B — Dedicated context repo**

For orgs with multiple products or strict access controls, create a shared `[product]-context` repo containing only `prodman-context/`. Reference it in each product's `CLAUDE.md`:

```
Context lives at: ../[product]-context/prodman-context/
```

**Handoff response loop**

When engineering or design receives a handoff doc (`handoff-eng.md`, `handoff-design.md`), they fill in `features/[name]/handoff-response.md` to log blockers, scope changes, answered questions, and technical discoveries. When the PM re-runs `/pm-ff [name]`, those responses are automatically incorporated into the spec bundle.

```
PM writes spec → /pm-ff →  handoff-eng.md  → Eng reviews
                                                    ↓
PM re-runs /pm-ff ← handoff-response.md ← Eng fills in
```

Use the template at [`templates/features/handoff-response.md`](templates/features/handoff-response.md).

---

## Philosophy

1. **Materialize clarity before documentation** — Don't write specs for fuzzy problems.
2. **Questioning precedes answering** — One focused question at a time. Socratic before prescriptive.
3. **Present options, not prescriptions** — Framings and directions are offered, not imposed.
4. **Context-first** — Product memory loads before every response. The AI knows your product.
5. **Immediately actionable output** — Every deliverable is ready to use, not just readable.
6. **Agent-first** — The primary output of `/pm-ff` is not a human archive — it's a structured context package for an AI agent that is about to build.
7. **AI-agnostic** — Plain Markdown. Works in Claude, GPT, Gemini, Cursor, or any interface.

---

## Roadmap

| Version | Focus | Status |
|---|---|---|
| v0 | Core commands, templates, schemas, integration guides | ✓ Done |
| v0.1 | Living memory, agent-first output, ticket export, audience lenses, cross-session continuity | ✓ Done |
| **v0.1.0 (Drop 1)** | **`@prodman/core` + `@prodman/cli` + GitHub Action + 12 lint rules + spec compiler** | **✓ Done** |
| **v0.2 (Drop 2)** | **`@prodman/vscode` — spec linter, readiness bar, agent brief launcher, CodeLens actions, quick fixes, init wizard, spec preview** | **✓ Done** |
| **v0.3** | **VS Code sidebar — context health + drift detection, signal inbox, pipeline dashboard · LNT-012 · Marketplace packaging** | **✓ Done** |
| v0.4 | MCP integration — zero-friction agent handoff from Claude Code | Q2 2026 |
| v0.5 | Live integrations — Linear/Jira push, team context sharing | Q3 2026 |

---

## Integration Guides

- [VS Code + Claude Code](integrations/vscode-claude.md) — Native slash commands, automatic context loading
- [Cursor](integrations/cursor.md) — Rules file + command workflow
- [Claude Projects](integrations/claude-projects.md) — Project instructions + file uploads
- [Universal (any AI tool)](integrations/universal.md) — Copy-paste workflow for any interface

---

## FAQ

**Can I use ProdMan without VS Code?**
Yes. All commands are plain Markdown — copy any command from `.claude/commands/` and paste it into Claude, ChatGPT, Gemini, or any AI tool. The VS Code extension adds linting and inline tooling on top, but isn't required.

**Does this work with Cursor / Copilot / other AI tools?**
Yes. See the [integration guides](#integration-guides) below. ProdMan is AI-agnostic by design — it produces clean Markdown that works anywhere.

**Is `prodman-context/` committed to git?**
Up to you. For product teams, commit it — everyone shares the same product memory. For solo projects or sensitive context (unreleased strategy, pricing), add it to `.gitignore`.

**My context is growing large. How do I manage it?**
Trim `history.md` to the last 6–12 months of decisions. Keep `product.md` and `users.md` tight — they should be 1-page each. The context files are meant to be curated, not append-only logs.

**What if my agent still overscopes despite AC + escalation triggers?**
Check your `anti_requirements` and `escalation_triggers` fields in `agent-brief.md` — they're likely too vague. Run `prodman validate [feature]` to catch issues. Specific beats general: "Do not modify the logged-in checkout path" is better than "Don't change unrelated flows."

---

## Contributing

Contributions are welcome. The bar: does this make ProdMan more useful for an AI-native PM?

- **New commands** — follow the structure in `prodman/commands/`. One command, one job.
- **Template improvements** — output templates live in `templates/features/`.
- **Integration guides** — new AI tools or IDE setups go in `integrations/`.
- **Bug reports** — open an issue with the command name and what went wrong.

See [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

---

## License

MIT

---

If ProdMan is useful to you, a ⭐ on GitHub helps others find it.
