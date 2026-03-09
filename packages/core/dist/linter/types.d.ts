export interface ParsedSection {
    /** Normalised heading text: lowercase, trimmed, punctuation stripped */
    name: string;
    /** Raw text content beneath the heading (until next same/higher heading) */
    content: string;
    /** Content split by newline */
    lines: string[];
    /** 0-indexed line number of the heading itself */
    lineStart: number;
    /** 0-indexed line number of the last content line */
    lineEnd: number;
}
export interface LintDiagnostic {
    /** Rule ID, e.g. "LNT-001" */
    rule: string;
    severity: 'error' | 'warning';
    message: string;
    /** 0-indexed line number */
    line: number;
    endLine?: number;
}
export type ReadinessState = 'agent-ready' | 'review-needed' | 'incomplete';
export type FileType = 'agent-brief' | 'prd' | 'approach' | 'plan' | 'unknown';
export interface LintResult {
    file: string;
    fileType: FileType;
    diagnostics: LintDiagnostic[];
    readiness: ReadinessState;
}
export interface Rule {
    id: string;
    run(sections: Map<string, ParsedSection>, filePath: string): LintDiagnostic[];
}
//# sourceMappingURL=types.d.ts.map