# Integration: Cursor

Use ProdMan in Cursor via the Rules system and the AI chat panel.

> **Note:** Commands live in `prodman/commands/`. When referencing command files in Cursor, always use `prodman/commands/pm-[name].md` — not `.claude/commands/`.

---

## Setup

### 1. Add ProdMan context as a Cursor Rule

Create `.cursor/rules/prodman.mdc` in your project:

```markdown
---
description: ProdMan PM framework context
globs: ["prodman-context/**", "features/**"]
alwaysApply: true
---

# ProdMan — Product Manager Assistant

You are a PM thinking partner using the ProdMan framework.

Before responding to any /pm command, read:
- prodman-context/product.md
- prodman-context/users.md
- prodman-context/constraints.md (if it exists)
- prodman-context/history.md (if it exists)

All ProdMan commands are defined in prodman/commands/. When the PM invokes a command,
read the corresponding file from prodman/commands/ and follow its instructions.

Follow the ProdMan philosophy:
1. Materialize clarity before documentation
2. Questioning precedes answering — ask one question at a time
3. Present options, not prescriptions
4. Context-first — always ground responses in the loaded product context
5. Immediately actionable output
6. AI-agnostic design — produce clean Markdown

Questioning rules:
- Ask exactly ONE question at a time
- Ground questions in the signal or context provided
- Distinguish symptoms from root causes
- Segment users specifically ("users" is not a segment)
- Synthesize periodically before continuing

When generating spec files, write to features/[feature-name]/ using kebab-case.
```

### 2. Set up prodman-context

```bash
mkdir prodman-context
cp templates/context/product.md prodman-context/product.md
cp templates/context/users.md prodman-context/users.md
```

Fill in both files before starting.

---

## Using Commands in Cursor

ProdMan commands work as chat prompts. Paste the command file content or use shorthand:

**Option A — Shorthand (after adding the rule):**
Type in Cursor chat:
```
Run /pm-signal [your signal here]
```

**Option B — Full prompt:**
Open `prodman/commands/pm-signal.md`, copy the contents, paste into Cursor chat, and add your signal at the end.

---

## Recommended Workflow

```
1. Open Cursor chat (Cmd+L or Ctrl+L)
2. Type: "Run /pm-signal [your signal]"
3. Continue conversation in the same chat thread
4. When ready: "Run /pm-frame"
5. Continue through /pm-explore → /pm-commit → /pm-ff
6. Cursor will write spec files directly to your workspace
```

---

## Composer Mode

For spec generation (/pm-ff, /pm-handoff, /pm-agent-brief), use **Cursor Composer** (Cmd+Shift+I) instead of chat — it's better at writing multiple files.

In Composer:
```
Using the direction commitment from our chat, run /pm-ff for the [feature name] feature.
Write the 4 spec files to features/[feature-name]/.
Load prodman-context/ for product and user context.
Reference prodman/commands/pm-ff.md for the full output schema.
```

---

## Tips

- Keep Cursor chat open alongside your spec files — you can ask Cursor to refine a specific section by highlighting it and pressing Cmd+K.
- Use `@prodman-context/product.md` and `@prodman-context/users.md` in Cursor chat to explicitly include those files in context.
- Use `@prodman/commands/pm-ff.md` to explicitly include the command definition in context for spec generation.
- For agent briefs, paste the generated `agent-brief.md` content directly into a new Composer session to start implementation.
