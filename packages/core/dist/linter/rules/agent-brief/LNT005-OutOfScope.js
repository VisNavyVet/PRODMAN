"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LNT005 = void 0;
const MarkdownSectionParser_1 = require("../../MarkdownSectionParser");
exports.LNT005 = {
    id: 'LNT-005',
    run(sections) {
        const section = sections.get('out of scope');
        if (!section)
            return [];
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < 1) {
            return [{
                    rule: 'LNT-005',
                    severity: 'error',
                    message: 'Out of Scope must contain at least 1 item. Explicit exclusions prevent scope creep.',
                    line: section.lineStart,
                }];
        }
        return [];
    },
};
//# sourceMappingURL=LNT005-OutOfScope.js.map