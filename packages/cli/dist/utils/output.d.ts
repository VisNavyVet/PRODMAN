import type { LintDiagnostic, LintResult, ReadinessState } from '@prodman/core';
export declare function readinessBadge(state: ReadinessState): string;
export declare function formatDiagnostic(d: LintDiagnostic): string;
export declare function formatLintResult(result: LintResult, relativePath?: string): string;
export declare function printTable(rows: Array<Record<string, string>>, columns: string[]): void;
