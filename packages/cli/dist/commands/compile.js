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
exports.compileCommand = compileCommand;
const path = __importStar(require("path"));
const core_1 = require("@prodman/core");
const output_1 = require("../utils/output");
const chalk_1 = __importDefault(require("chalk"));
async function compileCommand(featureName, options) {
    const compiler = new core_1.Compiler({
        featuresPath: options.featuresPath ?? 'features',
        contextPath: options.contextPath ?? 'prodman-context',
    });
    try {
        const result = compiler.compile(featureName, {
            allowIncomplete: options.force ?? false,
        });
        if (options.json) {
            console.log(JSON.stringify(result.spec, null, 2));
            return;
        }
        // Print warnings if any
        const warnings = result.lintResult.diagnostics.filter(d => d.severity === 'warning');
        if (warnings.length > 0) {
            console.log(chalk_1.default.yellow(`⚠ ${warnings.length} warning${warnings.length !== 1 ? 's' : ''}:`));
            for (const d of warnings)
                console.log((0, output_1.formatDiagnostic)(d));
            console.log();
        }
        const rel = path.relative(process.cwd(), result.outputPath);
        console.log(`${(0, output_1.readinessBadge)(result.spec.readiness)} — compiled-spec.json written`);
        console.log(chalk_1.default.dim(`  → ${rel} (v${result.spec.spec_version})`));
        if (result.spec.readiness === 'review-needed') {
            console.log(chalk_1.default.yellow('\nNote: Brief has warnings. Fix them before handing off to an agent.'));
        }
    }
    catch (err) {
        if (err instanceof core_1.CompileError) {
            console.error(chalk_1.default.red(`✗ Compile failed: ${err.message}`));
            if (err.diagnostics.length > 0) {
                console.error();
                const errors = err.diagnostics.filter(d => d.severity === 'error');
                for (const d of errors)
                    console.error((0, output_1.formatDiagnostic)(d));
                console.error();
                console.error(chalk_1.default.dim(`Fix the ${errors.length} error${errors.length !== 1 ? 's' : ''} above, then run prodman compile again.`));
                if (!options.force) {
                    console.error(chalk_1.default.dim('Use --force to compile anyway (for debugging only).'));
                }
            }
            process.exit(2);
        }
        throw err;
    }
}
//# sourceMappingURL=compile.js.map