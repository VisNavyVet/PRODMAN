"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LNT001 = void 0;
const REQUIRED_SECTIONS = [
    'task summary',
    'product context',
    'technical context',
    'in scope',
    'out of scope',
    'requirements',
    'anti-requirements',
    'acceptance criteria',
    'edge cases',
    'constraints',
    'definition of done',
    'escalation triggers',
];
exports.LNT001 = {
    id: 'LNT-001',
    run(sections) {
        const diagnostics = [];
        for (const required of REQUIRED_SECTIONS) {
            const section = sections.get(required);
            if (!section || section.content.trim().length === 0) {
                diagnostics.push({
                    rule: 'LNT-001',
                    severity: 'error',
                    message: `Missing required section: '${required}'. Agent briefs require all 12 sections.`,
                    line: 0,
                });
            }
        }
        return diagnostics;
    },
};
//# sourceMappingURL=LNT001-RequiredSections.js.map