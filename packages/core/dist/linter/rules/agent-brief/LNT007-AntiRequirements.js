"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LNT007 = void 0;
const MarkdownSectionParser_1 = require("../../MarkdownSectionParser");
exports.LNT007 = {
    id: 'LNT-007',
    run(sections) {
        const section = sections.get('anti-requirements');
        if (!section)
            return [];
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < 1) {
            return [{
                    rule: 'LNT-007',
                    severity: 'error',
                    message: 'Anti-Requirements (Must NOT do) must contain at least 1 item. Agents need explicit prohibitions.',
                    line: section.lineStart,
                }];
        }
        return [];
    },
};
//# sourceMappingURL=LNT007-AntiRequirements.js.map