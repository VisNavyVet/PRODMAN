import type { LintDiagnostic, ParsedSection, Rule } from '../../types'
import { countBulletItems } from '../../MarkdownSectionParser'

export const LNT007: Rule = {
  id: 'LNT-007',
  run(sections: Map<string, ParsedSection>): LintDiagnostic[] {
    const section = sections.get('anti-requirements')
    if (!section) return []

    const count = countBulletItems(section)
    if (count < 1) {
      return [{
        rule: 'LNT-007',
        severity: 'error',
        message: 'Anti-Requirements (Must NOT do) must contain at least 1 item. Agents need explicit prohibitions.',
        line: section.lineStart,
      }]
    }

    return []
  },
}
