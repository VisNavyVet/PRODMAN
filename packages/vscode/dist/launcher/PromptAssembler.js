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
exports.PromptAssembler = void 0;
const fs = __importStar(require("fs"));
/**
 * Assembles the final agent payload from a compiled spec.
 *
 * The payload is a structured prompt block that an AI agent can consume
 * directly — it includes the full spec JSON plus a context preamble
 * pointing to the product and user context files.
 */
class PromptAssembler {
    static assemble(spec) {
        const contextBlocks = [];
        // Include product context if the file exists
        if (spec.context_refs.product_md && fs.existsSync(spec.context_refs.product_md)) {
            const productContent = fs.readFileSync(spec.context_refs.product_md, 'utf8').trim();
            contextBlocks.push(`## Product Context\n\n${productContent}`);
        }
        // Include user context if the file exists
        if (spec.context_refs.users_md && fs.existsSync(spec.context_refs.users_md)) {
            const usersContent = fs.readFileSync(spec.context_refs.users_md, 'utf8').trim();
            contextBlocks.push(`## User Context\n\n${usersContent}`);
        }
        const preamble = contextBlocks.length > 0
            ? contextBlocks.join('\n\n') + '\n\n---\n\n'
            : '';
        const specJson = JSON.stringify(spec, null, 2);
        return [
            preamble + '## Agent Brief (Compiled Spec)',
            '',
            '```json',
            specJson,
            '```',
            '',
            '---',
            '',
            `Feature: **${spec.feature}**`,
            `Readiness: **${spec.readiness}**`,
            `Compiled: ${spec.compiled_at}`,
        ].join('\n');
    }
}
exports.PromptAssembler = PromptAssembler;
//# sourceMappingURL=PromptAssembler.js.map