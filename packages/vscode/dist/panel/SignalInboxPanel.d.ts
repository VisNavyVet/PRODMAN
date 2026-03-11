import * as vscode from 'vscode';
/**
 * TreeDataProvider for the Signal Inbox sidebar view.
 * Reads prodman-context/signals.md and shows each signal as a tree item.
 * Most recent signals appear first.
 */
export declare class SignalInboxPanel implements vscode.TreeDataProvider<vscode.TreeItem> {
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void>;
    refresh(): void;
    getTreeItem(element: vscode.TreeItem): vscode.TreeItem;
    getChildren(): vscode.TreeItem[];
}
