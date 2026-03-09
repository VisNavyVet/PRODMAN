import type { ReadinessState } from '../linter/types'

export interface CompiledSpecUser {
  segment: string
  description: string
}

export interface CompiledSpecAC {
  id: string
  statement: string
  testable: boolean
}

export interface CompiledSpecEdgeCase {
  scenario: string
  expected: string
}

export interface CompiledSpecProductContext {
  product: string
  affected_segment: string
}

export interface CompiledSpecTechContext {
  repo: string
  relevant_files: string[]
  stack: string[]
  related_systems: string[]
}

export interface CompiledSpecConstraints {
  performance: string
  compliance: string
  accessibility: string
}

export interface CompiledSpecContextRefs {
  product_md: string
  users_md: string
  tech_md: string | null
  agent_brief_md: string
}

export interface CompiledSpec {
  $schema: string
  feature: string
  spec_version: number
  readiness: ReadinessState
  compiled_at: string
  task_summary: string
  product_context: CompiledSpecProductContext
  technical_context: CompiledSpecTechContext
  problem: string
  users: CompiledSpecUser[]
  in_scope: string[]
  out_of_scope: string[]
  requirements: string[]
  anti_requirements: string[]
  constraints: CompiledSpecConstraints
  acceptance_criteria: CompiledSpecAC[]
  edge_cases: CompiledSpecEdgeCase[]
  definition_of_done: string[]
  escalation_triggers: string[]
  context_refs: CompiledSpecContextRefs
}

export class CompileError extends Error {
  constructor(
    message: string,
    public readonly diagnostics: import('../linter/types').LintDiagnostic[]
  ) {
    super(message)
    this.name = 'CompileError'
  }
}
