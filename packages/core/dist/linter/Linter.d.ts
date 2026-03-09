import type { LintResult, ReadinessState } from './types';
export declare class Linter {
    /** Lint a single file given its path and content string. */
    lintContent(filePath: string, content: string): LintResult;
    /** Lint a single file from disk. */
    lintFile(filePath: string): LintResult;
    /** Lint all spec files in a feature directory. Returns one result per file. */
    lintFeature(featurePath: string): LintResult[];
    /** Lint all features under a features directory. */
    lintAll(featuresPath: string): Map<string, LintResult[]>;
    /** Get overall readiness for a feature (worst readiness across all files). */
    featureReadiness(results: LintResult[]): ReadinessState;
}
//# sourceMappingURL=Linter.d.ts.map