import * as vscode from 'vscode'
import * as path from 'path'
import * as fs from 'fs'
import { AGENT_BRIEF_SCAFFOLD } from '@prodman/core'

const CONTEXT_TEMPLATES: Record<string, string> = {
  'product.md': `# Product

## What it is

[One paragraph description of your product]

## Problem it solves

[The core user problem this product addresses]

## How it works

[Brief description of the product experience]
`,

  'users.md': `# Users

## Primary Segment

**Name:** [Segment name]
**Description:** [Who they are and what they do]
**Key goal:** [What they want to achieve with your product]

## Secondary Segment

**Name:** [Segment name]
**Description:** [Who they are and what they do]
**Key goal:** [What they want to achieve with your product]
`,

  'constraints.md': `# Constraints

## Technical

- **Stack:** [Languages, frameworks, platforms]
- **Infrastructure:** [Cloud provider, hosting environment]
- **Performance:** [Latency, throughput, or size constraints]

## Compliance & Legal

- [Any regulatory or legal requirements, or None]

## Accessibility

- [Standard to meet, e.g. WCAG 2.1 AA, or None]

## Team & Process

- [Headcount, pace, or process constraints]
`,

  'history.md': `# Decision History

This file accumulates key decisions and retrospective learnings.
Each entry is added automatically by /pm-retro or manually.

---
`,
}

/**
 * Multi-step wizard to initialize a PRODMAN workspace.
 * Generates identical output to /pm-import in the Claude Code CLI.
 */
export class InitWizard {
  static async run(): Promise<void> {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath
    if (!workspaceRoot) {
      vscode.window.showErrorMessage('ProdMan: No workspace folder open.')
      return
    }

    const contextDir = path.join(workspaceRoot, 'prodman-context')
    const featuresDir = path.join(workspaceRoot, 'features')

    // Step 1: confirm
    const confirm = await vscode.window.showInformationMessage(
      'ProdMan will create prodman-context/ with product.md, users.md, constraints.md, and history.md.',
      { modal: true },
      'Initialize'
    )
    if (confirm !== 'Initialize') return

    // Step 2: create context files
    fs.mkdirSync(contextDir, { recursive: true })
    fs.mkdirSync(featuresDir, { recursive: true })

    const created: string[] = []
    for (const [filename, content] of Object.entries(CONTEXT_TEMPLATES)) {
      const filePath = path.join(contextDir, filename)
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, content)
        created.push(`prodman-context/${filename}`)
      }
    }

    // Step 3: offer to open product.md for editing
    const openProduct = await vscode.window.showInformationMessage(
      `ProdMan workspace initialized. Created: ${created.join(', ')}`,
      'Open product.md',
      'Create first feature brief',
      'Done'
    )

    if (openProduct === 'Open product.md') {
      const productUri = vscode.Uri.file(path.join(contextDir, 'product.md'))
      await vscode.window.showTextDocument(productUri)
      return
    }

    if (openProduct === 'Create first feature brief') {
      await InitWizard.createFeatureBrief(workspaceRoot, featuresDir)
    }
  }

  static async createFeatureBrief(
    workspaceRoot: string,
    featuresDir: string
  ): Promise<void> {
    const featureName = await vscode.window.showInputBox({
      prompt: 'Feature name (used as folder name)',
      placeHolder: 'e.g. payment-api, user-onboarding, search',
      validateInput: (value) => {
        if (!value.trim()) return 'Feature name cannot be empty'
        if (/\s/.test(value)) return 'Use kebab-case (no spaces)'
        if (!/^[a-z0-9-]+$/.test(value)) return 'Use lowercase letters, numbers, and hyphens only'
        return undefined
      },
    })

    if (!featureName) return

    const featureDir = path.join(featuresDir, featureName)
    const briefPath = path.join(featureDir, 'agent-brief.md')

    if (fs.existsSync(briefPath)) {
      const overwrite = await vscode.window.showWarningMessage(
        `features/${featureName}/agent-brief.md already exists. Overwrite?`,
        { modal: true },
        'Overwrite'
      )
      if (overwrite !== 'Overwrite') return
    }

    fs.mkdirSync(featureDir, { recursive: true })

    const scaffold = AGENT_BRIEF_SCAFFOLD.replace(
      '# Agent Brief: [Feature Title]',
      `# Agent Brief: ${featureName
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')}`
    )

    fs.writeFileSync(briefPath, scaffold)

    const briefUri = vscode.Uri.file(briefPath)
    await vscode.window.showTextDocument(briefUri)

    vscode.window.showInformationMessage(
      `ProdMan: features/${featureName}/agent-brief.md created — lint diagnostics will guide you.`
    )
  }
}
