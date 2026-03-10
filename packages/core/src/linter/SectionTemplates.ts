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
  name: string
  /** H2 heading text as it should appear in the file */
  heading: string
  /** Markdown body to insert beneath the heading */
  body: string
  /** Short description shown in VS Code completion UI */
  description: string
}

export const SECTION_TEMPLATES: Record<string, SectionTemplate> = {
  'task summary': {
    name: 'task summary',
    heading: '## Task Summary',
    body: 'One sentence describing what this feature does and why.',
    description: 'Single-sentence description of what to build and why',
  },

  'product context': {
    name: 'product context',
    heading: '## Product Context',
    body: [
      '- **Product:** [Your product name]',
      '- **Affected segment:** [Primary user segment]',
    ].join('\n'),
    description: 'Product name and affected user segment',
  },

  'technical context': {
    name: 'technical context',
    heading: '## Technical Context',
    body: [
      '- **Repository:** [repo-name]',
      '- **Relevant files:**',
      '  - `path/to/relevant/file.ts`',
      '- **Tech stack:**',
      '  - [Framework or language]',
      '- **Related systems:**',
      '  - [Service or API name, or None]',
    ].join('\n'),
    description: 'Repo, relevant files, stack, and related systems',
  },

  'in scope': {
    name: 'in scope',
    heading: '### In Scope',
    body: '- [What this feature covers]',
    description: 'What is explicitly included in this feature',
  },

  'out of scope': {
    name: 'out of scope',
    heading: '### Out of Scope',
    body: '- [What is explicitly excluded from this feature]',
    description: 'What the agent must not build',
  },

  'scope': {
    name: 'scope',
    heading: '## Scope',
    body: [
      '### In Scope',
      '',
      '- [What this feature covers]',
      '',
      '### Out of Scope',
      '',
      '- [What is explicitly excluded from this feature]',
    ].join('\n'),
    description: 'In scope and out of scope boundaries',
  },

  'requirements': {
    name: 'requirements',
    heading: '## Requirements',
    body: '- [Functional requirement — what the agent must implement]',
    description: 'Functional requirements the agent must implement',
  },

  'anti-requirements': {
    name: 'anti-requirements',
    heading: '## Anti-Requirements',
    body: '- [What the agent must not do or introduce]',
    description: 'Behaviours and patterns the agent must avoid',
  },

  'constraints': {
    name: 'constraints',
    heading: '## Constraints',
    body: [
      '- **Performance:** None specified',
      '- **Compliance:** None specified',
      '- **Accessibility:** None specified',
    ].join('\n'),
    description: 'Performance, compliance, and accessibility constraints',
  },

  'acceptance criteria': {
    name: 'acceptance criteria',
    heading: '## Acceptance Criteria',
    body: [
      '- [ ] User can [specific, observable action]',
      '- [ ] System [specific, verifiable response]',
      '- [ ] [Edge case scenario] is handled correctly',
    ].join('\n'),
    description: 'Testable pass/fail criteria (minimum 3)',
  },

  'edge cases': {
    name: 'edge cases',
    heading: '## Edge Cases',
    body: [
      '| Scenario / Condition | Expected Behavior |',
      '|----------------------|-------------------|',
      '| [Describe edge case] | [What should happen] |',
    ].join('\n'),
    description: 'Edge cases the agent should handle',
  },

  'definition of done': {
    name: 'definition of done',
    heading: '## Definition of Done',
    body: [
      '- [ ] All acceptance criteria pass',
      '- [ ] Unit tests written and passing',
      '- [ ] No lint errors or type errors',
    ].join('\n'),
    description: 'Completion checklist (minimum 3 items)',
  },

  'escalation triggers': {
    name: 'escalation triggers',
    heading: '## Escalation Triggers',
    body: '- [Question or ambiguity the agent must raise before proceeding]',
    description: 'Questions the agent should ask, not answer',
  },
}

/**
 * Full agent-brief.md scaffold template.
 * Used by InitWizard and (future) Brief Generator.
 * Produces a file that shows diagnostics on open,
 * guiding the user to complete each section.
 */
export const AGENT_BRIEF_SCAFFOLD = `# Agent Brief: [Feature Title]

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

- [Functional requirement — what the agent must implement]

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
`
