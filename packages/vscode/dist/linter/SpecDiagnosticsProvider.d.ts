import * as vscode from 'vscode';
import type { LintResult } from '@prodman/core';
export interface DiagnosticsResult {
    diagnostics: vscode.Diagnostic[];
    readiness: LintResult['readiness'];
    rulesPassing: number;
    rulesTotal: number;
}
export declare class SpecDiagnosticsProvider {
    private linter;
    lint(document: vscode.TextDocument): DiagnosticsResult;
    private getTotalRuleCount;
}
