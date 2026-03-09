import { parseMarkdownSections, normaliseHeading, countBulletItems, extractBulletItems } from '../src/linter/MarkdownSectionParser'

describe('normaliseHeading', () => {
  it('lowercases and trims', () => {
    expect(normaliseHeading('  Task Summary  ')).toBe('task summary')
  })

  it('strips punctuation but keeps spaces and hyphens', () => {
    expect(normaliseHeading('Anti-Requirements!')).toBe('anti-requirements')
  })

  it('collapses multiple spaces', () => {
    expect(normaliseHeading('Task   Summary')).toBe('task summary')
  })
})

describe('parseMarkdownSections', () => {
  it('returns empty map for empty string', () => {
    const sections = parseMarkdownSections('')
    expect(sections.size).toBe(0)
  })

  it('returns empty map when no headings', () => {
    const sections = parseMarkdownSections('Just some text.\nNo headings here.')
    expect(sections.size).toBe(0)
  })

  it('parses H2 sections', () => {
    const md = `## Task Summary\nDo the thing.\n\n## Constraints\n- Perf: fast`
    const sections = parseMarkdownSections(md)
    expect(sections.has('task summary')).toBe(true)
    expect(sections.has('constraints')).toBe(true)
    expect(sections.get('task summary')?.content.trim()).toBe('Do the thing.')
  })

  it('aliases "questions the agent should flag" → "escalation triggers"', () => {
    const md = `## Questions the Agent Should Flag\n- Stop if X`
    const sections = parseMarkdownSections(md)
    expect(sections.has('escalation triggers')).toBe(true)
  })

  it('aliases "must implement" → "requirements"', () => {
    const md = `## Must Implement\n- Do X`
    const sections = parseMarkdownSections(md)
    expect(sections.has('requirements')).toBe(true)
  })

  it('aliases "must not do" → "anti-requirements"', () => {
    const md = `## Must NOT Do\n- Do not X`
    const sections = parseMarkdownSections(md)
    expect(sections.has('anti-requirements')).toBe(true)
  })

  it('extracts in scope and out of scope from task scope parent', () => {
    const md = `## Task Scope\n\n### In scope\n- Build X\n\n### Out of scope (do not touch)\n- Not Y`
    const sections = parseMarkdownSections(md)
    expect(sections.has('in scope')).toBe(true)
    expect(sections.has('out of scope')).toBe(true)
  })

  it('preserves line numbers', () => {
    const md = `Line 0\n## Task Summary\nContent line`
    const sections = parseMarkdownSections(md)
    expect(sections.get('task summary')?.lineStart).toBe(1)
  })

  it('last heading wins on duplicate section names', () => {
    const md = `## Task Summary\nFirst\n\n## Task Summary\nSecond`
    const sections = parseMarkdownSections(md)
    expect(sections.get('task summary')?.content.trim()).toBe('Second')
  })
})

describe('countBulletItems', () => {
  it('counts dash bullets', () => {
    const sections = parseMarkdownSections(`## In scope\n- Item 1\n- Item 2\n- Item 3`)
    expect(countBulletItems(sections.get('in scope')!)).toBe(3)
  })

  it('counts checkbox bullets', () => {
    const sections = parseMarkdownSections(`## Requirements\n- [ ] Req 1\n- [ ] Req 2`)
    expect(countBulletItems(sections.get('requirements')!)).toBe(2)
  })

  it('returns 0 for empty section', () => {
    const sections = parseMarkdownSections(`## In scope\n\nNo bullets here`)
    expect(countBulletItems(sections.get('in scope')!)).toBe(0)
  })
})

describe('extractBulletItems', () => {
  it('strips list markers and trims', () => {
    const sections = parseMarkdownSections(`## In scope\n- Build X\n- Build Y`)
    const items = extractBulletItems(sections.get('in scope')!)
    expect(items).toEqual(['Build X', 'Build Y'])
  })

  it('strips checkbox markers', () => {
    const sections = parseMarkdownSections(`## Requirements\n- [ ] Req 1\n- [x] Req 2`)
    const items = extractBulletItems(sections.get('requirements')!)
    expect(items).toEqual(['Req 1', 'Req 2'])
  })
})
