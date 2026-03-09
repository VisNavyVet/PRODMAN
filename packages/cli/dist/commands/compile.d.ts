interface CompileOptions {
    featuresPath?: string;
    contextPath?: string;
    force?: boolean;
    json?: boolean;
}
export declare function compileCommand(featureName: string, options: CompileOptions): Promise<void>;
export {};
