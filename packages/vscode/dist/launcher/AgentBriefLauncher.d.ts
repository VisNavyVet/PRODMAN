import * as vscode from 'vscode';
/**
 * Orchestrates the full launch flow:
 *   Lint → Compile → Assemble payload → Copy to clipboard
 */
export declare class AgentBriefLauncher {
    /**
     * Full launch: lint + compile + assemble + copy.
     * Used by "Run with PRODMAN" CodeLens and command.
     */
    static launch(document: vscode.TextDocument): Promise<void>;
    /**
     * Compile-only: lint + compile, no clipboard.
     * Used by "Validate Spec" CodeLens.
     */
    static compileOnly(document: vscode.TextDocument): Promise<void>;
}
