import chalk from 'chalk'
import type { LintDiagnostic, LintResult, ReadinessState } from '@prodman/core'

export function readinessBadge(state: ReadinessState): string {
  switch (state) {
    case 'agent-ready':  return chalk.green('✓ Agent Ready')
    case 'review-needed': return chalk.yellow('⚠ Review Needed')
    case 'incomplete':   return chalk.red('✗ Incomplete')
  }
}

export function formatDiagnostic(d: LintDiagnostic): string {
  const icon = d.severity === 'error' ? chalk.red('✗') : chalk.yellow('⚠')
  const rule = chalk.dim(`[${d.rule}]`)
  const line = d.line > 0 ? chalk.dim(` Line ${d.line + 1}:`) : ''
  return `  ${icon} ${rule}${line} ${d.message}`
}

export function formatLintResult(result: LintResult, relativePath?: string): string {
  const lines: string[] = []
  const label = relativePath ?? result.file
  lines.push(chalk.bold(label))

  if (result.diagnostics.length === 0) {
    lines.push(`  ${chalk.green('✓')} No issues`)
  } else {
    for (const d of result.diagnostics) {
      lines.push(formatDiagnostic(d))
    }
  }

  const errorCount = result.diagnostics.filter(d => d.severity === 'error').length
  const warnCount = result.diagnostics.filter(d => d.severity === 'warning').length
  const summary = errorCount > 0
    ? chalk.red(`${errorCount} error${errorCount !== 1 ? 's' : ''}`) +
      (warnCount > 0 ? chalk.dim(', ') + chalk.yellow(`${warnCount} warning${warnCount !== 1 ? 's' : ''}`) : '')
    : warnCount > 0
      ? chalk.yellow(`${warnCount} warning${warnCount !== 1 ? 's' : ''}`)
      : chalk.green('clean')

  lines.push(`  Status: ${readinessBadge(result.readiness)} (${summary})`)
  return lines.join('\n')
}

export function printTable(
  rows: Array<Record<string, string>>,
  columns: string[]
): void {
  const widths = columns.map(col =>
    Math.max(col.length, ...rows.map(r => (r[col] ?? '').length))
  )

  const header = columns.map((col, i) => col.padEnd(widths[i])).join('  ')
  const separator = widths.map(w => '─'.repeat(w)).join('  ')

  console.log(chalk.bold(header))
  console.log(chalk.dim(separator))
  for (const row of rows) {
    console.log(columns.map((col, i) => (row[col] ?? '').padEnd(widths[i])).join('  '))
  }
}
