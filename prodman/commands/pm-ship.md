Load all files in `prodman-context/`. Load `features/[feature-name]/plan.md` and `brief.md`.

You are a Product Management thinking partner operating in **Zone 5: Ship & Learn**.

The PM is preparing to ship. Generate a launch coordination package.

Feature and launch context:
$ARGUMENTS

---

Generate the following launch package:

---

## Launch Checklist — [Feature Name]

**Target launch date:** [Date]
**PM:** [name]
**Eng lead:** [name]
**Design lead:** [name]

---

### Pre-Launch (complete before flipping the flag)

**Product**
- [ ] Acceptance criteria verified on staging
- [ ] Edge cases tested manually
- [ ] PM sign-off on staging

**Engineering**
- [ ] Feature flag configured and tested
- [ ] Rollback plan documented and confirmed
- [ ] Performance benchmarks acceptable
- [ ] Error monitoring alerts configured
- [ ] Analytics events firing correctly in staging

**Design**
- [ ] Visual QA complete on all breakpoints / platforms
- [ ] Accessibility review passed
- [ ] Copy final and approved

**Data & Analytics**
- [ ] Success metrics defined and instrumented: [list metrics]
- [ ] Dashboard or query ready to monitor post-launch
- [ ] Baseline numbers recorded (pre-launch)

**Support & Ops**
- [ ] Support team briefed on the change
- [ ] FAQ / help article updated (if user-facing)
- [ ] Known issues documented

**Legal / Compliance** (if applicable)
- [ ] [Any compliance requirements cleared]

---

### Launch Day

- [ ] Feature flag enabled for: [% rollout / segment]
- [ ] Monitor error rates for 30 minutes post-enable
- [ ] Confirm analytics events received
- [ ] Notify #[channel] that launch is live

**Rollback trigger:** If [specific error rate / metric threshold] is exceeded, roll back by [specific action].

---

### Post-Launch (first 48 hours)

- [ ] Check error rates vs. baseline
- [ ] Check success metrics vs. target
- [ ] Review support ticket volume for new complaint categories
- [ ] Share initial results with stakeholders in [channel]

---

### Communication Plan

| Audience | Channel | Message | Timing | Owner |
|----------|---------|---------|--------|-------|
| Internal team | #product | [Brief summary of what shipped] | Launch day | PM |
| Stakeholders | Email / Slack | [Stakeholder brief summary] | Launch day | PM |
| Users | [In-app / email / blog] | [User-facing message if applicable] | [Timing] | [Owner] |

---

### Rollout Phases

| Phase | Audience | Start date | Success criteria to advance |
|-------|----------|------------|----------------------------|
| Phase 1 | [% or segment] | [Date] | [Criterion] |
| Phase 2 | [% or segment] | [Date] | [Criterion] |
| Full rollout | All eligible users | [Date] | [Criterion] |

---

After generating, tell the PM: "Run `/pm-retro` after launch to capture learnings and update your product context."
