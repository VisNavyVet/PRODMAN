"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readinessBadge = readinessBadge;
exports.formatDiagnostic = formatDiagnostic;
exports.formatLintResult = formatLintResult;
exports.printTable = printTable;
const chalk_1 = __importDefault(require("chalk"));
function readinessBadge(state) {
    switch (state) {
        case 'agent-ready': return chalk_1.default.green('✓ Agent Ready');
        case 'review-needed': return chalk_1.default.yellow('⚠ Review Needed');
        case 'incomplete': return chalk_1.default.red('✗ Incomplete');
    }
}
function formatDiagnostic(d) {
    const icon = d.severity === 'error' ? chalk_1.default.red('✗') : chalk_1.default.yellow('⚠');
    const rule = chalk_1.default.dim(`[${d.rule}]`);
    const line = d.line > 0 ? chalk_1.default.dim(` Line ${d.line + 1}:`) : '';
    return `  ${icon} ${rule}${line} ${d.message}`;
}
function formatLintResult(result, relativePath) {
    const lines = [];
    const label = relativePath ?? result.file;
    lines.push(chalk_1.default.bold(label));
    if (result.diagnostics.length === 0) {
        lines.push(`  ${chalk_1.default.green('✓')} No issues`);
    }
    else {
        for (const d of result.diagnostics) {
            lines.push(formatDiagnostic(d));
        }
    }
    const errorCount = result.diagnostics.filter(d => d.severity === 'error').length;
    const warnCount = result.diagnostics.filter(d => d.severity === 'warning').length;
    const summary = errorCount > 0
        ? chalk_1.default.red(`${errorCount} error${errorCount !== 1 ? 's' : ''}`) +
            (warnCount > 0 ? chalk_1.default.dim(', ') + chalk_1.default.yellow(`${warnCount} warning${warnCount !== 1 ? 's' : ''}`) : '')
        : warnCount > 0
            ? chalk_1.default.yellow(`${warnCount} warning${warnCount !== 1 ? 's' : ''}`)
            : chalk_1.default.green('clean');
    lines.push(`  Status: ${readinessBadge(result.readiness)} (${summary})`);
    return lines.join('\n');
}
function printTable(rows, columns) {
    const widths = columns.map(col => Math.max(col.length, ...rows.map(r => (r[col] ?? '').length)));
    const header = columns.map((col, i) => col.padEnd(widths[i])).join('  ');
    const separator = widths.map(w => '─'.repeat(w)).join('  ');
    console.log(chalk_1.default.bold(header));
    console.log(chalk_1.default.dim(separator));
    for (const row of rows) {
        console.log(columns.map((col, i) => (row[col] ?? '').padEnd(widths[i])).join('  '));
    }
}
//# sourceMappingURL=output.js.map