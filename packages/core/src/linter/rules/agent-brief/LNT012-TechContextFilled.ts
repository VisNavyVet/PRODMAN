import type { LintDiagnostic, ParsedSection, Rule } from '../../types'

/**
 * LNT-012: TechContextFilled
 *
 * Detects unfilled placeholder text in the Technical Context section.
 * Template placeholders look like: **Repository:** [repo name or path]
 * An agent given a brief with these placeholders will hallucinate values.
 *
 * Fires: ERROR — blocks agent-ready status.
 */

// Matches a labeled field where the value is entirely a [placeholder]:
//   - **Repository:** [repo name or path]
//   - **Tech stack:** [Languages, frameworks, relevant versions]
const LABELED_PLACEHOLDER = /\*\*[^:*]+:\*\*\s*\[[^\]]{3,}\]\s*$/

// Matches a bare bullet item that is entirely a [placeholder]:
//   - [List files the agent should focus on]
// Excludes checkbox items: - [ ] and - [x]
const BARE_PLACEHOLDER = /^\s*[-*•]\s+\[[^\]]{5,}\]\s*$/

function isUnfilledPlaceholder(line: string): boolean {
  // Never flag checkbox items (- [ ] or - [x])
  if (/^\s*[-*•]\s+\[[ xX]\]/.test(line)) return false
  return LABELED_PLACEHOLDER.test(line) || BARE_PLACEHOLDER.test(line)
}

export const LNT012: Rule = {
  id: 'LNT-012',
  run(sections: Map<string, ParsedSection>): LintDiagnostic[] {
    const section = sections.get('technical context')
    if (!section) return [] // LNT-001 handles missing section

    const placeholderLines = section.lines
      .map((line, idx) => ({ line, lineNum: section.lineStart + 1 + idx }))
      .filter(({ line }) => isUnfilledPlaceholder(line))

    if (placeholderLines.length === 0) return []

    const first = placeholderLines[0]
    return [{
      rule: 'LNT-012',
      severity: 'error',
      message:
        'Technical Context contains unfilled placeholder text. Fill in repository, relevant files, tech stack, and related systems before handing to an agent.',
      line: first.lineNum,
      endLine: first.lineNum,
    }]
  },
}
