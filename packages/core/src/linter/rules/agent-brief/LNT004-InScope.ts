import type { LintDiagnostic, ParsedSection, Rule } from '../../types'
import { countBulletItems } from '../../MarkdownSectionParser'

export const LNT004: Rule = {
  id: 'LNT-004',
  run(sections: Map<string, ParsedSection>): LintDiagnostic[] {
    const section = sections.get('in scope')
    if (!section) return []

    const count = countBulletItems(section)
    if (count < 1) {
      return [{
        rule: 'LNT-004',
        severity: 'error',
        message: 'In Scope must contain at least 1 item. List what the agent should build.',
        line: section.lineStart,
      }]
    }

    return []
  },
}
