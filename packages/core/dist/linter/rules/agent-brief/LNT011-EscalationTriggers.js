"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LNT011 = void 0;
const MarkdownSectionParser_1 = require("../../MarkdownSectionParser");
exports.LNT011 = {
    id: 'LNT-011',
    run(sections) {
        const section = sections.get('escalation triggers');
        if (!section || section.content.trim().length === 0) {
            return [{
                    rule: 'LNT-011',
                    severity: 'warning',
                    message: 'No escalation triggers defined. Without them, the agent will make unauthorized decisions when it hits ambiguous situations.',
                    line: 0,
                }];
        }
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < 1) {
            return [{
                    rule: 'LNT-011',
                    severity: 'warning',
                    message: 'Escalation Triggers section exists but has no items. Add at least 1 condition under which the agent must stop and ask.',
                    line: section.lineStart,
                }];
        }
        return [];
    },
};
//# sourceMappingURL=LNT011-EscalationTriggers.js.map