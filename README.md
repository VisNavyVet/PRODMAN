# ProdMan

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![AI Agnostic](https://img.shields.io/badge/AI-Agnostic-green)](integrations/universal.md)
[![Works with Claude Code](https://img.shields.io/badge/Works%20with-Claude%20Code-blue)](https://claude.ai/code)
[![Works with Cursor](https://img.shields.io/badge/Works%20with-Cursor-black)](https://cursor.sh)
[![Version](https://img.shields.io/badge/version-0.1-brightgreen)]()

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

## How It Works

ProdMan is **12 command prompts and a context system**. Commands are plain Markdown — native slash commands in Claude Code, or paste them into any AI tool.

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

**Step 1 — Bootstrap your product context (once)**

```
/pm-import
```

ProdMan asks 5 targeted questions. Have existing docs? Paste them to skip ahead.

```
prodman-context/
├── product.md       ← what your product is
├── users.md         ← who your users are (specific segments, not "users")
├── constraints.md   ← tech, legal, org constraints
└── history.md       ← decisions + retro learnings — grows automatically
```

**Step 2 — Run your first signal**

```
/pm-signal Customer support is seeing a spike in "can't find past orders" tickets
```

ProdMan won't write a spec. It'll ask you one question first.

**In any other AI tool:** Open `prodman/commands/pm-signal.md`, paste it into your chat, then add your signal.

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
must_not_do           ← Explicit stop list. Prevents scope creep.
acceptance_criteria   ← Observable, verifiable. Agent self-checks before delivering.
edge_cases            ← Pre-enumerated. Handled consistently, not by guessing.
definition_of_done    ← Agent knows when to stop, not just when to ship.
escalation_triggers   ← Stop and ask if: [explicit conditions]. No unauthorized decisions.
```

---

## Command Reference

### Utility — Run once per product

| Command | What it does |
|---|---|
| `/pm-import` | 5-question interview → generates `prodman-context/`. Paste existing docs to skip ahead. |
| `/pm-attach` | Load a file (image, PDF, spreadsheet) into context. Surfaces relevant signals, not just summaries. |

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
├── product.md
├── users.md
├── constraints.md
└── history.md                ← auto-grows via /pm-retro

features/[feature-name]/      ← generated per feature
├── commitment.md             ← direction lock (written by /pm-commit)
├── agent-brief.md ★          ← primary output — for AI coding agents
├── brief.md                  ← 1-page PM summary
├── prd.md                    ← full requirements (P0/P1/P2)
├── approach.md               ← decision rationale, options considered
├── plan.md                   ← milestones, work breakdown, risks
├── handoff-eng.md            ← engineering kickoff package
├── handoff-design.md         ← design brief
├── stakeholder-brief.md      ← exec 1-pager
├── tickets.md                ← Linear / Jira tickets
└── retro.md                  ← retrospective
```

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
| v0.2 | VS Code extension — ambient context, auto-inject tech context, retro triggers | Planned |
| v0.3 | MCP integration — zero-friction agent handoff from Claude Code | Planned |
| v0.4 | Live integrations — Linear/Jira push, team context sharing | Planned |

---

## Integration Guides

- [VS Code + Claude Code](integrations/vscode-claude.md) — Native slash commands, automatic context loading
- [Cursor](integrations/cursor.md) — Rules file + command workflow
- [Claude Projects](integrations/claude-projects.md) — Project instructions + file uploads
- [Universal (any AI tool)](integrations/universal.md) — Copy-paste workflow for any interface

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
