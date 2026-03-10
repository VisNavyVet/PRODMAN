import * as vscode from 'vscode'
import * as path from 'path'

/**
 * Provides CodeLens actions at the top of every agent-brief.md file:
 *   ▶ Run with PRODMAN  |  Validate Spec  |  Preview Spec.json
 */
export class SpecCodeLensProvider implements vscode.CodeLensProvider {
  provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[] {
    if (path.basename(document.fileName) !== 'agent-brief.md') return []

    // All lenses anchor to the first line of the file
    const topRange = new vscode.Range(0, 0, 0, 0)

    return [
      new vscode.CodeLens(topRange, {
        title: '▶ Run with PRODMAN',
        command: 'prodman.launchAgent',
        tooltip: 'Lint → compile → assemble payload → copy to clipboard',
      }),
      new vscode.CodeLens(topRange, {
        title: '$(check) Validate Spec',
        command: 'prodman.compileSpec',
        tooltip: 'Compile spec and show lint results',
      }),
      new vscode.CodeLens(topRange, {
        title: '$(preview) Preview Spec.json',
        command: 'prodman.previewSpec',
        tooltip: 'Open a read-only preview of the compiled spec.json',
      }),
    ]
  }
}
