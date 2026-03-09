"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapSectionsToSpec = mapSectionsToSpec;
const MarkdownSectionParser_1 = require("../linter/MarkdownSectionParser");
const SCHEMA = 'https://prodman.dev/schemas/compiled-spec/v1.json';
const VAGUE_PHRASES = [
    'works correctly', 'looks good', 'is fast', 'is smooth',
    'feels right', 'should work', 'appears correct', 'is intuitive',
    'handles errors', 'as expected',
];
function isTestable(statement) {
    const lower = statement.toLowerCase();
    return !VAGUE_PHRASES.some(p => lower.includes(p));
}
function extractProductContext(section) {
    if (!section)
        return { product: '', affected_segment: '' };
    const lines = section.lines;
    let product = '';
    let segment = '';
    for (const line of lines) {
        const prodMatch = line.match(/\*\*product[:\*]*\*+\s*(.+)/i) || line.match(/^[-*]\s*\*?product\*?[:\s]+(.+)/i);
        if (prodMatch) {
            product = prodMatch[1].trim();
            continue;
        }
        const segMatch = line.match(/\*\*affected.+?[:\*]+\*+\s*(.+)/i) || line.match(/^[-*]\s*\*?affected.+?segment\*?[:\s]+(.+)/i);
        if (segMatch) {
            segment = segMatch[1].trim();
            continue;
        }
    }
    // Fallback: first two non-empty lines
    if (!product) {
        const nonEmpty = lines.filter(l => l.trim() && !l.trim().startsWith('#'));
        if (nonEmpty[0])
            product = nonEmpty[0].replace(/^\s*[-*]\s*/, '').trim();
        if (nonEmpty[1])
            segment = nonEmpty[1].replace(/^\s*[-*]\s*/, '').trim();
    }
    return { product, affected_segment: segment };
}
function extractTechContext(section) {
    if (!section)
        return { repo: '', relevant_files: [], stack: [], related_systems: [] };
    const lines = section.lines;
    let repo = '';
    const relevant_files = [];
    const stack = [];
    const related_systems = [];
    let currentLabel = '';
    for (const line of lines) {
        const repoMatch = line.match(/\*\*repository[:\*]*\*+\s*(.+)/i) || line.match(/^[-*]\s*\*?repo(?:sitory)?\*?[:\s]+(.+)/i);
        if (repoMatch) {
            repo = repoMatch[1].replace(/`/g, '').trim();
            continue;
        }
        // Detect label lines
        if (/relevant\s+files/i.test(line)) {
            currentLabel = 'files';
            continue;
        }
        if (/tech\s+stack|stack/i.test(line) && line.trim().startsWith('*')) {
            currentLabel = 'stack';
            continue;
        }
        if (/related\s+systems/i.test(line)) {
            currentLabel = 'systems';
            continue;
        }
        // Collect bullet items under detected label
        const bulletMatch = line.match(/^\s*[-*•]\s+(.+)/);
        if (bulletMatch) {
            const value = bulletMatch[1].replace(/`/g, '').trim();
            if (currentLabel === 'files')
                relevant_files.push(value);
            else if (currentLabel === 'stack')
                stack.push(value);
            else if (currentLabel === 'systems')
                related_systems.push(value);
            else {
                // Heuristic: file paths contain / or .ts .js .py etc.
                if (/[./]/.test(value))
                    relevant_files.push(value);
            }
        }
    }
    return { repo, relevant_files, stack, related_systems };
}
function extractConstraints(section) {
    if (!section)
        return { performance: 'None specified', compliance: 'None specified', accessibility: 'None specified' };
    const content = section.content;
    const getField = (pattern) => {
        const match = content.match(pattern);
        return match ? match[1].trim() : 'None specified';
    };
    return {
        performance: getField(/\*\*performance[:\*]*\*+\s*(.+)/i) !== 'None specified'
            ? getField(/\*\*performance[:\*]*\*+\s*(.+)/i)
            : getField(/performance[:\s]+(.+)/i),
        compliance: getField(/\*\*compliance[:\*]*\*+\s*(.+)/i) !== 'None specified'
            ? getField(/\*\*compliance[:\*]*\*+\s*(.+)/i)
            : getField(/compliance[:\s]+(.+)/i),
        accessibility: getField(/\*\*accessibility[:\*]*\*+\s*(.+)/i) !== 'None specified'
            ? getField(/\*\*accessibility[:\*]*\*+\s*(.+)/i)
            : getField(/accessibility[:\s]+(.+)/i),
    };
}
function extractAcceptanceCriteria(section) {
    if (!section)
        return [];
    const items = (0, MarkdownSectionParser_1.extractBulletItems)(section);
    return items.map((statement, i) => ({
        id: `AC-${String(i + 1).padStart(2, '0')}`,
        statement,
        testable: isTestable(statement),
    }));
}
function extractEdgeCases(section) {
    if (!section)
        return [];
    const rows = (0, MarkdownSectionParser_1.extractTableRows)(section);
    return rows
        .filter(row => row['scenario'] || row['edge case'] || row['scenario / condition'])
        .map(row => ({
        scenario: (row['scenario'] || row['edge case'] || row['scenario / condition'] || '').trim(),
        expected: (row['expected behavior'] || row['expected'] || row['behavior'] || '').trim(),
    }))
        .filter(ec => ec.scenario);
}
function extractUsers(section) {
    if (!section)
        return [];
    // Try to extract from structured "Product context" sub-bullets
    const lines = section.lines;
    const segmentMatch = section.content.match(/affected.+?segment[:\s]+(.+)/i);
    if (segmentMatch) {
        return [{ segment: segmentMatch[1].trim(), description: '' }];
    }
    // Fallback: return empty
    return [];
}
function mapSectionsToSpec(sections, options) {
    const taskSummary = sections.get('task summary');
    const productCtx = sections.get('product context');
    const techCtx = sections.get('technical context');
    const inScope = sections.get('in scope');
    const outOfScope = sections.get('out of scope');
    const requirements = sections.get('requirements');
    const antiReqs = sections.get('anti-requirements');
    const constraints = sections.get('constraints');
    const ac = sections.get('acceptance criteria');
    const edgeCases = sections.get('edge cases');
    const dod = sections.get('definition of done');
    const escalation = sections.get('escalation triggers');
    return {
        $schema: SCHEMA,
        feature: options.featureName,
        spec_version: options.specVersion,
        readiness: options.readiness,
        compiled_at: new Date().toISOString(),
        task_summary: taskSummary?.content.trim() ?? '',
        product_context: extractProductContext(productCtx),
        technical_context: extractTechContext(techCtx),
        problem: '', // enriched from prd.md if available — left empty for basic compile
        users: extractUsers(productCtx),
        in_scope: inScope ? (0, MarkdownSectionParser_1.extractBulletItems)(inScope) : [],
        out_of_scope: outOfScope ? (0, MarkdownSectionParser_1.extractBulletItems)(outOfScope) : [],
        requirements: requirements ? (0, MarkdownSectionParser_1.extractBulletItems)(requirements) : [],
        anti_requirements: antiReqs ? (0, MarkdownSectionParser_1.extractBulletItems)(antiReqs) : [],
        constraints: extractConstraints(constraints),
        acceptance_criteria: extractAcceptanceCriteria(ac),
        edge_cases: extractEdgeCases(edgeCases),
        definition_of_done: dod ? (0, MarkdownSectionParser_1.extractBulletItems)(dod) : [],
        escalation_triggers: escalation ? (0, MarkdownSectionParser_1.extractBulletItems)(escalation) : [],
        context_refs: options.contextRefs,
    };
}
//# sourceMappingURL=SpecMapper.js.map