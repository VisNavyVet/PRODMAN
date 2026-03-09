import type { ParsedSection } from './types'

/**
 * Maps heading text aliases → canonical section names.
 * All keys are already normalised (lowercase, trimmed, punctuation stripped).
 */
const SECTION_ALIASES: Record<string, string> = {
  // agent-brief variants
  'questions the agent should flag': 'escalation triggers',
  'questions the agent should flag not solve': 'escalation triggers',
  'stop and ask if': 'escalation triggers',
  'escalation': 'escalation triggers',
  'must implement': 'requirements',
  'must not do': 'anti-requirements',
  'anti requirements': 'anti-requirements',
  'do not': 'anti-requirements',
  'task scope': 'scope',
  'scope': 'scope',
  'edge cases to handle': 'edge cases',
  'edge case': 'edge cases',
  'product context': 'product context',
  'technical context': 'technical context',
  'tech context': 'technical context',
  'context': 'context',
  // acceptance criteria variants
  'ac': 'acceptance criteria',
  'criteria': 'acceptance criteria',
  // definition of done variants
  'dod': 'definition of done',
  'done criteria': 'definition of done',
}

/**
 * Normalise a heading string: lowercase, trim, strip parenthetical suffixes and non-alphanumeric.
 * e.g. "Out of scope (do not touch)" → "out of scope"
 */
export function normaliseHeading(text: string): string {
  return text
    .replace(/\s*\(.*?\)\s*/g, ' ') // strip parenthetical suffixes: "(do not touch)"
    .replace(/\s*—.*/g, '')          // strip em-dash suffixes: "— Notes"
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s\-]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Resolve a normalised heading to its canonical section name via alias map.
 */
function resolveAlias(normalised: string): string {
  return SECTION_ALIASES[normalised] ?? normalised
}

/**
 * Parse H2 (##) and H3 (###) headings from a Markdown file into a section map.
 *
 * - Keys are canonical section names (normalised + alias-resolved)
 * - Sub-headings (###) under a ## are included in the parent's content
 *   AND also stored as their own entries in the map
 * - Duplicate keys: last one wins
 * - Empty file or no headings: returns empty Map (does not throw)
 */
export function parseMarkdownSections(text: string): Map<string, ParsedSection> {
  const sections = new Map<string, ParsedSection>()
  const lines = text.split('\n')

  // Find all headings and their line positions
  interface HeadingEntry {
    level: number
    rawName: string
    normName: string
    lineIndex: number
  }

  const headings: HeadingEntry[] = []

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^(#{1,3})\s+(.+)/)
    if (match) {
      const level = match[1].length
      const rawName = match[2].trim()
      const normName = resolveAlias(normaliseHeading(rawName))
      headings.push({ level, rawName, normName, lineIndex: i })
    }
  }

  // Build sections: content runs from heading line+1 to next heading of same/higher level - 1
  for (let h = 0; h < headings.length; h++) {
    const heading = headings[h]
    const contentStart = heading.lineIndex + 1

    // Find end: next heading at same or higher level (lower number = higher level)
    let contentEnd = lines.length - 1
    for (let j = h + 1; j < headings.length; j++) {
      if (headings[j].level <= heading.level) {
        contentEnd = headings[j].lineIndex - 1
        break
      }
    }

    const contentLines = lines.slice(contentStart, contentEnd + 1)
    const content = contentLines.join('\n').trimEnd()

    const section: ParsedSection = {
      name: heading.normName,
      content,
      lines: contentLines,
      lineStart: heading.lineIndex,
      lineEnd: contentEnd,
    }

    sections.set(heading.normName, section)
  }

  // Also materialise "in scope" and "out of scope" from a parent "scope" or "task scope" section
  // by scanning its content for ### In scope / ### Out of scope sub-headings
  const scopeSection = sections.get('scope')
  if (scopeSection && !sections.has('in scope') && !sections.has('out of scope')) {
    _extractSubSection(scopeSection, 'in scope', sections)
    _extractSubSection(scopeSection, 'out of scope', sections)
  }

  // Similarly extract product context and technical context from a flat "context" section
  const contextSection = sections.get('context')
  if (contextSection) {
    if (!sections.has('product context')) {
      _extractSubSection(contextSection, 'product context', sections)
    }
    if (!sections.has('technical context')) {
      _extractSubSection(contextSection, 'technical context', sections)
    }
  }

  return sections
}

/**
 * Extract a sub-section from a parent section's content lines and add it to the map.
 */
function _extractSubSection(
  parent: ParsedSection,
  targetNorm: string,
  sections: Map<string, ParsedSection>
): void {
  const lines = parent.lines
  let startIdx = -1

  for (let i = 0; i < lines.length; i++) {
    const match = lines[i].match(/^#{2,3}\s+(.+)/)
    if (match) {
      const norm = resolveAlias(normaliseHeading(match[1]))
      if (norm === targetNorm) {
        startIdx = i
        break
      }
    }
  }

  if (startIdx === -1) return

  let endIdx = lines.length - 1
  for (let i = startIdx + 1; i < lines.length; i++) {
    if (lines[i].match(/^#{2,3}\s+/)) {
      endIdx = i - 1
      break
    }
  }

  const contentLines = lines.slice(startIdx + 1, endIdx + 1)
  sections.set(targetNorm, {
    name: targetNorm,
    content: contentLines.join('\n').trimEnd(),
    lines: contentLines,
    lineStart: parent.lineStart + startIdx,
    lineEnd: parent.lineStart + endIdx,
  })
}

/**
 * Count bullet list items in a section's content.
 * Matches: - item, * item, • item, 1. item, - [ ] item, - [x] item
 */
export function countBulletItems(section: ParsedSection): number {
  return section.lines.filter(line =>
    /^\s*[-*•]\s+\S/.test(line) ||
    /^\s*\d+\.\s+\S/.test(line) ||
    /^\s*-\s+\[[ x]\]\s+\S/.test(line)
  ).length
}

/**
 * Extract bullet list items from a section as an array of strings.
 * Strips the list marker and trims each item.
 */
export function extractBulletItems(section: ParsedSection): string[] {
  const items: string[] = []
  for (const line of section.lines) {
    const match = line.match(/^\s*(?:[-*•]|\d+\.)\s+(?:\[[ x]\]\s+)?(.+)/)
    if (match) {
      items.push(match[1].trim())
    }
  }
  return items
}

/**
 * Extract a Markdown table from a section as an array of row objects.
 * Returns rows as { [colHeader]: cellValue } records.
 * Skips header and separator rows.
 */
export function extractTableRows(section: ParsedSection): Array<Record<string, string>> {
  const rows: Array<Record<string, string>> = []
  let headers: string[] = []
  let headerFound = false

  for (const line of section.lines) {
    if (!line.trim().startsWith('|')) continue
    const cells = line
      .split('|')
      .slice(1, -1)
      .map(c => c.trim())

    if (!headerFound) {
      headers = cells.map(h => h.toLowerCase())
      headerFound = true
      continue
    }

    // Skip separator row (--- cells)
    if (cells.every(c => /^[-:]+$/.test(c))) continue

    const row: Record<string, string> = {}
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? ''
    })
    rows.push(row)
  }

  return rows
}
