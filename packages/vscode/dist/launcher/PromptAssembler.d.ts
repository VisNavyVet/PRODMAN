import type { CompiledSpec } from '@prodman/core';
/**
 * Assembles the final agent payload from a compiled spec.
 *
 * The payload is a structured prompt block that an AI agent can consume
 * directly — it includes the full spec JSON plus a context preamble
 * pointing to the product and user context files.
 */
export declare class PromptAssembler {
    static assemble(spec: CompiledSpec): string;
}
