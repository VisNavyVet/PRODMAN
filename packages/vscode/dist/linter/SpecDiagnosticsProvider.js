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
exports.SpecDiagnosticsProvider = void 0;
const vscode = __importStar(require("vscode"));
const core_1 = require("@prodman/core");
class SpecDiagnosticsProvider {
    constructor() {
        this.linter = new core_1.Linter();
    }
    lint(document) {
        const content = document.getText();
        const lintResult = this.linter.lintContent(document.fileName, content);
        const diagnostics = lintResult.diagnostics.map(d => {
            const line = Math.max(0, d.line);
            const endLine = d.endLine !== undefined ? Math.max(0, d.endLine) : line;
            const range = new vscode.Range(new vscode.Position(line, 0), new vscode.Position(endLine, Number.MAX_SAFE_INTEGER));
            const severity = d.severity === 'error'
                ? vscode.DiagnosticSeverity.Error
                : vscode.DiagnosticSeverity.Warning;
            const diagnostic = new vscode.Diagnostic(range, d.message, severity);
            diagnostic.source = 'ProdMan';
            diagnostic.code = d.rule;
            return diagnostic;
        });
        const totalRules = lintResult.diagnostics.length > 0
            ? this.getTotalRuleCount(lintResult)
            : 11; // AGENT_BRIEF_RULES.length
        const failingRules = new Set(lintResult.diagnostics.map(d => d.rule)).size;
        const rulesPassing = totalRules - failingRules;
        return {
            diagnostics,
            readiness: lintResult.readiness,
            rulesPassing,
            rulesTotal: totalRules,
        };
    }
    getTotalRuleCount(result) {
        // LNT-001 through LNT-011
        const ruleIds = result.diagnostics.map(d => d.rule);
        const maxRule = ruleIds.reduce((max, id) => {
            const n = parseInt(id.replace('LNT-', ''), 10);
            return isNaN(n) ? max : Math.max(max, n);
        }, 11);
        return Math.max(maxRule, 11);
    }
}
exports.SpecDiagnosticsProvider = SpecDiagnosticsProvider;
//# sourceMappingURL=SpecDiagnosticsProvider.js.map