"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LNT008 = void 0;
const MarkdownSectionParser_1 = require("../../MarkdownSectionParser");
const MIN_ITEMS = 3;
exports.LNT008 = {
    id: 'LNT-008',
    run(sections) {
        const section = sections.get('acceptance criteria');
        if (!section)
            return [];
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < MIN_ITEMS) {
            return [{
                    rule: 'LNT-008',
                    severity: 'error',
                    message: `Acceptance Criteria must contain at least ${MIN_ITEMS} items (found ${count}). Each criterion defines when the task is done.`,
                    line: section.lineStart,
                }];
        }
        return [];
    },
};
//# sourceMappingURL=LNT008-AcceptanceCriteria.js.map