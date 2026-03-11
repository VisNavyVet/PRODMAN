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
exports.TechDetector = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Priority-ordered framework detection: [npm-package-name, display-name]
 * More specific matches (scoped packages) listed before generic ones.
 */
const FRAMEWORK_MAP = [
    ['@angular/core', 'Angular'],
    ['@nestjs/core', 'NestJS'],
    ['@tanstack/react-query', 'TanStack Query'],
    ['@testing-library/react', 'React Testing Library'],
    ['@testing-library/vue', 'Vue Testing Library'],
    ['next', 'Next.js'],
    ['nuxt', 'Nuxt'],
    ['react', 'React'],
    ['vue', 'Vue'],
    ['svelte', 'Svelte'],
    ['@sveltejs/kit', 'SvelteKit'],
    ['typescript', 'TypeScript'],
    ['tailwindcss', 'Tailwind CSS'],
    ['express', 'Express'],
    ['fastify', 'Fastify'],
    ['hono', 'Hono'],
    ['prisma', 'Prisma'],
    ['drizzle-orm', 'Drizzle ORM'],
    ['mongoose', 'Mongoose'],
    ['sequelize', 'Sequelize'],
    ['graphql', 'GraphQL'],
    ['jest', 'Jest'],
    ['vitest', 'Vitest'],
    ['vite', 'Vite'],
    ['zod', 'Zod'],
    ['axios', 'Axios'],
    ['react-query', 'React Query'],
];
/** Strip semver prefix (^, ~, >=) and return major.minor only */
function toMajorMinor(version) {
    const cleaned = version.replace(/^[^0-9]*/, '');
    const parts = cleaned.split('.');
    return parts.length >= 2 ? `${parts[0]}.${parts[1]}` : parts[0] ?? '';
}
function detectFromPackageJson(workspaceRoot) {
    const pkgPath = path.join(workspaceRoot, 'package.json');
    if (!fs.existsSync(pkgPath))
        return {};
    let pkg;
    try {
        pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    }
    catch {
        return {};
    }
    const repo = typeof pkg.name === 'string' && pkg.name ? pkg.name : '';
    const allDeps = {
        ...(pkg.dependencies ?? {}),
        ...(pkg.devDependencies ?? {}),
    };
    const stack = [];
    for (const [pkgName, displayName] of FRAMEWORK_MAP) {
        const version = allDeps[pkgName];
        if (version !== undefined) {
            const v = toMajorMinor(version);
            stack.push(v ? `${displayName} ${v}` : displayName);
        }
    }
    return { repo, stackSummary: stack.join(', ') };
}
function detectFromGoMod(workspaceRoot) {
    const goModPath = path.join(workspaceRoot, 'go.mod');
    if (!fs.existsSync(goModPath))
        return {};
    try {
        const content = fs.readFileSync(goModPath, 'utf8');
        const moduleLine = content.split('\n').find(l => l.startsWith('module '));
        const moduleSegments = moduleLine?.replace('module ', '').trim().split('/');
        const repo = moduleSegments?.[moduleSegments.length - 1] ?? '';
        return { repo, stackSummary: 'Go' };
    }
    catch {
        return { stackSummary: 'Go' };
    }
}
function detectFromPython(workspaceRoot) {
    const hasPython = fs.existsSync(path.join(workspaceRoot, 'requirements.txt')) ||
        fs.existsSync(path.join(workspaceRoot, 'pyproject.toml')) ||
        fs.existsSync(path.join(workspaceRoot, 'setup.py'));
    return hasPython ? { stackSummary: 'Python' } : {};
}
function detectFromRust(workspaceRoot) {
    const cargoPath = path.join(workspaceRoot, 'Cargo.toml');
    if (!fs.existsSync(cargoPath))
        return {};
    try {
        const content = fs.readFileSync(cargoPath, 'utf8');
        const nameLine = content.split('\n').find(l => /^name\s*=/.test(l));
        const repo = nameLine ? nameLine.split('=')[1].trim().replace(/"/g, '') : '';
        return { repo, stackSummary: 'Rust' };
    }
    catch {
        return { stackSummary: 'Rust' };
    }
}
function detectFromJava(workspaceRoot) {
    if (fs.existsSync(path.join(workspaceRoot, 'pom.xml'))) {
        return { stackSummary: 'Java' };
    }
    if (fs.existsSync(path.join(workspaceRoot, 'build.gradle')) ||
        fs.existsSync(path.join(workspaceRoot, 'build.gradle.kts'))) {
        return { stackSummary: 'Kotlin/JVM' };
    }
    return {};
}
class TechDetector {
    /**
     * Detect the tech stack and repo name from workspace files.
     * Tries package.json first, then Go, Python, Rust, Java.
     * Falls back to workspace folder name for repo if nothing else is found.
     */
    static detect(workspaceRoot) {
        const fallbackRepo = path.basename(workspaceRoot);
        const detectors = [
            detectFromPackageJson,
            detectFromGoMod,
            detectFromPython,
            detectFromRust,
            detectFromJava,
        ];
        let repo = '';
        let stackSummary = '';
        for (const detect of detectors) {
            const result = detect(workspaceRoot);
            if (!repo && result.repo)
                repo = result.repo;
            if (!stackSummary && result.stackSummary)
                stackSummary = result.stackSummary;
            if (repo && stackSummary)
                break;
        }
        return {
            repo: repo || fallbackRepo,
            stackSummary,
        };
    }
    /** Returns true if the workspace has any detectable stack marker */
    static hasDetectableStack(workspaceRoot) {
        const markers = [
            'package.json',
            'go.mod',
            'requirements.txt',
            'pyproject.toml',
            'Cargo.toml',
            'pom.xml',
            'build.gradle',
            'build.gradle.kts',
        ];
        return markers.some(m => fs.existsSync(path.join(workspaceRoot, m)));
    }
}
exports.TechDetector = TechDetector;
//# sourceMappingURL=TechDetector.js.map