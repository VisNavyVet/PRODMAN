import type { LintDiagnostic, ParsedSection, Rule } from './types'
import { LNT001 } from './rules/agent-brief/LNT001-RequiredSections'
import { LNT002 } from './rules/agent-brief/LNT002-TaskSummaryLength'
import { LNT003 } from './rules/agent-brief/LNT003-RelevantFiles'
import { LNT004 } from './rules/agent-brief/LNT004-InScope'
import { LNT005 } from './rules/agent-brief/LNT005-OutOfScope'
import { LNT006 } from './rules/agent-brief/LNT006-Requirements'
import { LNT007 } from './rules/agent-brief/LNT007-AntiRequirements'
import { LNT008 } from './rules/agent-brief/LNT008-AcceptanceCriteria'
import { LNT009 } from './rules/agent-brief/LNT009-VagueAC'
import { LNT010 } from './rules/agent-brief/LNT010-DefinitionOfDone'
import { LNT011 } from './rules/agent-brief/LNT011-EscalationTriggers'

/** All rules that apply to agent-brief.md files */
export const AGENT_BRIEF_RULES: Rule[] = [
  LNT001, LNT002, LNT003, LNT004, LNT005,
  LNT006, LNT007, LNT008, LNT009, LNT010, LNT011,
]

export class RuleEngine {
  private rules: Rule[]

  constructor(rules: Rule[]) {
    this.rules = rules
  }

  run(sections: Map<string, ParsedSection>, filePath: string): LintDiagnostic[] {
    return this.rules.flatMap(rule => rule.run(sections, filePath))
  }
}
