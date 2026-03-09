"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LNT003 = void 0;
exports.LNT003 = {
    id: 'LNT-003',
    run(sections) {
        const section = sections.get('technical context');
        if (!section)
            return []; // LNT-001 handles missing section
        // Look for a "relevant files" sub-section or bullet list containing file paths
        const content = section.content;
        const hasFilePaths = 
        // bullet items with file-like content (contains / or .)
        content.split('\n').some(line => /^\s*[-*•]\s+.+[./].+/.test(line)) ||
            // or a "relevant files" label anywhere in the section
            /relevant\s+files?/i.test(content);
        // Count items that look like file paths
        const fileLines = content.split('\n').filter(line => /^\s*[-*•]\s+.*[./]/.test(line) ||
            /^\s*[-*•]\s+`[^`]+`/.test(line));
        if (!hasFilePaths || fileLines.length === 0) {
            return [{
                    rule: 'LNT-003',
                    severity: 'error',
                    message: 'Technical Context must list at least 1 relevant file or module for the agent to focus on.',
                    line: section.lineStart,
                }];
        }
        return [];
    },
};
//# sourceMappingURL=LNT003-RelevantFiles.js.map