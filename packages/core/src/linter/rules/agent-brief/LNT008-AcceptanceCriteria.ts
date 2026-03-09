import type { LintDiagnostic, ParsedSection, Rule } from '../../types'
import { countBulletItems } from '../../MarkdownSectionParser'

const MIN_ITEMS = 3

export const LNT008: Rule = {
  id: 'LNT-008',
  run(sections: Map<string, ParsedSection>): LintDiagnostic[] {
    const section = sections.get('acceptance criteria')
    if (!section) return []

    const count = countBulletItems(section)
    if (count < MIN_ITEMS) {
      return [{
        rule: 'LNT-008',
        severity: 'error',
        message: `Acceptance Criteria must contain at least ${MIN_ITEMS} items (found ${count}). Each criterion defines when the task is done.`,
        line: section.lineStart,
      }]
    }

    return []
  },
}
