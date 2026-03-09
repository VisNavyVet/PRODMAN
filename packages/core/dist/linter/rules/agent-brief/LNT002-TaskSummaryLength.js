"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LNT002 = void 0;
const MIN_LENGTH = 10;
const MAX_LENGTH = 500;
exports.LNT002 = {
    id: 'LNT-002',
    run(sections) {
        const section = sections.get('task summary');
        if (!section)
            return []; // LNT-001 already flags this
        const text = section.content.trim();
        const len = text.length;
        if (len < MIN_LENGTH) {
            return [{
                    rule: 'LNT-002',
                    severity: 'error',
                    message: `Task Summary is too short (${len} chars). Must be ${MIN_LENGTH}–${MAX_LENGTH} characters.`,
                    line: section.lineStart,
                }];
        }
        if (len > MAX_LENGTH) {
            return [{
                    rule: 'LNT-002',
                    severity: 'error',
                    message: `Task Summary is too long (${len} chars). Must be ${MIN_LENGTH}–${MAX_LENGTH} characters. Trim to 1–2 sentences.`,
                    line: section.lineStart,
                }];
        }
        return [];
    },
};
//# sourceMappingURL=LNT002-TaskSummaryLength.js.map