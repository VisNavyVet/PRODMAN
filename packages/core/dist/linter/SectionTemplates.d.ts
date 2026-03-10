/**
 * Canonical section templates for agent-brief.md.
 *
 * Used by:
 * - @prodman/vscode QuickFixProvider (insert missing sections)
 * - @prodman/vscode CompletionProvider (section autocomplete)
 *
 * Templates are designed to pass section-presence lint checks while
 * leaving clearly-marked placeholders — diagnostics guide the user
 * to fill them in properly.
 */
export interface SectionTemplate {
    /** Canonical section name (matches MarkdownSectionParser keys) */
    name: string;
    /** H2 heading text as it should appear in the file */
    heading: string;
    /** Markdown body to insert beneath the heading */
    body: string;
    /** Short description shown in VS Code completion UI */
    description: string;
}
export declare const SECTION_TEMPLATES: Record<string, SectionTemplate>;
/**
 * Full agent-brief.md scaffold template.
 * Used by InitWizard and (future) Brief Generator.
 * Produces a file that shows diagnostics on open,
 * guiding the user to complete each section.
 */
export declare const AGENT_BRIEF_SCAFFOLD = "# Agent Brief: [Feature Title]\n\n## Task Summary\n\nOne sentence describing what this feature does and why.\n\n## Product Context\n\n- **Product:** [Your product name]\n- **Affected segment:** [Primary user segment]\n\n## Technical Context\n\n- **Repository:** [repo-name]\n- **Relevant files:**\n  - `path/to/relevant/file.ts`\n- **Tech stack:**\n  - [Framework or language]\n- **Related systems:**\n  - [Service or API name, or None]\n\n## Scope\n\n### In Scope\n\n- [What this feature covers]\n\n### Out of Scope\n\n- [What is explicitly excluded from this feature]\n\n## Requirements\n\n- [Functional requirement \u2014 what the agent must implement]\n\n## Anti-Requirements\n\n- [What the agent must not do or introduce]\n\n## Constraints\n\n- **Performance:** None specified\n- **Compliance:** None specified\n- **Accessibility:** None specified\n\n## Acceptance Criteria\n\n- [ ] User can [specific, observable action]\n- [ ] System [specific, verifiable response]\n- [ ] [Edge case scenario] is handled correctly\n\n## Edge Cases\n\n| Scenario / Condition | Expected Behavior |\n|----------------------|-------------------|\n| [Describe edge case] | [What should happen] |\n\n## Definition of Done\n\n- [ ] All acceptance criteria pass\n- [ ] Unit tests written and passing\n- [ ] No lint errors or type errors\n\n## Escalation Triggers\n\n- [Question or ambiguity the agent must raise before proceeding]\n";
//# sourceMappingURL=SectionTemplates.d.ts.map