# Agent Run Log

> Copy this file to `features/[feature-name]/runs/run-[N].md` after each agent session.
> Fill it in manually — takes 3–5 minutes. Builds the observability record that informs future specs.

---

**Feature:** [feature-name]
**Run #:** [N]
**Date:** [YYYY-MM-DD]
**Agent used:** [Claude Code / Cursor / Copilot Workspace / Devin / Other]
**Spec version compiled:** [spec_version from compiled-spec.json, or "none — no compiled spec"]
**Spec readiness at start:** [agent-ready / review-needed / incomplete]

---

## What the Agent Was Asked to Do

[1–3 sentences describing the task given to the agent. Paste the prompt or brief summary.]

---

## What the Agent Did

[Narrative summary of what the agent built, modified, or attempted. Be specific about files touched.]

- Files created: [list]
- Files modified: [list]
- Files the agent should have touched but didn't: [list, or "None"]

---

## Outcome

**Result:** [Success / Partial / Failed]

[2–4 sentences. What was produced? Did it match the spec? Did it build and run?]

---

## Spec Quality Issues Encountered

> Did the spec cause the agent to go wrong? Flag these to improve future specs.

| Issue | Spec section | What happened | Proposed fix |
|-------|-------------|---------------|--------------|
| [e.g., Agent added pagination] | Out of Scope | Scope was missing "do not add pagination" | Add explicit exclusion to out_of_scope |
| [e.g., Agent didn't handle null seller_name] | Edge Cases | Edge case was listed but not specific enough | Add "skip field in match; do not throw" to expected behavior |

**Overall spec quality:** [Clear / Mostly clear / Several gaps / Major gaps]

---

## Agent Behavior Observations

> Patterns worth knowing for future runs.

- Did the agent ask clarifying questions before starting? [Yes / No]
- Did the agent make unauthorized decisions? [Yes — describe / No]
- Did the agent hit an escalation trigger correctly? [Yes / No / No triggers were hit]
- Did the agent exceed scope? [Yes — what / No]
- Did the agent miss anything in scope? [Yes — what / No]

---

## Durable Learnings

> 1–2 things to carry into the next spec or agent run for this feature or similar features.

1. [Learning]
2. [Learning, or "None"]

---

## Next Run Plan

[What should the next agent session pick up? What spec changes need to happen first?]

- Spec changes needed before next run: [list, or "None"]
- Remaining work for next run: [list]
