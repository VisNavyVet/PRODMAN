"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompileError = void 0;
class CompileError extends Error {
    constructor(message, diagnostics) {
        super(message);
        this.diagnostics = diagnostics;
        this.name = 'CompileError';
    }
}
exports.CompileError = CompileError;
//# sourceMappingURL=types.js.map