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
exports.getNextVersion = getNextVersion;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Read the current spec_version from an existing compiled-spec.json.
 * Returns the next version (current + 1), or 1 if no compiled spec exists.
 */
function getNextVersion(featureDir) {
    const specPath = path.join(featureDir, 'compiled-spec.json');
    if (!fs.existsSync(specPath))
        return 1;
    try {
        const raw = fs.readFileSync(specPath, 'utf8');
        const existing = JSON.parse(raw);
        const current = typeof existing.spec_version === 'number' ? existing.spec_version : 0;
        return current + 1;
    }
    catch {
        return 1;
    }
}
//# sourceMappingURL=VersionManager.js.map