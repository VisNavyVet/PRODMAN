import type { LintDiagnostic, ParsedSection, Rule } from '../../types'

const REQUIRED_SECTIONS = [
  'task summary',
  'product context',
  'technical context',
  'in scope',
  'out of scope',
  'requirements',
  'anti-requirements',
  'acceptance criteria',
  'edge cases',
  'constraints',
  'definition of done',
  'escalation triggers',
]

export const LNT001: Rule = {
  id: 'LNT-001',
  run(sections: Map<string, ParsedSection>): LintDiagnostic[] {
    const diagnostics: LintDiagnostic[] = []

    for (const required of REQUIRED_SECTIONS) {
      const section = sections.get(required)
      if (!section || section.content.trim().length === 0) {
        diagnostics.push({
          rule: 'LNT-001',
          severity: 'error',
          message: `Missing required section: '${required}'. Agent briefs require all 12 sections.`,
          line: 0,
        })
      }
    }

    return diagnostics
  },
}
