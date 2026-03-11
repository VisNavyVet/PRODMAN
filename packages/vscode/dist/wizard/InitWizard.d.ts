import * as vscode from 'vscode';
/**
 * Multi-step wizard to initialize a PRODMAN workspace.
 * Generates identical output to /pm-import in the Claude Code CLI.
 * Reads templates from the bundled templates/context/ directory.
 */
export declare class InitWizard {
    static run(extensionUri: vscode.Uri): Promise<void>;
    static createFeatureBrief(workspaceRoot: string, featuresDir: string): Promise<void>;
}
