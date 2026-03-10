import * as vscode from 'vscode';
import type { ReadinessState } from '@prodman/core';
export declare class SpecReadinessBar implements vscode.Disposable {
    private statusBarItem;
    constructor();
    update(readiness: ReadinessState, rulesPassing: number, rulesTotal: number): void;
    hide(): void;
    dispose(): void;
}
