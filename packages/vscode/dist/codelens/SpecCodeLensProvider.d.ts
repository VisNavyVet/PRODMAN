import * as vscode from 'vscode';
/**
 * Provides CodeLens actions at the top of every agent-brief.md file:
 *   ▶ Run with PRODMAN  |  Validate Spec  |  Preview Spec.json
 */
export declare class SpecCodeLensProvider implements vscode.CodeLensProvider {
    provideCodeLenses(document: vscode.TextDocument): vscode.CodeLens[];
}
