"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../core/dist/linter/MarkdownSectionParser.js
var require_MarkdownSectionParser = __commonJS({
  "../core/dist/linter/MarkdownSectionParser.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.normaliseHeading = normaliseHeading;
    exports2.parseMarkdownSections = parseMarkdownSections;
    exports2.countBulletItems = countBulletItems;
    exports2.extractBulletItems = extractBulletItems;
    exports2.extractTableRows = extractTableRows;
    var SECTION_ALIASES = {
      // agent-brief variants
      "questions the agent should flag": "escalation triggers",
      "questions the agent should flag not solve": "escalation triggers",
      "stop and ask if": "escalation triggers",
      "escalation": "escalation triggers",
      "must implement": "requirements",
      "must not do": "anti-requirements",
      "anti requirements": "anti-requirements",
      "do not": "anti-requirements",
      "task scope": "scope",
      "scope": "scope",
      "edge cases to handle": "edge cases",
      "edge case": "edge cases",
      "product context": "product context",
      "technical context": "technical context",
      "tech context": "technical context",
      "context": "context",
      // acceptance criteria variants
      "ac": "acceptance criteria",
      "criteria": "acceptance criteria",
      // definition of done variants
      "dod": "definition of done",
      "done criteria": "definition of done"
    };
    function normaliseHeading(text) {
      return text.replace(/\s*\(.*?\)\s*/g, " ").replace(/\s*—.*/g, "").toLowerCase().trim().replace(/[^a-z0-9\s\-]/g, "").replace(/\s+/g, " ").trim();
    }
    function resolveAlias(normalised) {
      return SECTION_ALIASES[normalised] ?? normalised;
    }
    function parseMarkdownSections(text) {
      const sections = /* @__PURE__ */ new Map();
      const lines = text.split("\n");
      const headings = [];
      for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(/^(#{1,3})\s+(.+)/);
        if (match) {
          const level = match[1].length;
          const rawName = match[2].trim();
          const normName = resolveAlias(normaliseHeading(rawName));
          headings.push({ level, rawName, normName, lineIndex: i });
        }
      }
      for (let h = 0; h < headings.length; h++) {
        const heading = headings[h];
        const contentStart = heading.lineIndex + 1;
        let contentEnd = lines.length - 1;
        for (let j = h + 1; j < headings.length; j++) {
          if (headings[j].level <= heading.level) {
            contentEnd = headings[j].lineIndex - 1;
            break;
          }
        }
        const contentLines = lines.slice(contentStart, contentEnd + 1);
        const content = contentLines.join("\n").trimEnd();
        const section = {
          name: heading.normName,
          content,
          lines: contentLines,
          lineStart: heading.lineIndex,
          lineEnd: contentEnd
        };
        sections.set(heading.normName, section);
      }
      const scopeSection = sections.get("scope");
      if (scopeSection && !sections.has("in scope") && !sections.has("out of scope")) {
        _extractSubSection(scopeSection, "in scope", sections);
        _extractSubSection(scopeSection, "out of scope", sections);
      }
      const contextSection = sections.get("context");
      if (contextSection) {
        if (!sections.has("product context")) {
          _extractSubSection(contextSection, "product context", sections);
        }
        if (!sections.has("technical context")) {
          _extractSubSection(contextSection, "technical context", sections);
        }
      }
      return sections;
    }
    function _extractSubSection(parent, targetNorm, sections) {
      const lines = parent.lines;
      let startIdx = -1;
      for (let i = 0; i < lines.length; i++) {
        const match = lines[i].match(/^#{2,3}\s+(.+)/);
        if (match) {
          const norm = resolveAlias(normaliseHeading(match[1]));
          if (norm === targetNorm) {
            startIdx = i;
            break;
          }
        }
      }
      if (startIdx === -1)
        return;
      let endIdx = lines.length - 1;
      for (let i = startIdx + 1; i < lines.length; i++) {
        if (lines[i].match(/^#{2,3}\s+/)) {
          endIdx = i - 1;
          break;
        }
      }
      const contentLines = lines.slice(startIdx + 1, endIdx + 1);
      sections.set(targetNorm, {
        name: targetNorm,
        content: contentLines.join("\n").trimEnd(),
        lines: contentLines,
        lineStart: parent.lineStart + startIdx,
        lineEnd: parent.lineStart + endIdx
      });
    }
    function countBulletItems(section) {
      return section.lines.filter((line) => /^\s*[-*•]\s+\S/.test(line) || /^\s*\d+\.\s+\S/.test(line) || /^\s*-\s+\[[ x]\]\s+\S/.test(line)).length;
    }
    function extractBulletItems(section) {
      const items = [];
      for (const line of section.lines) {
        const match = line.match(/^\s*(?:[-*•]|\d+\.)\s+(?:\[[ x]\]\s+)?(.+)/);
        if (match) {
          items.push(match[1].trim());
        }
      }
      return items;
    }
    function extractTableRows(section) {
      const rows = [];
      let headers = [];
      let headerFound = false;
      for (const line of section.lines) {
        if (!line.trim().startsWith("|"))
          continue;
        const cells = line.split("|").slice(1, -1).map((c) => c.trim());
        if (!headerFound) {
          headers = cells.map((h) => h.toLowerCase());
          headerFound = true;
          continue;
        }
        if (cells.every((c) => /^[-:]+$/.test(c)))
          continue;
        const row = {};
        headers.forEach((h, i) => {
          row[h] = cells[i] ?? "";
        });
        rows.push(row);
      }
      return rows;
    }
  }
});

// ../core/dist/linter/rules/agent-brief/LNT001-RequiredSections.js
var require_LNT001_RequiredSections = __commonJS({
  "../core/dist/linter/rules/agent-brief/LNT001-RequiredSections.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LNT001 = void 0;
    var REQUIRED_SECTIONS = [
      "task summary",
      "product context",
      "technical context",
      "in scope",
      "out of scope",
      "requirements",
      "anti-requirements",
      "acceptance criteria",
      "edge cases",
      "constraints",
      "definition of done",
      "escalation triggers"
    ];
    exports2.LNT001 = {
      id: "LNT-001",
      run(sections) {
        const diagnostics = [];
        for (const required of REQUIRED_SECTIONS) {
          const section = sections.get(required);
          if (!section || section.content.trim().length === 0) {
            diagnostics.push({
              rule: "LNT-001",
              severity: "error",
              message: `Missing required section: '${required}'. Agent briefs require all 12 sections.`,
              line: 0
            });
          }
        }
        return diagnostics;
      }
    };
  }
});

// ../core/dist/linter/rules/agent-brief/LNT002-TaskSummaryLength.js
var require_LNT002_TaskSummaryLength = __commonJS({
  "../core/dist/linter/rules/agent-brief/LNT002-TaskSummaryLength.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LNT002 = void 0;
    var MIN_LENGTH = 10;
    var MAX_LENGTH = 500;
    exports2.LNT002 = {
      id: "LNT-002",
      run(sections) {
        const section = sections.get("task summary");
        if (!section)
          return [];
        const text = section.content.trim();
        const len = text.length;
        if (len < MIN_LENGTH) {
          return [{
            rule: "LNT-002",
            severity: "error",
            message: `Task Summary is too short (${len} chars). Must be ${MIN_LENGTH}\u2013${MAX_LENGTH} characters.`,
            line: section.lineStart
          }];
        }
        if (len > MAX_LENGTH) {
          return [{
            rule: "LNT-002",
            severity: "error",
            message: `Task Summary is too long (${len} chars). Must be ${MIN_LENGTH}\u2013${MAX_LENGTH} characters. Trim to 1\u20132 sentences.`,
            line: section.lineStart
          }];
        }
        return [];
      }
    };
  }
});

// ../core/dist/linter/rules/agent-brief/LNT003-RelevantFiles.js
var require_LNT003_RelevantFiles = __commonJS({
  "../core/dist/linter/rules/agent-brief/LNT003-RelevantFiles.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LNT003 = void 0;
    exports2.LNT003 = {
      id: "LNT-003",
      run(sections) {
        const section = sections.get("technical context");
        if (!section)
          return [];
        const content = section.content;
        const hasFilePaths = (
          // bullet items with file-like content (contains / or .)
          content.split("\n").some((line) => /^\s*[-*•]\s+.+[./].+/.test(line)) || // or a "relevant files" label anywhere in the section
          /relevant\s+files?/i.test(content)
        );
        const fileLines = content.split("\n").filter((line) => /^\s*[-*•]\s+.*[./]/.test(line) || /^\s*[-*•]\s+`[^`]+`/.test(line));
        if (!hasFilePaths || fileLines.length === 0) {
          return [{
            rule: "LNT-003",
            severity: "error",
            message: "Technical Context must list at least 1 relevant file or module for the agent to focus on.",
            line: section.lineStart
          }];
        }
        return [];
      }
    };
  }
});

// ../core/dist/linter/rules/agent-brief/LNT004-InScope.js
var require_LNT004_InScope = __commonJS({
  "../core/dist/linter/rules/agent-brief/LNT004-InScope.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LNT004 = void 0;
    var MarkdownSectionParser_1 = require_MarkdownSectionParser();
    exports2.LNT004 = {
      id: "LNT-004",
      run(sections) {
        const section = sections.get("in scope");
        if (!section)
          return [];
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < 1) {
          return [{
            rule: "LNT-004",
            severity: "error",
            message: "In Scope must contain at least 1 item. List what the agent should build.",
            line: section.lineStart
          }];
        }
        return [];
      }
    };
  }
});

// ../core/dist/linter/rules/agent-brief/LNT005-OutOfScope.js
var require_LNT005_OutOfScope = __commonJS({
  "../core/dist/linter/rules/agent-brief/LNT005-OutOfScope.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LNT005 = void 0;
    var MarkdownSectionParser_1 = require_MarkdownSectionParser();
    exports2.LNT005 = {
      id: "LNT-005",
      run(sections) {
        const section = sections.get("out of scope");
        if (!section)
          return [];
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < 1) {
          return [{
            rule: "LNT-005",
            severity: "error",
            message: "Out of Scope must contain at least 1 item. Explicit exclusions prevent scope creep.",
            line: section.lineStart
          }];
        }
        return [];
      }
    };
  }
});

// ../core/dist/linter/rules/agent-brief/LNT006-Requirements.js
var require_LNT006_Requirements = __commonJS({
  "../core/dist/linter/rules/agent-brief/LNT006-Requirements.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LNT006 = void 0;
    var MarkdownSectionParser_1 = require_MarkdownSectionParser();
    exports2.LNT006 = {
      id: "LNT-006",
      run(sections) {
        const section = sections.get("requirements");
        if (!section)
          return [];
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < 1) {
          return [{
            rule: "LNT-006",
            severity: "error",
            message: "Requirements (Must implement) must contain at least 1 item.",
            line: section.lineStart
          }];
        }
        return [];
      }
    };
  }
});

// ../core/dist/linter/rules/agent-brief/LNT007-AntiRequirements.js
var require_LNT007_AntiRequirements = __commonJS({
  "../core/dist/linter/rules/agent-brief/LNT007-AntiRequirements.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LNT007 = void 0;
    var MarkdownSectionParser_1 = require_MarkdownSectionParser();
    exports2.LNT007 = {
      id: "LNT-007",
      run(sections) {
        const section = sections.get("anti-requirements");
        if (!section)
          return [];
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < 1) {
          return [{
            rule: "LNT-007",
            severity: "error",
            message: "Anti-Requirements (Must NOT do) must contain at least 1 item. Agents need explicit prohibitions.",
            line: section.lineStart
          }];
        }
        return [];
      }
    };
  }
});

// ../core/dist/linter/rules/agent-brief/LNT008-AcceptanceCriteria.js
var require_LNT008_AcceptanceCriteria = __commonJS({
  "../core/dist/linter/rules/agent-brief/LNT008-AcceptanceCriteria.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LNT008 = void 0;
    var MarkdownSectionParser_1 = require_MarkdownSectionParser();
    var MIN_ITEMS = 3;
    exports2.LNT008 = {
      id: "LNT-008",
      run(sections) {
        const section = sections.get("acceptance criteria");
        if (!section)
          return [];
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < MIN_ITEMS) {
          return [{
            rule: "LNT-008",
            severity: "error",
            message: `Acceptance Criteria must contain at least ${MIN_ITEMS} items (found ${count}). Each criterion defines when the task is done.`,
            line: section.lineStart
          }];
        }
        return [];
      }
    };
  }
});

// ../core/dist/linter/rules/agent-brief/LNT009-VagueAC.js
var require_LNT009_VagueAC = __commonJS({
  "../core/dist/linter/rules/agent-brief/LNT009-VagueAC.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LNT009 = void 0;
    var VAGUE_PHRASES = [
      "works correctly",
      "looks good",
      "is fast",
      "is smooth",
      "feels right",
      "should work",
      "appears correct",
      "is intuitive",
      "handles errors",
      "as expected",
      "properly",
      "correctly"
    ];
    exports2.LNT009 = {
      id: "LNT-009",
      run(sections) {
        const section = sections.get("acceptance criteria");
        if (!section)
          return [];
        const diagnostics = [];
        section.lines.forEach((line, i) => {
          if (!/^\s*[-*•]/.test(line) && !/^\s*-\s+\[/.test(line))
            return;
          const lower = line.toLowerCase();
          for (const phrase of VAGUE_PHRASES) {
            if (lower.includes(phrase)) {
              diagnostics.push({
                rule: "LNT-009",
                severity: "warning",
                message: `Acceptance Criteria contains vague language: "${phrase}". Use observable, verifiable behaviour instead.`,
                line: section.lineStart + i + 1
              });
              break;
            }
          }
        });
        return diagnostics;
      }
    };
  }
});

// ../core/dist/linter/rules/agent-brief/LNT010-DefinitionOfDone.js
var require_LNT010_DefinitionOfDone = __commonJS({
  "../core/dist/linter/rules/agent-brief/LNT010-DefinitionOfDone.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LNT010 = void 0;
    var MarkdownSectionParser_1 = require_MarkdownSectionParser();
    var MIN_ITEMS = 3;
    exports2.LNT010 = {
      id: "LNT-010",
      run(sections) {
        const section = sections.get("definition of done");
        if (!section)
          return [];
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < MIN_ITEMS) {
          return [{
            rule: "LNT-010",
            severity: "error",
            message: `Definition of Done must contain at least ${MIN_ITEMS} items (found ${count}). The agent needs to know when to stop.`,
            line: section.lineStart
          }];
        }
        return [];
      }
    };
  }
});

// ../core/dist/linter/rules/agent-brief/LNT011-EscalationTriggers.js
var require_LNT011_EscalationTriggers = __commonJS({
  "../core/dist/linter/rules/agent-brief/LNT011-EscalationTriggers.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LNT011 = void 0;
    var MarkdownSectionParser_1 = require_MarkdownSectionParser();
    exports2.LNT011 = {
      id: "LNT-011",
      run(sections) {
        const section = sections.get("escalation triggers");
        if (!section || section.content.trim().length === 0) {
          return [{
            rule: "LNT-011",
            severity: "warning",
            message: "No escalation triggers defined. Without them, the agent will make unauthorized decisions when it hits ambiguous situations.",
            line: 0
          }];
        }
        const count = (0, MarkdownSectionParser_1.countBulletItems)(section);
        if (count < 1) {
          return [{
            rule: "LNT-011",
            severity: "warning",
            message: "Escalation Triggers section exists but has no items. Add at least 1 condition under which the agent must stop and ask.",
            line: section.lineStart
          }];
        }
        return [];
      }
    };
  }
});

// ../core/dist/linter/rules/agent-brief/LNT012-TechContextFilled.js
var require_LNT012_TechContextFilled = __commonJS({
  "../core/dist/linter/rules/agent-brief/LNT012-TechContextFilled.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.LNT012 = void 0;
    var LABELED_PLACEHOLDER2 = /\*\*[^:*]+:\*\*\s*\[[^\]]{3,}\]\s*$/;
    var BARE_PLACEHOLDER = /^\s*[-*•]\s+\[[^\]]{5,}\]\s*$/;
    function isUnfilledPlaceholder(line) {
      if (/^\s*[-*•]\s+\[[ xX]\]/.test(line))
        return false;
      return LABELED_PLACEHOLDER2.test(line) || BARE_PLACEHOLDER.test(line);
    }
    exports2.LNT012 = {
      id: "LNT-012",
      run(sections) {
        const section = sections.get("technical context");
        if (!section)
          return [];
        const placeholderLines = section.lines.map((line, idx) => ({ line, lineNum: section.lineStart + 1 + idx })).filter(({ line }) => isUnfilledPlaceholder(line));
        if (placeholderLines.length === 0)
          return [];
        const first = placeholderLines[0];
        return [{
          rule: "LNT-012",
          severity: "error",
          message: "Technical Context contains unfilled placeholder text. Fill in repository, relevant files, tech stack, and related systems before handing to an agent.",
          line: first.lineNum,
          endLine: first.lineNum
        }];
      }
    };
  }
});

// ../core/dist/linter/RuleEngine.js
var require_RuleEngine = __commonJS({
  "../core/dist/linter/RuleEngine.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.RuleEngine = exports2.AGENT_BRIEF_RULES = void 0;
    var LNT001_RequiredSections_1 = require_LNT001_RequiredSections();
    var LNT002_TaskSummaryLength_1 = require_LNT002_TaskSummaryLength();
    var LNT003_RelevantFiles_1 = require_LNT003_RelevantFiles();
    var LNT004_InScope_1 = require_LNT004_InScope();
    var LNT005_OutOfScope_1 = require_LNT005_OutOfScope();
    var LNT006_Requirements_1 = require_LNT006_Requirements();
    var LNT007_AntiRequirements_1 = require_LNT007_AntiRequirements();
    var LNT008_AcceptanceCriteria_1 = require_LNT008_AcceptanceCriteria();
    var LNT009_VagueAC_1 = require_LNT009_VagueAC();
    var LNT010_DefinitionOfDone_1 = require_LNT010_DefinitionOfDone();
    var LNT011_EscalationTriggers_1 = require_LNT011_EscalationTriggers();
    var LNT012_TechContextFilled_1 = require_LNT012_TechContextFilled();
    exports2.AGENT_BRIEF_RULES = [
      LNT001_RequiredSections_1.LNT001,
      LNT002_TaskSummaryLength_1.LNT002,
      LNT003_RelevantFiles_1.LNT003,
      LNT004_InScope_1.LNT004,
      LNT005_OutOfScope_1.LNT005,
      LNT006_Requirements_1.LNT006,
      LNT007_AntiRequirements_1.LNT007,
      LNT008_AcceptanceCriteria_1.LNT008,
      LNT009_VagueAC_1.LNT009,
      LNT010_DefinitionOfDone_1.LNT010,
      LNT011_EscalationTriggers_1.LNT011,
      LNT012_TechContextFilled_1.LNT012
    ];
    var RuleEngine = class {
      constructor(rules) {
        this.rules = rules;
      }
      run(sections, filePath) {
        return this.rules.flatMap((rule) => rule.run(sections, filePath));
      }
    };
    exports2.RuleEngine = RuleEngine;
  }
});

// ../core/dist/linter/Linter.js
var require_Linter = __commonJS({
  "../core/dist/linter/Linter.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Linter = void 0;
    var fs10 = __importStar(require("fs"));
    var path10 = __importStar(require("path"));
    var MarkdownSectionParser_1 = require_MarkdownSectionParser();
    var RuleEngine_1 = require_RuleEngine();
    function detectFileType(filePath) {
      const name = path10.basename(filePath).toLowerCase();
      if (name.includes("agent-brief"))
        return "agent-brief";
      if (name === "prd.md")
        return "prd";
      if (name === "approach.md")
        return "approach";
      if (name === "plan.md")
        return "plan";
      return "unknown";
    }
    function getRulesForFileType(fileType) {
      switch (fileType) {
        case "agent-brief":
          return RuleEngine_1.AGENT_BRIEF_RULES;
        // Future: add prd/approach/plan rules here
        default:
          return [];
      }
    }
    function deriveReadiness(diagnostics) {
      if (diagnostics.some((d) => d.severity === "error"))
        return "incomplete";
      if (diagnostics.some((d) => d.severity === "warning"))
        return "review-needed";
      return "agent-ready";
    }
    var Linter3 = class {
      /** Lint a single file given its path and content string. */
      lintContent(filePath, content) {
        const fileType = detectFileType(filePath);
        const rules = getRulesForFileType(fileType);
        if (rules.length === 0) {
          return { file: filePath, fileType, diagnostics: [], readiness: "agent-ready" };
        }
        const sections = (0, MarkdownSectionParser_1.parseMarkdownSections)(content);
        const diagnostics = new RuleEngine_1.RuleEngine(rules).run(sections, filePath);
        const readiness = deriveReadiness(diagnostics);
        return { file: filePath, fileType, diagnostics, readiness };
      }
      /** Lint a single file from disk. */
      lintFile(filePath) {
        if (!fs10.existsSync(filePath)) {
          return {
            file: filePath,
            fileType: "unknown",
            diagnostics: [{
              rule: "PARSE",
              severity: "error",
              message: `File not found: ${filePath}`,
              line: 0
            }],
            readiness: "incomplete"
          };
        }
        const content = fs10.readFileSync(filePath, "utf8");
        return this.lintContent(filePath, content);
      }
      /** Lint all spec files in a feature directory. Returns one result per file. */
      lintFeature(featurePath) {
        const results = [];
        const specFiles = ["agent-brief.md", "prd.md", "approach.md", "plan.md"];
        for (const filename of specFiles) {
          const fullPath = path10.join(featurePath, filename);
          if (fs10.existsSync(fullPath)) {
            results.push(this.lintFile(fullPath));
          }
        }
        return results;
      }
      /** Lint all features under a features directory. */
      lintAll(featuresPath) {
        const results = /* @__PURE__ */ new Map();
        if (!fs10.existsSync(featuresPath))
          return results;
        const entries = fs10.readdirSync(featuresPath, { withFileTypes: true });
        for (const entry of entries) {
          if (!entry.isDirectory())
            continue;
          const featurePath = path10.join(featuresPath, entry.name);
          const featureResults = this.lintFeature(featurePath);
          if (featureResults.length > 0) {
            results.set(entry.name, featureResults);
          }
        }
        return results;
      }
      /** Get overall readiness for a feature (worst readiness across all files). */
      featureReadiness(results) {
        if (results.some((r) => r.readiness === "incomplete"))
          return "incomplete";
        if (results.some((r) => r.readiness === "review-needed"))
          return "review-needed";
        return "agent-ready";
      }
    };
    exports2.Linter = Linter3;
  }
});

// ../core/dist/linter/SectionTemplates.js
var require_SectionTemplates = __commonJS({
  "../core/dist/linter/SectionTemplates.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.AGENT_BRIEF_SCAFFOLD = exports2.SECTION_TEMPLATES = void 0;
    exports2.SECTION_TEMPLATES = {
      "task summary": {
        name: "task summary",
        heading: "## Task Summary",
        body: "One sentence describing what this feature does and why.",
        description: "Single-sentence description of what to build and why"
      },
      "product context": {
        name: "product context",
        heading: "## Product Context",
        body: [
          "- **Product:** [Your product name]",
          "- **Affected segment:** [Primary user segment]"
        ].join("\n"),
        description: "Product name and affected user segment"
      },
      "technical context": {
        name: "technical context",
        heading: "## Technical Context",
        body: [
          "- **Repository:** [repo-name]",
          "- **Relevant files:**",
          "  - `path/to/relevant/file.ts`",
          "- **Tech stack:**",
          "  - [Framework or language]",
          "- **Related systems:**",
          "  - [Service or API name, or None]"
        ].join("\n"),
        description: "Repo, relevant files, stack, and related systems"
      },
      "in scope": {
        name: "in scope",
        heading: "### In Scope",
        body: "- [What this feature covers]",
        description: "What is explicitly included in this feature"
      },
      "out of scope": {
        name: "out of scope",
        heading: "### Out of Scope",
        body: "- [What is explicitly excluded from this feature]",
        description: "What the agent must not build"
      },
      "scope": {
        name: "scope",
        heading: "## Scope",
        body: [
          "### In Scope",
          "",
          "- [What this feature covers]",
          "",
          "### Out of Scope",
          "",
          "- [What is explicitly excluded from this feature]"
        ].join("\n"),
        description: "In scope and out of scope boundaries"
      },
      "requirements": {
        name: "requirements",
        heading: "## Requirements",
        body: "- [Functional requirement \u2014 what the agent must implement]",
        description: "Functional requirements the agent must implement"
      },
      "anti-requirements": {
        name: "anti-requirements",
        heading: "## Anti-Requirements",
        body: "- [What the agent must not do or introduce]",
        description: "Behaviours and patterns the agent must avoid"
      },
      "constraints": {
        name: "constraints",
        heading: "## Constraints",
        body: [
          "- **Performance:** None specified",
          "- **Compliance:** None specified",
          "- **Accessibility:** None specified"
        ].join("\n"),
        description: "Performance, compliance, and accessibility constraints"
      },
      "acceptance criteria": {
        name: "acceptance criteria",
        heading: "## Acceptance Criteria",
        body: [
          "- [ ] User can [specific, observable action]",
          "- [ ] System [specific, verifiable response]",
          "- [ ] [Edge case scenario] is handled correctly"
        ].join("\n"),
        description: "Testable pass/fail criteria (minimum 3)"
      },
      "edge cases": {
        name: "edge cases",
        heading: "## Edge Cases",
        body: [
          "| Scenario / Condition | Expected Behavior |",
          "|----------------------|-------------------|",
          "| [Describe edge case] | [What should happen] |"
        ].join("\n"),
        description: "Edge cases the agent should handle"
      },
      "definition of done": {
        name: "definition of done",
        heading: "## Definition of Done",
        body: [
          "- [ ] All acceptance criteria pass",
          "- [ ] Unit tests written and passing",
          "- [ ] No lint errors or type errors"
        ].join("\n"),
        description: "Completion checklist (minimum 3 items)"
      },
      "escalation triggers": {
        name: "escalation triggers",
        heading: "## Escalation Triggers",
        body: "- [Question or ambiguity the agent must raise before proceeding]",
        description: "Questions the agent should ask, not answer"
      }
    };
    exports2.AGENT_BRIEF_SCAFFOLD = `# Agent Brief: [Feature Title]

## Task Summary

One sentence describing what this feature does and why.

## Product Context

- **Product:** [Your product name]
- **Affected segment:** [Primary user segment]

## Technical Context

- **Repository:** [repo-name]
- **Relevant files:**
  - \`path/to/relevant/file.ts\`
- **Tech stack:**
  - [Framework or language]
- **Related systems:**
  - [Service or API name, or None]

## Scope

### In Scope

- [What this feature covers]

### Out of Scope

- [What is explicitly excluded from this feature]

## Requirements

- [Functional requirement \u2014 what the agent must implement]

## Anti-Requirements

- [What the agent must not do or introduce]

## Constraints

- **Performance:** None specified
- **Compliance:** None specified
- **Accessibility:** None specified

## Acceptance Criteria

- [ ] User can [specific, observable action]
- [ ] System [specific, verifiable response]
- [ ] [Edge case scenario] is handled correctly

## Edge Cases

| Scenario / Condition | Expected Behavior |
|----------------------|-------------------|
| [Describe edge case] | [What should happen] |

## Definition of Done

- [ ] All acceptance criteria pass
- [ ] Unit tests written and passing
- [ ] No lint errors or type errors

## Escalation Triggers

- [Question or ambiguity the agent must raise before proceeding]
`;
  }
});

// ../core/dist/compiler/VersionManager.js
var require_VersionManager = __commonJS({
  "../core/dist/compiler/VersionManager.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.getNextVersion = getNextVersion;
    var fs10 = __importStar(require("fs"));
    var path10 = __importStar(require("path"));
    function getNextVersion(featureDir) {
      const specPath = path10.join(featureDir, "compiled-spec.json");
      if (!fs10.existsSync(specPath))
        return 1;
      try {
        const raw = fs10.readFileSync(specPath, "utf8");
        const existing = JSON.parse(raw);
        const current = typeof existing.spec_version === "number" ? existing.spec_version : 0;
        return current + 1;
      } catch {
        return 1;
      }
    }
  }
});

// ../core/dist/compiler/SpecMapper.js
var require_SpecMapper = __commonJS({
  "../core/dist/compiler/SpecMapper.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.mapSectionsToSpec = mapSectionsToSpec;
    var MarkdownSectionParser_1 = require_MarkdownSectionParser();
    var SCHEMA = "https://prodman.dev/schemas/compiled-spec/v1.json";
    var VAGUE_PHRASES = [
      "works correctly",
      "looks good",
      "is fast",
      "is smooth",
      "feels right",
      "should work",
      "appears correct",
      "is intuitive",
      "handles errors",
      "as expected"
    ];
    function isTestable(statement) {
      const lower = statement.toLowerCase();
      return !VAGUE_PHRASES.some((p) => lower.includes(p));
    }
    function extractProductContext(section) {
      if (!section)
        return { product: "", affected_segment: "" };
      const lines = section.lines;
      let product = "";
      let segment = "";
      for (const line of lines) {
        const prodMatch = line.match(/\*\*product[:\*]*\*+\s*(.+)/i) || line.match(/^[-*]\s*\*?product\*?[:\s]+(.+)/i);
        if (prodMatch) {
          product = prodMatch[1].trim();
          continue;
        }
        const segMatch = line.match(/\*\*affected.+?[:\*]+\*+\s*(.+)/i) || line.match(/^[-*]\s*\*?affected.+?segment\*?[:\s]+(.+)/i);
        if (segMatch) {
          segment = segMatch[1].trim();
          continue;
        }
      }
      if (!product) {
        const nonEmpty = lines.filter((l) => l.trim() && !l.trim().startsWith("#"));
        if (nonEmpty[0])
          product = nonEmpty[0].replace(/^\s*[-*]\s*/, "").trim();
        if (nonEmpty[1])
          segment = nonEmpty[1].replace(/^\s*[-*]\s*/, "").trim();
      }
      return { product, affected_segment: segment };
    }
    function extractTechContext(section) {
      if (!section)
        return { repo: "", relevant_files: [], stack: [], related_systems: [] };
      const lines = section.lines;
      let repo = "";
      const relevant_files = [];
      const stack = [];
      const related_systems = [];
      let currentLabel = "";
      for (const line of lines) {
        const repoMatch = line.match(/\*\*repository[:\*]*\*+\s*(.+)/i) || line.match(/^[-*]\s*\*?repo(?:sitory)?\*?[:\s]+(.+)/i);
        if (repoMatch) {
          repo = repoMatch[1].replace(/`/g, "").trim();
          continue;
        }
        if (/relevant\s+files/i.test(line)) {
          currentLabel = "files";
          continue;
        }
        if (/tech\s+stack|stack/i.test(line) && line.trim().startsWith("*")) {
          currentLabel = "stack";
          continue;
        }
        if (/related\s+systems/i.test(line)) {
          currentLabel = "systems";
          continue;
        }
        const bulletMatch = line.match(/^\s*[-*•]\s+(.+)/);
        if (bulletMatch) {
          const value = bulletMatch[1].replace(/`/g, "").trim();
          if (currentLabel === "files")
            relevant_files.push(value);
          else if (currentLabel === "stack")
            stack.push(value);
          else if (currentLabel === "systems")
            related_systems.push(value);
          else {
            if (/[./]/.test(value))
              relevant_files.push(value);
          }
        }
      }
      return { repo, relevant_files, stack, related_systems };
    }
    function extractConstraints(section) {
      if (!section)
        return { performance: "None specified", compliance: "None specified", accessibility: "None specified" };
      const content = section.content;
      const getField = (pattern) => {
        const match = content.match(pattern);
        return match ? match[1].trim() : "None specified";
      };
      return {
        performance: getField(/\*\*performance[:\*]*\*+\s*(.+)/i) !== "None specified" ? getField(/\*\*performance[:\*]*\*+\s*(.+)/i) : getField(/performance[:\s]+(.+)/i),
        compliance: getField(/\*\*compliance[:\*]*\*+\s*(.+)/i) !== "None specified" ? getField(/\*\*compliance[:\*]*\*+\s*(.+)/i) : getField(/compliance[:\s]+(.+)/i),
        accessibility: getField(/\*\*accessibility[:\*]*\*+\s*(.+)/i) !== "None specified" ? getField(/\*\*accessibility[:\*]*\*+\s*(.+)/i) : getField(/accessibility[:\s]+(.+)/i)
      };
    }
    function extractAcceptanceCriteria(section) {
      if (!section)
        return [];
      const items = (0, MarkdownSectionParser_1.extractBulletItems)(section);
      return items.map((statement, i) => ({
        id: `AC-${String(i + 1).padStart(2, "0")}`,
        statement,
        testable: isTestable(statement)
      }));
    }
    function extractEdgeCases(section) {
      if (!section)
        return [];
      const rows = (0, MarkdownSectionParser_1.extractTableRows)(section);
      return rows.filter((row) => row["scenario"] || row["edge case"] || row["scenario / condition"]).map((row) => ({
        scenario: (row["scenario"] || row["edge case"] || row["scenario / condition"] || "").trim(),
        expected: (row["expected behavior"] || row["expected"] || row["behavior"] || "").trim()
      })).filter((ec) => ec.scenario);
    }
    function extractUsers(section) {
      if (!section)
        return [];
      const lines = section.lines;
      const segmentMatch = section.content.match(/affected.+?segment[:\s]+(.+)/i);
      if (segmentMatch) {
        return [{ segment: segmentMatch[1].trim(), description: "" }];
      }
      return [];
    }
    function mapSectionsToSpec(sections, options) {
      const taskSummary = sections.get("task summary");
      const productCtx = sections.get("product context");
      const techCtx = sections.get("technical context");
      const inScope = sections.get("in scope");
      const outOfScope = sections.get("out of scope");
      const requirements = sections.get("requirements");
      const antiReqs = sections.get("anti-requirements");
      const constraints = sections.get("constraints");
      const ac = sections.get("acceptance criteria");
      const edgeCases = sections.get("edge cases");
      const dod = sections.get("definition of done");
      const escalation = sections.get("escalation triggers");
      return {
        $schema: SCHEMA,
        feature: options.featureName,
        spec_version: options.specVersion,
        readiness: options.readiness,
        compiled_at: (/* @__PURE__ */ new Date()).toISOString(),
        task_summary: taskSummary?.content.trim() ?? "",
        product_context: extractProductContext(productCtx),
        technical_context: extractTechContext(techCtx),
        problem: "",
        // enriched from prd.md if available — left empty for basic compile
        users: extractUsers(productCtx),
        in_scope: inScope ? (0, MarkdownSectionParser_1.extractBulletItems)(inScope) : [],
        out_of_scope: outOfScope ? (0, MarkdownSectionParser_1.extractBulletItems)(outOfScope) : [],
        requirements: requirements ? (0, MarkdownSectionParser_1.extractBulletItems)(requirements) : [],
        anti_requirements: antiReqs ? (0, MarkdownSectionParser_1.extractBulletItems)(antiReqs) : [],
        constraints: extractConstraints(constraints),
        acceptance_criteria: extractAcceptanceCriteria(ac),
        edge_cases: extractEdgeCases(edgeCases),
        definition_of_done: dod ? (0, MarkdownSectionParser_1.extractBulletItems)(dod) : [],
        escalation_triggers: escalation ? (0, MarkdownSectionParser_1.extractBulletItems)(escalation) : [],
        context_refs: options.contextRefs
      };
    }
  }
});

// ../core/dist/compiler/types.js
var require_types = __commonJS({
  "../core/dist/compiler/types.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CompileError = void 0;
    var CompileError = class extends Error {
      constructor(message, diagnostics) {
        super(message);
        this.diagnostics = diagnostics;
        this.name = "CompileError";
      }
    };
    exports2.CompileError = CompileError;
  }
});

// ../core/dist/compiler/Compiler.js
var require_Compiler = __commonJS({
  "../core/dist/compiler/Compiler.js"(exports2) {
    "use strict";
    var __createBinding = exports2 && exports2.__createBinding || (Object.create ? (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      var desc = Object.getOwnPropertyDescriptor(m, k);
      if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = { enumerable: true, get: function() {
          return m[k];
        } };
      }
      Object.defineProperty(o, k2, desc);
    }) : (function(o, m, k, k2) {
      if (k2 === void 0) k2 = k;
      o[k2] = m[k];
    }));
    var __setModuleDefault = exports2 && exports2.__setModuleDefault || (Object.create ? (function(o, v) {
      Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function(o, v) {
      o["default"] = v;
    });
    var __importStar = exports2 && exports2.__importStar || /* @__PURE__ */ (function() {
      var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o2) {
          var ar = [];
          for (var k in o2) if (Object.prototype.hasOwnProperty.call(o2, k)) ar[ar.length] = k;
          return ar;
        };
        return ownKeys(o);
      };
      return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
          for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
      };
    })();
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.Compiler = void 0;
    var fs10 = __importStar(require("fs"));
    var path10 = __importStar(require("path"));
    var MarkdownSectionParser_1 = require_MarkdownSectionParser();
    var Linter_1 = require_Linter();
    var VersionManager_1 = require_VersionManager();
    var SpecMapper_1 = require_SpecMapper();
    var types_1 = require_types();
    var Compiler2 = class {
      constructor(options = {}) {
        this.featuresPath = options.featuresPath ?? "features";
        this.contextPath = options.contextPath ?? "prodman-context";
      }
      compile(featureName, options = {}) {
        const allowIncomplete = options.allowIncomplete ?? false;
        const featuresPath = options.featuresPath ?? this.featuresPath;
        const contextPath = options.contextPath ?? this.contextPath;
        const featureDir = path10.resolve(featuresPath, featureName);
        const briefPath = path10.join(featureDir, "agent-brief.md");
        if (!fs10.existsSync(briefPath)) {
          throw new types_1.CompileError(`agent-brief.md not found in ${featureDir}. Run /pm-ff ${featureName} to generate the spec bundle.`, []);
        }
        const linter = new Linter_1.Linter();
        const lintResult = linter.lintFile(briefPath);
        if (lintResult.readiness === "incomplete" && !allowIncomplete) {
          throw new types_1.CompileError(`Spec is incomplete \u2014 ${lintResult.diagnostics.filter((d) => d.severity === "error").length} error(s) must be fixed before compiling.`, lintResult.diagnostics);
        }
        const content = fs10.readFileSync(briefPath, "utf8");
        const sections = (0, MarkdownSectionParser_1.parseMarkdownSections)(content);
        const specVersion = (0, VersionManager_1.getNextVersion)(featureDir);
        const contextRefs = {
          product_md: path10.join(contextPath, "product.md"),
          users_md: path10.join(contextPath, "users.md"),
          tech_md: fs10.existsSync(path10.join(contextPath, "tech.md")) ? path10.join(contextPath, "tech.md") : null,
          agent_brief_md: briefPath
        };
        const spec = (0, SpecMapper_1.mapSectionsToSpec)(sections, {
          featureName,
          specVersion,
          readiness: lintResult.readiness,
          contextRefs
        });
        const outputPath = path10.join(featureDir, "compiled-spec.json");
        fs10.writeFileSync(outputPath, JSON.stringify(spec, null, 2));
        return { outputPath, spec, lintResult };
      }
      /**
       * Compile an agent-brief from an in-memory content string — no filesystem reads or writes.
       * Used by the VS Code extension to compile the active editor document without saving.
       */
      compileToSpec(featureName, content, options = {}) {
        const { allowIncomplete = false, contextRefs = {} } = options;
        const linter = new Linter_1.Linter();
        const lintResult = linter.lintContent(featureName, content);
        if (lintResult.readiness === "incomplete" && !allowIncomplete) {
          throw new types_1.CompileError(`Spec is incomplete \u2014 ${lintResult.diagnostics.filter((d) => d.severity === "error").length} error(s) must be fixed before compiling.`, lintResult.diagnostics);
        }
        const sections = (0, MarkdownSectionParser_1.parseMarkdownSections)(content);
        const resolvedRefs = {
          product_md: contextRefs.product_md ?? "prodman-context/product.md",
          users_md: contextRefs.users_md ?? "prodman-context/users.md",
          tech_md: contextRefs.tech_md ?? null,
          agent_brief_md: contextRefs.agent_brief_md ?? `features/${featureName}/agent-brief.md`
        };
        const spec = (0, SpecMapper_1.mapSectionsToSpec)(sections, {
          featureName,
          specVersion: 0,
          readiness: lintResult.readiness,
          contextRefs: resolvedRefs
        });
        return { spec, lintResult };
      }
    };
    exports2.Compiler = Compiler2;
  }
});

// ../core/dist/index.js
var require_dist = __commonJS({
  "../core/dist/index.js"(exports2) {
    "use strict";
    Object.defineProperty(exports2, "__esModule", { value: true });
    exports2.CompileError = exports2.mapSectionsToSpec = exports2.getNextVersion = exports2.Compiler = exports2.AGENT_BRIEF_SCAFFOLD = exports2.SECTION_TEMPLATES = exports2.extractTableRows = exports2.extractBulletItems = exports2.countBulletItems = exports2.normaliseHeading = exports2.parseMarkdownSections = exports2.AGENT_BRIEF_RULES = exports2.RuleEngine = exports2.Linter = void 0;
    var Linter_1 = require_Linter();
    Object.defineProperty(exports2, "Linter", { enumerable: true, get: function() {
      return Linter_1.Linter;
    } });
    var RuleEngine_1 = require_RuleEngine();
    Object.defineProperty(exports2, "RuleEngine", { enumerable: true, get: function() {
      return RuleEngine_1.RuleEngine;
    } });
    Object.defineProperty(exports2, "AGENT_BRIEF_RULES", { enumerable: true, get: function() {
      return RuleEngine_1.AGENT_BRIEF_RULES;
    } });
    var MarkdownSectionParser_1 = require_MarkdownSectionParser();
    Object.defineProperty(exports2, "parseMarkdownSections", { enumerable: true, get: function() {
      return MarkdownSectionParser_1.parseMarkdownSections;
    } });
    Object.defineProperty(exports2, "normaliseHeading", { enumerable: true, get: function() {
      return MarkdownSectionParser_1.normaliseHeading;
    } });
    Object.defineProperty(exports2, "countBulletItems", { enumerable: true, get: function() {
      return MarkdownSectionParser_1.countBulletItems;
    } });
    Object.defineProperty(exports2, "extractBulletItems", { enumerable: true, get: function() {
      return MarkdownSectionParser_1.extractBulletItems;
    } });
    Object.defineProperty(exports2, "extractTableRows", { enumerable: true, get: function() {
      return MarkdownSectionParser_1.extractTableRows;
    } });
    var SectionTemplates_1 = require_SectionTemplates();
    Object.defineProperty(exports2, "SECTION_TEMPLATES", { enumerable: true, get: function() {
      return SectionTemplates_1.SECTION_TEMPLATES;
    } });
    Object.defineProperty(exports2, "AGENT_BRIEF_SCAFFOLD", { enumerable: true, get: function() {
      return SectionTemplates_1.AGENT_BRIEF_SCAFFOLD;
    } });
    var Compiler_1 = require_Compiler();
    Object.defineProperty(exports2, "Compiler", { enumerable: true, get: function() {
      return Compiler_1.Compiler;
    } });
    var VersionManager_1 = require_VersionManager();
    Object.defineProperty(exports2, "getNextVersion", { enumerable: true, get: function() {
      return VersionManager_1.getNextVersion;
    } });
    var SpecMapper_1 = require_SpecMapper();
    Object.defineProperty(exports2, "mapSectionsToSpec", { enumerable: true, get: function() {
      return SpecMapper_1.mapSectionsToSpec;
    } });
    var types_1 = require_types();
    Object.defineProperty(exports2, "CompileError", { enumerable: true, get: function() {
      return types_1.CompileError;
    } });
  }
});

// src/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
var vscode12 = __toESM(require("vscode"));
var path9 = __toESM(require("path"));
var fs9 = __toESM(require("fs"));

// src/linter/SpecDiagnosticsProvider.ts
var vscode = __toESM(require("vscode"));
var import_core = __toESM(require_dist());
var SpecDiagnosticsProvider = class {
  constructor() {
    this.linter = new import_core.Linter();
  }
  lint(document) {
    const content = document.getText();
    const lintResult = this.linter.lintContent(document.fileName, content);
    const diagnostics = lintResult.diagnostics.map((d) => {
      const line = Math.max(0, d.line);
      const endLine = d.endLine !== void 0 ? Math.max(0, d.endLine) : line;
      const range = new vscode.Range(
        new vscode.Position(line, 0),
        new vscode.Position(endLine, Number.MAX_SAFE_INTEGER)
      );
      const severity = d.severity === "error" ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning;
      const diagnostic = new vscode.Diagnostic(range, d.message, severity);
      diagnostic.source = "ProdMan";
      diagnostic.code = d.rule;
      return diagnostic;
    });
    const totalRules = lintResult.diagnostics.length > 0 ? this.getTotalRuleCount(lintResult) : 12;
    const failingRules = new Set(lintResult.diagnostics.map((d) => d.rule)).size;
    const rulesPassing = totalRules - failingRules;
    return {
      diagnostics,
      readiness: lintResult.readiness,
      rulesPassing,
      rulesTotal: totalRules
    };
  }
  getTotalRuleCount(result) {
    const ruleIds = result.diagnostics.map((d) => d.rule);
    const maxRule = ruleIds.reduce((max, id) => {
      const n = parseInt(id.replace("LNT-", ""), 10);
      return isNaN(n) ? max : Math.max(max, n);
    }, 12);
    return Math.max(maxRule, 12);
  }
};

// src/linter/QuickFixProvider.ts
var vscode2 = __toESM(require("vscode"));
var import_core2 = __toESM(require_dist());

// src/detector/TechDetector.ts
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var FRAMEWORK_MAP = [
  ["@angular/core", "Angular"],
  ["@nestjs/core", "NestJS"],
  ["@tanstack/react-query", "TanStack Query"],
  ["@testing-library/react", "React Testing Library"],
  ["@testing-library/vue", "Vue Testing Library"],
  ["next", "Next.js"],
  ["nuxt", "Nuxt"],
  ["react", "React"],
  ["vue", "Vue"],
  ["svelte", "Svelte"],
  ["@sveltejs/kit", "SvelteKit"],
  ["typescript", "TypeScript"],
  ["tailwindcss", "Tailwind CSS"],
  ["express", "Express"],
  ["fastify", "Fastify"],
  ["hono", "Hono"],
  ["prisma", "Prisma"],
  ["drizzle-orm", "Drizzle ORM"],
  ["mongoose", "Mongoose"],
  ["sequelize", "Sequelize"],
  ["graphql", "GraphQL"],
  ["jest", "Jest"],
  ["vitest", "Vitest"],
  ["vite", "Vite"],
  ["zod", "Zod"],
  ["axios", "Axios"],
  ["react-query", "React Query"]
];
function toMajorMinor(version) {
  const cleaned = version.replace(/^[^0-9]*/, "");
  const parts = cleaned.split(".");
  return parts.length >= 2 ? `${parts[0]}.${parts[1]}` : parts[0] ?? "";
}
function detectFromPackageJson(workspaceRoot) {
  const pkgPath = path.join(workspaceRoot, "package.json");
  if (!fs.existsSync(pkgPath)) return {};
  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  } catch {
    return {};
  }
  const repo = typeof pkg.name === "string" && pkg.name ? pkg.name : "";
  const allDeps = {
    ...pkg.dependencies ?? {},
    ...pkg.devDependencies ?? {}
  };
  const stack = [];
  for (const [pkgName, displayName] of FRAMEWORK_MAP) {
    const version = allDeps[pkgName];
    if (version !== void 0) {
      const v = toMajorMinor(version);
      stack.push(v ? `${displayName} ${v}` : displayName);
    }
  }
  return { repo, stackSummary: stack.join(", ") };
}
function detectFromGoMod(workspaceRoot) {
  const goModPath = path.join(workspaceRoot, "go.mod");
  if (!fs.existsSync(goModPath)) return {};
  try {
    const content = fs.readFileSync(goModPath, "utf8");
    const moduleLine = content.split("\n").find((l) => l.startsWith("module "));
    const moduleSegments = moduleLine?.replace("module ", "").trim().split("/");
    const repo = moduleSegments?.[moduleSegments.length - 1] ?? "";
    return { repo, stackSummary: "Go" };
  } catch {
    return { stackSummary: "Go" };
  }
}
function detectFromPython(workspaceRoot) {
  const hasPython = fs.existsSync(path.join(workspaceRoot, "requirements.txt")) || fs.existsSync(path.join(workspaceRoot, "pyproject.toml")) || fs.existsSync(path.join(workspaceRoot, "setup.py"));
  return hasPython ? { stackSummary: "Python" } : {};
}
function detectFromRust(workspaceRoot) {
  const cargoPath = path.join(workspaceRoot, "Cargo.toml");
  if (!fs.existsSync(cargoPath)) return {};
  try {
    const content = fs.readFileSync(cargoPath, "utf8");
    const nameLine = content.split("\n").find((l) => /^name\s*=/.test(l));
    const repo = nameLine ? nameLine.split("=")[1].trim().replace(/"/g, "") : "";
    return { repo, stackSummary: "Rust" };
  } catch {
    return { stackSummary: "Rust" };
  }
}
function detectFromJava(workspaceRoot) {
  if (fs.existsSync(path.join(workspaceRoot, "pom.xml"))) {
    return { stackSummary: "Java" };
  }
  if (fs.existsSync(path.join(workspaceRoot, "build.gradle")) || fs.existsSync(path.join(workspaceRoot, "build.gradle.kts"))) {
    return { stackSummary: "Kotlin/JVM" };
  }
  return {};
}
var TechDetector = class {
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
      detectFromJava
    ];
    let repo = "";
    let stackSummary = "";
    for (const detect of detectors) {
      const result = detect(workspaceRoot);
      if (!repo && result.repo) repo = result.repo;
      if (!stackSummary && result.stackSummary) stackSummary = result.stackSummary;
      if (repo && stackSummary) break;
    }
    return {
      repo: repo || fallbackRepo,
      stackSummary
    };
  }
  /** Returns true if the workspace has any detectable stack marker */
  static hasDetectableStack(workspaceRoot) {
    const markers = [
      "package.json",
      "go.mod",
      "requirements.txt",
      "pyproject.toml",
      "Cargo.toml",
      "pom.xml",
      "build.gradle",
      "build.gradle.kts"
    ];
    return markers.some((m) => fs.existsSync(path.join(workspaceRoot, m)));
  }
};

// src/linter/QuickFixProvider.ts
var RULE_TO_SECTION = {
  "LNT-001": "",
  // Required sections — handled dynamically from message
  "LNT-003": "technical context",
  "LNT-004": "in scope",
  "LNT-005": "out of scope",
  "LNT-006": "requirements",
  "LNT-007": "anti-requirements",
  "LNT-008": "acceptance criteria",
  "LNT-010": "definition of done",
  "LNT-011": "escalation triggers"
};
var LABELED_PLACEHOLDER = /\*\*[^:*]+:\*\*\s*\[[^\]]{3,}\]\s*$/;
var QuickFixProvider = class {
  provideCodeActions(document, _range, context) {
    const actions = [];
    for (const diagnostic of context.diagnostics) {
      if (diagnostic.source !== "ProdMan") continue;
      const ruleId = String(diagnostic.code);
      const fixes = this.buildFixes(document, diagnostic, ruleId);
      actions.push(...fixes);
    }
    return actions;
  }
  buildFixes(document, diagnostic, ruleId) {
    if (ruleId === "LNT-001") {
      return this.fixMissingSection(document, diagnostic);
    }
    if (ruleId === "LNT-002") {
      return this.fixTaskSummaryLength(document, diagnostic);
    }
    if (ruleId === "LNT-008") {
      return this.fixInsufficientItems(document, diagnostic, "acceptance criteria", [
        "- [ ] User can [specific, observable action]",
        "- [ ] System [specific, verifiable response]",
        "- [ ] [Edge case scenario] is handled correctly"
      ]);
    }
    if (ruleId === "LNT-010") {
      return this.fixInsufficientItems(document, diagnostic, "definition of done", [
        "- [ ] All acceptance criteria pass",
        "- [ ] Unit tests written and passing",
        "- [ ] No lint errors or type errors"
      ]);
    }
    if (ruleId === "LNT-009") {
      return [];
    }
    if (ruleId === "LNT-012") {
      return this.fixTechContextPlaceholders(document, diagnostic);
    }
    const sectionKey = RULE_TO_SECTION[ruleId];
    if (sectionKey && import_core2.SECTION_TEMPLATES[sectionKey]) {
      return [this.insertSectionAtEnd(document, diagnostic, sectionKey)];
    }
    return [];
  }
  fixTechContextPlaceholders(document, diagnostic) {
    const workspaceRoot = vscode2.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath;
    if (!workspaceRoot) return [];
    const { repo, stackSummary } = TechDetector.detect(workspaceRoot);
    if (!repo && !stackSummary) return [];
    const action = new vscode2.CodeAction(
      "Fill Technical Context from workspace",
      vscode2.CodeActionKind.QuickFix
    );
    action.diagnostics = [diagnostic];
    action.edit = new vscode2.WorkspaceEdit();
    action.isPreferred = true;
    for (let i = 0; i < document.lineCount; i++) {
      const lineText = document.lineAt(i).text;
      if (!LABELED_PLACEHOLDER.test(lineText)) continue;
      let replacement = null;
      if (/\*\*Repository:\*\*/i.test(lineText) && repo) {
        replacement = lineText.replace(/\[[^\]]+\]\s*$/, `\`${repo}\``);
      } else if (/\*\*Tech stack:\*\*/i.test(lineText) && stackSummary) {
        replacement = lineText.replace(/\[[^\]]+\]\s*$/, stackSummary);
      }
      if (replacement !== null) {
        const range = new vscode2.Range(
          new vscode2.Position(i, 0),
          new vscode2.Position(i, lineText.length)
        );
        action.edit.replace(document.uri, range, replacement);
      }
    }
    return [action];
  }
  fixMissingSection(document, diagnostic) {
    const msg = diagnostic.message.toLowerCase();
    for (const [key, template] of Object.entries(import_core2.SECTION_TEMPLATES)) {
      if (msg.includes(key)) {
        return [this.insertSectionAtEnd(document, diagnostic, key, template)];
      }
    }
    return [];
  }
  fixTaskSummaryLength(document, diagnostic) {
    const action = new vscode2.CodeAction(
      "Insert Task Summary template",
      vscode2.CodeActionKind.QuickFix
    );
    action.diagnostics = [diagnostic];
    action.edit = new vscode2.WorkspaceEdit();
    const line = diagnostic.range.start.line + 1;
    const position = new vscode2.Position(line, 0);
    action.edit.insert(
      document.uri,
      position,
      "One sentence describing what this feature does and why.\n"
    );
    return [action];
  }
  fixInsufficientItems(document, diagnostic, _sectionKey, items) {
    const action = new vscode2.CodeAction(
      `Insert ${_sectionKey} template items`,
      vscode2.CodeActionKind.QuickFix
    );
    action.diagnostics = [diagnostic];
    action.edit = new vscode2.WorkspaceEdit();
    const insertLine = diagnostic.range.end.line + 1;
    const position = new vscode2.Position(insertLine, 0);
    action.edit.insert(document.uri, position, items.join("\n") + "\n");
    return [action];
  }
  insertSectionAtEnd(document, diagnostic, sectionKey, template = import_core2.SECTION_TEMPLATES[sectionKey]) {
    const action = new vscode2.CodeAction(
      `Insert "${template.heading}" section`,
      vscode2.CodeActionKind.QuickFix
    );
    action.diagnostics = [diagnostic];
    action.edit = new vscode2.WorkspaceEdit();
    const lastLine = document.lineCount - 1;
    const endOfDoc = document.lineAt(lastLine).range.end;
    const insertion = `

${template.heading}

${template.body}
`;
    action.edit.insert(document.uri, endOfDoc, insertion);
    return action;
  }
};

// src/status/SpecReadinessBar.ts
var vscode3 = __toESM(require("vscode"));
var STATE_CONFIG = {
  "agent-ready": {
    icon: "$(check)",
    color: new vscode3.ThemeColor("statusBarItem.prominentForeground"),
    tooltip: "All lint rules pass \u2014 spec is ready to send to an AI agent"
  },
  "review-needed": {
    icon: "$(warning)",
    color: new vscode3.ThemeColor("statusBarItem.warningForeground"),
    tooltip: "Spec has warnings \u2014 review before sending to an AI agent"
  },
  "incomplete": {
    icon: "$(error)",
    color: new vscode3.ThemeColor("statusBarItem.errorForeground"),
    tooltip: "Spec is incomplete \u2014 fix errors before launching agent"
  }
};
var SpecReadinessBar = class {
  constructor() {
    this.statusBarItem = vscode3.window.createStatusBarItem(
      vscode3.StatusBarAlignment.Right,
      100
    );
    this.statusBarItem.command = "prodman.launchAgent";
    this.statusBarItem.name = "ProdMan Readiness";
  }
  update(readiness, rulesPassing, rulesTotal) {
    const config = STATE_CONFIG[readiness];
    const label = readiness === "agent-ready" ? `PRODMAN ${config.icon} Agent Ready \u2014 ${rulesPassing}/${rulesTotal} rules passing` : readiness === "review-needed" ? `PRODMAN ${config.icon} Review Needed \u2014 ${rulesPassing}/${rulesTotal} rules passing` : `PRODMAN ${config.icon} Incomplete \u2014 ${rulesPassing}/${rulesTotal} rules passing`;
    this.statusBarItem.text = label;
    this.statusBarItem.color = config.color;
    this.statusBarItem.tooltip = config.tooltip;
    this.statusBarItem.show();
  }
  hide() {
    this.statusBarItem.hide();
  }
  dispose() {
    this.statusBarItem.dispose();
  }
};

// src/codelens/SpecCodeLensProvider.ts
var vscode4 = __toESM(require("vscode"));
var path2 = __toESM(require("path"));
var SpecCodeLensProvider = class {
  provideCodeLenses(document) {
    if (path2.basename(document.fileName) !== "agent-brief.md") return [];
    const topRange = new vscode4.Range(0, 0, 0, 0);
    return [
      new vscode4.CodeLens(topRange, {
        title: "\u25B6 Run with PRODMAN",
        command: "prodman.launchAgent",
        tooltip: "Lint \u2192 compile \u2192 assemble payload \u2192 copy to clipboard"
      }),
      new vscode4.CodeLens(topRange, {
        title: "$(check) Validate Spec",
        command: "prodman.compileSpec",
        tooltip: "Compile spec and show lint results"
      }),
      new vscode4.CodeLens(topRange, {
        title: "$(preview) Preview Spec.json",
        command: "prodman.previewSpec",
        tooltip: "Open a read-only preview of the compiled spec.json"
      })
    ];
  }
};

// src/launcher/AgentBriefLauncher.ts
var vscode6 = __toESM(require("vscode"));

// src/launcher/CompilerAdapter.ts
var vscode5 = __toESM(require("vscode"));
var path3 = __toESM(require("path"));
var fs2 = __toESM(require("fs"));
var import_core3 = __toESM(require_dist());
var CompilerAdapter = class _CompilerAdapter {
  static compile(document) {
    const workspaceRoot = vscode5.workspace.getWorkspaceFolder(document.uri)?.uri.fsPath ?? path3.dirname(document.fileName);
    const featureName = _CompilerAdapter.resolveFeatureName(document.fileName, workspaceRoot);
    const content = document.getText();
    const contextPath = path3.join(workspaceRoot, "prodman-context");
    const contextRefs = {
      product_md: path3.join(contextPath, "product.md"),
      users_md: path3.join(contextPath, "users.md"),
      tech_md: fs2.existsSync(path3.join(contextPath, "constraints.md")) ? path3.join(contextPath, "constraints.md") : null,
      agent_brief_md: document.fileName
    };
    const compiler = new import_core3.Compiler();
    return compiler.compileToSpec(featureName, content, {
      allowIncomplete: true,
      // linter shows diagnostics; we still want to preview partial specs
      contextRefs
    });
  }
  static resolveFeatureName(filePath, workspaceRoot) {
    const relative2 = path3.relative(workspaceRoot, filePath);
    const parts = relative2.split(path3.sep);
    if (parts.length >= 3 && parts[0] === "features") {
      return parts[1];
    }
    return path3.basename(path3.dirname(filePath));
  }
};

// src/launcher/PromptAssembler.ts
var fs3 = __toESM(require("fs"));
var PromptAssembler = class {
  static assemble(spec) {
    const contextBlocks = [];
    if (spec.context_refs.product_md && fs3.existsSync(spec.context_refs.product_md)) {
      const productContent = fs3.readFileSync(spec.context_refs.product_md, "utf8").trim();
      contextBlocks.push(`## Product Context

${productContent}`);
    }
    if (spec.context_refs.users_md && fs3.existsSync(spec.context_refs.users_md)) {
      const usersContent = fs3.readFileSync(spec.context_refs.users_md, "utf8").trim();
      contextBlocks.push(`## User Context

${usersContent}`);
    }
    const preamble = contextBlocks.length > 0 ? contextBlocks.join("\n\n") + "\n\n---\n\n" : "";
    const specJson = JSON.stringify(spec, null, 2);
    return [
      preamble + "## Agent Brief (Compiled Spec)",
      "",
      "```json",
      specJson,
      "```",
      "",
      "---",
      "",
      `Feature: **${spec.feature}**`,
      `Readiness: **${spec.readiness}**`,
      `Compiled: ${spec.compiled_at}`
    ].join("\n");
  }
};

// src/launcher/AgentBriefLauncher.ts
var AgentBriefLauncher = class {
  /**
   * Full launch: lint + compile + assemble + copy.
   * Used by "Run with PRODMAN" CodeLens and command.
   */
  static async launch(document) {
    await vscode6.window.withProgress(
      {
        location: vscode6.ProgressLocation.Notification,
        title: "ProdMan: Preparing agent payload\u2026",
        cancellable: false
      },
      async () => {
        try {
          const { spec, lintResult } = CompilerAdapter.compile(document);
          if (lintResult.readiness === "incomplete") {
            const errorCount = lintResult.diagnostics.filter((d) => d.severity === "error").length;
            const warningCount = lintResult.diagnostics.filter((d) => d.severity === "warning").length;
            const proceed = await vscode6.window.showWarningMessage(
              `Spec has ${errorCount} error(s) and ${warningCount} warning(s). Launch anyway?`,
              { modal: true },
              "Launch anyway",
              "Fix first"
            );
            if (proceed !== "Launch anyway") return;
          }
          const payload = PromptAssembler.assemble(spec);
          await vscode6.env.clipboard.writeText(payload);
          const msg = lintResult.readiness === "agent-ready" ? `ProdMan \u2713 Agent payload copied \u2014 spec is agent-ready.` : `ProdMan \u26A0 Agent payload copied \u2014 ${lintResult.diagnostics.length} issue(s) remain.`;
          vscode6.window.showInformationMessage(msg);
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          vscode6.window.showErrorMessage(`ProdMan: ${message}`);
        }
      }
    );
  }
  /**
   * Compile-only: lint + compile, no clipboard.
   * Used by "Validate Spec" CodeLens.
   */
  static async compileOnly(document) {
    try {
      const { lintResult } = CompilerAdapter.compile(document);
      const errors = lintResult.diagnostics.filter((d) => d.severity === "error").length;
      const warnings = lintResult.diagnostics.filter((d) => d.severity === "warning").length;
      if (lintResult.readiness === "agent-ready") {
        vscode6.window.showInformationMessage("ProdMan \u2713 Spec is agent-ready \u2014 all rules pass.");
      } else if (lintResult.readiness === "review-needed") {
        vscode6.window.showWarningMessage(
          `ProdMan \u26A0 Review needed \u2014 ${warnings} warning(s). See Problems panel.`
        );
      } else {
        vscode6.window.showErrorMessage(
          `ProdMan \u2717 Spec incomplete \u2014 ${errors} error(s), ${warnings} warning(s). See Problems panel.`
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      vscode6.window.showErrorMessage(`ProdMan: ${message}`);
    }
  }
};

// src/preview/SpecPreviewPanel.ts
var vscode7 = __toESM(require("vscode"));
var SpecPreviewPanel = class _SpecPreviewPanel {
  constructor(panel, extensionUri, document) {
    this.extensionUri = extensionUri;
    this.document = document;
    this.disposables = [];
    this.panel = panel;
    this.render();
    this.panel.onDidDispose(() => this.dispose(), null, this.disposables);
    vscode7.workspace.onDidChangeTextDocument(
      (e) => {
        if (e.document === this.document) this.render();
      },
      null,
      this.disposables
    );
  }
  static show(extensionUri, document) {
    if (_SpecPreviewPanel.currentPanel) {
      _SpecPreviewPanel.currentPanel.document = document;
      _SpecPreviewPanel.currentPanel.render();
      _SpecPreviewPanel.currentPanel.panel.reveal(vscode7.ViewColumn.Beside);
      return;
    }
    const panel = vscode7.window.createWebviewPanel(
      "prodmanSpecPreview",
      "ProdMan: Spec Preview",
      vscode7.ViewColumn.Beside,
      { enableScripts: true, retainContextWhenHidden: true }
    );
    _SpecPreviewPanel.currentPanel = new _SpecPreviewPanel(panel, extensionUri, document);
  }
  render() {
    let specJson;
    let readiness;
    let error;
    try {
      const { spec } = CompilerAdapter.compile(this.document);
      specJson = JSON.stringify(spec, null, 2);
      readiness = spec.readiness;
    } catch (err) {
      specJson = "";
      readiness = "incomplete";
      error = err instanceof Error ? err.message : String(err);
    }
    this.panel.webview.html = this.buildHtml(specJson, readiness, error);
  }
  buildHtml(specJson, readiness, error) {
    const escaped = specJson.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const readinessColor = readiness === "agent-ready" ? "#4caf50" : readiness === "review-needed" ? "#ff9800" : "#f44336";
    const readinessLabel = readiness === "agent-ready" ? "\u2713 Agent Ready" : readiness === "review-needed" ? "\u26A0 Review Needed" : "\u2717 Incomplete";
    const body = error ? `<div class="error">${error}</div>` : `<pre><code id="spec">${escaped}</code></pre>`;
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ProdMan: Spec Preview</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: var(--vscode-editor-font-family, monospace);
      font-size: var(--vscode-editor-font-size, 13px);
      background: var(--vscode-editor-background);
      color: var(--vscode-editor-foreground);
      margin: 0;
      padding: 0;
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      background: var(--vscode-sideBar-background);
      border-bottom: 1px solid var(--vscode-panel-border);
      position: sticky;
      top: 0;
      z-index: 10;
    }
    .title { font-weight: 600; font-size: 14px; }
    .badge {
      font-size: 12px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      background: ${readinessColor}22;
      color: ${readinessColor};
      border: 1px solid ${readinessColor};
    }
    button {
      padding: 4px 12px;
      font-size: 12px;
      cursor: pointer;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
      border: none;
      border-radius: 4px;
    }
    button:hover { background: var(--vscode-button-hoverBackground); }
    pre {
      margin: 0;
      padding: 16px;
      overflow: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
    .error {
      padding: 16px;
      color: #f44336;
    }
  </style>
</head>
<body>
  <header>
    <span class="title">compiled spec.json</span>
    <span class="badge">${readinessLabel}</span>
    <button onclick="copyJson()">Copy JSON</button>
  </header>
  ${body}
  <script>
    function copyJson() {
      const code = document.getElementById('spec')
      if (!code) return
      navigator.clipboard.writeText(code.textContent || '').then(() => {
        const btn = document.querySelector('button')
        if (btn) { btn.textContent = 'Copied!'; setTimeout(() => btn.textContent = 'Copy JSON', 1500) }
      })
    }
  </script>
</body>
</html>`;
  }
  dispose() {
    _SpecPreviewPanel.currentPanel = void 0;
    this.panel.dispose();
    this.disposables.forEach((d) => d.dispose());
    this.disposables = [];
  }
};

// src/wizard/InitWizard.ts
var vscode8 = __toESM(require("vscode"));
var path4 = __toESM(require("path"));
var fs4 = __toESM(require("fs"));
var import_core4 = __toESM(require_dist());
var FALLBACK_TEMPLATES = {
  "product.md": `# Product Context

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
  "users.md": `# User Segments

## Segment 1: [Name]

- **Who they are:**
- **What they're trying to do:**
- **Where they struggle today:**
- **What success looks like for them:**
- **Usage pattern:**
- **Size / importance:**


## Who We're NOT Building For

`,
  "constraints.md": `# Constraints

## Technical Constraints

- **Stack:** [Languages, frameworks, platforms]
- **Infrastructure:** [Cloud provider, hosting environment]
- **Performance:** [Latency, throughput, or size constraints]

## Legal / Compliance


## Organizational Constraints


## Explicit Non-Starters

`,
  "history.md": `# Product History & Decisions

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
`
};
function readBundledTemplate(extensionUri, filename) {
  try {
    const templateUri = vscode8.Uri.joinPath(extensionUri, "templates", "context", filename);
    return fs4.readFileSync(templateUri.fsPath, "utf8");
  } catch {
    return FALLBACK_TEMPLATES[filename] ?? `# ${filename}

`;
  }
}
function injectStack(content, stackSummary) {
  if (!stackSummary) return content;
  if (content.includes("- **Stack:** [Languages, frameworks, platforms]")) {
    return content.replace(
      "- **Stack:** [Languages, frameworks, platforms]",
      `- **Stack:** ${stackSummary}`
    );
  }
  return content.replace(
    /(##\s+Technical(?:\s+Constraints)?\s*\n)/i,
    `$1
- **Stack:** ${stackSummary}
`
  );
}
var InitWizard = class _InitWizard {
  static async run(extensionUri) {
    const workspaceRoot = vscode8.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
      vscode8.window.showErrorMessage("ProdMan: No workspace folder open.");
      return;
    }
    const contextDir = path4.join(workspaceRoot, "prodman-context");
    const featuresDir = path4.join(workspaceRoot, "features");
    const confirm = await vscode8.window.showInformationMessage(
      "ProdMan will create prodman-context/ with product.md, users.md, constraints.md, and history.md.",
      { modal: true },
      "Initialize"
    );
    if (confirm !== "Initialize") return;
    fs4.mkdirSync(contextDir, { recursive: true });
    fs4.mkdirSync(featuresDir, { recursive: true });
    const tech = TechDetector.detect(workspaceRoot);
    const filenames = ["product.md", "users.md", "constraints.md", "history.md"];
    const created = [];
    for (const filename of filenames) {
      const filePath = path4.join(contextDir, filename);
      if (!fs4.existsSync(filePath)) {
        let content = readBundledTemplate(extensionUri, filename);
        if (filename === "constraints.md" && tech.stackSummary) {
          content = injectStack(content, tech.stackSummary);
        }
        fs4.writeFileSync(filePath, content);
        created.push(`prodman-context/${filename}`);
      }
    }
    const openProduct = await vscode8.window.showInformationMessage(
      `ProdMan workspace initialized. Created: ${created.join(", ")}`,
      "Open product.md",
      "Create first feature brief",
      "Done"
    );
    if (openProduct === "Open product.md") {
      const productUri = vscode8.Uri.file(path4.join(contextDir, "product.md"));
      await vscode8.window.showTextDocument(productUri);
      return;
    }
    if (openProduct === "Create first feature brief") {
      await _InitWizard.createFeatureBrief(workspaceRoot, featuresDir);
    }
  }
  static async createFeatureBrief(workspaceRoot, featuresDir) {
    const featureName = await vscode8.window.showInputBox({
      prompt: "Feature name (used as folder name)",
      placeHolder: "e.g. payment-api, user-onboarding, search",
      validateInput: (value) => {
        if (!value.trim()) return "Feature name cannot be empty";
        if (/\s/.test(value)) return "Use kebab-case (no spaces)";
        if (!/^[a-z0-9-]+$/.test(value)) return "Use lowercase letters, numbers, and hyphens only";
        return void 0;
      }
    });
    if (!featureName) return;
    const featureDir = path4.join(featuresDir, featureName);
    const briefPath = path4.join(featureDir, "agent-brief.md");
    if (fs4.existsSync(briefPath)) {
      const overwrite = await vscode8.window.showWarningMessage(
        `features/${featureName}/agent-brief.md already exists. Overwrite?`,
        { modal: true },
        "Overwrite"
      );
      if (overwrite !== "Overwrite") return;
    }
    fs4.mkdirSync(featureDir, { recursive: true });
    const featureTitle = featureName.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    let scaffold = import_core4.AGENT_BRIEF_SCAFFOLD.replace(
      "# Agent Brief: [Feature Title]",
      `# Agent Brief: ${featureTitle}`
    );
    const tech = TechDetector.detect(workspaceRoot);
    if (tech.repo) {
      scaffold = scaffold.replace(
        /\*\*Repository:\*\* \[repo name or path\]/,
        `**Repository:** \`${tech.repo}\``
      );
    }
    if (tech.stackSummary) {
      scaffold = scaffold.replace(
        /\*\*Tech stack:\*\* \[Languages, frameworks, relevant versions\]/,
        `**Tech stack:** ${tech.stackSummary}`
      );
    }
    fs4.writeFileSync(briefPath, scaffold);
    const briefUri = vscode8.Uri.file(briefPath);
    await vscode8.window.showTextDocument(briefUri);
    const techNote = tech.stackSummary ? ` Stack pre-filled: ${tech.stackSummary}.` : "";
    vscode8.window.showInformationMessage(
      `ProdMan: features/${featureName}/agent-brief.md created.${techNote} Fill in remaining fields to reach agent-ready.`
    );
  }
};

// src/panel/ContextHealthPanel.ts
var vscode9 = __toESM(require("vscode"));
var fs6 = __toESM(require("fs"));
var path6 = __toESM(require("path"));

// src/detector/DriftDetector.ts
var fs5 = __toESM(require("fs"));
var path5 = __toESM(require("path"));
var DriftDetector = class {
  static detect(workspaceRoot) {
    const constraintsPath = path5.join(workspaceRoot, "prodman-context", "constraints.md");
    if (!fs5.existsSync(constraintsPath)) {
      return {
        isDrifted: false,
        detectedStack: "",
        recordedStack: "",
        message: "constraints.md not found"
      };
    }
    const detected = TechDetector.detect(workspaceRoot);
    const detectedStack = detected.stackSummary;
    if (!detectedStack) {
      return {
        isDrifted: false,
        detectedStack,
        recordedStack: "",
        message: "No detectable stack in workspace"
      };
    }
    const content = fs5.readFileSync(constraintsPath, "utf8");
    const contentNoComments = content.replace(/<!--[\s\S]*?-->/g, "");
    const techSectionMatch = contentNoComments.match(
      /##\s+Technical(?:\s+Constraints)?\s*\n([\s\S]*?)(?=\n##|\s*$)/i
    );
    const recordedStack = techSectionMatch ? techSectionMatch[1].trim() : contentNoComments.trim();
    if (!recordedStack || recordedStack.length < 5) {
      return {
        isDrifted: true,
        detectedStack,
        recordedStack,
        message: `Technical Constraints not filled in. Detected stack: ${detectedStack}`
      };
    }
    const detectedFrameworks = detectedStack.split(",").map((f) => f.trim().split(" ")[0].toLowerCase()).filter(Boolean);
    const recordedLower = recordedStack.toLowerCase();
    const missingFrameworks = detectedFrameworks.filter((f) => !recordedLower.includes(f));
    if (missingFrameworks.length > 0) {
      return {
        isDrifted: true,
        detectedStack,
        recordedStack,
        message: `Stack drift \u2014 ${missingFrameworks.join(", ")} detected but not in constraints.md`
      };
    }
    return {
      isDrifted: false,
      detectedStack,
      recordedStack,
      message: "Stack is up to date"
    };
  }
};

// src/panel/ContextHealthPanel.ts
var ContextHealthItem = class extends vscode9.TreeItem {
  constructor(label, status, filePath, tooltip, description) {
    super(label, vscode9.TreeItemCollapsibleState.None);
    this.status = status;
    this.tooltip = tooltip;
    this.description = description ?? this.statusDescription();
    this.iconPath = this.statusIcon();
    if (filePath) {
      this.command = {
        command: "vscode.open",
        title: "Open",
        arguments: [vscode9.Uri.file(filePath)]
      };
    }
  }
  statusDescription() {
    switch (this.status) {
      case "ok":
        return "\u2713";
      case "warning":
        return "\u26A0";
      case "error":
        return "\u2717 Missing";
      case "info":
        return "\u2139";
    }
  }
  statusIcon() {
    switch (this.status) {
      case "ok":
        return new vscode9.ThemeIcon("check", new vscode9.ThemeColor("testing.iconPassed"));
      case "warning":
        return new vscode9.ThemeIcon("warning", new vscode9.ThemeColor("testing.iconQueued"));
      case "error":
        return new vscode9.ThemeIcon("error", new vscode9.ThemeColor("testing.iconFailed"));
      case "info":
        return new vscode9.ThemeIcon("info", new vscode9.ThemeColor("notificationsInfoIcon.foreground"));
    }
  }
};
var ContextHealthPanel = class {
  constructor() {
    this._onDidChangeTreeData = new vscode9.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }
  refresh() {
    this._onDidChangeTreeData.fire();
  }
  getTreeItem(element) {
    return element;
  }
  getChildren() {
    const workspaceRoot = vscode9.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
      return [new ContextHealthItem("No workspace open", "info", void 0, "Open a folder to see context health")];
    }
    const contextDir = path6.join(workspaceRoot, "prodman-context");
    const items = [];
    const productPath = path6.join(contextDir, "product.md");
    items.push(new ContextHealthItem(
      "product.md",
      fs6.existsSync(productPath) ? "ok" : "error",
      fs6.existsSync(productPath) ? productPath : void 0,
      fs6.existsSync(productPath) ? "Product context \u2014 click to edit" : "Missing \u2014 run ProdMan: Initialize Workspace"
    ));
    const usersPath = path6.join(contextDir, "users.md");
    items.push(new ContextHealthItem(
      "users.md",
      fs6.existsSync(usersPath) ? "ok" : "error",
      fs6.existsSync(usersPath) ? usersPath : void 0,
      fs6.existsSync(usersPath) ? "User segments \u2014 click to edit" : "Missing \u2014 run ProdMan: Initialize Workspace"
    ));
    const constraintsPath = path6.join(contextDir, "constraints.md");
    if (fs6.existsSync(constraintsPath)) {
      const drift = DriftDetector.detect(workspaceRoot);
      items.push(new ContextHealthItem(
        "constraints.md",
        drift.isDrifted ? "warning" : "ok",
        constraintsPath,
        drift.isDrifted ? drift.message : "Constraints up to date \u2014 click to edit",
        drift.isDrifted ? "\u26A0 Stack drift" : "\u2713"
      ));
    } else {
      items.push(new ContextHealthItem(
        "constraints.md",
        "error",
        void 0,
        "Missing \u2014 run ProdMan: Initialize Workspace"
      ));
    }
    const historyPath = path6.join(contextDir, "history.md");
    items.push(new ContextHealthItem(
      "history.md",
      fs6.existsSync(historyPath) ? "ok" : "info",
      fs6.existsSync(historyPath) ? historyPath : void 0,
      fs6.existsSync(historyPath) ? "Decision history \u2014 grows via /pm-retro" : "Optional \u2014 created automatically by /pm-retro"
    ));
    const signalsPath = path6.join(contextDir, "signals.md");
    if (fs6.existsSync(signalsPath)) {
      const content = fs6.readFileSync(signalsPath, "utf8");
      const count = (content.match(/^- \[/gm) ?? []).length;
      items.push(new ContextHealthItem(
        "signals.md",
        "info",
        signalsPath,
        `${count} signal${count !== 1 ? "s" : ""} captured`,
        `${count} signal${count !== 1 ? "s" : ""}`
      ));
    }
    return items;
  }
};

// src/panel/SignalInboxPanel.ts
var vscode10 = __toESM(require("vscode"));
var fs7 = __toESM(require("fs"));
var path7 = __toESM(require("path"));
var SignalItem = class extends vscode10.TreeItem {
  constructor(date, signal) {
    super(signal, vscode10.TreeItemCollapsibleState.None);
    this.date = date;
    this.signal = signal;
    this.description = date;
    this.tooltip = `[${date}] ${signal}`;
    this.iconPath = new vscode10.ThemeIcon("lightbulb");
    this.contextValue = "signal";
  }
};
var EmptyItem = class extends vscode10.TreeItem {
  constructor(message) {
    super(message, vscode10.TreeItemCollapsibleState.None);
    this.iconPath = new vscode10.ThemeIcon("inbox");
  }
};
var SignalInboxPanel = class {
  constructor() {
    this._onDidChangeTreeData = new vscode10.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }
  refresh() {
    this._onDidChangeTreeData.fire();
  }
  getTreeItem(element) {
    return element;
  }
  getChildren() {
    const workspaceRoot = vscode10.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
      return [new EmptyItem("No workspace open")];
    }
    const signalsPath = path7.join(workspaceRoot, "prodman-context", "signals.md");
    if (!fs7.existsSync(signalsPath)) {
      return [new EmptyItem("No signals yet \u2014 use Capture Signal to add one")];
    }
    const content = fs7.readFileSync(signalsPath, "utf8");
    const lines = content.split("\n").filter((l) => /^- \[/.test(l));
    if (lines.length === 0) {
      return [new EmptyItem("No signals yet \u2014 use Capture Signal to add one")];
    }
    return [...lines].reverse().map((line) => {
      const match = line.match(/^- \[([^\]]+)\] (.+)/);
      const date = match?.[1] ?? "?";
      const text = match?.[2] ?? line.slice(2);
      return new SignalItem(date, text);
    });
  }
};

// src/panel/PipelineDashboard.ts
var vscode11 = __toESM(require("vscode"));
var fs8 = __toESM(require("fs"));
var path8 = __toESM(require("path"));
var import_core5 = __toESM(require_dist());
var ZONE_MARKERS = [
  { file: "retro.md", zone: "Zone 5", level: 5 },
  { file: "tickets.md", zone: "Zone 4", level: 4 },
  { file: "handoff-eng.md", zone: "Zone 4", level: 4 },
  { file: "handoff-design.md", zone: "Zone 4", level: 4 },
  { file: "stakeholder-brief.md", zone: "Zone 4", level: 4 },
  { file: "agent-brief.md", zone: "Zone 2", level: 2 },
  { file: "prd.md", zone: "Zone 2", level: 2 },
  { file: "plan.md", zone: "Zone 2", level: 2 },
  { file: "commitment.md", zone: "Zone 1", level: 1 },
  { file: "exploration.md", zone: "Zone 1", level: 1 },
  { file: "framing.md", zone: "Zone 1", level: 1 },
  { file: "signal.md", zone: "Zone 1", level: 1 }
];
var PipelineDashboard = class {
  static {
    this.viewType = "prodmanPipeline";
  }
  resolveWebviewView(webviewView) {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: false };
    this.render();
  }
  refresh() {
    this.render();
  }
  render() {
    if (!this._view) return;
    this._view.webview.html = this.buildHtml();
  }
  getFeatures(workspaceRoot) {
    const featuresDir = path8.join(workspaceRoot, "features");
    if (!fs8.existsSync(featuresDir)) return [];
    const entries = fs8.readdirSync(featuresDir, { withFileTypes: true });
    const linter = new import_core5.Linter();
    const rows = [];
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const featureDir = path8.join(featuresDir, entry.name);
      let zone = "\u2014";
      for (const marker of ZONE_MARKERS) {
        if (fs8.existsSync(path8.join(featureDir, marker.file))) {
          zone = marker.zone;
          break;
        }
      }
      let readiness = "none";
      const briefPath = path8.join(featureDir, "agent-brief.md");
      if (fs8.existsSync(briefPath)) {
        try {
          const result = linter.lintFile(briefPath);
          readiness = result.readiness;
        } catch {
          readiness = "incomplete";
        }
      }
      rows.push({ name: entry.name, zone, readiness });
    }
    return rows.sort((a, b) => {
      const zoneOrder = (z) => z === "Zone 5" ? 5 : z === "Zone 4" ? 4 : z === "Zone 2" ? 2 : z === "Zone 1" ? 1 : 0;
      return zoneOrder(b.zone) - zoneOrder(a.zone) || a.name.localeCompare(b.name);
    });
  }
  readinessBadge(r) {
    if (r === "none") return '<span class="dim">\u2014</span>';
    const color = r === "agent-ready" ? "#4caf50" : r === "review-needed" ? "#ff9800" : "#f44336";
    const label = r === "agent-ready" ? "\u2713 Ready" : r === "review-needed" ? "\u26A0 Review" : "\u2717 Draft";
    return `<span style="color:${color};font-weight:600">${label}</span>`;
  }
  buildHtml() {
    const workspaceRoot = vscode11.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
      return `<html><body class="empty">No workspace open.</body></html>`;
    }
    const features = this.getFeatures(workspaceRoot);
    const rows = features.length === 0 ? `<tr><td colspan="3" class="empty">No features yet \u2014 run /pm-ff to create one</td></tr>` : features.map((f) => `
          <tr>
            <td class="name">${f.name}</td>
            <td class="zone">${f.zone}</td>
            <td>${this.readinessBadge(f.readiness)}</td>
          </tr>`).join("");
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: var(--vscode-font-family);
    font-size: var(--vscode-font-size);
    color: var(--vscode-foreground);
    background: var(--vscode-sideBar-background);
  }
  table { width: 100%; border-collapse: collapse; }
  th {
    text-align: left;
    padding: 6px 10px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--vscode-descriptionForeground);
    border-bottom: 1px solid var(--vscode-panel-border);
  }
  td {
    padding: 5px 10px;
    border-bottom: 1px solid var(--vscode-panel-border);
    font-size: 12px;
  }
  .name { font-weight: 500; }
  .zone { color: var(--vscode-descriptionForeground); }
  .dim { color: var(--vscode-descriptionForeground); }
  .empty { padding: 24px 16px; color: var(--vscode-descriptionForeground); font-size: 12px; text-align: center; }
  tr:hover td { background: var(--vscode-list-hoverBackground); }
</style>
</head>
<body>
<table>
  <thead>
    <tr>
      <th>Feature</th>
      <th>Zone</th>
      <th>Readiness</th>
    </tr>
  </thead>
  <tbody>${rows}</tbody>
</table>
</body>
</html>`;
  }
};

// src/extension.ts
var AGENT_BRIEF_SELECTOR = {
  scheme: "file",
  pattern: "**/agent-brief.md"
};
function activate(context) {
  const diagnosticsProvider = new SpecDiagnosticsProvider();
  const readinessBar = new SpecReadinessBar();
  const diagnosticCollection = vscode12.languages.createDiagnosticCollection("prodman");
  context.subscriptions.push(diagnosticCollection);
  function lintDocument(document) {
    if (!isAgentBrief(document)) return;
    const result = diagnosticsProvider.lint(document);
    diagnosticCollection.set(document.uri, result.diagnostics);
    readinessBar.update(result.readiness, result.rulesPassing, result.rulesTotal);
  }
  context.subscriptions.push(
    vscode12.workspace.onDidOpenTextDocument(lintDocument),
    vscode12.workspace.onDidChangeTextDocument((e) => lintDocument(e.document)),
    vscode12.workspace.onDidCloseTextDocument((doc) => {
      if (isAgentBrief(doc)) {
        diagnosticCollection.delete(doc.uri);
        readinessBar.hide();
      }
    })
  );
  vscode12.workspace.textDocuments.forEach(lintDocument);
  context.subscriptions.push(
    vscode12.window.onDidChangeActiveTextEditor((editor) => {
      if (editor && isAgentBrief(editor.document)) {
        lintDocument(editor.document);
      } else {
        readinessBar.hide();
      }
    })
  );
  context.subscriptions.push(
    vscode12.languages.registerCodeLensProvider(
      AGENT_BRIEF_SELECTOR,
      new SpecCodeLensProvider()
    )
  );
  context.subscriptions.push(
    vscode12.languages.registerCodeActionsProvider(
      AGENT_BRIEF_SELECTOR,
      new QuickFixProvider(),
      { providedCodeActionKinds: [vscode12.CodeActionKind.QuickFix] }
    )
  );
  const contextHealthPanel = new ContextHealthPanel();
  context.subscriptions.push(
    vscode12.window.registerTreeDataProvider("prodmanContextHealth", contextHealthPanel)
  );
  const signalInboxPanel = new SignalInboxPanel();
  context.subscriptions.push(
    vscode12.window.registerTreeDataProvider("prodmanSignalInbox", signalInboxPanel)
  );
  const pipelineDashboard = new PipelineDashboard();
  context.subscriptions.push(
    vscode12.window.registerWebviewViewProvider(PipelineDashboard.viewType, pipelineDashboard)
  );
  context.subscriptions.push(
    vscode12.commands.registerCommand("prodman.launchAgent", async () => {
      const doc = activeAgentBriefDocument();
      if (!doc) {
        vscode12.window.showErrorMessage("ProdMan: Open an agent-brief.md file first.");
        return;
      }
      await AgentBriefLauncher.launch(doc);
    }),
    vscode12.commands.registerCommand("prodman.compileSpec", async () => {
      const doc = activeAgentBriefDocument();
      if (!doc) {
        vscode12.window.showErrorMessage("ProdMan: Open an agent-brief.md file first.");
        return;
      }
      await AgentBriefLauncher.compileOnly(doc);
    }),
    vscode12.commands.registerCommand("prodman.previewSpec", async () => {
      const doc = activeAgentBriefDocument();
      if (!doc) {
        vscode12.window.showErrorMessage("ProdMan: Open an agent-brief.md file first.");
        return;
      }
      SpecPreviewPanel.show(context.extensionUri, doc);
    }),
    vscode12.commands.registerCommand("prodman.captureSignal", async () => {
      const signal = await vscode12.window.showInputBox({
        prompt: "Describe the signal (user feedback, problem, opportunity)",
        placeHolder: "e.g. Users keep asking for bulk export"
      });
      if (!signal) return;
      await appendSignal(signal);
      signalInboxPanel.refresh();
    }),
    vscode12.commands.registerCommand("prodman.initWorkspace", async () => {
      await InitWizard.run(context.extensionUri);
    }),
    vscode12.commands.registerCommand("prodman.refreshContextHealth", () => {
      contextHealthPanel.refresh();
    }),
    vscode12.commands.registerCommand("prodman.refreshSignalInbox", () => {
      signalInboxPanel.refresh();
    }),
    vscode12.commands.registerCommand("prodman.refreshPipeline", () => {
      pipelineDashboard.refresh();
    })
  );
  checkAndPromptInit();
  context.subscriptions.push(readinessBar);
}
function deactivate() {
}
function isAgentBrief(document) {
  return path9.basename(document.fileName) === "agent-brief.md";
}
function activeAgentBriefDocument() {
  const editor = vscode12.window.activeTextEditor;
  if (editor && isAgentBrief(editor.document)) return editor.document;
  return void 0;
}
async function appendSignal(signal) {
  const workspaceRoot = vscode12.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) return;
  const signalsPath = path9.join(workspaceRoot, "prodman-context", "signals.md");
  const timestamp = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
  const entry = `
- [${timestamp}] ${signal}
`;
  if (!fs9.existsSync(signalsPath)) {
    fs9.mkdirSync(path9.dirname(signalsPath), { recursive: true });
    fs9.writeFileSync(signalsPath, `# Signals
${entry}`);
  } else {
    fs9.appendFileSync(signalsPath, entry);
  }
  vscode12.window.showInformationMessage(`ProdMan: Signal captured \u2192 prodman-context/signals.md`);
}
function checkAndPromptInit() {
  const workspaceRoot = vscode12.workspace.workspaceFolders?.[0]?.uri.fsPath;
  if (!workspaceRoot) return;
  const productMd = path9.join(workspaceRoot, "prodman-context", "product.md");
  const claudeMd = path9.join(workspaceRoot, "CLAUDE.md");
  if (!fs9.existsSync(productMd) && !fs9.existsSync(claudeMd)) {
    vscode12.window.showInformationMessage(
      "No PRODMAN workspace detected. Initialize now?",
      "Initialize",
      "Not now"
    ).then((choice) => {
      if (choice === "Initialize") {
        vscode12.commands.executeCommand("prodman.initWorkspace");
      }
    });
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  activate,
  deactivate
});
//# sourceMappingURL=extension.js.map
