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
exports.DriftDetector = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const TechDetector_1 = require("./TechDetector");
/**
 * Detects when constraints.md is out of sync with the detected tech stack.
 * Compares TechDetector output against constraints.md content.
 */
class DriftDetector {
    static detect(workspaceRoot) {
        const constraintsPath = path.join(workspaceRoot, 'prodman-context', 'constraints.md');
        if (!fs.existsSync(constraintsPath)) {
            return {
                isDrifted: false,
                detectedStack: '',
                recordedStack: '',
                message: 'constraints.md not found',
            };
        }
        const detected = TechDetector_1.TechDetector.detect(workspaceRoot);
        const detectedStack = detected.stackSummary;
        if (!detectedStack) {
            return {
                isDrifted: false,
                detectedStack,
                recordedStack: '',
                message: 'No detectable stack in workspace',
            };
        }
        const content = fs.readFileSync(constraintsPath, 'utf8');
        // Strip HTML comments — templates have instructional comments that shouldn't count
        const contentNoComments = content.replace(/<!--[\s\S]*?-->/g, '');
        // Extract the Technical Constraints section for targeted comparison
        const techSectionMatch = contentNoComments.match(/##\s+Technical(?:\s+Constraints)?\s*\n([\s\S]*?)(?=\n##|\s*$)/i);
        const recordedStack = techSectionMatch ? techSectionMatch[1].trim() : contentNoComments.trim();
        // If Technical section is blank or only whitespace, flag as unfilled
        if (!recordedStack || recordedStack.length < 5) {
            return {
                isDrifted: true,
                detectedStack,
                recordedStack,
                message: `Technical Constraints not filled in. Detected stack: ${detectedStack}`,
            };
        }
        // Check if major framework names from detected stack appear in constraints.md
        const detectedFrameworks = detectedStack
            .split(',')
            .map(f => f.trim().split(' ')[0].toLowerCase())
            .filter(Boolean);
        const recordedLower = recordedStack.toLowerCase();
        const missingFrameworks = detectedFrameworks.filter(f => !recordedLower.includes(f));
        if (missingFrameworks.length > 0) {
            return {
                isDrifted: true,
                detectedStack,
                recordedStack,
                message: `Stack drift — ${missingFrameworks.join(', ')} detected but not in constraints.md`,
            };
        }
        return {
            isDrifted: false,
            detectedStack,
            recordedStack,
            message: 'Stack is up to date',
        };
    }
}
exports.DriftDetector = DriftDetector;
//# sourceMappingURL=DriftDetector.js.map