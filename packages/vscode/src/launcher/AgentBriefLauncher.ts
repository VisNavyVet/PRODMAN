import * as vscode from 'vscode'
import { CompilerAdapter } from './CompilerAdapter'
import { PromptAssembler } from './PromptAssembler'

/**
 * Orchestrates the full launch flow:
 *   Lint → Compile → Assemble payload → Copy to clipboard
 */
export class AgentBriefLauncher {
  /**
   * Full launch: lint + compile + assemble + copy.
   * Used by "Run with PRODMAN" CodeLens and command.
   */
  static async launch(document: vscode.TextDocument): Promise<void> {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'ProdMan: Preparing agent payload…',
        cancellable: false,
      },
      async () => {
        try {
          const { spec, lintResult } = CompilerAdapter.compile(document)

          if (lintResult.readiness === 'incomplete') {
            const errorCount = lintResult.diagnostics.filter(d => d.severity === 'error').length
            const warningCount = lintResult.diagnostics.filter(d => d.severity === 'warning').length
            const proceed = await vscode.window.showWarningMessage(
              `Spec has ${errorCount} error(s) and ${warningCount} warning(s). Launch anyway?`,
              { modal: true },
              'Launch anyway',
              'Fix first'
            )
            if (proceed !== 'Launch anyway') return
          }

          const payload = PromptAssembler.assemble(spec)
          await vscode.env.clipboard.writeText(payload)

          const msg =
            lintResult.readiness === 'agent-ready'
              ? `ProdMan ✓ Agent payload copied — spec is agent-ready.`
              : `ProdMan ⚠ Agent payload copied — ${lintResult.diagnostics.length} issue(s) remain.`

          vscode.window.showInformationMessage(msg)
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err)
          vscode.window.showErrorMessage(`ProdMan: ${message}`)
        }
      }
    )
  }

  /**
   * Compile-only: lint + compile, no clipboard.
   * Used by "Validate Spec" CodeLens.
   */
  static async compileOnly(document: vscode.TextDocument): Promise<void> {
    try {
      const { lintResult } = CompilerAdapter.compile(document)

      const errors = lintResult.diagnostics.filter(d => d.severity === 'error').length
      const warnings = lintResult.diagnostics.filter(d => d.severity === 'warning').length

      if (lintResult.readiness === 'agent-ready') {
        vscode.window.showInformationMessage('ProdMan ✓ Spec is agent-ready — all rules pass.')
      } else if (lintResult.readiness === 'review-needed') {
        vscode.window.showWarningMessage(
          `ProdMan ⚠ Review needed — ${warnings} warning(s). See Problems panel.`
        )
      } else {
        vscode.window.showErrorMessage(
          `ProdMan ✗ Spec incomplete — ${errors} error(s), ${warnings} warning(s). See Problems panel.`
        )
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      vscode.window.showErrorMessage(`ProdMan: ${message}`)
    }
  }
}
