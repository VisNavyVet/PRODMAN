import * as fs from 'fs'
import * as path from 'path'
import { TechDetector } from './TechDetector'

export interface DriftResult {
  isDrifted: boolean
  detectedStack: string
  recordedStack: string
  message: string
}

/**
 * Detects when constraints.md is out of sync with the detected tech stack.
 * Compares TechDetector output against constraints.md content.
 */
export class DriftDetector {
  static detect(workspaceRoot: string): DriftResult {
    const constraintsPath = path.join(workspaceRoot, 'prodman-context', 'constraints.md')

    if (!fs.existsSync(constraintsPath)) {
      return {
        isDrifted: false,
        detectedStack: '',
        recordedStack: '',
        message: 'constraints.md not found',
      }
    }

    const detected = TechDetector.detect(workspaceRoot)
    const detectedStack = detected.stackSummary

    if (!detectedStack) {
      return {
        isDrifted: false,
        detectedStack,
        recordedStack: '',
        message: 'No detectable stack in workspace',
      }
    }

    const content = fs.readFileSync(constraintsPath, 'utf8')

    // Strip HTML comments — templates have instructional comments that shouldn't count
    const contentNoComments = content.replace(/<!--[\s\S]*?-->/g, '')

    // Extract the Technical Constraints section for targeted comparison
    const techSectionMatch = contentNoComments.match(
      /##\s+Technical(?:\s+Constraints)?\s*\n([\s\S]*?)(?=\n##|\s*$)/i
    )
    const recordedStack = techSectionMatch ? techSectionMatch[1].trim() : contentNoComments.trim()

    // If Technical section is blank or only whitespace, flag as unfilled
    if (!recordedStack || recordedStack.length < 5) {
      return {
        isDrifted: true,
        detectedStack,
        recordedStack,
        message: `Technical Constraints not filled in. Detected stack: ${detectedStack}`,
      }
    }

    // Check if major framework names from detected stack appear in constraints.md
    const detectedFrameworks = detectedStack
      .split(',')
      .map(f => f.trim().split(' ')[0].toLowerCase())
      .filter(Boolean)

    const recordedLower = recordedStack.toLowerCase()
    const missingFrameworks = detectedFrameworks.filter(f => !recordedLower.includes(f))

    if (missingFrameworks.length > 0) {
      return {
        isDrifted: true,
        detectedStack,
        recordedStack,
        message: `Stack drift — ${missingFrameworks.join(', ')} detected but not in constraints.md`,
      }
    }

    return {
      isDrifted: false,
      detectedStack,
      recordedStack,
      message: 'Stack is up to date',
    }
  }
}
