"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LNT004 = void 0;
const MarkdownSectionParser_1 = require("../../MarkdownSectionParser");
exports.LNT004 = {
    id: 'LNT-004',
    run(sections) {
        const section = sections.get('in scope');
        if (!section)
            return [];
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < 1) {
            return [{
                    rule: 'LNT-004',
                    severity: 'error',
                    message: 'In Scope must contain at least 1 item. List what the agent should build.',
                    line: section.lineStart,
                }];
        }
        return [];
    },
};
//# sourceMappingURL=LNT004-InScope.js.map