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
exports.ContextHealthPanel = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const DriftDetector_1 = require("../detector/DriftDetector");
class ContextHealthItem extends vscode.TreeItem {
    constructor(label, status, filePath, tooltip, description) {
        super(label, vscode.TreeItemCollapsibleState.None);
        this.status = status;
        this.tooltip = tooltip;
        this.description = description ?? this.statusDescription();
        this.iconPath = this.statusIcon();
        if (filePath) {
            this.command = {
                command: 'vscode.open',
                title: 'Open',
                arguments: [vscode.Uri.file(filePath)],
            };
        }
    }
    statusDescription() {
        switch (this.status) {
            case 'ok': return '✓';
            case 'warning': return '⚠';
            case 'error': return '✗ Missing';
            case 'info': return 'ℹ';
        }
    }
    statusIcon() {
        switch (this.status) {
            case 'ok': return new vscode.ThemeIcon('check', new vscode.ThemeColor('testing.iconPassed'));
            case 'warning': return new vscode.ThemeIcon('warning', new vscode.ThemeColor('testing.iconQueued'));
            case 'error': return new vscode.ThemeIcon('error', new vscode.ThemeColor('testing.iconFailed'));
            case 'info': return new vscode.ThemeIcon('info', new vscode.ThemeColor('notificationsInfoIcon.foreground'));
        }
    }
}
/**
 * TreeDataProvider for the Context Health sidebar view.
 * Shows health of prodman-context/ files and flags stack drift.
 */
class ContextHealthPanel {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceRoot) {
            return [new ContextHealthItem('No workspace open', 'info', undefined, 'Open a folder to see context health')];
        }
        const contextDir = path.join(workspaceRoot, 'prodman-context');
        const items = [];
        // product.md
        const productPath = path.join(contextDir, 'product.md');
        items.push(new ContextHealthItem('product.md', fs.existsSync(productPath) ? 'ok' : 'error', fs.existsSync(productPath) ? productPath : undefined, fs.existsSync(productPath) ? 'Product context — click to edit' : 'Missing — run ProdMan: Initialize Workspace'));
        // users.md
        const usersPath = path.join(contextDir, 'users.md');
        items.push(new ContextHealthItem('users.md', fs.existsSync(usersPath) ? 'ok' : 'error', fs.existsSync(usersPath) ? usersPath : undefined, fs.existsSync(usersPath) ? 'User segments — click to edit' : 'Missing — run ProdMan: Initialize Workspace'));
        // constraints.md — check for drift
        const constraintsPath = path.join(contextDir, 'constraints.md');
        if (fs.existsSync(constraintsPath)) {
            const drift = DriftDetector_1.DriftDetector.detect(workspaceRoot);
            items.push(new ContextHealthItem('constraints.md', drift.isDrifted ? 'warning' : 'ok', constraintsPath, drift.isDrifted ? drift.message : 'Constraints up to date — click to edit', drift.isDrifted ? '⚠ Stack drift' : '✓'));
        }
        else {
            items.push(new ContextHealthItem('constraints.md', 'error', undefined, 'Missing — run ProdMan: Initialize Workspace'));
        }
        // history.md
        const historyPath = path.join(contextDir, 'history.md');
        items.push(new ContextHealthItem('history.md', fs.existsSync(historyPath) ? 'ok' : 'info', fs.existsSync(historyPath) ? historyPath : undefined, fs.existsSync(historyPath)
            ? 'Decision history — grows via /pm-retro'
            : 'Optional — created automatically by /pm-retro'));
        // signals.md
        const signalsPath = path.join(contextDir, 'signals.md');
        if (fs.existsSync(signalsPath)) {
            const content = fs.readFileSync(signalsPath, 'utf8');
            const count = (content.match(/^- \[/gm) ?? []).length;
            items.push(new ContextHealthItem('signals.md', 'info', signalsPath, `${count} signal${count !== 1 ? 's' : ''} captured`, `${count} signal${count !== 1 ? 's' : ''}`));
        }
        return items;
    }
}
exports.ContextHealthPanel = ContextHealthPanel;
//# sourceMappingURL=ContextHealthPanel.js.map