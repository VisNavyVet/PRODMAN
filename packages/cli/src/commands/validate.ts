import * as fs from 'fs'
import * as path from 'path'
import { Linter } from '@prodman/core'
import type { LintResult } from '@prodman/core'
import { formatLintResult, readinessBadge, printTable } from '../utils/output'
import chalk from 'chalk'

interface ValidateOptions {
  all?: boolean
  json?: boolean
  quiet?: boolean
  featuresPath?: string
}

export async function validateCommand(
  featureName: string | undefined,
  options: ValidateOptions
): Promise<void> {
  const featuresPath = options.featuresPath ?? 'features'
  const linter = new Linter()

  // --all or no feature name → validate everything
  if (options.all || !featureName) {
    await validateAll(linter, featuresPath, options)
    return
  }

  // Validate a single feature
  const featureDir = path.resolve(featuresPath, featureName)
  if (!fs.existsSync(featureDir)) {
    console.error(chalk.red(`Feature not found: ${featureDir}`))
    process.exit(3)
  }

  const results = linter.lintFeature(featureDir)
  if (results.length === 0) {
    console.error(chalk.yellow(`No spec files found in ${featureDir}`))
    process.exit(3)
  }

  if (options.json) {
    console.log(JSON.stringify(results, null, 2))
  } else if (!options.quiet) {
    for (const result of results) {
      const rel = path.relative(process.cwd(), result.file)
      console.log(formatLintResult(result, rel))
      console.log()
    }
  }

  const overallReadiness = linter.featureReadiness(results)

  if (options.quiet) {
    console.log(overallReadiness)
  }

  if (overallReadiness === 'incomplete') process.exit(2)
  if (overallReadiness === 'review-needed') process.exit(1)
  process.exit(0)
}

async function validateAll(
  linter: Linter,
  featuresPath: string,
  options: ValidateOptions
): Promise<void> {
  const resolvedPath = path.resolve(featuresPath)

  if (!fs.existsSync(resolvedPath)) {
    console.error(chalk.red(`Features directory not found: ${resolvedPath}`))
    process.exit(3)
  }

  const allResults = linter.lintAll(resolvedPath)

  if (allResults.size === 0) {
    console.log(chalk.yellow('No features found. Create a directory under features/ and add an agent-brief.md.'))
    process.exit(0)
  }

  if (options.json) {
    const out: Record<string, LintResult[]> = {}
    for (const [name, results] of allResults) out[name] = results
    console.log(JSON.stringify(out, null, 2))
  } else {
    const tableRows: Array<Record<string, string>> = []
    let agentReady = 0

    for (const [name, results] of allResults) {
      const readiness = linter.featureReadiness(results)
      const errors = results.flatMap(r => r.diagnostics.filter(d => d.severity === 'error')).length
      const warnings = results.flatMap(r => r.diagnostics.filter(d => d.severity === 'warning')).length
      const issues = errors > 0
        ? chalk.red(`${errors} error${errors !== 1 ? 's' : ''}`) + (warnings > 0 ? `, ${warnings} warning${warnings !== 1 ? 's' : ''}` : '')
        : warnings > 0 ? chalk.yellow(`${warnings} warning${warnings !== 1 ? 's' : ''}`) : chalk.green('—')

      if (readiness === 'agent-ready') agentReady++

      tableRows.push({
        Feature: name,
        Readiness: readinessBadge(readiness),
        Issues: issues,
      })
    }

    printTable(tableRows, ['Feature', 'Readiness', 'Issues'])
    console.log()
    console.log(`${agentReady} of ${allResults.size} feature${allResults.size !== 1 ? 's' : ''} agent-ready.`)
  }

  // Exit code based on worst readiness
  let hasErrors = false
  for (const [, results] of allResults) {
    if (linter.featureReadiness(results) === 'incomplete') { hasErrors = true; break }
  }

  if (hasErrors) process.exit(2)
  process.exit(0)
}
