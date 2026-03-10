import * as vscode from 'vscode';
export declare class QuickFixProvider implements vscode.CodeActionProvider {
    provideCodeActions(document: vscode.TextDocument, _range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext): vscode.CodeAction[];
    private buildFixes;
    private fixMissingSection;
    private fixTaskSummaryLength;
    private fixInsufficientItems;
    private insertSectionAtEnd;
}
