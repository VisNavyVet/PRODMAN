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
exports.SpecPreviewPanel = void 0;
const vscode = __importStar(require("vscode"));
const CompilerAdapter_1 = require("../launcher/CompilerAdapter");
/**
 * Webview panel that shows a read-only, syntax-highlighted preview
 * of the compiled spec.json for the active agent-brief.md.
 */
class SpecPreviewPanel {
    constructor(panel, extensionUri, document) {
        this.extensionUri = extensionUri;
        this.document = document;
        this.disposables = [];
        this.panel = panel;
        this.render();
        this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
        // Re-render when the document changes
        vscode.workspace.onDidChangeTextDocument(e => {
            if (e.document === this.document)
                this.render();
        }, null, this.disposables);
    }
    static show(extensionUri, document) {
        if (SpecPreviewPanel.currentPanel) {
            SpecPreviewPanel.currentPanel.document = document;
            SpecPreviewPanel.currentPanel.render();
            SpecPreviewPanel.currentPanel.panel.reveal(vscode.ViewColumn.Beside);
            return;
        }
        const panel = vscode.window.createWebviewPanel('prodmanSpecPreview', 'ProdMan: Spec Preview', vscode.ViewColumn.Beside, { enableScripts: true, retainContextWhenHidden: true });
        SpecPreviewPanel.currentPanel = new SpecPreviewPanel(panel, extensionUri, document);
    }
    render() {
        let specJson;
        let readiness;
        let error;
        try {
            const { spec } = CompilerAdapter_1.CompilerAdapter.compile(this.document);
            specJson = JSON.stringify(spec, null, 2);
            readiness = spec.readiness;
        }
        catch (err) {
            specJson = '';
            readiness = 'incomplete';
            error = err instanceof Error ? err.message : String(err);
        }
        this.panel.webview.html = this.buildHtml(specJson, readiness, error);
    }
    buildHtml(specJson, readiness, error) {
        const escaped = specJson
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
        const readinessColor = readiness === 'agent-ready' ? '#4caf50' :
            readiness === 'review-needed' ? '#ff9800' : '#f44336';
        const readinessLabel = readiness === 'agent-ready' ? '✓ Agent Ready' :
            readiness === 'review-needed' ? '⚠ Review Needed' : '✗ Incomplete';
        const body = error
            ? `<div class="error">${error}</div>`
            : `<pre><code id="spec">${escaped}</code></pre>`;
        return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ProdMan: Spec Preview</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: var(--vscode-editor-font-size, 13px);
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      margin: 0;
      padding: 0;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: var(--vscode-sideBar-background);
      border-bottom: 1px solid var(--vscode-panel-border);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .title { font-weight: 600; font-size: 14px; }
    .badge {
      font-size: 12px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      background: ${readinessColor}22;
      color: ${readinessColor};
      border: 1px solid ${readinessColor};
    }
    button {
      padding: 4px 12px;
      font-size: 12px;
      cursor: pointer;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 4px;
    }
    button:hover { background: var(--vscode-button-hoverBackground); }
    pre {
      margin: 0;
      padding: 16px;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .error {
      padding: 16px;
      color: #f44336;
    }
  </style>
</head>
<body>
  <header>
    <span class="title">compiled spec.json</span>
    <span class="badge">${readinessLabel}</span>
    <button onclick="copyJson()">Copy JSON</button>
  </header>
  ${body}
  <script>
    function copyJson() {
      const code = document.getElementById('spec')
      if (!code) return
      navigator.clipboard.writeText(code.textContent || '').then(() => {
        const btn = document.querySelector('button')
        if (btn) { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy JSON', 1500) }
      })
    }
  </script>
</body>
</html>`;
    }
    dispose() {
        SpecPreviewPanel.currentPanel = undefined;
        this.panel.dispose();
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
    }
}
exports.SpecPreviewPanel = SpecPreviewPanel;
//# sourceMappingURL=SpecPreviewPanel.js.map