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
exports.AgentBriefLauncher = void 0;
const vscode = __importStar(require("vscode"));
const CompilerAdapter_1 = require("./CompilerAdapter");
const PromptAssembler_1 = require("./PromptAssembler");
/**
 * Orchestrates the full launch flow:
 *   Lint → Compile → Assemble payload → Copy to clipboard
 */
class AgentBriefLauncher {
    /**
     * Full launch: lint + compile + assemble + copy.
     * Used by "Run with PRODMAN" CodeLens and command.
     */
    static async launch(document) {
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'ProdMan: Preparing agent payload…',
            cancellable: false,
        }, async () => {
            try {
                const { spec, lintResult } = CompilerAdapter_1.CompilerAdapter.compile(document);
                if (lintResult.readiness === 'incomplete') {
                    const errorCount = lintResult.diagnostics.filter(d => d.severity === 'error').length;
                    const warningCount = lintResult.diagnostics.filter(d => d.severity === 'warning').length;
                    const proceed = await vscode.window.showWarningMessage(`Spec has ${errorCount} error(s) and ${warningCount} warning(s). Launch anyway?`, { modal: true }, 'Launch anyway', 'Fix first');
                    if (proceed !== 'Launch anyway')
                        return;
                }
                const payload = PromptAssembler_1.PromptAssembler.assemble(spec);
                await vscode.env.clipboard.writeText(payload);
                const msg = lintResult.readiness === 'agent-ready'
                    ? `ProdMan ✓ Agent payload copied — spec is agent-ready.`
                    : `ProdMan ⚠ Agent payload copied — ${lintResult.diagnostics.length} issue(s) remain.`;
                vscode.window.showInformationMessage(msg);
            }
            catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                vscode.window.showErrorMessage(`ProdMan: ${message}`);
            }
        });
    }
    /**
     * Compile-only: lint + compile, no clipboard.
     * Used by "Validate Spec" CodeLens.
     */
    static async compileOnly(document) {
        try {
            const { lintResult } = CompilerAdapter_1.CompilerAdapter.compile(document);
            const errors = lintResult.diagnostics.filter(d => d.severity === 'error').length;
            const warnings = lintResult.diagnostics.filter(d => d.severity === 'warning').length;
            if (lintResult.readiness === 'agent-ready') {
                vscode.window.showInformationMessage('ProdMan ✓ Spec is agent-ready — all rules pass.');
            }
            else if (lintResult.readiness === 'review-needed') {
                vscode.window.showWarningMessage(`ProdMan ⚠ Review needed — ${warnings} warning(s). See Problems panel.`);
            }
            else {
                vscode.window.showErrorMessage(`ProdMan ✗ Spec incomplete — ${errors} error(s), ${warnings} warning(s). See Problems panel.`);
            }
        }
        catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            vscode.window.showErrorMessage(`ProdMan: ${message}`);
        }
    }
}
exports.AgentBriefLauncher = AgentBriefLauncher;
//# sourceMappingURL=AgentBriefLauncher.js.map