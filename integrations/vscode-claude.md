# Integration: VS Code + Claude Code

ProdMan works natively as Claude Code slash commands. This is the recommended integration for the best experience.

> **Note:** Commands live in `prodman/commands/`. The `.claude/commands/` folder contains pointer stubs that tell Claude Code where to find the real command files. The source of truth is always `prodman/commands/` — not `.claude/commands/`.

---

## Setup

### 1. Clone or copy ProdMan into your project

Option A — Dedicated ProdMan workspace (recommended for solo PMs):
```
your-prodman-workspace/
├── .claude/
│   └── commands/       ← pointer stubs (redirect to prodman/commands/)
├── prodman/
│   └── commands/       ← source of truth for all commands
├── prodman-context/    ← your product memory
├── features/           ← your spec output
└── CLAUDE.md           ← auto-loaded project instructions
```

Option B — Inside your product repo:
```
your-product-repo/
├── .claude/
│   └── commands/       ← pointer stubs (redirect to prodman/commands/)
├── prodman/
│   └── commands/       ← source of truth for all commands
├── prodman-context/    ← add to .gitignore if sensitive
└── features/           ← commit these with your code
```

### 2. Set up your product context

Copy templates and fill them in:
```bash
mkdir prodman-context
cp templates/context/product.md prodman-context/product.md
cp templates/context/users.md prodman-context/users.md
# Optional:
cp templates/context/constraints.md prodman-context/constraints.md
cp templates/context/history.md prodman-context/history.md
```

Or use `/pm-import` if you have existing docs:
```
/pm-import [paste your existing product docs here]
```

### 3. Open Claude Code in VS Code

Open the project folder in VS Code. Claude Code automatically loads `CLAUDE.md` as project-level instructions — this tells Claude to load `prodman-context/` before each command.

---

## Using Commands

Type `/` in the Claude Code chat panel to see all available commands. ProdMan commands appear as `/pm-signal`, `/pm-frame`, etc. Each stub in `.claude/commands/` directs Claude to read the full command definition from `prodman/commands/`.

**Example workflow:**

```
/pm-signal We're getting a lot of "can't find my past orders" support tickets

[Claude asks clarifying questions]

/pm-frame

[Claude surfaces 3 framings]

/pm-explore I like framing 2 — the navigation problem

[Claude runs structured exploration]

/pm-commit

[Claude produces the direction commitment document]

/pm-ff order-history-search

[Claude writes 4 spec files to features/order-history-search/]

/pm-handoff engineer

[Claude writes handoff-eng.md]

/pm-agent-brief

[Claude writes agent-brief.md — paste into Claude Code for your engineer or use it yourself]
```

---

## Tips for Claude Code

- **Context persistence**: Claude Code maintains conversation context within a session. Run commands sequentially in the same chat window for best results.
- **File references**: Claude Code can read files from your workspace. After `/pm-ff`, you can ask Claude to "refine the PRD" and it will read the file directly.
- **Parallel agents**: Use `/pm-agent-brief` output to spin up a Claude Code agent sub-task for implementation while you continue spec work in the main chat.
- **CLAUDE.md**: Edit `CLAUDE.md` to add product-specific instructions that Claude should always follow in this workspace.

---

## Slash Command Reference

| Command | Usage |
|---------|-------|
| `/pm-signal` | `/pm-signal [your raw signal here]` |
| `/pm-frame` | `/pm-frame` (no arguments needed — uses conversation context) |
| `/pm-explore` | `/pm-explore [framing number or description]` |
| `/pm-commit` | `/pm-commit` or `/pm-commit [any overrides]` |
| `/pm-ff` | `/pm-ff [feature name]` |
| `/pm-research` | `/pm-research interview` or `/pm-research competitive` |
| `/pm-handoff` | `/pm-handoff engineer` or `/pm-handoff designer` |
| `/pm-agent-brief` | `/pm-agent-brief [feature name or path]` |
| `/pm-ship` | `/pm-ship [feature name]` |
| `/pm-retro` | `/pm-retro [feature name and outcome summary]` |
| `/pm-import` | `/pm-import [paste existing docs]` |
| `/pm-attach` | `/pm-attach` then paste/drag content |
