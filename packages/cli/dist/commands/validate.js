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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCommand = validateCommand;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const core_1 = require("@prodman/core");
const output_1 = require("../utils/output");
const chalk_1 = __importDefault(require("chalk"));
async function validateCommand(featureName, options) {
    const featuresPath = options.featuresPath ?? 'features';
    const linter = new core_1.Linter();
    // --all or no feature name → validate everything
    if (options.all || !featureName) {
        await validateAll(linter, featuresPath, options);
        return;
    }
    // Validate a single feature
    const featureDir = path.resolve(featuresPath, featureName);
    if (!fs.existsSync(featureDir)) {
        console.error(chalk_1.default.red(`Feature not found: ${featureDir}`));
        process.exit(3);
    }
    const results = linter.lintFeature(featureDir);
    if (results.length === 0) {
        console.error(chalk_1.default.yellow(`No spec files found in ${featureDir}`));
        process.exit(3);
    }
    if (options.json) {
        console.log(JSON.stringify(results, null, 2));
    }
    else if (!options.quiet) {
        for (const result of results) {
            const rel = path.relative(process.cwd(), result.file);
            console.log((0, output_1.formatLintResult)(result, rel));
            console.log();
        }
    }
    const overallReadiness = linter.featureReadiness(results);
    if (options.quiet) {
        console.log(overallReadiness);
    }
    if (overallReadiness === 'incomplete')
        process.exit(2);
    if (overallReadiness === 'review-needed')
        process.exit(1);
    process.exit(0);
}
async function validateAll(linter, featuresPath, options) {
    const resolvedPath = path.resolve(featuresPath);
    if (!fs.existsSync(resolvedPath)) {
        console.error(chalk_1.default.red(`Features directory not found: ${resolvedPath}`));
        process.exit(3);
    }
    const allResults = linter.lintAll(resolvedPath);
    if (allResults.size === 0) {
        console.log(chalk_1.default.yellow('No features found. Create a directory under features/ and add an agent-brief.md.'));
        process.exit(0);
    }
    if (options.json) {
        const out = {};
        for (const [name, results] of allResults)
            out[name] = results;
        console.log(JSON.stringify(out, null, 2));
    }
    else {
        const tableRows = [];
        let agentReady = 0;
        for (const [name, results] of allResults) {
            const readiness = linter.featureReadiness(results);
            const errors = results.flatMap(r => r.diagnostics.filter(d => d.severity === 'error')).length;
            const warnings = results.flatMap(r => r.diagnostics.filter(d => d.severity === 'warning')).length;
            const issues = errors > 0
                ? chalk_1.default.red(`${errors} error${errors !== 1 ? 's' : ''}`) + (warnings > 0 ? `, ${warnings} warning${warnings !== 1 ? 's' : ''}` : '')
                : warnings > 0 ? chalk_1.default.yellow(`${warnings} warning${warnings !== 1 ? 's' : ''}`) : chalk_1.default.green('—');
            if (readiness === 'agent-ready')
                agentReady++;
            tableRows.push({
                Feature: name,
                Readiness: (0, output_1.readinessBadge)(readiness),
                Issues: issues,
            });
        }
        (0, output_1.printTable)(tableRows, ['Feature', 'Readiness', 'Issues']);
        console.log();
        console.log(`${agentReady} of ${allResults.size} feature${allResults.size !== 1 ? 's' : ''} agent-ready.`);
    }
    // Exit code based on worst readiness
    let hasErrors = false;
    for (const [, results] of allResults) {
        if (linter.featureReadiness(results) === 'incomplete') {
            hasErrors = true;
            break;
        }
    }
    if (hasErrors)
        process.exit(2);
    process.exit(0);
}
//# sourceMappingURL=validate.js.map