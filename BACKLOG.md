# ProdMan Backlog

Items sourced from v0.1 review. Targeted for v0.2.

---

## v0.2 — Cross-Session Continuity & Command Clarity

### High Priority

#### ~~[BL-01] Persist direction commitment to file after `/pm-commit`~~ ✓ Done
**Fix shipped:** `/pm-commit` now derives a feature name, confirms with PM, and writes `features/[feature-name]/commitment.md`. `/pm-ff [feature-name]` loads it automatically.

#### ~~[BL-02] Make `/pm-research` artifact mode selection explicit~~ ✓ Done
**Fix shipped:** Added explicit usage block at top of command (`/pm-research [interview|competitive|prioritize|survey]`). Valid mode in `$ARGUMENTS` generates immediately; empty args prompts with the four options.

---

### Medium Priority

#### [BL-03] Clarify `/pm-agent-brief` use case vs `/pm-ff` agent-brief
**Problem:** `/pm-ff` always generates `agent-brief.md`. `/pm-agent-brief` is a separate command that also generates `agent-brief.md`. The differentiation isn't explained anywhere.
**Fix:** Add a 2-sentence rationale to the command: use it when (a) you have existing docs from outside ProdMan, or (b) you need to regenerate the brief after `handoff-eng.md` is updated.
**Impact:** Medium — causes confusion about which command to use.

#### [BL-04] Add "Agent-first" principle to CLAUDE.md
**Problem:** README lists 7 philosophy principles. CLAUDE.md only lists 6. "Agent-first" (#6 in README) is missing from the project instructions file.
**Fix:** Add principle #6 to CLAUDE.md: "Agent-first — the primary output of every spec is structured for AI coding agents, not human archives."
**Impact:** Medium — CLAUDE.md is the runtime instructions file; this principle should shape Claude's behavior.

#### [BL-05] Fix `/pm-retro` Step 3 — context update confirmation is a dead end
**Problem:** Step 3 flags potential updates to `product.md`, `users.md`, `constraints.md` "for PM confirmation" — but provides no mechanism to act on those flags.
**Fix:** Either (a) cut Step 3 and append a "Review these files" checklist block to `retro.md`, or (b) add a `/pm-retro update` sub-flow that applies confirmed changes.
**Impact:** Medium — currently produces guidance the PM cannot act on.

---

### Low Priority

#### [BL-06] Add file-existence guard to `/pm-handoff`
**Problem:** `/pm-handoff` loads `prd.md`, `brief.md`, `approach.md` — which only exist after `/pm-ff`. If run without the spec bundle, it fails silently.
**Fix:** Add a file-existence check at the top of the command. If files are missing, respond: "No spec bundle found in `features/`. Run `/pm-ff` first."
**Impact:** Low — error is recoverable, but the silent failure is bad UX.

#### [BL-07] Standardize `/pm-attach` zone placement
**Problem:** `pm-attach` appears in Zone 1's command table in the README but is listed as "Utility" in the Command Reference table.
**Fix:** Pick one. Recommended: keep it as Utility (alongside `/pm-import`) since it's usable across all zones, and remove it from the Zone 1 table.
**Impact:** Low — cosmetic inconsistency.

#### [BL-08] Sharpen `/pm-import` Question 5
**Problem:** "What has your team already decided?" is the weakest of the five questions — too broad, produces vague answers.
**Fix:** Reframe as: "What have you already built, ruled out, or committed to as a team? Include any pivots, feature bets, or explicit non-starters."
**Impact:** Low — improves the quality of `history.md` bootstrap.

---

## Icebox (No Target Release)

- Zone 1 inter-command handoff files: persist chosen framing from `/pm-frame` so `/pm-explore` can load it reliably without relying on chat context
- `/pm-ff` inline "all" response: warn PM that generating all four handoff views at once produces significant output
- Feature name sourcing: explicitly prompt for feature name at start of `/pm-ff` rather than deriving it implicitly

---

*Last updated: 2026-03-08. Source: v0.1 internal review.*
