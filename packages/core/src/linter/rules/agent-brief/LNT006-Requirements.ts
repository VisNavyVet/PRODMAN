import type { LintDiagnostic, ParsedSection, Rule } from '../../types'
import { countBulletItems } from '../../MarkdownSectionParser'

export const LNT006: Rule = {
  id: 'LNT-006',
  run(sections: Map<string, ParsedSection>): LintDiagnostic[] {
    const section = sections.get('requirements')
    if (!section) return []

    const count = countBulletItems(section)
    if (count < 1) {
      return [{
        rule: 'LNT-006',
        severity: 'error',
        message: 'Requirements (Must implement) must contain at least 1 item.',
        line: section.lineStart,
      }]
    }

    return []
  },
}
