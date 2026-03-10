import type { CompiledSpec } from './types';
import type { LintResult } from '../linter/types';
export interface CompilerOptions {
    /** Path to the features/ directory. Defaults to 'features' */
    featuresPath?: string;
    /** Path to prodman-context/. Defaults to 'prodman-context' */
    contextPath?: string;
    /** Allow compiling even if spec is incomplete (adds --force behaviour) */
    allowIncomplete?: boolean;
}
export interface CompileResult {
    outputPath: string;
    spec: CompiledSpec;
    lintResult: LintResult;
}
export interface CompileToSpecOptions {
    /** Allow compiling even if spec is incomplete */
    allowIncomplete?: boolean;
    /** Override context file refs (useful when running outside of a workspace) */
    contextRefs?: {
        product_md?: string;
        users_md?: string;
        tech_md?: string | null;
        agent_brief_md?: string;
    };
}
export interface CompileToSpecResult {
    spec: CompiledSpec;
    lintResult: LintResult;
}
export declare class Compiler {
    private featuresPath;
    private contextPath;
    constructor(options?: CompilerOptions);
    compile(featureName: string, options?: CompilerOptions): CompileResult;
    /**
     * Compile an agent-brief from an in-memory content string — no filesystem reads or writes.
     * Used by the VS Code extension to compile the active editor document without saving.
     */
    compileToSpec(featureName: string, content: string, options?: CompileToSpecOptions): CompileToSpecResult;
}
//# sourceMappingURL=Compiler.d.ts.map