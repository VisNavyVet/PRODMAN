import * as fs from 'fs'
import * as path from 'path'
import chalk from 'chalk'

interface InitOptions {
  contextPath?: string
}

const CONTEXT_TEMPLATES = {
  'product.md': `# Product Context

## What We Build
[2–3 sentences. What the product is, what it does, who it's for.]

## Positioning
[How we're positioned vs. alternatives. What we're better at and what we're not trying to be.]

## Core Value Proposition
[The single most important thing users get from using this product.]

## Current Stage
[Early / Growth / Scale / Enterprise — and what that means for how we work]

## Key Metrics We Care About
- [Primary metric — e.g., weekly active users, ARR, NPS]
- [Secondary metric]
- [Retention / engagement metric]

## Product Principles (if any)
[Things the team has agreed to always/never do]
`,
  'users.md': `# User Segments

## Segment 1: [Name]
- **Who they are:** [1–2 sentences. Role, context, how they end up in our product]
- **What they're trying to do:** [The job they're hiring our product to do]
- **Where they struggle:** [The biggest friction points or unmet needs]
- **What success looks like for them:** [The outcome they care about]
- **Usage pattern:** [Daily / weekly / event-driven, primary surfaces]

## Who We're NOT Building For
[Explicit statement of user types or use cases we've decided not to serve]
`,
  'constraints.md': `# Constraints

## Technical Constraints
- [Constraint 1]

## Legal / Compliance
- [Constraint 1]

## Organizational Constraints
- [Constraint 1]

## Known Non-Starters
- [Non-starter 1]
`,
  'history.md': `# Product History & Decisions

## Features Shipped (last 6–12 months)
| Feature | Date | Outcome | Key Learning |
|---------|------|---------|-------------|
| [Feature] | [Date] | [Hit / Missed / Mixed] | [1-line learning] |

## Active Strategic Bets
- [Bet 1]

## Ruled Out (and why)
| Idea | Why ruled out | Revisit when |
|------|--------------|-------------|
| [Idea] | [Reason] | [Condition] |

---

## Retro Learnings
<!-- Auto-populated by /pm-retro after each feature launch. Do not edit manually. -->
`,
}

export async function initCommand(options: InitOptions): Promise<void> {
  const contextPath = path.resolve(options.contextPath ?? 'prodman-context')
  const featuresPath = path.resolve('features')

  let created = false

  // Create prodman-context/
  if (!fs.existsSync(contextPath)) {
    fs.mkdirSync(contextPath, { recursive: true })

    for (const [filename, content] of Object.entries(CONTEXT_TEMPLATES)) {
      const filePath = path.join(contextPath, filename)
      fs.writeFileSync(filePath, content)
    }

    console.log(chalk.green('✓') + ` Created prodman-context/ with 4 context templates`)
    created = true
  } else {
    console.log(chalk.dim('prodman-context/ already exists — skipping'))
  }

  // Create features/
  if (!fs.existsSync(featuresPath)) {
    fs.mkdirSync(featuresPath, { recursive: true })
    console.log(chalk.green('✓') + ' Created features/')
    created = true
  }

  if (created) {
    console.log()
    console.log(chalk.bold('ProdMan initialized.'))
    console.log()
    console.log('Next steps:')
    console.log(`  1. Run ${chalk.cyan('/pm-import')} in your AI tool to populate prodman-context/`)
    console.log(`  2. Run ${chalk.cyan('/pm-signal')} to capture your first feature signal`)
    console.log(`  3. Run ${chalk.cyan('prodman validate <feature>')} to check spec quality`)
  } else {
    console.log(chalk.dim('Nothing to create — ProdMan is already initialized.'))
  }
}
