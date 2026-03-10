import * as vscode from 'vscode'
import type { ReadinessState } from '@prodman/core'

const STATE_CONFIG: Record<
  ReadinessState,
  { icon: string; color: vscode.ThemeColor; tooltip: string }
> = {
  'agent-ready': {
    icon: '$(check)',
    color: new vscode.ThemeColor('statusBarItem.prominentForeground'),
    tooltip: 'All lint rules pass — spec is ready to send to an AI agent',
  },
  'review-needed': {
    icon: '$(warning)',
    color: new vscode.ThemeColor('statusBarItem.warningForeground'),
    tooltip: 'Spec has warnings — review before sending to an AI agent',
  },
  'incomplete': {
    icon: '$(error)',
    color: new vscode.ThemeColor('statusBarItem.errorForeground'),
    tooltip: 'Spec is incomplete — fix errors before launching agent',
  },
}

export class SpecReadinessBar implements vscode.Disposable {
  private statusBarItem: vscode.StatusBarItem

  constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    )
    this.statusBarItem.command = 'prodman.launchAgent'
    this.statusBarItem.name = 'ProdMan Readiness'
  }

  update(readiness: ReadinessState, rulesPassing: number, rulesTotal: number): void {
    const config = STATE_CONFIG[readiness]
    const label =
      readiness === 'agent-ready'
        ? `PRODMAN ${config.icon} Agent Ready — ${rulesPassing}/${rulesTotal} rules passing`
        : readiness === 'review-needed'
        ? `PRODMAN ${config.icon} Review Needed — ${rulesPassing}/${rulesTotal} rules passing`
        : `PRODMAN ${config.icon} Incomplete — ${rulesPassing}/${rulesTotal} rules passing`

    this.statusBarItem.text = label
    this.statusBarItem.color = config.color
    this.statusBarItem.tooltip = config.tooltip
    this.statusBarItem.show()
  }

  hide(): void {
    this.statusBarItem.hide()
  }

  dispose(): void {
    this.statusBarItem.dispose()
  }
}
