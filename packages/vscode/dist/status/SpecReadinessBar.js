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
exports.SpecReadinessBar = void 0;
const vscode = __importStar(require("vscode"));
const STATE_CONFIG = {
    'agent-ready': {
        icon: '$(check)',
        color: new vscode.ThemeColor('statusBarItem.prominentForeground'),
        tooltip: 'All lint rules pass — spec is ready to send to an AI agent',
    },
    'review-needed': {
        icon: '$(warning)',
        color: new vscode.ThemeColor('statusBarItem.warningForeground'),
        tooltip: 'Spec has warnings — review before sending to an AI agent',
    },
    'incomplete': {
        icon: '$(error)',
        color: new vscode.ThemeColor('statusBarItem.errorForeground'),
        tooltip: 'Spec is incomplete — fix errors before launching agent',
    },
};
class SpecReadinessBar {
    constructor() {
        this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        this.statusBarItem.command = 'prodman.launchAgent';
        this.statusBarItem.name = 'ProdMan Readiness';
    }
    update(readiness, rulesPassing, rulesTotal) {
        const config = STATE_CONFIG[readiness];
        const label = readiness === 'agent-ready'
            ? `PRODMAN ${config.icon} Agent Ready — ${rulesPassing}/${rulesTotal} rules passing`
            : readiness === 'review-needed'
                ? `PRODMAN ${config.icon} Review Needed — ${rulesPassing}/${rulesTotal} rules passing`
                : `PRODMAN ${config.icon} Incomplete — ${rulesPassing}/${rulesTotal} rules passing`;
        this.statusBarItem.text = label;
        this.statusBarItem.color = config.color;
        this.statusBarItem.tooltip = config.tooltip;
        this.statusBarItem.show();
    }
    hide() {
        this.statusBarItem.hide();
    }
    dispose() {
        this.statusBarItem.dispose();
    }
}
exports.SpecReadinessBar = SpecReadinessBar;
//# sourceMappingURL=SpecReadinessBar.js.map