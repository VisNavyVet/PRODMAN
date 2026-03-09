import * as fs from 'fs'
import * as path from 'path'
import { Linter } from '@prodman/core'
import type { ReadinessState } from '@prodman/core'
import { readinessBadge, printTable } from '../utils/output'
import chalk from 'chalk'

interface StatusOptions {
  featuresPath?: string
  json?: boolean
}

function timeAgo(mtime: Date): string {
  const diff = Date.now() - mtime.getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'today'
  if (days === 1) return '1 day ago'
  if (days < 30) return `${days} days ago`
  const months = Math.floor(days / 30)
  return `${months} month${months !== 1 ? 's' : ''} ago`
}

function inferZone(featureDir: string): string {
  const files = fs.existsSync(featureDir) ? fs.readdirSync(featureDir) : []
  if (files.includes('retro.md')) return '5 — Ship & Learn'
  if (files.some(f => f.startsWith('handoff'))) return '4 — Handover'
  if (files.includes('agent-brief.md')) return '2 — Plan'
  if (files.includes('commitment.md')) return '1 — Materialise'
  return '0 — Inbox'
}

function lastUpdated(featureDir: string): { date: Date; label: string; isStale: boolean } {
  if (!fs.existsSync(featureDir)) return { date: new Date(0), label: 'unknown', isStale: false }
  const files = fs.readdirSync(featureDir)
    .map(f => fs.statSync(path.join(featureDir, f)).mtime)
  const latest = new Date(Math.max(...files.map(d => d.getTime())))
  const isStale = Date.now() - latest.getTime() > 14 * 86400000
  return { date: latest, label: timeAgo(latest), isStale }
}

function compiledVersion(featureDir: string): string {
  const specPath = path.join(featureDir, 'compiled-spec.json')
  if (!fs.existsSync(specPath)) return '—'
  try {
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'))
    return `v${spec.spec_version}`
  } catch {
    return '?'
  }
}

interface FeatureStatus {
  name: string
  zone: string
  readiness: ReadinessState | '—'
  compiled: string
  lastUpdated: string
  isStale: boolean
}

export async function statusCommand(options: StatusOptions): Promise<void> {
  const featuresPath = path.resolve(options.featuresPath ?? 'features')

  if (!fs.existsSync(featuresPath)) {
    console.log(chalk.yellow('No features/ directory found. Run `prodman init` to set up ProdMan.'))
    return
  }

  const entries = fs.readdirSync(featuresPath, { withFileTypes: true })
    .filter(e => e.isDirectory())

  if (entries.length === 0) {
    console.log(chalk.yellow('No features found. Create a directory under features/ and run /pm-ff.'))
    return
  }

  const linter = new Linter()
  const statuses: FeatureStatus[] = []

  for (const entry of entries) {
    const featureDir = path.join(featuresPath, entry.name)
    const zone = inferZone(featureDir)
    const { label, isStale } = lastUpdated(featureDir)
    const compiled = compiledVersion(featureDir)

    const briefPath = path.join(featureDir, 'agent-brief.md')
    let readiness: ReadinessState | '—' = '—'
    if (fs.existsSync(briefPath)) {
      const result = linter.lintFile(briefPath)
      readiness = result.readiness
    }

    statuses.push({ name: entry.name, zone, readiness, compiled, lastUpdated: label, isStale })
  }

  if (options.json) {
    console.log(JSON.stringify(statuses, null, 2))
    return
  }

  const rows = statuses.map(s => ({
    Feature: s.name,
    Zone: s.zone,
    Readiness: s.readiness === '—' ? chalk.dim('—') : readinessBadge(s.readiness as ReadinessState),
    Compiled: chalk.dim(s.compiled),
    'Last Updated': s.isStale
      ? chalk.yellow(s.lastUpdated + ' ⚠ STALE')
      : chalk.dim(s.lastUpdated),
  }))

  printTable(rows, ['Feature', 'Zone', 'Readiness', 'Compiled', 'Last Updated'])
}
