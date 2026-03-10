import * as vscode from 'vscode';
import type { CompiledSpec, LintResult } from '@prodman/core';
export interface CompileAdapterResult {
    spec: CompiledSpec;
    lintResult: LintResult;
}
/**
 * Mediates between the VS Code extension and @prodman/core's Compiler.
 * Resolves workspace context paths and compiles from the active document content
 * without requiring a save or filesystem write.
 */
export declare class CompilerAdapter {
    static compile(document: vscode.TextDocument): CompileAdapterResult;
    private static resolveFeatureName;
}
