# ProdMan Demo — Recording Guide

## Tools

| Tool | Platform | Notes |
|---|---|---|
| **Screen Studio** | macOS | Best for clean zoom effects and cursor highlighting |
| **OBS Studio** | Win/Mac/Linux | Free, full control, use with virtual camera |
| **Loom** | All | Quick share but limited editing |
| **Kap** | macOS | Good for short GIFs (30s) |

Recommended: **Screen Studio** (macOS) or **OBS** (Windows)

---

## Terminal Setup

Before recording:

```bash
# Set font size large enough to read when compressed to 1080p
# JetBrains Mono, 16–18px minimum

# Clear history so output is clean
clear

# Pre-type the commands but don't run them
# Use Ctrl+L between takes to clear
```

Terminal settings:
- Theme: dark (Catppuccin Mocha, One Dark, or Tokyo Night)
- Window: maximized or 1200×700 minimum
- No system notifications — enable Do Not Disturb
- Hide menu bar and dock if possible

---

## Pre-Recording Checklist

- [ ] `@prodman/cli` installed globally (`npm install -g @prodman/cli`)
- [ ] `features/checkout-v2/agent-brief.md` exists with intentional issues (vague AC, empty escalation triggers)
- [ ] A "fixed" version ready to swap in during step 3 (or edit live)
- [ ] `prodman compile checkout-v2` will work after the fix
- [ ] `compiled-spec.json` not yet present (so it generates fresh on camera)
- [ ] Terminal shows just the prompt — no extra directories or files
- [ ] Do a full dry run at speed before hitting record

---

## Recording Plan

### Shot 1 — Install (12–17s)

```bash
npm install -g @prodman/cli
```

Tip: pre-run this, so you can type fast and the output is instant.
Or show the `npm install` output compressed (speed ramp in editing).

### Shot 2 — Validate bad spec (17–28s)

```bash
prodman validate checkout-v2
```

Let the output appear. **Pause 1 second on the errors.** Zoom in if possible.

### Shot 3 — Edit the spec (28–35s)

Open `features/checkout-v2/agent-brief.md` in VS Code or terminal editor.
Show two changes:
1. Add a line under "Questions the Agent Should Flag": `- Stop if the checkout flow requires backend auth changes`
2. Change "works correctly" to: `- Payment form submits and user sees confirmation page within 3 seconds`

Keep edits visible for 2–3 seconds.

### Shot 4 — Re-validate (35–40s)

```bash
prodman validate checkout-v2
```

Let `✓ Agent Ready` sit on screen for 1.5 seconds.

### Shot 5 — Compile (40–46s)

```bash
prodman compile checkout-v2
```

Then open or `cat` the compiled JSON:

```bash
cat features/checkout-v2/compiled-spec.json | head -40
```

Scroll slowly. Let `acceptance_criteria` and `escalation_triggers` fields be visible.

### Shot 6 — CI snippet (46–52s)

Switch to VS Code or show a YAML file. Zoom into:

```yaml
- uses: prodman/prodman-validate@v1
  with:
    fail-on: incomplete
```

### Shot 7 — Close (52–60s)

Back to terminal showing `✓ Agent Ready`.
Optionally show `prodman status` for a polished finish.

---

## Post-Production

- Trim dead air ruthlessly — each transition should be < 0.3s
- Add zoom on diagnostics output (1.5x zoom for 2 seconds)
- No background music — keep it professional
- Add bottom-third text card: `npm install -g @prodman/cli`
- Export: H.264, 1080p, 30fps
- File size target: < 15 MB for Twitter; upload full quality to YouTube/Loom for embed

---

## Distribution

| Platform | Format | Length | Notes |
|---|---|---|---|
| Twitter/X | MP4, no audio description | < 60s | Add captions |
| HackerNews | Link to GitHub or Loom | — | Lead with the "wrong product" hook |
| Indie Hackers | Loom or YouTube embed | Full 60s | Add context in post body |
| README | GIF (first 10s) or embedded Loom | 10–15s | Show the `✓ Agent Ready` moment |
| npm package page | Link to GitHub README | — | npm pages don't embed video |
