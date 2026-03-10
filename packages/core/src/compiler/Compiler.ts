import * as fs from 'fs'
import * as path from 'path'
import { parseMarkdownSections } from '../linter/MarkdownSectionParser'
import { Linter } from '../linter/Linter'
import { getNextVersion } from './VersionManager'
import { mapSectionsToSpec } from './SpecMapper'
import { CompileError } from './types'
import type { CompiledSpec } from './types'
import type { LintResult } from '../linter/types'

export interface CompilerOptions {
  /** Path to the features/ directory. Defaults to 'features' */
  featuresPath?: string
  /** Path to prodman-context/. Defaults to 'prodman-context' */
  contextPath?: string
  /** Allow compiling even if spec is incomplete (adds --force behaviour) */
  allowIncomplete?: boolean
}

export interface CompileResult {
  outputPath: string
  spec: CompiledSpec
  lintResult: LintResult
}

export interface CompileToSpecOptions {
  /** Allow compiling even if spec is incomplete */
  allowIncomplete?: boolean
  /** Override context file refs (useful when running outside of a workspace) */
  contextRefs?: {
    product_md?: string
    users_md?: string
    tech_md?: string | null
    agent_brief_md?: string
  }
}

export interface CompileToSpecResult {
  spec: CompiledSpec
  lintResult: LintResult
}

export class Compiler {
  private featuresPath: string
  private contextPath: string

  constructor(options: CompilerOptions = {}) {
    this.featuresPath = options.featuresPath ?? 'features'
    this.contextPath = options.contextPath ?? 'prodman-context'
  }

  compile(featureName: string, options: CompilerOptions = {}): CompileResult {
    const allowIncomplete = options.allowIncomplete ?? false
    const featuresPath = options.featuresPath ?? this.featuresPath
    const contextPath = options.contextPath ?? this.contextPath

    const featureDir = path.resolve(featuresPath, featureName)
    const briefPath = path.join(featureDir, 'agent-brief.md')

    // Validate agent-brief.md exists
    if (!fs.existsSync(briefPath)) {
      throw new CompileError(
        `agent-brief.md not found in ${featureDir}. Run /pm-ff ${featureName} to generate the spec bundle.`,
        []
      )
    }

    // Run linter
    const linter = new Linter()
    const lintResult = linter.lintFile(briefPath)

    if (lintResult.readiness === 'incomplete' && !allowIncomplete) {
      throw new CompileError(
        `Spec is incomplete — ${lintResult.diagnostics.filter(d => d.severity === 'error').length} error(s) must be fixed before compiling.`,
        lintResult.diagnostics
      )
    }

    // Parse sections
    const content = fs.readFileSync(briefPath, 'utf8')
    const sections = parseMarkdownSections(content)

    // Get version
    const specVersion = getNextVersion(featureDir)

    // Resolve context file paths
    const contextRefs = {
      product_md: path.join(contextPath, 'product.md'),
      users_md: path.join(contextPath, 'users.md'),
      tech_md: fs.existsSync(path.join(contextPath, 'tech.md'))
        ? path.join(contextPath, 'tech.md')
        : null,
      agent_brief_md: briefPath,
    }

    // Map to spec
    const spec = mapSectionsToSpec(sections, {
      featureName,
      specVersion,
      readiness: lintResult.readiness,
      contextRefs,
    })

    // Write output
    const outputPath = path.join(featureDir, 'compiled-spec.json')
    fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2))

    return { outputPath, spec, lintResult }
  }

  /**
   * Compile an agent-brief from an in-memory content string — no filesystem reads or writes.
   * Used by the VS Code extension to compile the active editor document without saving.
   */
  compileToSpec(
    featureName: string,
    content: string,
    options: CompileToSpecOptions = {}
  ): CompileToSpecResult {
    const { allowIncomplete = false, contextRefs = {} } = options

    const linter = new Linter()
    const lintResult = linter.lintContent(featureName, content)

    if (lintResult.readiness === 'incomplete' && !allowIncomplete) {
      throw new CompileError(
        `Spec is incomplete — ${lintResult.diagnostics.filter(d => d.severity === 'error').length} error(s) must be fixed before compiling.`,
        lintResult.diagnostics
      )
    }

    const sections = parseMarkdownSections(content)

    const resolvedRefs = {
      product_md: contextRefs.product_md ?? 'prodman-context/product.md',
      users_md: contextRefs.users_md ?? 'prodman-context/users.md',
      tech_md: contextRefs.tech_md ?? null,
      agent_brief_md: contextRefs.agent_brief_md ?? `features/${featureName}/agent-brief.md`,
    }

    const spec = mapSectionsToSpec(sections, {
      featureName,
      specVersion: 0,
      readiness: lintResult.readiness,
      contextRefs: resolvedRefs,
    })

    return { spec, lintResult }
  }
}
