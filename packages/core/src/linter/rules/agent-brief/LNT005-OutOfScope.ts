import type { LintDiagnostic, ParsedSection, Rule } from '../../types'
import { countBulletItems } from '../../MarkdownSectionParser'

export const LNT005: Rule = {
  id: 'LNT-005',
  run(sections: Map<string, ParsedSection>): LintDiagnostic[] {
    const section = sections.get('out of scope')
    if (!section) return []

    const count = countBulletItems(section)
    if (count < 1) {
      return [{
        rule: 'LNT-005',
        severity: 'error',
        message: 'Out of Scope must contain at least 1 item. Explicit exclusions prevent scope creep.',
        line: section.lineStart,
      }]
    }

    return []
  },
}
