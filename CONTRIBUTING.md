# Contributing to ProdMan

ProdMan is an open framework. Contributions are welcome.

## What to Contribute

### High-value contributions
- **Command improvements** — better prompts, cleaner output, edge cases handled
- **New commands** — filling gaps in the Zone 1–5 coverage
- **Integration guides** — new AI tools, IDEs, or workflows
- **Schema refinements** — better output structures for tickets, briefs, agent briefs
- **Context templates** — templates for specific product types (B2B SaaS, marketplace, consumer app, etc.)
- **Example outputs** — real (anonymized) examples of good spec bundles, framings, retros

### Lower-priority contributions
- Cosmetic README changes
- Adding frameworks or methodologies that duplicate existing command behavior
- Enterprise features (out of scope for v0–v0.3)

---

## How to Contribute

1. **Fork and clone** the repository
2. **Create a branch**: `git checkout -b feat/better-pm-frame-prompt`
3. **Make your changes** — see guidelines below
4. **Test your changes** — run the command yourself on a real or realistic scenario
5. **Submit a pull request** with:
   - What you changed and why
   - A before/after example if you're changing a command prompt
   - Notes on any trade-offs

---

## Command Prompt Guidelines

When modifying or adding commands:

- **One question at a time** — commands in Zone 1 must ask single questions, never compound questions
- **No prescriptions** — commands should offer options and framings, not tell PMs what to do
- **Specific over generic** — prompts should push for specificity (user segments, metrics, named behaviors), not accept vague answers
- **Actionable output** — every command should produce something the PM can immediately use or act on
- **Markdown-first** — all output should be clean Markdown compatible with any tool
- **AI-agnostic** — commands should work in Claude, GPT, Gemini, or any other model without modification

---

## File Naming Conventions

- Commands: `pm-[zone-action].md` (e.g., `pm-signal.md`, `pm-ff.md`)
- Templates: descriptive names in `templates/` subdirectories
- Schemas: `[output-type].md` in `schemas/`
- Integration guides: `[tool-name].md` in `integrations/`

---

## Testing a Command

Before submitting a command change, test it against these scenarios:

1. **Sparse input** — the PM gives a one-sentence, vague signal. Does the command handle it gracefully?
2. **Rich input** — the PM gives detailed context. Does the command avoid asking questions they've already answered?
3. **Wrong context** — no `prodman-context/` exists. Does the command fail gracefully?
4. **Scope creep** — does the output stay within the stated scope?
5. **Different AI models** — test on at least 2 models if changing a core command

---

## Code of Conduct

Be direct and specific in feedback — vague "this could be better" comments aren't useful. If you think a prompt is wrong, explain why and propose the alternative.
