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
exports.CompilerAdapter = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const core_1 = require("@prodman/core");
/**
 * Mediates between the VS Code extension and @prodman/core's Compiler.
 * Resolves workspace context paths and compiles from the active document content
 * without requiring a save or filesystem write.
 */
class CompilerAdapter {
    static compile(document) {
        const workspaceRoot = vscode.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath
            ?? path.dirname(document.fileName);
        const featureName = CompilerAdapter.resolveFeatureName(document.fileName, workspaceRoot);
        const content = document.getText();
        const contextPath = path.join(workspaceRoot, 'prodman-context');
        const contextRefs = {
            product_md: path.join(contextPath, 'product.md'),
            users_md: path.join(contextPath, 'users.md'),
            tech_md: fs.existsSync(path.join(contextPath, 'constraints.md'))
                ? path.join(contextPath, 'constraints.md')
                : null,
            agent_brief_md: document.fileName,
        };
        const compiler = new core_1.Compiler();
        return compiler.compileToSpec(featureName, content, {
            allowIncomplete: true, // linter shows diagnostics; we still want to preview partial specs
            contextRefs,
        });
    }
    static resolveFeatureName(filePath, workspaceRoot) {
        // features/[feature-name]/agent-brief.md → feature-name
        const relative = path.relative(workspaceRoot, filePath);
        const parts = relative.split(path.sep);
        if (parts.length >= 3 && parts[0] === 'features') {
            return parts[1];
        }
        return path.basename(path.dirname(filePath));
    }
}
exports.CompilerAdapter = CompilerAdapter;
//# sourceMappingURL=CompilerAdapter.js.map