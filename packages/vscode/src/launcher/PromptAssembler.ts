import * as fs from 'fs'
import type { CompiledSpec } from '@prodman/core'

/**
 * Assembles the final agent payload from a compiled spec.
 *
 * The payload is a structured prompt block that an AI agent can consume
 * directly — it includes the full spec JSON plus a context preamble
 * pointing to the product and user context files.
 */
export class PromptAssembler {
  static assemble(spec: CompiledSpec): string {
    const contextBlocks: string[] = []

    // Include product context if the file exists
    if (spec.context_refs.product_md && fs.existsSync(spec.context_refs.product_md)) {
      const productContent = fs.readFileSync(spec.context_refs.product_md, 'utf8').trim()
      contextBlocks.push(`## Product Context\n\n${productContent}`)
    }

    // Include user context if the file exists
    if (spec.context_refs.users_md && fs.existsSync(spec.context_refs.users_md)) {
      const usersContent = fs.readFileSync(spec.context_refs.users_md, 'utf8').trim()
      contextBlocks.push(`## User Context\n\n${usersContent}`)
    }

    const preamble = contextBlocks.length > 0
      ? contextBlocks.join('\n\n') + '\n\n---\n\n'
      : ''

    const specJson = JSON.stringify(spec, null, 2)

    return [
      preamble + '## Agent Brief (Compiled Spec)',
      '',
      '```json',
      specJson,
      '```',
      '',
      '---',
      '',
      `Feature: **${spec.feature}**`,
      `Readiness: **${spec.readiness}**`,
      `Compiled: ${spec.compiled_at}`,
    ].join('\n')
  }
}
