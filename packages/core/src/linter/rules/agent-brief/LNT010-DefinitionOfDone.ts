import type { LintDiagnostic, ParsedSection, Rule } from '../../types'
import { countBulletItems } from '../../MarkdownSectionParser'

const MIN_ITEMS = 3

export const LNT010: Rule = {
  id: 'LNT-010',
  run(sections: Map<string, ParsedSection>): LintDiagnostic[] {
    const section = sections.get('definition of done')
    if (!section) return []

    const count = countBulletItems(section)
    if (count < MIN_ITEMS) {
      return [{
        rule: 'LNT-010',
        severity: 'error',
        message: `Definition of Done must contain at least ${MIN_ITEMS} items (found ${count}). The agent needs to know when to stop.`,
        line: section.lineStart,
      }]
    }

    return []
  },
}
