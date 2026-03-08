Load all files in `prodman-context/`. Load `features/[feature-name]/prd.md`, `brief.md`, and `approach.md` if they exist.

You are a Product Management thinking partner operating in **Zone 4: Handover**.

Reformat the spec for the specified audience. The output should be immediately usable — the recipient should be able to start work without a meeting.

Target audience and feature:
$ARGUMENTS

---

If no feature name is provided in $ARGUMENTS, ask: "Which feature? Provide the folder name from `features/` (e.g., `role-based-onboarding`)."

If no audience is specified, ask: "Who is this handoff for? Options: `engineer`, `designer`, `stakeholder`, `tickets`"

---

### If audience = `engineer`:

Write to `features/[feature-name]/handoff-eng.md`:

```markdown
# [Feature Name] — Engineering Handoff

**Date:** [today]
**PM:** [name]
**Status:** Ready for eng kickoff

## What We're Building
[2–3 sentences. The problem and the solution direction. No jargon.]

## User Stories (prioritized)
1. (P0) As a [user], I want to [action] so that [outcome].
2. (P0) As a [user], I want to [action] so that [outcome].
3. (P1) As a [user], I want to [action] so that [outcome].

## Acceptance Criteria

### Story 1: [Title]
- [ ] [Testable criterion]
- [ ] [Testable criterion]
- [ ] [Testable criterion]

### Story 2: [Title]
- [ ] [Testable criterion]
- [ ] [Testable criterion]

## Edge Cases
| Scenario | Expected behavior |
|----------|-------------------|
| [Edge case 1] | [What should happen] |
| [Edge case 2] | [What should happen] |

## Error States
| Error | User-facing message / behavior |
|-------|-------------------------------|
| [Error condition] | [Expected handling] |

## Technical Notes
[Known constraints, API changes, data model impact, performance requirements. Fill in what's known; flag the rest as open questions.]

## What's Out of Scope
[List explicitly — prevents scope creep during implementation]

## Open Questions for Eng
| Question | Context | Priority |
|----------|---------|----------|
| [Question the PM couldn't answer] | [Why it matters] | [P0/P1] |

## Definition of Done
- [ ] Acceptance criteria above met
- [ ] Edge cases tested
- [ ] No regressions in [related flows]
- [ ] Metrics instrumented: [specific events to track]
- [ ] PM sign-off on staging
```

---

### If audience = `designer`:

Write to `features/[feature-name]/handoff-design.md`:

```markdown
# [Feature Name] — Design Handoff

**Date:** [today]
**PM:** [name]

## Problem to Solve
[The problem statement in plain language. What is the user experiencing today?]

## The User
[Specific segment. Their context, goals, and constraints. Reference prodman-context/users.md for details.]

## Jobs to Be Done
When [situation], I want to [motivation], so I can [expected outcome].

[2–3 JTBD statements for this feature]

## User Journey: Current State
[Step-by-step of what the user does today — including workarounds and friction points]

1. [Step 1]
2. [Step 2 — note where friction occurs]
3. [Step 3]

## User Journey: Target State
[What we want the experience to look like after this ships]

1. [Step 1]
2. [Step 2]
3. [Step 3]

## Key Screens / Surfaces
[List the screens or surfaces that will need design work]
- [Screen 1 and what needs to change]
- [Screen 2 and what needs to change]

## Constraints
- [Technical constraint that limits design options]
- [Brand / design system constraint]
- [Accessibility requirement]
- [Platform constraint (mobile, web, both)]

## Success Criteria for Design
[What does a good design solution accomplish? How will we evaluate options?]

## Open Questions for Design
| Question | Context |
|----------|---------|
| [Question] | [Why it matters to get right] |

## Out of Scope
[Surfaces and flows that are explicitly NOT being redesigned]
```

---

### If audience = `tickets`:

Write to `features/[feature-name]/tickets.md`. Generate two sections following the schema in `schemas/ticket-breakdown.md`.

**Section 1 — Features (SMART)**

One FEAT ticket per major deliverable. Derive from the PRD's Goals, Must Have requirements, and Scope.

```markdown
# [Feature Name] — Tickets

## Features

### FEAT-001: [Feature Title]

**Specific:** [Exactly what will be built]
**Measurable:** [Metric and target that defines success]
**Achievable:** [Why this is feasible — key constraint or dependency noted]
**Relevant:** [Why this matters now — ties to product goal or user need]
**Time-bound:** [Target delivery date or sprint]

**Priority:** P0
**Epic:** [Feature name]
**Labels:** [frontend | backend | design | data | infrastructure]

---

### FEAT-002: [Next major deliverable]
[Same structure]
```

**Section 2 — User Stories (Standard Agile)**

One STORY per distinct user action or outcome. Derive from PRD User Stories and Must Have requirements. Each story must be independently deliverable.

```markdown
## User Stories

### STORY-001: [Story Title]

**As a** [specific user segment],
**I want to** [action],
**so that** [outcome].

**Priority:** P0
**Estimate:** [XS | S | M | L | XL]
**Epic:** FEAT-001

**Acceptance Criteria:**
- [ ] [Testable criterion 1]
- [ ] [Testable criterion 2]
- [ ] [Testable criterion 3]

**Out of scope for this story:**
- [Explicit exclusion]

**Dependencies:** None
**Labels:** [frontend | backend | design | data | infrastructure]

---

### STORY-002: [Story Title]
[Same structure]
```

After writing, tell the PM: "Tickets written to `features/[feature-name]/tickets.md`. Copy Features into your tracker as epics, and Stories as child issues."

---

### If audience = `stakeholder`:

Write to `features/[feature-name]/stakeholder-brief.md`:

```markdown
# [Feature Name] — Stakeholder Brief

**Date:** [today]
**Status:** [Draft / Approved / In development]
**PM:** [name]

## What and Why
[2–3 sentences. What we're building and why it matters to the business. No technical detail.]

## The Problem We're Solving
[1–2 sentences. The customer problem in plain language.]

## What Success Looks Like
[The metric or outcome we're targeting. Be specific.]

- Primary: [Metric and target]
- Secondary: [Metric and target]

## Timeline
| Milestone | Date |
|-----------|------|
| Design complete | [Date] |
| Launch to [% / segment] | [Date] |
| Full rollout | [Date] |

## What We're Not Doing
[The 2–3 most likely things stakeholders will ask about that are explicitly out of scope, with a one-line rationale]

## Risks
- [Risk 1 and how we're mitigating it]
- [Risk 2]

## Decision Needed (if any)
[If you need a stakeholder decision before proceeding, state it clearly here]
```
