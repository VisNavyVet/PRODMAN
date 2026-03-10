import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { Compiler } from '@prodman/core'
import type { CompiledSpec, LintResult } from '@prodman/core'

export interface CompileAdapterResult {
  spec: CompiledSpec
  lintResult: LintResult
}

/**
 * Mediates between the VS Code extension and @prodman/core's Compiler.
 * Resolves workspace context paths and compiles from the active document content
 * without requiring a save or filesystem write.
 */
export class CompilerAdapter {
  static compile(document: vscode.TextDocument): CompileAdapterResult {
    const workspaceRoot = vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath
      ?? path.dirname(document.fileName)

    const featureName = CompilerAdapter.resolveFeatureName(document.fileName, workspaceRoot)
    const content = document.getText()

    const contextPath = path.join(workspaceRoot, 'prodman-context')
    const contextRefs = {
      product_md: path.join(contextPath, 'product.md'),
      users_md: path.join(contextPath, 'users.md'),
      tech_md: fs.existsSync(path.join(contextPath, 'constraints.md'))
        ? path.join(contextPath, 'constraints.md')
        : null,
      agent_brief_md: document.fileName,
    }

    const compiler = new Compiler()
    return compiler.compileToSpec(featureName, content, {
      allowIncomplete: true, // linter shows diagnostics; we still want to preview partial specs
      contextRefs,
    })
  }

  private static resolveFeatureName(filePath: string, workspaceRoot: string): string {
    // features/[feature-name]/agent-brief.md → feature-name
    const relative = path.relative(workspaceRoot, filePath)
    const parts = relative.split(path.sep)
    if (parts.length >= 3 && parts[0] === 'features') {
      return parts[1]
    }
    return path.basename(path.dirname(filePath))
  }
}
