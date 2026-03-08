# Integration: Universal (Any AI Tool)

ProdMan commands work in any AI interface — ChatGPT, Gemini, Mistral, Perplexity, or any other tool that accepts a system prompt or long chat message. This guide covers the copy-paste workflow.

> **Note:** All commands live in `prodman/commands/`. This is the source of truth — not `.claude/commands/`, which contains Claude Code pointer stubs only.

---

## The Copy-Paste Workflow

Every ProdMan command is a plain Markdown file. To use any command in any AI tool:

1. Open the relevant file from `prodman/commands/`
2. Copy the entire contents
3. Paste it into your AI chat as the first message (or as a system prompt if supported)
4. Replace `$ARGUMENTS` with your actual input
5. Send

---

## Setting Up Context

Before starting any PM work, paste your product context so the AI has it:

```
[Paste contents of prodman/commands/pm-signal.md]

---
PRODUCT CONTEXT:
[Paste contents of prodman-context/product.md]

USER SEGMENTS:
[Paste contents of prodman-context/users.md]

---
My signal: [your signal here]
```

For long sessions, paste context once at the start of the conversation — most AI tools maintain it for the session duration.

---

## System Prompt (if your tool supports it)

If your AI tool supports a persistent system prompt (ChatGPT Custom Instructions, API system prompt, etc.), use this:

```
You are a Product Management thinking partner using the ProdMan framework.

Core philosophy:
1. Materialize clarity before documentation
2. Ask ONE question at a time — never compound questions
3. Present options, not prescriptions
4. Ground all responses in the product context provided
5. Generate immediately actionable output
6. Keep outputs as clean Markdown

Questioning rules:
- Ask exactly one question at a time
- Ground questions in what the PM has said, not generic frameworks
- Distinguish symptoms from root causes
- Push for user specificity — "users" is not a segment
- Synthesize before asking the next question

Tone: Professional, direct, no filler. Serve the PM's thinking.

When the PM says "/pm-[command]", act as described in the ProdMan [command] instructions.
All command files live in prodman/commands/. If you don't have the command file,
ask the PM to paste it from prodman/commands/pm-[name].md.
```

Then paste your `prodman-context/product.md` and `prodman-context/users.md` content as the first user message.

---

## Command Quick Reference

Copy these condensed versions for faster use in any tool:

### /pm-signal (condensed)
```
You're a PM thinking partner. I'll share a raw signal. Reflect it back in 1-2 sentences to confirm understanding, then ask ONE clarifying question. Don't frame or solve yet. Continue dialogue one question at a time until you have: specific user segment, what they experience, why it matters. Then say you're ready to frame.

Signal: [your signal]
```

### /pm-frame (condensed)
```
Based on our conversation, generate 2-3 distinct problem framings. Each needs: problem statement (who+what+why), root hypothesis, implied direction, key assumption, what it excludes. Make them genuinely distinct. Don't recommend one — ask which resonates.
```

### /pm-commit (condensed)
```
Synthesize our conversation into a direction commitment with: problem statement (1-2 sentences, falsifiable), who we're solving for, who we're NOT solving for, direction (2-4 sentences), key assumptions (2-3), top risks (2-3), success criteria (measurable), out of scope (explicit list). Confirm with me before finalizing.
```

### /pm-ff (condensed)
```
Generate a full spec bundle for [feature name] based on the committed direction. Include:
1. Brief (1-page: problem, solution, metrics, scope, risks)
2. PRD (background, problem statement, goals, non-goals, user stories P0/P1/P2, requirements, edge cases, open questions, success criteria, dependencies)
3. Approach doc (options considered, chosen option with rationale, technical and design considerations, rollout strategy, assumptions)
4. Plan (timeline milestones, work breakdown by function, dependencies, comms plan)
Format as clean Markdown with clear section headers.
```

---

## ChatGPT Custom GPT Setup

If you use ChatGPT, you can create a Custom GPT for ProdMan:

1. Go to ChatGPT → Explore GPTs → Create
2. Name: "ProdMan"
3. Instructions: Paste the system prompt from above + your product context
4. Upload files: Upload `product.md`, `users.md`, `constraints.md`, and the command files from `prodman/commands/` that you use most
5. Save as private

This gives you a persistent ProdMan assistant that knows your product without re-pasting context each session.

---

## Tips for Any AI Tool

- **New session = fresh context**: Most AI tools don't persist context across sessions. Keep a "context paste" snippet ready with your product.md and users.md content.
- **One conversation per feature**: Don't mix features in the same chat — context drift degrades output quality.
- **Copy outputs immediately**: Don't rely on the chat history. Copy spec outputs to your `features/` folder right away.
- **Iterate on outputs**: Tell the AI what's wrong with a generated section rather than asking it to regenerate everything. "The user stories are too generic — make them specific to [segment]" works better than "redo the PRD."
