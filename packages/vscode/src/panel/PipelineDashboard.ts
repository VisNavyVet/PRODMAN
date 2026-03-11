import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import { Linter } from '@prodman/core'

type Readiness = 'agent-ready' | 'review-needed' | 'incomplete' | 'none'

interface FeatureRow {
  name: string
  zone: string
  readiness: Readiness
}

/** Files that indicate which Zone a feature has reached */
const ZONE_MARKERS = [
  { file: 'retro.md', zone: 'Zone 5', level: 5 },
  { file: 'tickets.md', zone: 'Zone 4', level: 4 },
  { file: 'handoff-eng.md', zone: 'Zone 4', level: 4 },
  { file: 'handoff-design.md', zone: 'Zone 4', level: 4 },
  { file: 'stakeholder-brief.md', zone: 'Zone 4', level: 4 },
  { file: 'agent-brief.md', zone: 'Zone 2', level: 2 },
  { file: 'prd.md', zone: 'Zone 2', level: 2 },
  { file: 'plan.md', zone: 'Zone 2', level: 2 },
  { file: 'commitment.md', zone: 'Zone 1', level: 1 },
  { file: 'exploration.md', zone: 'Zone 1', level: 1 },
  { file: 'framing.md', zone: 'Zone 1', level: 1 },
  { file: 'signal.md', zone: 'Zone 1', level: 1 },
]

/**
 * WebviewViewProvider for the Feature Pipeline sidebar panel.
 * Shows all features/, their zone, and agent-brief readiness.
 */
export class PipelineDashboard implements vscode.WebviewViewProvider {
  public static readonly viewType = 'prodmanPipeline'
  private _view?: vscode.WebviewView

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView
    webviewView.webview.options = { enableScripts: false }
    this.render()
  }

  refresh(): void {
    this.render()
  }

  private render(): void {
    if (!this._view) return
    this._view.webview.html = this.buildHtml()
  }

  private getFeatures(workspaceRoot: string): FeatureRow[] {
    const featuresDir = path.join(workspaceRoot, 'features')
    if (!fs.existsSync(featuresDir)) return []

    const entries = fs.readdirSync(featuresDir, { withFileTypes: true })
    const linter = new Linter()
    const rows: FeatureRow[] = []

    for (const entry of entries) {
      if (!entry.isDirectory()) continue

      const featureDir = path.join(featuresDir, entry.name)

      // Determine zone from most advanced file present
      let zone = '—'
      for (const marker of ZONE_MARKERS) {
        if (fs.existsSync(path.join(featureDir, marker.file))) {
          zone = marker.zone
          break
        }
      }

      // Readiness from agent-brief.md lint
      let readiness: Readiness = 'none'
      const briefPath = path.join(featureDir, 'agent-brief.md')
      if (fs.existsSync(briefPath)) {
        try {
          const result = linter.lintFile(briefPath)
          readiness = result.readiness as Readiness
        } catch {
          readiness = 'incomplete'
        }
      }

      rows.push({ name: entry.name, zone, readiness })
    }

    // Sort: most advanced zone first, then alpha
    return rows.sort((a, b) => {
      const zoneOrder = (z: string) =>
        z === 'Zone 5' ? 5 : z === 'Zone 4' ? 4 : z === 'Zone 2' ? 2 : z === 'Zone 1' ? 1 : 0
      return zoneOrder(b.zone) - zoneOrder(a.zone) || a.name.localeCompare(b.name)
    })
  }

  private readinessBadge(r: Readiness): string {
    if (r === 'none') return '<span class="dim">—</span>'
    const color = r === 'agent-ready' ? '#4caf50' : r === 'review-needed' ? '#ff9800' : '#f44336'
    const label = r === 'agent-ready' ? '✓ Ready' : r === 'review-needed' ? '⚠ Review' : '✗ Draft'
    return `<span style="color:${color};font-weight:600">${label}</span>`
  }

  private buildHtml(): string {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
    if (!workspaceRoot) {
      return `<html><body class="empty">No workspace open.</body></html>`
    }

    const features = this.getFeatures(workspaceRoot)

    const rows = features.length === 0
      ? `<tr><td colspan="3" class="empty">No features yet — run /pm-ff to create one</td></tr>`
      : features.map(f => `
          <tr>
            <td class="name">${f.name}</td>
            <td class="zone">${f.zone}</td>
            <td>${this.readinessBadge(f.readiness)}</td>
          </tr>`).join('')

    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: var(--vscode-font-family);
    font-size: var(--vscode-font-size);
    color: var(--vscode-foreground);
    background: var(--vscode-sideBar-background);
  }
  table { width: 100%; border-collapse: collapse; }
  th {
    text-align: left;
    padding: 6px 10px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--vscode-descriptionForeground);
    border-bottom: 1px solid var(--vscode-panel-border);
  }
  td {
    padding: 5px 10px;
    border-bottom: 1px solid var(--vscode-panel-border);
    font-size: 12px;
  }
  .name { font-weight: 500; }
  .zone { color: var(--vscode-descriptionForeground); }
  .dim { color: var(--vscode-descriptionForeground); }
  .empty { padding: 24px 16px; color: var(--vscode-descriptionForeground); font-size: 12px; text-align: center; }
  tr:hover td { background: var(--vscode-list-hoverBackground); }
</style>
</head>
<body>
<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Zone</th>
      <th>Readiness</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
</body>
</html>`
  }
}
