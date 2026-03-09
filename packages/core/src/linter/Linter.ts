import * as fs from 'fs'
import * as path from 'path'
import { parseMarkdownSections } from './MarkdownSectionParser'
import { RuleEngine, AGENT_BRIEF_RULES } from './RuleEngine'
import type { LintDiagnostic, LintResult, ReadinessState, FileType } from './types'

function detectFileType(filePath: string): FileType {
  const name = path.basename(filePath).toLowerCase()
  if (name.includes('agent-brief')) return 'agent-brief'
  if (name === 'prd.md') return 'prd'
  if (name === 'approach.md') return 'approach'
  if (name === 'plan.md') return 'plan'
  return 'unknown'
}

function getRulesForFileType(fileType: FileType) {
  switch (fileType) {
    case 'agent-brief': return AGENT_BRIEF_RULES
    // Future: add prd/approach/plan rules here
    default: return []
  }
}

function deriveReadiness(diagnostics: LintDiagnostic[]): ReadinessState {
  if (diagnostics.some(d => d.severity === 'error')) return 'incomplete'
  if (diagnostics.some(d => d.severity === 'warning')) return 'review-needed'
  return 'agent-ready'
}

export class Linter {
  /** Lint a single file given its path and content string. */
  lintContent(filePath: string, content: string): LintResult {
    const fileType = detectFileType(filePath)
    const rules = getRulesForFileType(fileType)

    if (rules.length === 0) {
      return { file: filePath, fileType, diagnostics: [], readiness: 'agent-ready' }
    }

    const sections = parseMarkdownSections(content)
    const diagnostics = new RuleEngine(rules).run(sections, filePath)
    const readiness = deriveReadiness(diagnostics)

    return { file: filePath, fileType, diagnostics, readiness }
  }

  /** Lint a single file from disk. */
  lintFile(filePath: string): LintResult {
    if (!fs.existsSync(filePath)) {
      return {
        file: filePath,
        fileType: 'unknown',
        diagnostics: [{
          rule: 'PARSE',
          severity: 'error',
          message: `File not found: ${filePath}`,
          line: 0,
        }],
        readiness: 'incomplete',
      }
    }

    const content = fs.readFileSync(filePath, 'utf8')
    return this.lintContent(filePath, content)
  }

  /** Lint all spec files in a feature directory. Returns one result per file. */
  lintFeature(featurePath: string): LintResult[] {
    const results: LintResult[] = []
    const specFiles = ['agent-brief.md', 'prd.md', 'approach.md', 'plan.md']

    for (const filename of specFiles) {
      const fullPath = path.join(featurePath, filename)
      if (fs.existsSync(fullPath)) {
        results.push(this.lintFile(fullPath))
      }
    }

    return results
  }

  /** Lint all features under a features directory. */
  lintAll(featuresPath: string): Map<string, LintResult[]> {
    const results = new Map<string, LintResult[]>()

    if (!fs.existsSync(featuresPath)) return results

    const entries = fs.readdirSync(featuresPath, { withFileTypes: true })
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const featurePath = path.join(featuresPath, entry.name)
      const featureResults = this.lintFeature(featurePath)
      if (featureResults.length > 0) {
        results.set(entry.name, featureResults)
      }
    }

    return results
  }

  /** Get overall readiness for a feature (worst readiness across all files). */
  featureReadiness(results: LintResult[]): ReadinessState {
    if (results.some(r => r.readiness === 'incomplete')) return 'incomplete'
    if (results.some(r => r.readiness === 'review-needed')) return 'review-needed'
    return 'agent-ready'
  }
}
