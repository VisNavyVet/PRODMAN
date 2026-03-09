import * as fs from 'fs'
import * as path from 'path'
import type { CompiledSpec } from './types'

/**
 * Read the current spec_version from an existing compiled-spec.json.
 * Returns the next version (current + 1), or 1 if no compiled spec exists.
 */
export function getNextVersion(featureDir: string): number {
  const specPath = path.join(featureDir, 'compiled-spec.json')

  if (!fs.existsSync(specPath)) return 1

  try {
    const raw = fs.readFileSync(specPath, 'utf8')
    const existing = JSON.parse(raw) as Partial<CompiledSpec>
    const current = typeof existing.spec_version === 'number' ? existing.spec_version : 0
    return current + 1
  } catch {
    return 1
  }
}
