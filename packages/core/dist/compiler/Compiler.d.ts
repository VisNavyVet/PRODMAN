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
export declare class Compiler {
    private featuresPath;
    private contextPath;
    constructor(options?: CompilerOptions);
    compile(featureName: string, options?: CompilerOptions): CompileResult;
}
//# sourceMappingURL=Compiler.d.ts.map