interface ValidateOptions {
    all?: boolean;
    json?: boolean;
    quiet?: boolean;
    featuresPath?: string;
}
export declare function validateCommand(featureName: string | undefined, options: ValidateOptions): Promise<void>;
export {};
