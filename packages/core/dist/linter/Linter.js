"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Linter = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const MarkdownSectionParser_1 = require("./MarkdownSectionParser");
const RuleEngine_1 = require("./RuleEngine");
function detectFileType(filePath) {
    const name = path.basename(filePath).toLowerCase();
    if (name.includes('agent-brief'))
        return 'agent-brief';
    if (name === 'prd.md')
        return 'prd';
    if (name === 'approach.md')
        return 'approach';
    if (name === 'plan.md')
        return 'plan';
    return 'unknown';
}
function getRulesForFileType(fileType) {
    switch (fileType) {
        case 'agent-brief': return RuleEngine_1.AGENT_BRIEF_RULES;
        // Future: add prd/approach/plan rules here
        default: return [];
    }
}
function deriveReadiness(diagnostics) {
    if (diagnostics.some(d => d.severity === 'error'))
        return 'incomplete';
    if (diagnostics.some(d => d.severity === 'warning'))
        return 'review-needed';
    return 'agent-ready';
}
class Linter {
    /** Lint a single file given its path and content string. */
    lintContent(filePath, content) {
        const fileType = detectFileType(filePath);
        const rules = getRulesForFileType(fileType);
        if (rules.length === 0) {
            return { file: filePath, fileType, diagnostics: [], readiness: 'agent-ready' };
        }
        const sections = (0, MarkdownSectionParser_1.parseMarkdownSections)(content);
        const diagnostics = new RuleEngine_1.RuleEngine(rules).run(sections, filePath);
        const readiness = deriveReadiness(diagnostics);
        return { file: filePath, fileType, diagnostics, readiness };
    }
    /** Lint a single file from disk. */
    lintFile(filePath) {
        if (!fs.existsSync(filePath)) {
            return {
                file: filePath,
                fileType: 'unknown',
                diagnostics: [{
                        rule: 'PARSE',
                        severity: 'error',
                        message: `File not found: ${filePath}`,
                        line: 0,
                    }],
                readiness: 'incomplete',
            };
        }
        const content = fs.readFileSync(filePath, 'utf8');
        return this.lintContent(filePath, content);
    }
    /** Lint all spec files in a feature directory. Returns one result per file. */
    lintFeature(featurePath) {
        const results = [];
        const specFiles = ['agent-brief.md', 'prd.md', 'approach.md', 'plan.md'];
        for (const filename of specFiles) {
            const fullPath = path.join(featurePath, filename);
            if (fs.existsSync(fullPath)) {
                results.push(this.lintFile(fullPath));
            }
        }
        return results;
    }
    /** Lint all features under a features directory. */
    lintAll(featuresPath) {
        const results = new Map();
        if (!fs.existsSync(featuresPath))
            return results;
        const entries = fs.readdirSync(featuresPath, { withFileTypes: true });
        for (const entry of entries) {
            if (!entry.isDirectory())
                continue;
            const featurePath = path.join(featuresPath, entry.name);
            const featureResults = this.lintFeature(featurePath);
            if (featureResults.length > 0) {
                results.set(entry.name, featureResults);
            }
        }
        return results;
    }
    /** Get overall readiness for a feature (worst readiness across all files). */
    featureReadiness(results) {
        if (results.some(r => r.readiness === 'incomplete'))
            return 'incomplete';
        if (results.some(r => r.readiness === 'review-needed'))
            return 'review-needed';
        return 'agent-ready';
    }
}
exports.Linter = Linter;
//# sourceMappingURL=Linter.js.map