import type { LintDiagnostic, ParsedSection, Rule } from './types';
/** All rules that apply to agent-brief.md files */
export declare const AGENT_BRIEF_RULES: Rule[];
export declare class RuleEngine {
    private rules;
    constructor(rules: Rule[]);
    run(sections: Map<string, ParsedSection>, filePath: string): LintDiagnostic[];
}
//# sourceMappingURL=RuleEngine.d.ts.map