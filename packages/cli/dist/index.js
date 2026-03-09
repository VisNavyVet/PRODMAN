#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const validate_1 = require("./commands/validate");
const compile_1 = require("./commands/compile");
const status_1 = require("./commands/status");
const init_1 = require("./commands/init");
const pkg = require('../package.json');
const program = new commander_1.Command();
program
    .name('prodman')
    .description('Validate and compile ProdMan product specs for AI coding agents')
    .version(pkg.version);
// prodman validate [feature]
program
    .command('validate [feature]')
    .description('Lint spec files and show agent-readiness. Omit feature to validate all.')
    .option('-a, --all', 'Validate all features')
    .option('--json', 'Output raw JSON')
    .option('-q, --quiet', 'Only output readiness state (no details)')
    .option('--features-path <path>', 'Path to features directory', 'features')
    .action((feature, options) => (0, validate_1.validateCommand)(feature, options).catch(handleError));
// prodman compile <feature>
program
    .command('compile <feature>')
    .description('Compile agent-brief.md to compiled-spec.json. Blocked if spec is Incomplete.')
    .option('--force', 'Compile even if spec is Incomplete (debugging only)')
    .option('--json', 'Print compiled spec JSON to stdout')
    .option('--features-path <path>', 'Path to features directory', 'features')
    .option('--context-path <path>', 'Path to prodman-context directory', 'prodman-context')
    .action((feature, options) => (0, compile_1.compileCommand)(feature, options).catch(handleError));
// prodman status
program
    .command('status')
    .description('Show all features, zones, readiness, and staleness at a glance')
    .option('--json', 'Output raw JSON')
    .option('--features-path <path>', 'Path to features directory', 'features')
    .action((options) => (0, status_1.statusCommand)(options).catch(handleError));
// prodman init
program
    .command('init')
    .description('Scaffold prodman-context/ and features/ directories')
    .option('--context-path <path>', 'Path to create prodman-context', 'prodman-context')
    .action((options) => (0, init_1.initCommand)(options).catch(handleError));
function handleError(err) {
    if (err instanceof Error) {
        console.error(`\nError: ${err.message}`);
    }
    else {
        console.error('\nUnknown error:', err);
    }
    process.exit(3);
}
program.parse();
//# sourceMappingURL=index.js.map