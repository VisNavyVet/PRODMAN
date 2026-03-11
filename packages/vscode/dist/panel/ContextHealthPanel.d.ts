import * as vscode from 'vscode';
type HealthStatus = 'ok' | 'warning' | 'error' | 'info';
declare class ContextHealthItem extends vscode.TreeItem {
    readonly status: HealthStatus;
    constructor(label: string, status: HealthStatus, filePath: string | undefined, tooltip: string, description?: string);
    private statusDescription;
    private statusIcon;
}
/**
 * TreeDataProvider for the Context Health sidebar view.
 * Shows health of prodman-context/ files and flags stack drift.
 */
export declare class ContextHealthPanel implements vscode.TreeDataProvider<ContextHealthItem> {
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void>;
    refresh(): void;
    getTreeItem(element: ContextHealthItem): vscode.TreeItem;
    getChildren(): ContextHealthItem[];
}
export {};
