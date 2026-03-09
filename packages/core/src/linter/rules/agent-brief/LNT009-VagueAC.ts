import type { LintDiagnostic, ParsedSection, Rule } from '../../types'

const VAGUE_PHRASES = [
  'works correctly',
  'looks good',
  'is fast',
  'is smooth',
  'feels right',
  'should work',
  'appears correct',
  'is intuitive',
  'handles errors',
  'as expected',
  'properly',
  'correctly',
]

export const LNT009: Rule = {
  id: 'LNT-009',
  run(sections: Map<string, ParsedSection>): LintDiagnostic[] {
    const section = sections.get('acceptance criteria')
    if (!section) return []

    const diagnostics: LintDiagnostic[] = []

    section.lines.forEach((line, i) => {
      // Only check bullet items
      if (!/^\s*[-*•]/.test(line) && !/^\s*-\s+\[/.test(line)) return

      const lower = line.toLowerCase()
      for (const phrase of VAGUE_PHRASES) {
        if (lower.includes(phrase)) {
          diagnostics.push({
            rule: 'LNT-009',
            severity: 'warning',
            message: `Acceptance Criteria contains vague language: "${phrase}". Use observable, verifiable behaviour instead.`,
            line: section.lineStart + i + 1,
          })
          break // one diagnostic per line
        }
      }
    })

    return diagnostics
  },
}
