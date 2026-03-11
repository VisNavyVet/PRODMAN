import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

class SignalItem extends vscode.TreeItem {
  constructor(
    public readonly date: string,
    public readonly signal: string
  ) {
    super(signal, vscode.TreeItemCollapsibleState.None)
    this.description = date
    this.tooltip = `[${date}] ${signal}`
    this.iconPath = new vscode.ThemeIcon('lightbulb')
    this.contextValue = 'signal'
  }
}

class EmptyItem extends vscode.TreeItem {
  constructor(message: string) {
    super(message, vscode.TreeItemCollapsibleState.None)
    this.iconPath = new vscode.ThemeIcon('inbox')
  }
}

/**
 * TreeDataProvider for the Signal Inbox sidebar view.
 * Reads prodman-context/signals.md and shows each signal as a tree item.
 * Most recent signals appear first.
 */
export class SignalInboxPanel implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<void>()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
    return element
  }

  getChildren(): vscode.TreeItem[] {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
    if (!workspaceRoot) {
      return [new EmptyItem('No workspace open')]
    }

    const signalsPath = path.join(workspaceRoot, 'prodman-context', 'signals.md')
    if (!fs.existsSync(signalsPath)) {
      return [new EmptyItem('No signals yet — use Capture Signal to add one')]
    }

    const content = fs.readFileSync(signalsPath, 'utf8')
    const lines = content.split('\n').filter(l => /^- \[/.test(l))

    if (lines.length === 0) {
      return [new EmptyItem('No signals yet — use Capture Signal to add one')]
    }

    // Most recent first
    return [...lines].reverse().map(line => {
      const match = line.match(/^- \[([^\]]+)\] (.+)/)
      const date = match?.[1] ?? '?'
      const text = match?.[2] ?? line.slice(2)
      return new SignalItem(date, text)
    })
  }
}
