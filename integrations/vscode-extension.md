# ProdMan VS Code Extension

The `@prodman/vscode` extension brings the full ProdMan tight loop into VS Code: lint as you write, quick fix missing sections, compile to spec.json, and copy the agent payload to clipboard — without leaving the editor.

---

## Installation

**From Marketplace (v0.3+):**
1. Open VS Code
2. Press `Ctrl+Shift+X` / `Cmd+Shift+X` to open Extensions
3. Search for `ProdMan`
4. Install `@prodman/vscode`

**From source:**
```bash
git clone https://github.com/VisNavyVet/PRODMAN.git
cd PRODMAN/packages/vscode
npm install
npm run build
# Then install the generated .vsix file
```

---

## First Run

When you open a workspace without `prodman-context/`, the extension prompts:

> No PRODMAN workspace detected. Initialize now?

Click **Initialize** to run the Init Wizard. It will:
1. Detect your tech stack automatically
2. Create `prodman-context/` with `product.md`, `users.md`, `constraints.md`, `history.md`
3. Pre-fill `constraints.md` with the detected stack
4. Offer to open `product.md` or create your first feature brief

Fill in `product.md` first. Every command loads it automatically.

---

## The Tight Loop

### 1. Open an agent-brief

Open any `features/[feature-name]/agent-brief.md`. The extension activates immediately.

**Status bar** (bottom right):
```
PRODMAN ✓ Agent Ready — 12/12 rules passing
PRODMAN ⚠ Review Needed — 10/12 rules passing  ← warnings only
PRODMAN ✗ Incomplete — 7/12 rules passing       ← errors present
```

### 2. Fix lint errors

Hover a red underline → click the lightbulb (or `Ctrl+.`) → **Apply Quick Fix**.

The extension inserts the missing section template directly at the right position. Fill in the template, and the diagnostic clears.

### 3. Preview the compiled spec

Click `$(preview) Preview Spec.json` in the CodeLens (top of file).

A side panel opens showing the compiled `spec.json` with a readiness badge and copy button.

### 4. Launch the agent

Click `▶ Run with PRODMAN` in the CodeLens, or press `Ctrl+Shift+P` → `ProdMan: Launch Agent from Brief`.

The extension:
1. Lints the brief
2. Compiles to `spec.json`
3. Assembles the agent payload (spec + product/user context)
4. Copies to clipboard

Paste into Claude, GPT-4, Cursor, or any AI tool.

---

## Sidebar Views

Click the ProdMan icon in the Activity Bar to open the sidebar.

### Context Health

Shows the health of your `prodman-context/` files:

| File | Status |
|------|--------|
| `product.md` | ✓ Found / ✗ Missing |
| `users.md` | ✓ Found / ✗ Missing |
| `constraints.md` | ✓ Up to date / ⚠ Stack drift detected |
| `history.md` | ✓ Found / ℹ Optional |
| `signals.md` | ℹ N signals captured |

**Stack drift** is flagged when TechDetector finds frameworks in `package.json` (or other manifests) that aren't mentioned in `constraints.md`. Click `constraints.md` to open and update it.

### Signal Inbox

Shows all signals captured via `ProdMan: Capture Signal`. Most recent first.

To add a signal:
- Command Palette → `ProdMan: Capture Signal`
- Or press the + button in the Signal Inbox view header

### Feature Pipeline

A table of all `features/` in your workspace:

| Feature | Zone | Readiness |
|---------|------|-----------|
| `payment-api` | Zone 2 | ✓ Ready |
| `user-onboarding` | Zone 1 | — |
| `search` | Zone 2 | ⚠ Review |

Zone is derived from which files exist in the feature directory. Readiness is derived from live lint results on `agent-brief.md`.

---

## Commands Reference

| Command | When available | Description |
|---------|---------------|-------------|
| `ProdMan: Initialize Workspace` | Always | Create `prodman-context/` and feature scaffolding |
| `ProdMan: Launch Agent from Brief` | `agent-brief.md` active | Full launch: lint → compile → clipboard |
| `ProdMan: Compile Spec → spec.json` | `agent-brief.md` active | Lint + compile only |
| `ProdMan: Preview Compiled Spec` | `agent-brief.md` active | Open spec.json webview |
| `ProdMan: Capture Signal` | Always | Append signal to `prodman-context/signals.md` |

---

## Using with Other Tools

The compiled payload is plain text. After copying, paste it into:

- **Claude** (claude.ai or Claude Code) — paste directly into the conversation
- **Cursor** — open Cursor Composer, paste payload, run
- **GitHub Copilot Chat** — paste into chat with your coding instructions
- **Any AI tool** — the payload is AI-agnostic Markdown

The `compiled-spec.json` is also written to `features/[name]/compiled-spec.json` on disk. Reference it in tool configurations or CI.

---

## Keyboard Shortcuts

No default keybindings are set. To add your own:

1. `Ctrl+K Ctrl+S` → Keyboard Shortcuts
2. Search `prodman`
3. Bind to your preferred keys

---

## Troubleshooting

**Extension doesn't activate:**
- Ensure your workspace has `CLAUDE.md`, `prodman-context/product.md`, or a `features/**/agent-brief.md` file
- Or open any `agent-brief.md` file directly

**Lint shows no diagnostics on an incomplete brief:**
- Verify the file is named exactly `agent-brief.md`
- Check Output panel → ProdMan for errors

**"No workspace folder open" error:**
- Open a folder (not just a file) in VS Code before running ProdMan commands
