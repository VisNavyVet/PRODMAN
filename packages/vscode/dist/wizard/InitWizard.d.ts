/**
 * Multi-step wizard to initialize a PRODMAN workspace.
 * Generates identical output to /pm-import in the Claude Code CLI.
 */
export declare class InitWizard {
    static run(): Promise<void>;
    static createFeatureBrief(workspaceRoot: string, featuresDir: string): Promise<void>;
}
