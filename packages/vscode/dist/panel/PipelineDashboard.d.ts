import * as vscode from 'vscode';
/**
 * WebviewViewProvider for the Feature Pipeline sidebar panel.
 * Shows all features/, their zone, and agent-brief readiness.
 */
export declare class PipelineDashboard implements vscode.WebviewViewProvider {
    static readonly viewType = "prodmanPipeline";
    private _view?;
    resolveWebviewView(webviewView: vscode.WebviewView): void;
    refresh(): void;
    private render;
    private getFeatures;
    private readinessBadge;
    private buildHtml;
}
