"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleEngine = exports.AGENT_BRIEF_RULES = void 0;
const LNT001_RequiredSections_1 = require("./rules/agent-brief/LNT001-RequiredSections");
const LNT002_TaskSummaryLength_1 = require("./rules/agent-brief/LNT002-TaskSummaryLength");
const LNT003_RelevantFiles_1 = require("./rules/agent-brief/LNT003-RelevantFiles");
const LNT004_InScope_1 = require("./rules/agent-brief/LNT004-InScope");
const LNT005_OutOfScope_1 = require("./rules/agent-brief/LNT005-OutOfScope");
const LNT006_Requirements_1 = require("./rules/agent-brief/LNT006-Requirements");
const LNT007_AntiRequirements_1 = require("./rules/agent-brief/LNT007-AntiRequirements");
const LNT008_AcceptanceCriteria_1 = require("./rules/agent-brief/LNT008-AcceptanceCriteria");
const LNT009_VagueAC_1 = require("./rules/agent-brief/LNT009-VagueAC");
const LNT010_DefinitionOfDone_1 = require("./rules/agent-brief/LNT010-DefinitionOfDone");
const LNT011_EscalationTriggers_1 = require("./rules/agent-brief/LNT011-EscalationTriggers");
const LNT012_TechContextFilled_1 = require("./rules/agent-brief/LNT012-TechContextFilled");
/** All rules that apply to agent-brief.md files */
exports.AGENT_BRIEF_RULES = [
    LNT001_RequiredSections_1.LNT001, LNT002_TaskSummaryLength_1.LNT002, LNT003_RelevantFiles_1.LNT003, LNT004_InScope_1.LNT004, LNT005_OutOfScope_1.LNT005,
    LNT006_Requirements_1.LNT006, LNT007_AntiRequirements_1.LNT007, LNT008_AcceptanceCriteria_1.LNT008, LNT009_VagueAC_1.LNT009, LNT010_DefinitionOfDone_1.LNT010, LNT011_EscalationTriggers_1.LNT011,
    LNT012_TechContextFilled_1.LNT012,
];
class RuleEngine {
    constructor(rules) {
        this.rules = rules;
    }
    run(sections, filePath) {
        return this.rules.flatMap(rule => rule.run(sections, filePath));
    }
}
exports.RuleEngine = RuleEngine;
//# sourceMappingURL=RuleEngine.js.map