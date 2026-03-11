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
exports.SignalInboxPanel = void 0;
const vscode = __importStar(require("vscode"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class SignalItem extends vscode.TreeItem {
    constructor(date, signal) {
        super(signal, vscode.TreeItemCollapsibleState.None);
        this.date = date;
        this.signal = signal;
        this.description = date;
        this.tooltip = `[${date}] ${signal}`;
        this.iconPath = new vscode.ThemeIcon('lightbulb');
        this.contextValue = 'signal';
    }
}
class EmptyItem extends vscode.TreeItem {
    constructor(message) {
        super(message, vscode.TreeItemCollapsibleState.None);
        this.iconPath = new vscode.ThemeIcon('inbox');
    }
}
/**
 * TreeDataProvider for the Signal Inbox sidebar view.
 * Reads prodman-context/signals.md and shows each signal as a tree item.
 * Most recent signals appear first.
 */
class SignalInboxPanel {
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
            return [new EmptyItem('No workspace open')];
        }
        const signalsPath = path.join(workspaceRoot, 'prodman-context', 'signals.md');
        if (!fs.existsSync(signalsPath)) {
            return [new EmptyItem('No signals yet — use Capture Signal to add one')];
        }
        const content = fs.readFileSync(signalsPath, 'utf8');
        const lines = content.split('\n').filter(l => /^- \[/.test(l));
        if (lines.length === 0) {
            return [new EmptyItem('No signals yet — use Capture Signal to add one')];
        }
        // Most recent first
        return [...lines].reverse().map(line => {
            const match = line.match(/^- \[([^\]]+)\] (.+)/);
            const date = match?.[1] ?? '?';
            const text = match?.[2] ?? line.slice(2);
            return new SignalItem(date, text);
        });
    }
}
exports.SignalInboxPanel = SignalInboxPanel;
//# sourceMappingURL=SignalInboxPanel.js.map