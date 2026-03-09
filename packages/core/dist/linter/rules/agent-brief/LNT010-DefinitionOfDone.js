"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LNT010 = void 0;
const MarkdownSectionParser_1 = require("../../MarkdownSectionParser");
const MIN_ITEMS = 3;
exports.LNT010 = {
    id: 'LNT-010',
    run(sections) {
        const section = sections.get('definition of done');
        if (!section)
            return [];
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < MIN_ITEMS) {
            return [{
                    rule: 'LNT-010',
                    severity: 'error',
                    message: `Definition of Done must contain at least ${MIN_ITEMS} items (found ${count}). The agent needs to know when to stop.`,
                    line: section.lineStart,
                }];
        }
        return [];
    },
};
//# sourceMappingURL=LNT010-DefinitionOfDone.js.map