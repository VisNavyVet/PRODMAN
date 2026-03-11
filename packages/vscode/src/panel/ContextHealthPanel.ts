import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import { DriftDetector } from '../detector/DriftDetector'

type HealthStatus = 'ok' | 'warning' | 'error' | 'info'

class ContextHealthItem extends vscode.TreeItem {
  constructor(
    label: string,
    public readonly status: HealthStatus,
    filePath: string | undefined,
    tooltip: string,
    description?: string
  ) {
    super(label, vscode.TreeItemCollapsibleState.None)
    this.tooltip = tooltip
    this.description = description ?? this.statusDescription()
    this.iconPath = this.statusIcon()
    if (filePath) {
      this.command = {
        command: 'vscode.open',
        title: 'Open',
        arguments: [vscode.Uri.file(filePath)],
      }
    }
  }

  private statusDescription(): string {
    switch (this.status) {
      case 'ok': return '✓'
      case 'warning': return '⚠'
      case 'error': return '✗ Missing'
      case 'info': return 'ℹ'
    }
  }

  private statusIcon(): vscode.ThemeIcon {
    switch (this.status) {
      case 'ok': return new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed'))
      case 'warning': return new vscode.ThemeIcon('warning', new vscode.ThemeColor('testing.iconQueued'))
      case 'error': return new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'))
      case 'info': return new vscode.ThemeIcon('info', new vscode.ThemeColor('notificationsInfoIcon.foreground'))
    }
  }
}

/**
 * TreeDataProvider for the Context Health sidebar view.
 * Shows health of prodman-context/ files and flags stack drift.
 */
export class ContextHealthPanel implements vscode.TreeDataProvider<ContextHealthItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<void>()
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event

  refresh(): void {
    this._onDidChangeTreeData.fire()
  }

  getTreeItem(element: ContextHealthItem): vscode.TreeItem {
    return element
  }

  getChildren(): ContextHealthItem[] {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
    if (!workspaceRoot) {
      return [new ContextHealthItem('No workspace open', 'info', undefined, 'Open a folder to see context health')]
    }

    const contextDir = path.join(workspaceRoot, 'prodman-context')
    const items: ContextHealthItem[] = []

    // product.md
    const productPath = path.join(contextDir, 'product.md')
    items.push(new ContextHealthItem(
      'product.md',
      fs.existsSync(productPath) ? 'ok' : 'error',
      fs.existsSync(productPath) ? productPath : undefined,
      fs.existsSync(productPath) ? 'Product context — click to edit' : 'Missing — run ProdMan: Initialize Workspace'
    ))

    // users.md
    const usersPath = path.join(contextDir, 'users.md')
    items.push(new ContextHealthItem(
      'users.md',
      fs.existsSync(usersPath) ? 'ok' : 'error',
      fs.existsSync(usersPath) ? usersPath : undefined,
      fs.existsSync(usersPath) ? 'User segments — click to edit' : 'Missing — run ProdMan: Initialize Workspace'
    ))

    // constraints.md — check for drift
    const constraintsPath = path.join(contextDir, 'constraints.md')
    if (fs.existsSync(constraintsPath)) {
      const drift = DriftDetector.detect(workspaceRoot)
      items.push(new ContextHealthItem(
        'constraints.md',
        drift.isDrifted ? 'warning' : 'ok',
        constraintsPath,
        drift.isDrifted ? drift.message : 'Constraints up to date — click to edit',
        drift.isDrifted ? '⚠ Stack drift' : '✓'
      ))
    } else {
      items.push(new ContextHealthItem(
        'constraints.md',
        'error',
        undefined,
        'Missing — run ProdMan: Initialize Workspace'
      ))
    }

    // history.md
    const historyPath = path.join(contextDir, 'history.md')
    items.push(new ContextHealthItem(
      'history.md',
      fs.existsSync(historyPath) ? 'ok' : 'info',
      fs.existsSync(historyPath) ? historyPath : undefined,
      fs.existsSync(historyPath)
        ? 'Decision history — grows via /pm-retro'
        : 'Optional — created automatically by /pm-retro'
    ))

    // signals.md
    const signalsPath = path.join(contextDir, 'signals.md')
    if (fs.existsSync(signalsPath)) {
      const content = fs.readFileSync(signalsPath, 'utf8')
      const count = (content.match(/^- \[/gm) ?? []).length
      items.push(new ContextHealthItem(
        'signals.md',
        'info',
        signalsPath,
        `${count} signal${count !== 1 ? 's' : ''} captured`,
        `${count} signal${count !== 1 ? 's' : ''}`
      ))
    }

    return items
  }
}
