import * as fs from 'fs'
import * as path from 'path'
import { Linter } from '../src/linter/Linter'

const FIXTURES = path.join(__dirname, 'fixtures')

describe('Linter.lintFile', () => {
  const linter = new Linter()

  it('returns agent-ready for the agent-ready fixture', () => {
    const filePath = path.join(FIXTURES, 'agent-ready', 'agent-brief.md')
    const result = linter.lintFile(filePath)
    expect(result.readiness).toBe('agent-ready')
    expect(result.diagnostics.filter(d => d.severity === 'error')).toHaveLength(0)
  })

  it('returns review-needed for the review-needed fixture', () => {
    const filePath = path.join(FIXTURES, 'review-needed', 'agent-brief.md')
    const result = linter.lintFile(filePath)
    // Has vague AC ("works correctly", "looks good") → LNT-009 warnings
    // Missing escalation triggers → LNT-011 warning
    expect(result.readiness).toBe('review-needed')
    expect(result.diagnostics.some(d => d.rule === 'LNT-009')).toBe(true)
    expect(result.diagnostics.some(d => d.rule === 'LNT-011')).toBe(true)
    expect(result.diagnostics.filter(d => d.severity === 'error')).toHaveLength(0)
  })

  it('returns incomplete for the incomplete fixture', () => {
    const filePath = path.join(FIXTURES, 'incomplete', 'agent-brief.md')
    const result = linter.lintFile(filePath)
    expect(result.readiness).toBe('incomplete')
    expect(result.diagnostics.filter(d => d.severity === 'error').length).toBeGreaterThan(0)
  })

  it('returns incomplete for a missing file', () => {
    const result = linter.lintFile('/nonexistent/agent-brief.md')
    expect(result.readiness).toBe('incomplete')
    expect(result.diagnostics[0].rule).toBe('PARSE')
  })
})

describe('Individual rule: LNT-001 (RequiredSections)', () => {
  const linter = new Linter()

  it('fires on missing task summary', () => {
    const content = `## Context\n- Some content`
    const result = linter.lintContent('agent-brief.md', content)
    const diag = result.diagnostics.find(d => d.rule === 'LNT-001' && d.message.includes('task summary'))
    expect(diag).toBeDefined()
    expect(diag?.severity).toBe('error')
  })

  it('fires on missing escalation triggers', () => {
    const content = fs.readFileSync(path.join(FIXTURES, 'incomplete', 'agent-brief.md'), 'utf8')
    const result = linter.lintContent('agent-brief.md', content)
    expect(result.diagnostics.some(d => d.rule === 'LNT-001' && d.message.includes('escalation triggers'))).toBe(true)
  })
})

describe('Individual rule: LNT-002 (TaskSummaryLength)', () => {
  const linter = new Linter()

  it('fires when task summary is too short', () => {
    const content = `## Task Summary\nShort.\n\n## Context\n- x\n\n### Technical context\n- x\n\n### Product context\n- x`
    const result = linter.lintContent('agent-brief.md', content)
    expect(result.diagnostics.some(d => d.rule === 'LNT-002')).toBe(true)
  })

  it('does not fire for a valid task summary', () => {
    const summary = 'A'.repeat(50)
    const content = `## Task Summary\n${summary}`
    const result = linter.lintContent('agent-brief.md', content)
    expect(result.diagnostics.some(d => d.rule === 'LNT-002')).toBe(false)
  })
})

describe('Individual rule: LNT-008 (AcceptanceCriteria)', () => {
  const linter = new Linter()

  it('fires when fewer than 3 AC items', () => {
    const content = `## Acceptance Criteria\n- [ ] Item 1\n- [ ] Item 2`
    const result = linter.lintContent('agent-brief.md', content)
    expect(result.diagnostics.some(d => d.rule === 'LNT-008')).toBe(true)
  })

  it('passes when 3+ AC items', () => {
    const content = `## Acceptance Criteria\n- [ ] Item 1\n- [ ] Item 2\n- [ ] Item 3`
    const result = linter.lintContent('agent-brief.md', content)
    expect(result.diagnostics.some(d => d.rule === 'LNT-008')).toBe(false)
  })
})

describe('Individual rule: LNT-009 (VagueAC)', () => {
  const linter = new Linter()

  it('fires on "works correctly"', () => {
    const content = `## Acceptance Criteria\n- [ ] The feature works correctly\n- [ ] Item 2\n- [ ] Item 3`
    const result = linter.lintContent('agent-brief.md', content)
    expect(result.diagnostics.some(d => d.rule === 'LNT-009')).toBe(true)
  })

  it('fires on "looks good"', () => {
    const content = `## Acceptance Criteria\n- [ ] The UI looks good on mobile\n- [ ] Item 2\n- [ ] Item 3`
    const result = linter.lintContent('agent-brief.md', content)
    expect(result.diagnostics.some(d => d.rule === 'LNT-009')).toBe(true)
  })

  it('does not fire on specific, observable criteria', () => {
    const content = `## Acceptance Criteria\n- [ ] When user types "foo", orders containing "foo" are shown\n- [ ] Empty state renders when result count is 0\n- [ ] Clear button disappears when input is empty`
    const result = linter.lintContent('agent-brief.md', content)
    expect(result.diagnostics.some(d => d.rule === 'LNT-009')).toBe(false)
  })
})

describe('Individual rule: LNT-011 (EscalationTriggers)', () => {
  const linter = new Linter()

  it('fires (warning) when escalation triggers section is missing', () => {
    const content = `## Task Summary\nDo something`
    const result = linter.lintContent('agent-brief.md', content)
    const diag = result.diagnostics.find(d => d.rule === 'LNT-011')
    expect(diag).toBeDefined()
    expect(diag?.severity).toBe('warning')
  })

  it('does not fire when escalation triggers has content', () => {
    const content = `## Questions the Agent Should Flag\n- Stop if X is ambiguous`
    const result = linter.lintContent('agent-brief.md', content)
    expect(result.diagnostics.some(d => d.rule === 'LNT-011')).toBe(false)
  })
})

describe('Linter.featureReadiness', () => {
  const linter = new Linter()

  it('returns incomplete when any result is incomplete', () => {
    const results = [
      linter.lintContent('agent-brief.md', '## Task Summary\nShort.'),
      linter.lintContent('prd.md', ''),
    ]
    expect(linter.featureReadiness(results)).toBe('incomplete')
  })
})
