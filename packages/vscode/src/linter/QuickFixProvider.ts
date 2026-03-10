import * as vscode from 'vscode'
import { SECTION_TEMPLATES } from '@prodman/core'

/**
 * Maps lint rule IDs to the section template they can insert.
 * When a quick fix is triggered on a diagnostic, we look up the rule,
 * find the missing section, and append its template to the document.
 */
const RULE_TO_SECTION: Record<string, string> = {
  'LNT-001': '', // Required sections — handled dynamically from message
  'LNT-003': 'technical context',
  'LNT-004': 'in scope',
  'LNT-005': 'out of scope',
  'LNT-006': 'requirements',
  'LNT-007': 'anti-requirements',
  'LNT-008': 'acceptance criteria',
  'LNT-010': 'definition of done',
  'LNT-011': 'escalation triggers',
}

export class QuickFixProvider implements vscode.CodeActionProvider {
  provideCodeActions(
    document: vscode.TextDocument,
    _range: vscode.Range | vscode.Selection,
    context: vscode.CodeActionContext
  ): vscode.CodeAction[] {
    const actions: vscode.CodeAction[] = []

    for (const diagnostic of context.diagnostics) {
      if (diagnostic.source !== 'ProdMan') continue

      const ruleId = String(diagnostic.code)
      const fixes = this.buildFixes(document, diagnostic, ruleId)
      actions.push(...fixes)
    }

    return actions
  }

  private buildFixes(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic,
    ruleId: string
  ): vscode.CodeAction[] {
    // LNT-001: missing required section — parse section name from message
    if (ruleId === 'LNT-001') {
      return this.fixMissingSection(document, diagnostic)
    }

    // LNT-002: task summary too short — replace the section content
    if (ruleId === 'LNT-002') {
      return this.fixTaskSummaryLength(document, diagnostic)
    }

    // LNT-008: fewer than 3 AC items — insert additional items
    if (ruleId === 'LNT-008') {
      return this.fixInsufficientItems(document, diagnostic, 'acceptance criteria', [
        '- [ ] User can [specific, observable action]',
        '- [ ] System [specific, verifiable response]',
        '- [ ] [Edge case scenario] is handled correctly',
      ])
    }

    // LNT-010: fewer than 3 DoD items — insert additional items
    if (ruleId === 'LNT-010') {
      return this.fixInsufficientItems(document, diagnostic, 'definition of done', [
        '- [ ] All acceptance criteria pass',
        '- [ ] Unit tests written and passing',
        '- [ ] No lint errors or type errors',
      ])
    }

    // LNT-009: vague AC — no auto-fix (requires human judgment)
    if (ruleId === 'LNT-009') {
      return [] // No safe auto-fix for vague language
    }

    // Generic: insert section template at end of file
    const sectionKey = RULE_TO_SECTION[ruleId]
    if (sectionKey && SECTION_TEMPLATES[sectionKey]) {
      return [this.insertSectionAtEnd(document, diagnostic, sectionKey)]
    }

    return []
  }

  private fixMissingSection(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic
  ): vscode.CodeAction[] {
    // Message format: "Missing required section: ..."
    const msg = diagnostic.message.toLowerCase()
    for (const [key, template] of Object.entries(SECTION_TEMPLATES)) {
      if (msg.includes(key)) {
        return [this.insertSectionAtEnd(document, diagnostic, key, template)]
      }
    }
    return []
  }

  private fixTaskSummaryLength(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic
  ): vscode.CodeAction[] {
    const action = new vscode.CodeAction(
      'Insert Task Summary template',
      vscode.CodeActionKind.QuickFix
    )
    action.diagnostics = [diagnostic]
    action.edit = new vscode.WorkspaceEdit()

    // Replace the line at the diagnostic with a longer placeholder
    const line = diagnostic.range.start.line + 1 // line after the heading
    const position = new vscode.Position(line, 0)
    action.edit.insert(
      document.uri,
      position,
      'One sentence describing what this feature does and why.\n'
    )
    return [action]
  }

  private fixInsufficientItems(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic,
    _sectionKey: string,
    items: string[]
  ): vscode.CodeAction[] {
    const action = new vscode.CodeAction(
      `Insert ${_sectionKey} template items`,
      vscode.CodeActionKind.QuickFix
    )
    action.diagnostics = [diagnostic]
    action.edit = new vscode.WorkspaceEdit()

    // Append items at the end of the section (after the diagnostic range end line)
    const insertLine = diagnostic.range.end.line + 1
    const position = new vscode.Position(insertLine, 0)
    action.edit.insert(document.uri, position, items.join('\n') + '\n')
    return [action]
  }

  private insertSectionAtEnd(
    document: vscode.TextDocument,
    diagnostic: vscode.Diagnostic,
    sectionKey: string,
    template = SECTION_TEMPLATES[sectionKey]
  ): vscode.CodeAction {
    const action = new vscode.CodeAction(
      `Insert "${template.heading}" section`,
      vscode.CodeActionKind.QuickFix
    )
    action.diagnostics = [diagnostic]
    action.edit = new vscode.WorkspaceEdit()

    const lastLine = document.lineCount - 1
    const endOfDoc = document.lineAt(lastLine).range.end
    const insertion = `\n\n${template.heading}\n\n${template.body}\n`
    action.edit.insert(document.uri, endOfDoc, insertion)
    return action
  }
}
