#!/usr/bin/env node
import { Command } from 'commander'
import { validateCommand } from './commands/validate'
import { compileCommand } from './commands/compile'
import { statusCommand } from './commands/status'
import { initCommand } from './commands/init'

const pkg = require('../package.json') as { version: string }

const program = new Command()

program
  .name('prodman')
  .description('Validate and compile ProdMan product specs for AI coding agents')
  .version(pkg.version)

// prodman validate [feature]
program
  .command('validate [feature]')
  .description('Lint spec files and show agent-readiness. Omit feature to validate all.')
  .option('-a, --all', 'Validate all features')
  .option('--json', 'Output raw JSON')
  .option('-q, --quiet', 'Only output readiness state (no details)')
  .option('--features-path <path>', 'Path to features directory', 'features')
  .action((feature: string | undefined, options) =>
    validateCommand(feature, options).catch(handleError)
  )

// prodman compile <feature>
program
  .command('compile <feature>')
  .description('Compile agent-brief.md to compiled-spec.json. Blocked if spec is Incomplete.')
  .option('--force', 'Compile even if spec is Incomplete (debugging only)')
  .option('--json', 'Print compiled spec JSON to stdout')
  .option('--features-path <path>', 'Path to features directory', 'features')
  .option('--context-path <path>', 'Path to prodman-context directory', 'prodman-context')
  .action((feature: string, options) =>
    compileCommand(feature, options).catch(handleError)
  )

// prodman status
program
  .command('status')
  .description('Show all features, zones, readiness, and staleness at a glance')
  .option('--json', 'Output raw JSON')
  .option('--features-path <path>', 'Path to features directory', 'features')
  .action((options) =>
    statusCommand(options).catch(handleError)
  )

// prodman init
program
  .command('init')
  .description('Scaffold prodman-context/ and features/ directories')
  .option('--context-path <path>', 'Path to create prodman-context', 'prodman-context')
  .action((options) =>
    initCommand(options).catch(handleError)
  )

function handleError(err: unknown): void {
  if (err instanceof Error) {
    console.error(`\nError: ${err.message}`)
  } else {
    console.error('\nUnknown error:', err)
  }
  process.exit(3)
}

program.parse()
