import * as vscode from 'vscode';
/**
 * Webview panel that shows a read-only, syntax-highlighted preview
 * of the compiled spec.json for the active agent-brief.md.
 */
export declare class SpecPreviewPanel {
    private readonly extensionUri;
    private document;
    private static currentPanel;
    private readonly panel;
    private disposables;
    private constructor();
    static show(extensionUri: vscode.Uri, document: vscode.TextDocument): void;
    private render;
    private buildHtml;
    private dispose;
}
