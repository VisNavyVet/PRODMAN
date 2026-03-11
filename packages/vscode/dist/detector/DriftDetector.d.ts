export interface DriftResult {
    isDrifted: boolean;
    detectedStack: string;
    recordedStack: string;
    message: string;
}
/**
 * Detects when constraints.md is out of sync with the detected tech stack.
 * Compares TechDetector output against constraints.md content.
 */
export declare class DriftDetector {
    static detect(workspaceRoot: string): DriftResult;
}
