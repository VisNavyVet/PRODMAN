"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LNT009 = void 0;
const VAGUE_PHRASES = [
    'works correctly',
    'looks good',
    'is fast',
    'is smooth',
    'feels right',
    'should work',
    'appears correct',
    'is intuitive',
    'handles errors',
    'as expected',
    'properly',
    'correctly',
];
exports.LNT009 = {
    id: 'LNT-009',
    run(sections) {
        const section = sections.get('acceptance criteria');
        if (!section)
            return [];
        const diagnostics = [];
        section.lines.forEach((line, i) => {
            // Only check bullet items
            if (!/^\s*[-*•]/.test(line) && !/^\s*-\s+\[/.test(line))
                return;
            const lower = line.toLowerCase();
            for (const phrase of VAGUE_PHRASES) {
                if (lower.includes(phrase)) {
                    diagnostics.push({
                        rule: 'LNT-009',
                        severity: 'warning',
                        message: `Acceptance Criteria contains vague language: "${phrase}". Use observable, verifiable behaviour instead.`,
                        line: section.lineStart + i + 1,
                    });
                    break; // one diagnostic per line
                }
            }
        });
        return diagnostics;
    },
};
//# sourceMappingURL=LNT009-VagueAC.js.map