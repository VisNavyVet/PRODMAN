import type { LintDiagnostic, ParsedSection, Rule } from '../../types'

const MIN_LENGTH = 10
const MAX_LENGTH = 500

export const LNT002: Rule = {
  id: 'LNT-002',
  run(sections: Map<string, ParsedSection>): LintDiagnostic[] {
    const section = sections.get('task summary')
    if (!section) return [] // LNT-001 already flags this

    const text = section.content.trim()
    const len = text.length

    if (len < MIN_LENGTH) {
      return [{
        rule: 'LNT-002',
        severity: 'error',
        message: `Task Summary is too short (${len} chars). Must be ${MIN_LENGTH}–${MAX_LENGTH} characters.`,
        line: section.lineStart,
      }]
    }

    if (len > MAX_LENGTH) {
      return [{
        rule: 'LNT-002',
        severity: 'error',
        message: `Task Summary is too long (${len} chars). Must be ${MIN_LENGTH}–${MAX_LENGTH} characters. Trim to 1–2 sentences.`,
        line: section.lineStart,
      }]
    }

    return []
  },
}
