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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statusCommand = statusCommand;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const core_1 = require("@prodman/core");
const output_1 = require("../utils/output");
const chalk_1 = __importDefault(require("chalk"));
function timeAgo(mtime) {
    const diff = Date.now() - mtime.getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0)
        return 'today';
    if (days === 1)
        return '1 day ago';
    if (days < 30)
        return `${days} days ago`;
    const months = Math.floor(days / 30);
    return `${months} month${months !== 1 ? 's' : ''} ago`;
}
function inferZone(featureDir) {
    const files = fs.existsSync(featureDir) ? fs.readdirSync(featureDir) : [];
    if (files.includes('retro.md'))
        return '5 — Ship & Learn';
    if (files.some(f => f.startsWith('handoff')))
        return '4 — Handover';
    if (files.includes('agent-brief.md'))
        return '2 — Plan';
    if (files.includes('commitment.md'))
        return '1 — Materialise';
    return '0 — Inbox';
}
function lastUpdated(featureDir) {
    if (!fs.existsSync(featureDir))
        return { date: new Date(0), label: 'unknown', isStale: false };
    const files = fs.readdirSync(featureDir)
        .map(f => fs.statSync(path.join(featureDir, f)).mtime);
    const latest = new Date(Math.max(...files.map(d => d.getTime())));
    const isStale = Date.now() - latest.getTime() > 14 * 86400000;
    return { date: latest, label: timeAgo(latest), isStale };
}
function compiledVersion(featureDir) {
    const specPath = path.join(featureDir, 'compiled-spec.json');
    if (!fs.existsSync(specPath))
        return '—';
    try {
        const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
        return `v${spec.spec_version}`;
    }
    catch {
        return '?';
    }
}
async function statusCommand(options) {
    const featuresPath = path.resolve(options.featuresPath ?? 'features');
    if (!fs.existsSync(featuresPath)) {
        console.log(chalk_1.default.yellow('No features/ directory found. Run `prodman init` to set up ProdMan.'));
        return;
    }
    const entries = fs.readdirSync(featuresPath, { withFileTypes: true })
        .filter(e => e.isDirectory());
    if (entries.length === 0) {
        console.log(chalk_1.default.yellow('No features found. Create a directory under features/ and run /pm-ff.'));
        return;
    }
    const linter = new core_1.Linter();
    const statuses = [];
    for (const entry of entries) {
        const featureDir = path.join(featuresPath, entry.name);
        const zone = inferZone(featureDir);
        const { label, isStale } = lastUpdated(featureDir);
        const compiled = compiledVersion(featureDir);
        const briefPath = path.join(featureDir, 'agent-brief.md');
        let readiness = '—';
        if (fs.existsSync(briefPath)) {
            const result = linter.lintFile(briefPath);
            readiness = result.readiness;
        }
        statuses.push({ name: entry.name, zone, readiness, compiled, lastUpdated: label, isStale });
    }
    if (options.json) {
        console.log(JSON.stringify(statuses, null, 2));
        return;
    }
    const rows = statuses.map(s => ({
        Feature: s.name,
        Zone: s.zone,
        Readiness: s.readiness === '—' ? chalk_1.default.dim('—') : (0, output_1.readinessBadge)(s.readiness),
        Compiled: chalk_1.default.dim(s.compiled),
        'Last Updated': s.isStale
            ? chalk_1.default.yellow(s.lastUpdated + ' ⚠ STALE')
            : chalk_1.default.dim(s.lastUpdated),
    }));
    (0, output_1.printTable)(rows, ['Feature', 'Zone', 'Readiness', 'Compiled', 'Last Updated']);
}
//# sourceMappingURL=status.js.map