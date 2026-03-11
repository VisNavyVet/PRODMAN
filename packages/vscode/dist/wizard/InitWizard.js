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
exports.InitWizard = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const core_1 = require("@prodman/core");
const TechDetector_1 = require("../detector/TechDetector");
/**
 * Fallback templates used when bundled templates/context/ files cannot be read.
 * Keep in sync with packages/vscode/templates/context/.
 */
const FALLBACK_TEMPLATES = {
    'product.md': `# Product Context

## What We Build


## Positioning


## Core Value Proposition


## Current Stage


## Key Metrics
- Primary:
- Secondary:
- Retention / engagement:


## Tech Stack (brief)

`,
    'users.md': `# User Segments

## Segment 1: [Name]

- **Who they are:**
- **What they're trying to do:**
- **Where they struggle today:**
- **What success looks like for them:**
- **Usage pattern:**
- **Size / importance:**


## Who We're NOT Building For

`,
    'constraints.md': `# Constraints

## Technical Constraints

- **Stack:** [Languages, frameworks, platforms]
- **Infrastructure:** [Cloud provider, hosting environment]
- **Performance:** [Latency, throughput, or size constraints]

## Legal / Compliance


## Organizational Constraints


## Explicit Non-Starters

`,
    'history.md': `# Product History & Decisions

## Features Shipped

| Feature | Date | Outcome | Key Learning |
|---------|------|---------|-------------|

## Things We Tried That Didn't Work

## Active Strategic Bets

1.
2.

## Explicitly Ruled Out

| Idea | Why ruled out | Condition to revisit |
|------|--------------|---------------------|

## Open Strategic Questions

-
`,
};
/**
 * Read a bundled context template from the extension package.
 * Falls back to FALLBACK_TEMPLATES if the file cannot be read.
 */
function readBundledTemplate(extensionUri, filename) {
    try {
        const templateUri = vscode.Uri.joinPath(extensionUri, 'templates', 'context', filename);
        return fs.readFileSync(templateUri.fsPath, 'utf8');
    }
    catch {
        return FALLBACK_TEMPLATES[filename] ?? `# ${filename}\n\n`;
    }
}
/**
 * Inject detected tech stack into a constraints.md template.
 * Handles both the rich (repo) template format and the simple fallback format.
 */
function injectStack(content, stackSummary) {
    if (!stackSummary)
        return content;
    // Handle simple "- **Stack:** [...]" format (fallback template)
    if (content.includes('- **Stack:** [Languages, frameworks, platforms]')) {
        return content.replace('- **Stack:** [Languages, frameworks, platforms]', `- **Stack:** ${stackSummary}`);
    }
    // Handle rich template: inject after ## Technical Constraints heading
    return content.replace(/(##\s+Technical(?:\s+Constraints)?\s*\n)/i, `$1\n- **Stack:** ${stackSummary}\n`);
}
/**
 * Multi-step wizard to initialize a PRODMAN workspace.
 * Generates identical output to /pm-import in the Claude Code CLI.
 * Reads templates from the bundled templates/context/ directory.
 */
class InitWizard {
    static async run(extensionUri) {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceRoot) {
            vscode.window.showErrorMessage('ProdMan: No workspace folder open.');
            return;
        }
        const contextDir = path.join(workspaceRoot, 'prodman-context');
        const featuresDir = path.join(workspaceRoot, 'features');
        // Step 1: confirm
        const confirm = await vscode.window.showInformationMessage('ProdMan will create prodman-context/ with product.md, users.md, constraints.md, and history.md.', { modal: true }, 'Initialize');
        if (confirm !== 'Initialize')
            return;
        // Step 2: create context files — read from bundled templates, pre-fill detected stack
        fs.mkdirSync(contextDir, { recursive: true });
        fs.mkdirSync(featuresDir, { recursive: true });
        const tech = TechDetector_1.TechDetector.detect(workspaceRoot);
        const filenames = ['product.md', 'users.md', 'constraints.md', 'history.md'];
        const created = [];
        for (const filename of filenames) {
            const filePath = path.join(contextDir, filename);
            if (!fs.existsSync(filePath)) {
                let content = readBundledTemplate(extensionUri, filename);
                if (filename === 'constraints.md' && tech.stackSummary) {
                    content = injectStack(content, tech.stackSummary);
                }
                fs.writeFileSync(filePath, content);
                created.push(`prodman-context/${filename}`);
            }
        }
        // Step 3: offer to open product.md for editing
        const openProduct = await vscode.window.showInformationMessage(`ProdMan workspace initialized. Created: ${created.join(', ')}`, 'Open product.md', 'Create first feature brief', 'Done');
        if (openProduct === 'Open product.md') {
            const productUri = vscode.Uri.file(path.join(contextDir, 'product.md'));
            await vscode.window.showTextDocument(productUri);
            return;
        }
        if (openProduct === 'Create first feature brief') {
            await InitWizard.createFeatureBrief(workspaceRoot, featuresDir);
        }
    }
    static async createFeatureBrief(workspaceRoot, featuresDir) {
        const featureName = await vscode.window.showInputBox({
            prompt: 'Feature name (used as folder name)',
            placeHolder: 'e.g. payment-api, user-onboarding, search',
            validateInput: (value) => {
                if (!value.trim())
                    return 'Feature name cannot be empty';
                if (/\s/.test(value))
                    return 'Use kebab-case (no spaces)';
                if (!/^[a-z0-9-]+$/.test(value))
                    return 'Use lowercase letters, numbers, and hyphens only';
                return undefined;
            },
        });
        if (!featureName)
            return;
        const featureDir = path.join(featuresDir, featureName);
        const briefPath = path.join(featureDir, 'agent-brief.md');
        if (fs.existsSync(briefPath)) {
            const overwrite = await vscode.window.showWarningMessage(`features/${featureName}/agent-brief.md already exists. Overwrite?`, { modal: true }, 'Overwrite');
            if (overwrite !== 'Overwrite')
                return;
        }
        fs.mkdirSync(featureDir, { recursive: true });
        const featureTitle = featureName
            .split('-')
            .map(w => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' ');
        let scaffold = core_1.AGENT_BRIEF_SCAFFOLD.replace('# Agent Brief: [Feature Title]', `# Agent Brief: ${featureTitle}`);
        // Pre-fill detected tech values — reduce LNT-012 errors on first open
        const tech = TechDetector_1.TechDetector.detect(workspaceRoot);
        if (tech.repo) {
            scaffold = scaffold.replace(/\*\*Repository:\*\* \[repo name or path\]/, `**Repository:** \`${tech.repo}\``);
        }
        if (tech.stackSummary) {
            scaffold = scaffold.replace(/\*\*Tech stack:\*\* \[Languages, frameworks, relevant versions\]/, `**Tech stack:** ${tech.stackSummary}`);
        }
        fs.writeFileSync(briefPath, scaffold);
        const briefUri = vscode.Uri.file(briefPath);
        await vscode.window.showTextDocument(briefUri);
        const techNote = tech.stackSummary
            ? ` Stack pre-filled: ${tech.stackSummary}.`
            : '';
        vscode.window.showInformationMessage(`ProdMan: features/${featureName}/agent-brief.md created.${techNote} Fill in remaining fields to reach agent-ready.`);
    }
}
exports.InitWizard = InitWizard;
//# sourceMappingURL=InitWizard.js.map