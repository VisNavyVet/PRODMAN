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
exports.Compiler = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const MarkdownSectionParser_1 = require("../linter/MarkdownSectionParser");
const Linter_1 = require("../linter/Linter");
const VersionManager_1 = require("./VersionManager");
const SpecMapper_1 = require("./SpecMapper");
const types_1 = require("./types");
class Compiler {
    constructor(options = {}) {
        this.featuresPath = options.featuresPath ?? 'features';
        this.contextPath = options.contextPath ?? 'prodman-context';
    }
    compile(featureName, options = {}) {
        const allowIncomplete = options.allowIncomplete ?? false;
        const featuresPath = options.featuresPath ?? this.featuresPath;
        const contextPath = options.contextPath ?? this.contextPath;
        const featureDir = path.resolve(featuresPath, featureName);
        const briefPath = path.join(featureDir, 'agent-brief.md');
        // Validate agent-brief.md exists
        if (!fs.existsSync(briefPath)) {
            throw new types_1.CompileError(`agent-brief.md not found in ${featureDir}. Run /pm-ff ${featureName} to generate the spec bundle.`, []);
        }
        // Run linter
        const linter = new Linter_1.Linter();
        const lintResult = linter.lintFile(briefPath);
        if (lintResult.readiness === 'incomplete' && !allowIncomplete) {
            throw new types_1.CompileError(`Spec is incomplete — ${lintResult.diagnostics.filter(d => d.severity === 'error').length} error(s) must be fixed before compiling.`, lintResult.diagnostics);
        }
        // Parse sections
        const content = fs.readFileSync(briefPath, 'utf8');
        const sections = (0, MarkdownSectionParser_1.parseMarkdownSections)(content);
        // Get version
        const specVersion = (0, VersionManager_1.getNextVersion)(featureDir);
        // Resolve context file paths
        const contextRefs = {
            product_md: path.join(contextPath, 'product.md'),
            users_md: path.join(contextPath, 'users.md'),
            tech_md: fs.existsSync(path.join(contextPath, 'tech.md'))
                ? path.join(contextPath, 'tech.md')
                : null,
            agent_brief_md: briefPath,
        };
        // Map to spec
        const spec = (0, SpecMapper_1.mapSectionsToSpec)(sections, {
            featureName,
            specVersion,
            readiness: lintResult.readiness,
            contextRefs,
        });
        // Write output
        const outputPath = path.join(featureDir, 'compiled-spec.json');
        fs.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
        return { outputPath, spec, lintResult };
    }
}
exports.Compiler = Compiler;
//# sourceMappingURL=Compiler.js.map