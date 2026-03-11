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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const SpecDiagnosticsProvider_1 = require("./linter/SpecDiagnosticsProvider");
const QuickFixProvider_1 = require("./linter/QuickFixProvider");
const SpecReadinessBar_1 = require("./status/SpecReadinessBar");
const SpecCodeLensProvider_1 = require("./codelens/SpecCodeLensProvider");
const AgentBriefLauncher_1 = require("./launcher/AgentBriefLauncher");
const SpecPreviewPanel_1 = require("./preview/SpecPreviewPanel");
const InitWizard_1 = require("./wizard/InitWizard");
const ContextHealthPanel_1 = require("./panel/ContextHealthPanel");
const SignalInboxPanel_1 = require("./panel/SignalInboxPanel");
const PipelineDashboard_1 = require("./panel/PipelineDashboard");
const AGENT_BRIEF_SELECTOR = {
    scheme: 'file',
    pattern: '**/agent-brief.md',
};
function activate(context) {
    const diagnosticsProvider = new SpecDiagnosticsProvider_1.SpecDiagnosticsProvider();
    const readinessBar = new SpecReadinessBar_1.SpecReadinessBar();
    // --- Linter diagnostics ---
    const diagnosticCollection = vscode.languages.createDiagnosticCollection('prodman');
    context.subscriptions.push(diagnosticCollection);
    function lintDocument(document) {
        if (!isAgentBrief(document))
            return;
        const result = diagnosticsProvider.lint(document);
        diagnosticCollection.set(document.uri, result.diagnostics);
        readinessBar.update(result.readiness, result.rulesPassing, result.rulesTotal);
    }
    // Lint on open and on change
    context.subscriptions.push(vscode.workspace.onDidOpenTextDocument(lintDocument), vscode.workspace.onDidChangeTextDocument(e => lintDocument(e.document)), vscode.workspace.onDidCloseTextDocument(doc => {
        if (isAgentBrief(doc)) {
            diagnosticCollection.delete(doc.uri);
            readinessBar.hide();
        }
    }));
    // Lint all already-open agent-brief documents on activate
    vscode.workspace.textDocuments.forEach(lintDocument);
    // Show/hide readiness bar based on active editor
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        if (editor && isAgentBrief(editor.document)) {
            lintDocument(editor.document);
        }
        else {
            readinessBar.hide();
        }
    }));
    // --- CodeLens ---
    context.subscriptions.push(vscode.languages.registerCodeLensProvider(AGENT_BRIEF_SELECTOR, new SpecCodeLensProvider_1.SpecCodeLensProvider()));
    // --- Quick fixes ---
    context.subscriptions.push(vscode.languages.registerCodeActionsProvider(AGENT_BRIEF_SELECTOR, new QuickFixProvider_1.QuickFixProvider(), { providedCodeActionKinds: [vscode.CodeActionKind.QuickFix] }));
    // --- Sidebar: Context Health ---
    const contextHealthPanel = new ContextHealthPanel_1.ContextHealthPanel();
    context.subscriptions.push(vscode.window.registerTreeDataProvider('prodmanContextHealth', contextHealthPanel));
    // --- Sidebar: Signal Inbox ---
    const signalInboxPanel = new SignalInboxPanel_1.SignalInboxPanel();
    context.subscriptions.push(vscode.window.registerTreeDataProvider('prodmanSignalInbox', signalInboxPanel));
    // --- Sidebar: Pipeline Dashboard ---
    const pipelineDashboard = new PipelineDashboard_1.PipelineDashboard();
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(PipelineDashboard_1.PipelineDashboard.viewType, pipelineDashboard));
    // --- Commands ---
    context.subscriptions.push(vscode.commands.registerCommand('prodman.launchAgent', async () => {
        const doc = activeAgentBriefDocument();
        if (!doc) {
            vscode.window.showErrorMessage('ProdMan: Open an agent-brief.md file first.');
            return;
        }
        await AgentBriefLauncher_1.AgentBriefLauncher.launch(doc);
    }), vscode.commands.registerCommand('prodman.compileSpec', async () => {
        const doc = activeAgentBriefDocument();
        if (!doc) {
            vscode.window.showErrorMessage('ProdMan: Open an agent-brief.md file first.');
            return;
        }
        await AgentBriefLauncher_1.AgentBriefLauncher.compileOnly(doc);
    }), vscode.commands.registerCommand('prodman.previewSpec', async () => {
        const doc = activeAgentBriefDocument();
        if (!doc) {
            vscode.window.showErrorMessage('ProdMan: Open an agent-brief.md file first.');
            return;
        }
        SpecPreviewPanel_1.SpecPreviewPanel.show(context.extensionUri, doc);
    }), vscode.commands.registerCommand('prodman.captureSignal', async () => {
        const signal = await vscode.window.showInputBox({
            prompt: 'Describe the signal (user feedback, problem, opportunity)',
            placeHolder: 'e.g. Users keep asking for bulk export',
        });
        if (!signal)
            return;
        await appendSignal(signal);
        signalInboxPanel.refresh();
    }), vscode.commands.registerCommand('prodman.initWorkspace', async () => {
        await InitWizard_1.InitWizard.run(context.extensionUri);
    }), vscode.commands.registerCommand('prodman.refreshContextHealth', () => {
        contextHealthPanel.refresh();
    }), vscode.commands.registerCommand('prodman.refreshSignalInbox', () => {
        signalInboxPanel.refresh();
    }), vscode.commands.registerCommand('prodman.refreshPipeline', () => {
        pipelineDashboard.refresh();
    }));
    // --- Init Wizard: auto-prompt on startup if no context detected ---
    checkAndPromptInit();
    context.subscriptions.push(readinessBar);
}
function deactivate() {
    // VS Code disposes subscriptions automatically
}
// --- Helpers ---
function isAgentBrief(document) {
    return path.basename(document.fileName) === 'agent-brief.md';
}
function activeAgentBriefDocument() {
    const editor = vscode.window.activeTextEditor;
    if (editor && isAgentBrief(editor.document))
        return editor.document;
    return undefined;
}
async function appendSignal(signal) {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot)
        return;
    const signalsPath = path.join(workspaceRoot, 'prodman-context', 'signals.md');
    const timestamp = new Date().toISOString().split('T')[0];
    const entry = `\n- [${timestamp}] ${signal}\n`;
    if (!fs.existsSync(signalsPath)) {
        fs.mkdirSync(path.dirname(signalsPath), { recursive: true });
        fs.writeFileSync(signalsPath, `# Signals\n${entry}`);
    }
    else {
        fs.appendFileSync(signalsPath, entry);
    }
    vscode.window.showInformationMessage(`ProdMan: Signal captured → prodman-context/signals.md`);
}
function checkAndPromptInit() {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot)
        return;
    const productMd = path.join(workspaceRoot, 'prodman-context', 'product.md');
    const claudeMd = path.join(workspaceRoot, 'CLAUDE.md');
    if (!fs.existsSync(productMd) && !fs.existsSync(claudeMd)) {
        vscode.window
            .showInformationMessage('No PRODMAN workspace detected. Initialize now?', 'Initialize', 'Not now')
            .then(choice => {
            if (choice === 'Initialize') {
                vscode.commands.executeCommand('prodman.initWorkspace');
            }
        });
    }
}
//# sourceMappingURL=extension.js.map