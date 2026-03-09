import * as path from 'path'
import { Compiler, CompileError } from '@prodman/core'
import { formatDiagnostic, readinessBadge } from '../utils/output'
import chalk from 'chalk'

interface CompileOptions {
  featuresPath?: string
  contextPath?: string
  force?: boolean
  json?: boolean
}

export async function compileCommand(
  featureName: string,
  options: CompileOptions
): Promise<void> {
  const compiler = new Compiler({
    featuresPath: options.featuresPath ?? 'features',
    contextPath: options.contextPath ?? 'prodman-context',
  })

  try {
    const result = compiler.compile(featureName, {
      allowIncomplete: options.force ?? false,
    })

    if (options.json) {
      console.log(JSON.stringify(result.spec, null, 2))
      return
    }

    // Print warnings if any
    const warnings = result.lintResult.diagnostics.filter(d => d.severity === 'warning')
    if (warnings.length > 0) {
      console.log(chalk.yellow(`⚠ ${warnings.length} warning${warnings.length !== 1 ? 's' : ''}:`))
      for (const d of warnings) console.log(formatDiagnostic(d))
      console.log()
    }

    const rel = path.relative(process.cwd(), result.outputPath)
    console.log(`${readinessBadge(result.spec.readiness)} — compiled-spec.json written`)
    console.log(chalk.dim(`  → ${rel} (v${result.spec.spec_version})`))

    if (result.spec.readiness === 'review-needed') {
      console.log(chalk.yellow('\nNote: Brief has warnings. Fix them before handing off to an agent.'))
    }
  } catch (err) {
    if (err instanceof CompileError) {
      console.error(chalk.red(`✗ Compile failed: ${err.message}`))
      if (err.diagnostics.length > 0) {
        console.error()
        const errors = err.diagnostics.filter(d => d.severity === 'error')
        for (const d of errors) console.error(formatDiagnostic(d))
        console.error()
        console.error(chalk.dim(`Fix the ${errors.length} error${errors.length !== 1 ? 's' : ''} above, then run prodman compile again.`))
        if (!options.force) {
          console.error(chalk.dim('Use --force to compile anyway (for debugging only).'))
        }
      }
      process.exit(2)
    }
    throw err
  }
}
