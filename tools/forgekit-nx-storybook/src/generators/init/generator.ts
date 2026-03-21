import {
  Tree,
  formatFiles,
  logger,
  readJson,
  updateJson,
  getProjects
} from '@nx/devkit'
import { prompt } from 'enquirer'
import { execSync } from 'child_process'

import { ui } from '../../utils/ui'
import { InitGeneratorSchema } from './schema'

/**
 * Init generator that runs automatically when users install
 * @effinrich/forgekit-nx-storybook via `nx add @effinrich/forgekit-nx-storybook`.
 *
 * Checks for @nx/storybook and offers to set it up if missing,
 * then configures workspace-level story generation settings.
 */
export default async function initGenerator(
  tree: Tree,
  options: InitGeneratorSchema
): Promise<void> {
  ui.banner()

  const totalSteps = 3

  // --- Step 1: Check prerequisites ---
  ui.step(1, totalSteps, 'Checking prerequisites')

  const nxStorybookReady = checkNxStorybook(tree)
  const storybookReady = checkStorybookDeps(tree)

  if (!nxStorybookReady) {
    ui.warn(
      '@nx/storybook is not installed. This is required for Storybook configuration.'
    )

    const shouldInstall = await promptInstallNxStorybook()

    if (shouldInstall) {
      ui.info('Installing @nx/storybook...')
      try {
        execSync('npm install --save-dev @nx/storybook --legacy-peer-deps', {
          stdio: 'inherit',
          cwd: process.cwd()
        })
        ui.success('@nx/storybook installed.')
      } catch {
        ui.error('Failed to install @nx/storybook. Please install it manually:')
        ui.hint(
          `Run: ${ui.command(
            'npm install --save-dev @nx/storybook --legacy-peer-deps'
          )}`
        )
        return
      }

      // Prompt to configure a project
      const projectName = await promptConfigureProject(tree)
      if (projectName) {
        ui.info(`Running Storybook configuration for ${projectName}...`)
        try {
          execSync(
            `npx nx g @nx/storybook:configuration --project=${projectName} --uiFramework=@storybook/react-vite --no-interactive`,
            { stdio: 'inherit', cwd: process.cwd() }
          )
          ui.success(`Storybook configured for ${projectName}.`)
        } catch {
          ui.warn(
            'Storybook configuration had issues. You may need to configure manually.'
          )
          ui.hint(
            `Run: ${ui.command(
              `npx nx g @nx/storybook:configuration --project=${projectName}`
            )}`
          )
        }
      }
    } else {
      ui.warn('Skipping @nx/storybook setup. You can set it up later with:')
      ui.hint(
        `${ui.command(
          'npm install --save-dev @nx/storybook && npx nx g @nx/storybook:configuration --project=<your-project>'
        )}`
      )
    }
  } else {
    ui.success('@nx/storybook is installed.')
  }

  // --- Step 2: Ensure Storybook core deps ---
  ui.step(2, totalSteps, 'Ensuring Storybook dependencies')

  if (storybookReady) {
    ui.success('All Storybook packages are present.')
  } else {
    addStorybookDeps(tree)
    ui.success('Added missing Storybook packages to devDependencies.')
    ui.hint(
      `Run ${ui.command('npm install --legacy-peer-deps')} to install them.`
    )
  }

  // --- Step 3: Ready ---
  ui.step(3, totalSteps, 'Setup complete')

  ui.separator()
  ui.info('Available commands:')
  console.log('')
  console.log(
    `    ${ui.command(
      'nx g @effinrich/forgekit-nx-storybook:story'
    )} ${' '.repeat(2)}Generate a story for a component`
  )
  console.log(
    `    ${ui.command('nx run <project>:watch-stories')} ${' '.repeat(
      2
    )}Watch and auto-generate stories`
  )
  ui.separator()

  ui.done('@effinrich/forgekit-nx-storybook is ready to use.')

  if (!options.skipFormat) {
    await formatFiles(tree)
  }
}

function checkNxStorybook(tree: Tree): boolean {
  if (!tree.exists('package.json')) return false

  const packageJson = readJson(tree, 'package.json')
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  }

  return '@nx/storybook' in allDeps
}

function checkStorybookDeps(tree: Tree): boolean {
  if (!tree.exists('package.json')) return false

  const packageJson = readJson(tree, 'package.json')
  const allDeps = {
    ...packageJson.dependencies,
    ...packageJson.devDependencies
  }

  return (
    '@storybook/react-vite' in allDeps &&
    '@storybook/test' in allDeps &&
    'storybook' in allDeps
  )
}

function addStorybookDeps(tree: Tree): void {
  if (!tree.exists('package.json')) return

  updateJson(tree, 'package.json', json => {
    const devDeps = json.devDependencies ?? {}

    const required: Record<string, string> = {
      '@storybook/react-vite': '^8.0.0',
      '@storybook/test': '^8.0.0',
      storybook: '^8.0.0'
    }

    for (const [pkg, version] of Object.entries(required)) {
      if (!devDeps[pkg] && !json.dependencies?.[pkg]) {
        devDeps[pkg] = version
      }
    }

    json.devDependencies = devDeps
    return json
  })
}

async function promptInstallNxStorybook(): Promise<boolean> {
  try {
    const response = await prompt<{ install: boolean }>({
      type: 'confirm',
      name: 'install',
      message: 'Would you like to install and configure @nx/storybook now?',
      initial: true
    })
    return response.install
  } catch {
    // User pressed Ctrl+C or prompt failed
    return false
  }
}

async function promptConfigureProject(tree: Tree): Promise<string | null> {
  const projects = getProjects(tree)
  const libraryProjects: string[] = []

  for (const [name, config] of projects) {
    if (
      config.projectType === 'library' &&
      config.sourceRoot?.includes('src')
    ) {
      libraryProjects.push(name)
    }
  }

  if (libraryProjects.length === 0) return null

  // Show top candidates (UI libs first)
  const uiLibs = libraryProjects.filter(
    p => p.includes('ui') || p.includes('shared')
  )
  const candidates =
    uiLibs.length > 0 ? uiLibs.slice(0, 10) : libraryProjects.slice(0, 10)

  try {
    const response = await prompt<{ project: string }>({
      type: 'select',
      name: 'project',
      message: 'Which project should Storybook be configured for?',
      choices: [...candidates, '(skip — configure later)']
    })

    if (response.project.startsWith('(skip')) return null
    return response.project
  } catch {
    return null
  }
}
