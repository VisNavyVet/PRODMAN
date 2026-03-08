# Integration: Claude Projects

Claude Projects (claude.ai/projects) lets you persist instructions and files across conversations. It's an excellent home for ProdMan if you're not using an IDE.

> **Note:** Commands live in `prodman/commands/`. When uploading files to your Claude Project, upload from `prodman/commands/` — not `.claude/commands/`.

---

## Setup

### 1. Create a new Project in Claude

Go to [claude.ai](https://claude.ai) → Projects → New Project.

Name it: `ProdMan — [Your Product Name]`

### 2. Add Project Instructions

In the Project settings, paste the following as your project instructions:

```
You are my Product Management thinking partner using the ProdMan framework.

All ProdMan commands are defined in the files I've uploaded from prodman/commands/.
When I invoke a command like /pm-signal or /pm-frame, refer to the corresponding
uploaded command file and follow its instructions exactly.

Before responding to any /pm command, refer to the product context files I've
uploaded (product.md, users.md, and constraints.md if present).

Follow the ProdMan philosophy:
1. Materialize clarity before documentation — don't write specs for fuzzy problems
2. Questioning precedes answering — ask one question at a time, never compound questions
3. Present options, not prescriptions — offer framings and directions, don't impose them
4. Context-first — always ground responses in the product context files
5. Immediately actionable output — every deliverable should be usable
6. AI-agnostic design — produce clean Markdown

Questioning rules:
- Ask exactly ONE question at a time
- Ground questions in the signal or context provided, not generic PM frameworks
- Distinguish symptoms from root causes
- Segment users specifically — "users" is not a segment, push for specificity
- Synthesize periodically: "Here's what I'm hearing..." before continuing
- Adjust depth based on how specific the PM's inputs are

Tone: Professional and direct. No filler phrases. No unsolicited opinions on business strategy. Serve the PM's thinking, don't replace it.

When generating spec files, produce them as clean Markdown that I can copy into my files. Use the feature name I provide for file paths.
```

### 3. Upload your context files

In the Project, upload:
- `prodman-context/product.md`
- `prodman-context/users.md`
- `prodman-context/constraints.md` (optional)
- `prodman-context/history.md` (optional)

Claude will reference these in every conversation in this Project.

### 4. Upload command files (optional but recommended)

Upload the command files from `prodman/commands/` so Claude has the exact prompt definitions:
- `prodman/commands/pm-signal.md`
- `prodman/commands/pm-frame.md`
- `prodman/commands/pm-explore.md`
- `prodman/commands/pm-commit.md`
- `prodman/commands/pm-ff.md`
- Any others you plan to use regularly

---

## Using Commands

In any conversation within your Project, use commands naturally:

```
/pm-signal We're seeing a drop in week-2 retention for new users

[Claude asks one clarifying question]

Continue until you have enough, then:

/pm-frame

[Claude generates 2–3 framings]

/pm-commit

[Claude produces the direction commitment]

/pm-ff retention-improvement

[Claude generates the 4 spec documents as Markdown — copy into your files]
```

---

## Keeping Context Updated

Claude Projects doesn't auto-update uploaded files. After running `/pm-retro`, copy any updates to your context files and re-upload them:

1. Update `prodman-context/history.md` locally
2. Delete the old version in the Project files
3. Upload the updated version

**Tip:** Keep `history.md` as a running log — append entries rather than rewriting. This minimizes how often you need to re-upload.

---

## Multiple Products

Create one Project per product. This keeps context clean and prevents confusion between different products' users, constraints, and history.

Project naming convention: `ProdMan — [Product Name] [Year]`

---

## Tips

- Claude Projects conversations persist — you can return to a spec discussion the next day and continue where you left off.
- Use the conversation title to track which feature you're working on: "Order History Search — Spec"
- Star conversations for features you're actively speccing.
- Export important spec outputs by copying Claude's responses and saving them to your `features/` folder locally.
