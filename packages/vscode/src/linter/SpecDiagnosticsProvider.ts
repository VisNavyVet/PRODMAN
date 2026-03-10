import * as vscode from 'vscode'
import { Linter } from '@prodman/core'
import type { LintResult } from '@prodman/core'

export interface DiagnosticsResult {
  diagnostics: vscode.Diagnostic[]
  readiness: LintResult['readiness']
  rulesPassing: number
  rulesTotal: number
}

export class SpecDiagnosticsProvider {
  private linter = new Linter()

  lint(document: vscode.TextDocument): DiagnosticsResult {
    const content = document.getText()
    const lintResult = this.linter.lintContent(document.fileName, content)

    const diagnostics = lintResult.diagnostics.map(d => {
      const line = Math.max(0, d.line)
      const endLine = d.endLine !== undefined ? Math.max(0, d.endLine) : line

      const range = new vscode.Range(
        new vscode.Position(line, 0),
        new vscode.Position(endLine, Number.MAX_SAFE_INTEGER)
      )

      const severity =
        d.severity === 'error'
          ? vscode.DiagnosticSeverity.Error
          : vscode.DiagnosticSeverity.Warning

      const diagnostic = new vscode.Diagnostic(range, d.message, severity)
      diagnostic.source = 'ProdMan'
      diagnostic.code = d.rule
      return diagnostic
    })

    const totalRules = lintResult.diagnostics.length > 0
      ? this.getTotalRuleCount(lintResult)
      : 11 // AGENT_BRIEF_RULES.length

    const failingRules = new Set(lintResult.diagnostics.map(d => d.rule)).size
    const rulesPassing = totalRules - failingRules

    return {
      diagnostics,
      readiness: lintResult.readiness,
      rulesPassing,
      rulesTotal: totalRules,
    }
  }

  private getTotalRuleCount(result: LintResult): number {
    // LNT-001 through LNT-011
    const ruleIds = result.diagnostics.map(d => d.rule)
    const maxRule = ruleIds.reduce((max, id) => {
      const n = parseInt(id.replace('LNT-', ''), 10)
      return isNaN(n) ? max : Math.max(max, n)
    }, 11)
    return Math.max(maxRule, 11)
  }
}
