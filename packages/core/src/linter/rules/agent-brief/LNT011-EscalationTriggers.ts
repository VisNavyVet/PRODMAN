import type { LintDiagnostic, ParsedSection, Rule } from '../../types'
import { countBulletItems } from '../../MarkdownSectionParser'

export const LNT011: Rule = {
  id: 'LNT-011',
  run(sections: Map<string, ParsedSection>): LintDiagnostic[] {
    const section = sections.get('escalation triggers')
    if (!section || section.content.trim().length === 0) {
      return [{
        rule: 'LNT-011',
        severity: 'warning',
        message: 'No escalation triggers defined. Without them, the agent will make unauthorized decisions when it hits ambiguous situations.',
        line: 0,
      }]
    }

    const count = countBulletItems(section)
    if (count < 1) {
      return [{
        rule: 'LNT-011',
        severity: 'warning',
        message: 'Escalation Triggers section exists but has no items. Add at least 1 condition under which the agent must stop and ask.',
        line: section.lineStart,
      }]
    }

    return []
  },
}
