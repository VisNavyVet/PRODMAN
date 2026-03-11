export interface DetectedTech {
    /** Package / module name, or workspace folder name as fallback */
    repo: string;
    /** Comma-separated list of detected frameworks with versions, e.g. "React 18, TypeScript 5" */
    stackSummary: string;
}
export declare class TechDetector {
    /**
     * Detect the tech stack and repo name from workspace files.
     * Tries package.json first, then Go, Python, Rust, Java.
     * Falls back to workspace folder name for repo if nothing else is found.
     */
    static detect(workspaceRoot: string): DetectedTech;
    /** Returns true if the workspace has any detectable stack marker */
    static hasDetectableStack(workspaceRoot: string): boolean;
}
