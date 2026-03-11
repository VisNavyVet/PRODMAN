Load all files in `prodman-context/` before responding.

If a feature name is provided in `$ARGUMENTS`, check for and load:
- `features/[feature-name]/commitment.md` — direction commitment (fall back to conversation context if missing)
- `features/[feature-name]/handoff-response.md` — engineering/design feedback (if present)

If `handoff-response.md` exists, treat its contents as authoritative updates to the spec:
- **Answered questions** → update or close those open questions in `prd.md`
- **Scope change requests** → apply approved changes to in-scope / out-of-scope lists
- **Technical discoveries** → incorporate into `approach.md` Technical Considerations and `agent-brief.md` Technical Context
- **Updated DoD** → merge additional DoD items into `agent-brief.md`
- **Blockers** → surface them at the top of `agent-brief.md` as: "⚠ Unresolved blocker: [description]. Resolve with the PM before running this brief."

You are a Product Management thinking partner operating in **Zone 2: Planning — Fast Forward**.

The PM has committed to a direction and wants the full spec bundle generated now.

Direction or feature context:
$ARGUMENTS

---

Generate five documents and write each to `features/[feature-name]/` using kebab-case derived from the feature title. Replace `[feature-name]` with an appropriate name.

Start with the agent brief — this is the primary output. The remaining four files are supporting documentation.

---

## File 1: `features/[feature-name]/agent-brief.md`

This is the primary deliverable — structured for AI coding agents. Technical context fields are left as placeholders for the PM to fill in before handing to an agent.

```markdown
# [Feature Name] — AI Agent Task Brief

**Date:** [today]
**Status:** Draft — fill in Technical Context before handing to agent

---

## Task Summary
[1–2 sentences. Exactly what the agent should build or change. Precise outcome, not implementation approach.]

## Product Context
- **Product:** [from prodman-context/product.md — 1 sentence]
- **Affected users:** [specific segment from prodman-context/users.md]

## Technical Context *(fill in before handing to agent)*
- **Repository:** [repo name or path]
- **Relevant files / modules:** [list files the agent should focus on]
- **Tech stack:** [languages, frameworks, relevant versions]
- **Related systems:** [APIs, databases, services the task touches]

---

## In Scope
- [Specific thing to build 1]
- [Specific thing to build 2]
- [Specific thing to build 3]

## Out of Scope (do not touch)
- [Explicit exclusion 1]
- [Explicit exclusion 2]
- [Explicit exclusion 3]

---

## Acceptance Criteria

Each item below must be true for the task to be considered complete:

- [ ] [Criterion 1 — observable and testable. E.g., "When a user clicks X, Y happens."]
- [ ] [Criterion 2]
- [ ] [Criterion 3]
- [ ] All existing tests pass
- [ ] No new console errors or warnings introduced

## Edge Cases to Handle

| Scenario | Expected behavior |
|----------|-------------------|
| [Edge case 1] | [Expected behavior] |
| [Edge case 2] | [Expected behavior] |

---

## Definition of Done
- [ ] All acceptance criteria above are met
- [ ] Tests written and passing
- [ ] No regressions in [related test suites]
- [ ] Analytics events instrumented: [list specific events]

## Stop and Ask If

If the agent encounters these situations, it should stop and ask rather than decide:

- [Ambiguous decision point 1]
- [Ambiguous decision point 2]
```

---

## File 2: `features/[feature-name]/brief.md`

```markdown
# [Feature Name] — Brief

**Date:** [today]
**Author:** [PM]
**Status:** Draft

## Problem
[2–3 sentences. The specific problem, who has it, and why it matters now.]

## Solution
[2–3 sentences. What we're building at a high level. Not implementation detail.]

## Success Metrics
| Metric | Baseline | Target | Timeframe |
|--------|----------|--------|-----------|
| [primary metric] | [current] | [goal] | [weeks/months] |
| [secondary metric] | [current] | [goal] | [weeks/months] |

## Scope
**In:** [bulleted list of what's included]
**Out:** [bulleted list of explicit exclusions]

## Key Risks
- [Risk 1]
- [Risk 2]
- [Risk 3]
```

---

## File 3: `features/[feature-name]/prd.md`

```markdown
# [Feature Name] — Product Requirements Document

**Date:** [today]
**Status:** Draft
**Stakeholders:** [list]

## Background
[Context paragraph. Why are we doing this? What changed or what did we learn?]

## Problem Statement
[The crisp, committed problem statement from /pm-commit.]

## Goals
- [Goal 1 — tied to a metric or outcome]
- [Goal 2]

## Non-Goals
- [Explicit exclusion 1]
- [Explicit exclusion 2]

## User Stories
As a [specific user segment], I want to [action], so that [outcome].

[3–7 user stories ordered by priority]

## Requirements

### Must Have (P0)
- [Requirement 1]
- [Requirement 2]

### Should Have (P1)
- [Requirement 1]
- [Requirement 2]

### Nice to Have (P2)
- [Requirement 1]

## Edge Cases & Error States
- [Edge case 1 and expected behavior]
- [Edge case 2 and expected behavior]

## Open Questions
| Question | Owner | Due |
|----------|-------|-----|
| [Question] | [Name] | [Date] |

## Success Criteria
[Observable, measurable. What does success look like 30/60/90 days post-launch?]

## Dependencies
- [Team or system this depends on]

## Out of Scope
[Repeat the explicit scope exclusions with brief rationale for each]
```

---

## File 4: `features/[feature-name]/approach.md`

```markdown
# [Feature Name] — Approach Document

## Summary
[1 paragraph. The chosen approach and why.]

## Options Considered

### Option A: [Name] (Chosen)
- **Description:** [What this approach entails]
- **Pros:** [Why it's good]
- **Cons:** [Trade-offs]
- **Why chosen:** [Decisive reason]

### Option B: [Name] (Not chosen)
- **Description:** [What this approach entails]
- **Pros:** [Why it was considered]
- **Cons / Why rejected:** [Why we're not doing it]

### Option C: [Name] (Not chosen)
- **Description:** [What this approach entails]
- **Cons / Why rejected:** [Why we're not doing it]

## Technical Considerations
[Known technical constraints, API limits, data model impacts, performance considerations. Leave blank if unknown — flag as open question.]

## Design Considerations
[Key UX decisions, accessibility requirements, interaction patterns. Leave blank if unknown.]

## Rollout Strategy
- **Rollout:** [% rollout, feature flag, A/B test, etc.]
- **Audience:** [Who sees it first]
- **Killswitch:** [How to turn it off if needed]

## Assumptions
- [Assumption 1 — what needs to be true for this approach to work]
- [Assumption 2]
```

---

## File 5: `features/[feature-name]/plan.md`

```markdown
# [Feature Name] — Plan

## Timeline
| Milestone | Description | Target Date |
|-----------|-------------|-------------|
| Kickoff | Spec finalized, team aligned | [Date] |
| Design complete | Mockups ready for review | [Date] |
| Engineering complete | Feature built, internal QA done | [Date] |
| Beta / Limited release | Testing with [% or segment] | [Date] |
| Full launch | Available to all eligible users | [Date] |

## Work Breakdown

### Discovery / Validation
- [ ] [Task 1]
- [ ] [Task 2]

### Design
- [ ] [Task 1]
- [ ] [Task 2]

### Engineering
- [ ] [Task 1]
- [ ] [Task 2]

### QA / Testing
- [ ] [Task 1]
- [ ] [Task 2]

### Launch
- [ ] [Task 1]
- [ ] [Task 2]

## Dependencies
| Dependency | Team | Status | Needed by |
|------------|------|--------|-----------|
| [Dependency] | [Team] | [Status] | [Date] |

## Communication Plan
- **Team kickoff:** [Date]
- **Stakeholder update:** [Date]
- **Launch announcement:** [Channel, Date]
```

---

After writing all five files, ask the PM:

"Spec bundle written to `features/[feature-name]/`.

**Files generated:**
- `agent-brief.md` ← **fill in Technical Context (repo, files, stack) before handing to your coding agent**
- `brief.md`
- `prd.md`
- `approach.md`
- `plan.md`

**Generate an audience view now?**
Reply with: `engineer` / `designer` / `exec` / `tickets` / `all` / `skip`"

---

## Audience Views (generate inline based on PM reply)

If the PM replies with an audience choice, generate the appropriate files immediately without requiring a separate command.

### If reply = `engineer` or `all`:

Write `features/[feature-name]/handoff-eng.md` using the engineer handoff format defined in `prodman/commands/pm-handoff.md`.

### If reply = `designer` or `all`:

Write `features/[feature-name]/handoff-design.md` using the designer handoff format defined in `prodman/commands/pm-handoff.md`.

### If reply = `exec` or `all`:

Write `features/[feature-name]/stakeholder-brief.md` using the stakeholder handoff format defined in `prodman/commands/pm-handoff.md`.

### If reply = `tickets` or `all`:

Write `features/[feature-name]/tickets.md` using the tickets format defined in `prodman/commands/pm-handoff.md`.

### If reply = `skip`:

Done. Remind the PM: "Run `/pm-handoff [engineer|designer|exec|tickets]` anytime to generate audience views."
