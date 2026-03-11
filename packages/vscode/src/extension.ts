import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { SpecDiagnosticsProvider } from './linter/SpecDiagnosticsProvider'
import { QuickFixProvider } from './linter/QuickFixProvider'
import { SpecReadinessBar } from './status/SpecReadinessBar'
import { SpecCodeLensProvider } from './codelens/SpecCodeLensProvider'
import { AgentBriefLauncher } from './launcher/AgentBriefLauncher'
import { SpecPreviewPanel } from './preview/SpecPreviewPanel'
import { InitWizard } from './wizard/InitWizard'
import { ContextHealthPanel } from './panel/ContextHealthPanel'
import { SignalInboxPanel } from './panel/SignalInboxPanel'
import { PipelineDashboard } from './panel/PipelineDashboard'

const AGENT_BRIEF_SELECTOR: vscode.DocumentSelector = {
  scheme: 'file',
  pattern: '**/agent-brief.md',
}

export function activate(context: vscode.ExtensionContext): void {
  const diagnosticsProvider = new SpecDiagnosticsProvider()
  const readinessBar = new SpecReadinessBar()

  // --- Linter diagnostics ---
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('prodman')
  context.subscriptions.push(diagnosticCollection)

  function lintDocument(document: vscode.TextDocument): void {
    if (!isAgentBrief(document)) return
    const result = diagnosticsProvider.lint(document)
    diagnosticCollection.set(document.uri, result.diagnostics)
    readinessBar.update(result.readiness, result.rulesPassing, result.rulesTotal)
  }

  // Lint on open and on change
  context.subscriptions.push(
    vscode.workspace.onDidOpenTextDocument(lintDocument),
    vscode.workspace.onDidChangeTextDocument(e => lintDocument(e.document)),
    vscode.workspace.onDidCloseTextDocument(doc => {
      if (isAgentBrief(doc)) {
        diagnosticCollection.delete(doc.uri)
        readinessBar.hide()
      }
    })
  )

  // Lint all already-open agent-brief documents on activate
  vscode.workspace.textDocuments.forEach(lintDocument)

  // Show/hide readiness bar based on active editor
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (editor && isAgentBrief(editor.document)) {
        lintDocument(editor.document)
      } else {
        readinessBar.hide()
      }
    })
  )

  // --- CodeLens ---
  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      AGENT_BRIEF_SELECTOR,
      new SpecCodeLensProvider()
    )
  )

  // --- Quick fixes ---
  context.subscriptions.push(
    vscode.languages.registerCodeActionsProvider(
      AGENT_BRIEF_SELECTOR,
      new QuickFixProvider(),
      { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }
    )
  )

  // --- Sidebar: Context Health ---
  const contextHealthPanel = new ContextHealthPanel()
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('prodmanContextHealth', contextHealthPanel)
  )

  // --- Sidebar: Signal Inbox ---
  const signalInboxPanel = new SignalInboxPanel()
  context.subscriptions.push(
    vscode.window.registerTreeDataProvider('prodmanSignalInbox', signalInboxPanel)
  )

  // --- Sidebar: Pipeline Dashboard ---
  const pipelineDashboard = new PipelineDashboard()
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(PipelineDashboard.viewType, pipelineDashboard)
  )

  // --- Commands ---
  context.subscriptions.push(
    vscode.commands.registerCommand('prodman.launchAgent', async () => {
      const doc = activeAgentBriefDocument()
      if (!doc) {
        vscode.window.showErrorMessage('ProdMan: Open an agent-brief.md file first.')
        return
      }
      await AgentBriefLauncher.launch(doc)
    }),

    vscode.commands.registerCommand('prodman.compileSpec', async () => {
      const doc = activeAgentBriefDocument()
      if (!doc) {
        vscode.window.showErrorMessage('ProdMan: Open an agent-brief.md file first.')
        return
      }
      await AgentBriefLauncher.compileOnly(doc)
    }),

    vscode.commands.registerCommand('prodman.previewSpec', async () => {
      const doc = activeAgentBriefDocument()
      if (!doc) {
        vscode.window.showErrorMessage('ProdMan: Open an agent-brief.md file first.')
        return
      }
      SpecPreviewPanel.show(context.extensionUri, doc)
    }),

    vscode.commands.registerCommand('prodman.captureSignal', async () => {
      const signal = await vscode.window.showInputBox({
        prompt: 'Describe the signal (user feedback, problem, opportunity)',
        placeHolder: 'e.g. Users keep asking for bulk export',
      })
      if (!signal) return
      await appendSignal(signal)
      signalInboxPanel.refresh()
    }),

    vscode.commands.registerCommand('prodman.initWorkspace', async () => {
      await InitWizard.run(context.extensionUri)
    }),

    vscode.commands.registerCommand('prodman.refreshContextHealth', () => {
      contextHealthPanel.refresh()
    }),

    vscode.commands.registerCommand('prodman.refreshSignalInbox', () => {
      signalInboxPanel.refresh()
    }),

    vscode.commands.registerCommand('prodman.refreshPipeline', () => {
      pipelineDashboard.refresh()
    })
  )

  // --- Init Wizard: auto-prompt on startup if no context detected ---
  checkAndPromptInit()

  context.subscriptions.push(readinessBar)
}

export function deactivate(): void {
  // VS Code disposes subscriptions automatically
}

// --- Helpers ---

function isAgentBrief(document: vscode.TextDocument): boolean {
  return path.basename(document.fileName) === 'agent-brief.md'
}

function activeAgentBriefDocument(): vscode.TextDocument | undefined {
  const editor = vscode.window.activeTextEditor
  if (editor && isAgentBrief(editor.document)) return editor.document
  return undefined
}

async function appendSignal(signal: string): Promise<void> {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
  if (!workspaceRoot) return

  const signalsPath = path.join(workspaceRoot, 'prodman-context', 'signals.md')
  const timestamp = new Date().toISOString().split('T')[0]
  const entry = `\n- [${timestamp}] ${signal}\n`

  if (!fs.existsSync(signalsPath)) {
    fs.mkdirSync(path.dirname(signalsPath), { recursive: true })
    fs.writeFileSync(signalsPath, `# Signals\n${entry}`)
  } else {
    fs.appendFileSync(signalsPath, entry)
  }

  vscode.window.showInformationMessage(`ProdMan: Signal captured → prodman-context/signals.md`)
}

function checkAndPromptInit(): void {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
  if (!workspaceRoot) return

  const productMd = path.join(workspaceRoot, 'prodman-context', 'product.md')
  const claudeMd = path.join(workspaceRoot, 'CLAUDE.md')

  if (!fs.existsSync(productMd) && !fs.existsSync(claudeMd)) {
    vscode.window
      .showInformationMessage(
        'No PRODMAN workspace detected. Initialize now?',
        'Initialize',
        'Not now'
      )
      .then(choice => {
        if (choice === 'Initialize') {
          vscode.commands.executeCommand('prodman.initWorkspace')
        }
      })
  }
}
