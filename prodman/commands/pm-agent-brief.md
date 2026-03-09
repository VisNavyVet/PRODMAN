Load all files in `prodman-context/`. Load `features/[feature-name]/prd.md`, `approach.md`, and `handoff-eng.md` if they exist.

> **When to use this command:**
> Use `/pm-agent-brief` when (a) you have existing docs from outside ProdMan and need an agent brief without running `/pm-ff`, or (b) you need to regenerate the brief after engineering handoff (`handoff-eng.md`) has been updated with new technical decisions. If you ran `/pm-ff` and it already generated `agent-brief.md`, you do not need this command unless something has changed.

You are a Product Management thinking partner operating in **Zone 4: Handover — AI Agent Brief**.

Generate a structured task brief optimized for AI coding agents (Claude Code, Cursor, Copilot Workspace, Devin, etc.). This brief must be precise, bounded, and immediately actionable — no ambiguity.

Feature or task context:
$ARGUMENTS

---

Write to `features/[feature-name]/agent-brief.md`:

```markdown
# [Feature Name] — AI Agent Task Brief

**Date:** [today]
**PM:** [name]
**Target agent:** [Claude Code / Cursor / General]

---

## Task Summary
[1–2 sentences. Exactly what the agent should build or change. Be precise about the outcome, not the implementation approach.]

## Context

### Product context
- **Product:** [Brief product description from prodman-context/product.md]
- **Affected users:** [Specific segment from prodman-context/users.md]

### Technical context
- **Repository:** [repo name or path]
- **Relevant files / modules:** [List files the agent should focus on]
- **Tech stack:** [Languages, frameworks, relevant versions]
- **Related systems:** [APIs, databases, services the task touches]

---

## Task Scope

### In scope
- [Specific thing to build 1]
- [Specific thing to build 2]
- [Specific thing to build 3]

### Out of scope (do not touch)
- [Explicit exclusion 1 — e.g., "Do not modify the auth flow"]
- [Explicit exclusion 2]
- [Explicit exclusion 3]

---

## Requirements

### Must implement
- [ ] [Requirement 1 — specific and testable]
- [ ] [Requirement 2]
- [ ] [Requirement 3]

### Must NOT do
- [ ] [Anti-requirement 1 — e.g., "Do not introduce breaking changes to the public API"]
- [ ] [Anti-requirement 2]
- [ ] [Anti-requirement 3]

---

## Acceptance Criteria

Each item below must be true for the task to be considered complete:

- [ ] [Criterion 1 — observable and testable. E.g., "When a user clicks X, Y happens."]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
- [ ] [Criterion 4]
- [ ] All existing tests pass
- [ ] [New tests written for: specific behaviors]
- [ ] No new console errors or warnings introduced

---

## Edge Cases to Handle

| Scenario | Expected behavior |
|----------|-------------------|
| [Edge case 1] | [Exact expected behavior] |
| [Edge case 2] | [Exact expected behavior] |
| [Edge case 3] | [Exact expected behavior] |

---

## Constraints

- **Do not change:** [Files or systems off-limits]
- **Style guide:** [Link or brief note on code style expectations]
- **Performance:** [Any latency or load requirements]
- **Accessibility:** [WCAG level or specific requirements]
- **Security:** [Auth requirements, input validation rules, etc.]

---

## Definition of Done

- [ ] All acceptance criteria above are met
- [ ] Tests written and passing
- [ ] No regressions in [related test suites]
- [ ] Code reviewed by PM on staging
- [ ] Analytics events instrumented: [list specific events]

---

## Questions the Agent Should Flag (not solve)

If the agent encounters these situations, it should stop and ask rather than make a decision:

- [Ambiguous decision point 1 — e.g., "If the user has no saved data, unclear whether to show empty state A or B"]
- [Ambiguous decision point 2]

---

## Reference Links

- PRD: `features/[feature-name]/prd.md`
- Eng handoff: `features/[feature-name]/handoff-eng.md`
- Design spec: [link or file path]
- Related ticket: [Linear / Jira link]
```
