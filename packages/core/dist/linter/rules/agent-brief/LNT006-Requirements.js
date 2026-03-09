"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LNT006 = void 0;
const MarkdownSectionParser_1 = require("../../MarkdownSectionParser");
exports.LNT006 = {
    id: 'LNT-006',
    run(sections) {
        const section = sections.get('requirements');
        if (!section)
            return [];
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < 1) {
            return [{
                    rule: 'LNT-006',
                    severity: 'error',
                    message: 'Requirements (Must implement) must contain at least 1 item.',
                    line: section.lineStart,
                }];
        }
        return [];
    },
};
//# sourceMappingURL=LNT006-Requirements.js.map