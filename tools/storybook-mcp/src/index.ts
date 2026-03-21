#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema
} from '@modelcontextprotocol/sdk/types.js'
import { exec } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import { promisify } from 'util'

import { glob } from 'glob'

// ---------------------------------------------------------------------------
// Workspace root
// ---------------------------------------------------------------------------

const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT || path.resolve(process.cwd())

// ---------------------------------------------------------------------------
// Config types
// ---------------------------------------------------------------------------

interface LibraryConfig {
  /** Path to component source files, relative to workspace root */
  path: string
  /** Optional separate path for story files (defaults to `path`) */
  storyPath?: string
  /** TypeScript import path for components in this library */
  importPath: string
  /** Port the Storybook dev server runs on */
  storybookPort?: number
}

interface StorybookMcpConfig {
  libraries: Record<string, LibraryConfig>
}

type LibraryName = string

// ---------------------------------------------------------------------------
// Config loading
// ---------------------------------------------------------------------------

function loadConfig(): StorybookMcpConfig {
  // 1. Explicit config file via env var
  const envConfigPath = process.env.STORYBOOK_MCP_CONFIG
  if (envConfigPath && fs.existsSync(envConfigPath)) {
    return parseConfigFile(envConfigPath)
  }

  // 2. storybook-mcp.config.json in workspace root
  const defaultConfigPath = path.join(
    WORKSPACE_ROOT,
    'storybook-mcp.config.json'
  )
  if (fs.existsSync(defaultConfigPath)) {
    return parseConfigFile(defaultConfigPath)
  }

  // 3. Auto-discover: scan for directories that contain .storybook/main.ts
  const discovered = autoDiscoverLibraries()
  if (Object.keys(discovered.libraries).length > 0) {
    console.error(
      '[storybook-mcp] Auto-discovered libraries from workspace. ' +
        'Create storybook-mcp.config.json to customise.'
    )
    return discovered
  }

  // 4. Fallback — empty config; tools still work with explicit component paths
  console.error(
    '[storybook-mcp] No config found. Create storybook-mcp.config.json in your workspace root.\n' +
      'See https://github.com/effinrich/storybook-mcp for documentation.'
  )
  return { libraries: {} }
}

function parseConfigFile(configPath: string): StorybookMcpConfig {
  try {
    const raw = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
    if (!raw.libraries || typeof raw.libraries !== 'object') {
      throw new Error('Config must have a "libraries" object.')
    }
    return raw as StorybookMcpConfig
  } catch (e) {
    console.error(`[storybook-mcp] Failed to parse config at ${configPath}:`, e)
    return { libraries: {} }
  }
}

/**
 * Auto-discover component libraries by scanning for `.storybook/main.ts` files.
 * Also checks common Nx directory conventions (`libs/`, `packages/`).
 */
function autoDiscoverLibraries(): StorybookMcpConfig {
  const libraries: Record<string, LibraryConfig> = {}
  const searchBases = ['libs', 'packages', 'src']

  for (const base of searchBases) {
    const basePath = path.join(WORKSPACE_ROOT, base)
    if (!fs.existsSync(basePath)) continue

    // Find all .storybook/main.ts or main.js files (2 levels deep max)
    const pattern = path.join(basePath, '*/.storybook/main.{ts,js}')
    try {
      const storybookMains = fs.readdirSync(basePath).filter(entry => {
        const storybookDir = path.join(basePath, entry, '.storybook')
        return fs.existsSync(storybookDir)
      })

      for (const libDir of storybookMains) {
        const libRoot = path.join(basePath, libDir)
        // Prefer src/lib if it exists, otherwise use src
        const srcLib = path.join(libRoot, 'src', 'lib')
        const src = path.join(libRoot, 'src')
        const componentPath = fs.existsSync(srcLib)
          ? path.relative(WORKSPACE_ROOT, srcLib)
          : path.relative(WORKSPACE_ROOT, src)

        libraries[libDir] = {
          path: componentPath,
          importPath: '',
          storybookPort: 6006
        }
      }
    } catch {
      // ignore scan errors
    }
  }

  return { libraries }
}

// Load config once at startup
const CONFIG = loadConfig()
const COMPONENT_LIBS = CONFIG.libraries

// ---------------------------------------------------------------------------
// Nx generator runner — delegates file generation to @effinrich/forgekit-nx-storybook
// ---------------------------------------------------------------------------

const execAsync = promisify(exec)

async function runNxGenerator(
  generatorSpec: string,
  flags: string[] = []
): Promise<{ success: boolean; output: string }> {
  const cmd = `npx nx g ${generatorSpec} ${flags.join(' ')}`
  try {
    const { stdout, stderr } = await execAsync(cmd, {
      cwd: WORKSPACE_ROOT,
      timeout: 120_000,
      env: { ...process.env, FORCE_COLOR: '0', NO_COLOR: '1' }
    })
    const output = [stdout, stderr].filter(Boolean).join('\n').trim()
    return { success: true, output }
  } catch (err: unknown) {
    const e = err as { stdout?: string; stderr?: string; message?: string }
    const output = [e.stdout, e.stderr, e.message]
      .filter(Boolean)
      .join('\n')
      .trim()
    return { success: false, output }
  }
}

interface ComponentInfo {
  name: string
  path: string
  hasStory: boolean
  library: LibraryName
  props: PropInfo[]
  exportType: 'default' | 'named' | 'both'
}

interface PropInfo {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description?: string
}

// Create MCP server
const server = new Server(
  {
    name: 'storybook-mcp',
    version: '1.0.0'
  },
  {
    capabilities: {
      tools: {},
      resources: {}
    }
  }
)

// Build a dynamic enum of library names for tool schemas
const libraryNames = Object.keys(COMPONENT_LIBS)
const libraryEnum =
  libraryNames.length > 0 ? [...libraryNames, 'all'] : undefined

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_components',
        description:
          'List React components in the configured component libraries. Returns component names, paths, and whether they have Storybook stories.',
        inputSchema: {
          type: 'object',
          properties: {
            library: {
              type: 'string',
              ...(libraryEnum ? { enum: libraryEnum } : {}),
              description: `Which library to list components from. Defaults to "all". Configured libraries: ${
                libraryNames.join(', ') ||
                'none — add storybook-mcp.config.json'
              }.`
            },
            hasStory: {
              type: 'boolean',
              description:
                'Filter by whether components have stories. Leave empty for all.'
            }
          }
        }
      },
      {
        name: 'analyze_component',
        description:
          'Analyze a React component to extract its props, types, and structure. Useful for understanding a component before generating a story.',
        inputSchema: {
          type: 'object',
          properties: {
            componentPath: {
              type: 'string',
              description:
                'Path to the component file relative to workspace root (e.g., "src/components/button/button.tsx")'
            }
          },
          required: ['componentPath']
        }
      },
      {
        name: 'generate_story',
        description:
          'Analyze a React component and generate a Storybook story by delegating to the @effinrich/forgekit-nx-storybook:story Nx generator. The MCP analyzes the component first (props, Router/Query usage) then passes the right flags to the generator which handles all file writing.',
        inputSchema: {
          type: 'object',
          properties: {
            componentPath: {
              type: 'string',
              description:
                'Path to the component file relative to workspace root (e.g., "libs/shared/ui/src/lib/button/button.tsx")'
            },
            storyTitle: {
              type: 'string',
              description:
                'Optional custom title (e.g., "Components / Forms / Button"). Auto-generated from path if omitted.'
            },
            skipInteractionTests: {
              type: 'boolean',
              description:
                'Skip generating play() interaction test functions. Defaults to false.'
            },
            overwrite: {
              type: 'boolean',
              description:
                'Overwrite an existing .stories.tsx file. Defaults to false.'
            },
            dryRun: {
              type: 'boolean',
              description:
                'Preview what would be generated without writing any files. Defaults to false.'
            }
          },
          required: ['componentPath']
        }
      },
      {
        name: 'get_story_template',
        description:
          'Get a template for a specific type of Storybook story. Useful for understanding patterns or starting from scratch.',
        inputSchema: {
          type: 'object',
          properties: {
            templateType: {
              type: 'string',
              enum: [
                'basic',
                'with-controls',
                'with-variants',
                'with-msw',
                'with-router',
                'page'
              ],
              description: 'Type of story template to generate.'
            },
            libraryStyle: {
              type: 'string',
              enum: ['standard', 'with-router'],
              description:
                'Story style: "standard" uses export-default pattern; "with-router" adds React Router decorator. Defaults to "standard".'
            }
          },
          required: ['templateType']
        }
      },
      {
        name: 'validate_story',
        description:
          'Validate an existing Storybook story file for common issues and best practices.',
        inputSchema: {
          type: 'object',
          properties: {
            storyPath: {
              type: 'string',
              description: 'Path to the story file relative to workspace root.'
            }
          },
          required: ['storyPath']
        }
      },
      {
        name: 'generate_stories',
        description:
          'Bulk generate Storybook stories for all components in an Nx project that are missing them. Delegates to the @effinrich/forgekit-nx-storybook:stories generator and reports a coverage score (A–F).',
        inputSchema: {
          type: 'object',
          properties: {
            project: {
              type: 'string',
              description:
                'Nx project name (e.g., "shared-ui"). Use the name from project.json, not the directory path.'
            },
            skipInteractionTests: {
              type: 'boolean',
              description:
                'Skip play() interaction test functions. Defaults to false.'
            },
            overwrite: {
              type: 'boolean',
              description: 'Overwrite existing story files. Defaults to false.'
            },
            dryRun: {
              type: 'boolean',
              description: 'Preview without writing files. Defaults to false.'
            },
            includeA11y: {
              type: 'boolean',
              description:
                'Include accessibility audit stories. Defaults to true.'
            },
            includeComponentTests: {
              type: 'boolean',
              description:
                'Also generate Playwright .ct.tsx component test files. Defaults to false.'
            }
          },
          required: ['project']
        }
      },
      {
        name: 'generate_component_test',
        description:
          'Generate a co-located Playwright component test (.ct.tsx) for a React component. Delegates to the @effinrich/forgekit-nx-storybook:component-test Nx generator.',
        inputSchema: {
          type: 'object',
          properties: {
            componentPath: {
              type: 'string',
              description:
                'Path to the component file relative to workspace root (e.g., "libs/shared/ui/src/lib/button/button.tsx")'
            },
            overwrite: {
              type: 'boolean',
              description:
                'Overwrite an existing .ct.tsx file. Defaults to false.'
            },
            dryRun: {
              type: 'boolean',
              description: 'Preview without writing files. Defaults to false.'
            }
          },
          required: ['componentPath']
        }
      }
    ]
  }
})

// List resources (component libraries info)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'storybook://libraries',
        name: 'Component Libraries',
        description:
          'Information about available component libraries in the design system',
        mimeType: 'application/json'
      },
      {
        uri: 'storybook://patterns',
        name: 'Story Patterns',
        description: 'Common Storybook story patterns used in this codebase',
        mimeType: 'text/markdown'
      }
    ]
  }
})

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async request => {
  const { uri } = request.params

  if (uri === 'storybook://libraries') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(COMPONENT_LIBS, null, 2)
        }
      ]
    }
  }

  if (uri === 'storybook://patterns') {
    const patterns = `# Storybook Story Patterns

## Basic Component Story
\`\`\`tsx
import { Meta, StoryObj } from '@storybook/react-vite'

import { ComponentName } from './component-name'

export default {
  component: ComponentName,
  title: 'Components / Category / ComponentName',
  tags: ['autodocs'],
  argTypes: {
    // Define controls here
  },
  args: {
    // Default args
  },
} satisfies Meta<typeof ComponentName>

type Story = StoryObj<typeof ComponentName>

export const Default: Story = {
  args: {
    // Story-specific args
  },
}
\`\`\`

## Story with React Router decorator
\`\`\`tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { withRouter } from 'storybook-addon-react-router-v6'

import { ComponentName } from './component-name'

const meta = {
  component: ComponentName,
  title: 'Components / ComponentName',
  decorators: [withRouter],
  args: {},
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
\`\`\`

## Story with MSW (API mocking)
\`\`\`tsx
import type { Meta, StoryObj } from '@storybook/react-vite'
import { http, HttpResponse } from 'msw'

import { ComponentName } from './component-name'

const meta = {
  component: ComponentName,
  title: 'Components / ComponentName',
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/data', () => HttpResponse.json({ items: [] })),
      ],
    },
  },
}
\`\`\`

## Key Conventions
- Use \`satisfies Meta<typeof ComponentName>\` (TypeScript-safe)
- Add \`tags: ['autodocs']\` for automatic documentation
- Use \`@storybook/react-vite\` for Vite-based projects
- Add a \`play\` function for interaction tests (Storybook Test)
`
    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: patterns
        }
      ]
    }
  }

  throw new Error(`Resource not found: ${uri}`)
})

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async request => {
  const { name, arguments: args } = request.params

  switch (name) {
    case 'list_components':
      return await handleListComponents(
        args as { library?: string; hasStory?: boolean }
      )

    case 'analyze_component':
      return await handleAnalyzeComponent(args as { componentPath: string })

    case 'generate_story':
      return await handleGenerateStory(
        args as {
          componentPath: string
          storyTitle?: string
          skipInteractionTests?: boolean
          overwrite?: boolean
          dryRun?: boolean
        }
      )

    case 'get_story_template':
      return await handleGetStoryTemplate(
        args as { templateType: string; libraryStyle?: string }
      )

    case 'validate_story':
      return await handleValidateStory(args as { storyPath: string })

    case 'generate_stories':
      return await handleGenerateStories(
        args as {
          project: string
          skipInteractionTests?: boolean
          overwrite?: boolean
          dryRun?: boolean
          includeA11y?: boolean
          includeComponentTests?: boolean
        }
      )

    case 'generate_component_test':
      return await handleGenerateComponentTest(
        args as {
          componentPath: string
          overwrite?: boolean
          dryRun?: boolean
        }
      )

    default:
      throw new Error(`Unknown tool: ${name}`)
  }
})

// Tool implementations

async function handleListComponents(args: {
  library?: string
  hasStory?: boolean
}) {
  const library = args.library || 'all'
  const components: ComponentInfo[] = []

  const libsToSearch =
    library === 'all'
      ? (Object.keys(COMPONENT_LIBS) as LibraryName[])
      : [library as LibraryName]

  for (const lib of libsToSearch) {
    const libConfig = COMPONENT_LIBS[lib]
    if (!libConfig) continue

    const libPath = path.join(WORKSPACE_ROOT, libConfig.path)

    // Find all .tsx files that aren't stories or tests
    const pattern = path.join(libPath, '**/*.tsx')
    const files = await glob(pattern, {
      ignore: ['**/*.stories.tsx', '**/*.test.tsx', '**/*.spec.tsx']
    })

    for (const file of files) {
      const relativePath = path.relative(WORKSPACE_ROOT, file)
      const dirName = path.dirname(file)
      const baseName = path.basename(file, '.tsx')

      // Check if there's a story file
      const storyFile = path.join(dirName, `${baseName}.stories.tsx`)
      const hasStory = fs.existsSync(storyFile)

      // Skip if filtering by hasStory
      if (args.hasStory !== undefined && args.hasStory !== hasStory) {
        continue
      }

      // Try to determine component name and export type
      const content = fs.readFileSync(file, 'utf-8')
      const componentName = extractComponentName(content, baseName)

      if (componentName) {
        components.push({
          name: componentName,
          path: relativePath,
          hasStory,
          library: lib,
          props: [],
          exportType: detectExportType(content)
        })
      }
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            total: components.length,
            withStories: components.filter(c => c.hasStory).length,
            withoutStories: components.filter(c => !c.hasStory).length,
            components: components.sort((a, b) => a.name.localeCompare(b.name))
          },
          null,
          2
        )
      }
    ]
  }
}

async function handleAnalyzeComponent(args: { componentPath: string }) {
  const fullPath = path.join(WORKSPACE_ROOT, args.componentPath)

  if (!fs.existsSync(fullPath)) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: Component file not found at ${args.componentPath}`
        }
      ]
    }
  }

  const content = fs.readFileSync(fullPath, 'utf-8')
  const componentName = extractComponentName(
    content,
    path.basename(fullPath, '.tsx')
  )
  const props = extractProps(content)
  const imports = extractImports(content)
  const exportType = detectExportType(content)

  // Determine which library this component belongs to
  let library: LibraryName | 'unknown' = 'unknown'
  for (const [lib, config] of Object.entries(COMPONENT_LIBS)) {
    if (args.componentPath.includes(config.path)) {
      library = lib as LibraryName
      break
    }
  }

  // Check for existing story
  const storyPath = args.componentPath.replace('.tsx', '.stories.tsx')
  const hasStory = fs.existsSync(path.join(WORKSPACE_ROOT, storyPath))

  const analysis = {
    componentName,
    filePath: args.componentPath,
    library,
    exportType,
    hasStory,
    storyPath: hasStory ? storyPath : null,
    props,
    imports: imports.slice(0, 20), // Limit imports shown
    usesChakra: content.includes('@chakra-ui'),
    usesRouter:
      content.includes('react-router') ||
      content.includes('useNavigate') ||
      content.includes('useParams'),
    usesQuery:
      content.includes('@tanstack/react-query') || content.includes('useQuery'),
    suggestions: generateSuggestions(content, library, props)
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(analysis, null, 2)
      }
    ]
  }
}

async function handleGenerateStory(args: {
  componentPath: string
  storyTitle?: string
  skipInteractionTests?: boolean
  overwrite?: boolean
  dryRun?: boolean
}) {
  const fullPath = path.join(WORKSPACE_ROOT, args.componentPath)

  if (!fs.existsSync(fullPath)) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: Component file not found at ${args.componentPath}`
        }
      ]
    }
  }

  // MCP brain: analyze the component to surface context before delegating
  const source = fs.readFileSync(fullPath, 'utf-8')
  const componentName = extractComponentName(
    source,
    path.basename(fullPath, '.tsx')
  )
  const props = extractProps(source)
  const usesRouter =
    source.includes('react-router') ||
    source.includes('useNavigate') ||
    source.includes('useParams')
  const usesQuery =
    source.includes('@tanstack/react-query') || source.includes('useQuery')

  const analysisLines = [
    `Component: ${componentName}`,
    `Props detected: ${props.length}`,
    usesRouter
      ? '⚠ Uses React Router — generator will add withRouter decorator'
      : '',
    usesQuery ? '⚠ Uses React Query — consider adding MSW handlers' : ''
  ].filter(Boolean)

  // Build flags and delegate to the Nx generator
  const flags: string[] = [`--componentPath="${args.componentPath}"`]
  if (args.storyTitle) flags.push(`--storyTitle="${args.storyTitle}"`)
  if (args.skipInteractionTests) flags.push('--skipInteractionTests')
  if (args.overwrite) flags.push('--overwrite')
  if (args.dryRun) flags.push('--dryRun')

  const result = await runNxGenerator(
    '@effinrich/forgekit-nx-storybook:story',
    flags
  )

  if (!result.success) {
    return {
      content: [
        {
          type: 'text',
          text: [
            `Analysis:\n${analysisLines.join('\n')}`,
            `\nGenerator failed:\n${result.output}`,
            '\nIs @effinrich/forgekit-nx-storybook installed? Run: npm install --save-dev @effinrich/forgekit-nx-storybook'
          ].join('')
        }
      ]
    }
  }

  // Read the generated file and surface it so the AI can show it to the user
  const storyPath = args.componentPath.replace('.tsx', '.stories.tsx')
  const generatedPath = path.join(WORKSPACE_ROOT, storyPath)
  const generatedContent =
    !args.dryRun && fs.existsSync(generatedPath)
      ? `\n\n**Generated: ${storyPath}**\n\`\`\`tsx\n${fs.readFileSync(
          generatedPath,
          'utf-8'
        )}\n\`\`\``
      : ''

  return {
    content: [
      {
        type: 'text',
        text: `Analysis:\n${analysisLines.join('\n')}\n\nGenerator output:\n${
          result.output
        }${generatedContent}`
      }
    ]
  }
}

async function handleGetStoryTemplate(args: {
  templateType: string
  libraryStyle?: string
}) {
  const useRouter = args.libraryStyle === 'with-router'
  const templates: Record<string, string> = {
    basic: getBasicTemplate(useRouter),
    'with-controls': getControlsTemplate(),
    'with-variants': getVariantsTemplate(),
    'with-msw': getMswTemplate(),
    'with-router': getRouterTemplate(),
    page: getPageTemplate()
  }

  const template = templates[args.templateType]

  if (!template) {
    return {
      content: [
        {
          type: 'text',
          text: `Unknown template type: ${
            args.templateType
          }. Available types: ${Object.keys(templates).join(', ')}`
        }
      ]
    }
  }

  return {
    content: [
      {
        type: 'text',
        text: `# ${args.templateType} Story Template\n\n\`\`\`tsx\n${template}\n\`\`\`\n`
      }
    ]
  }
}

async function handleValidateStory(args: { storyPath: string }) {
  const fullPath = path.join(WORKSPACE_ROOT, args.storyPath)

  if (!fs.existsSync(fullPath)) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: Story file not found at ${args.storyPath}`
        }
      ]
    }
  }

  const content = fs.readFileSync(fullPath, 'utf-8')
  const issues: string[] = []
  const suggestions: string[] = []

  // Check for common issues
  if (!content.includes("from '@storybook/react-vite'")) {
    issues.push(
      'Should import from @storybook/react-vite (not @storybook/react)'
    )
  }

  if (!content.includes('export default')) {
    issues.push('Missing default export for story meta')
  }

  if (!content.includes('component:')) {
    issues.push('Missing component property in meta')
  }

  if (!content.includes('title:')) {
    suggestions.push('Consider adding a title property for better organization')
  }

  // Check for React Router usage without decorator
  if (content.includes('useNavigate') || content.includes('useParams')) {
    if (!content.includes('withRouter') && !content.includes('MemoryRouter')) {
      issues.push(
        'Component appears to use React Router hooks but story is missing a withRouter decorator'
      )
    }
  }

  // Check for accessibility
  if (!content.includes('aria-')) {
    suggestions.push(
      'Consider adding aria-label args for accessibility testing'
    )
  }

  // Check for autodocs
  if (!content.includes('autodocs') && !content.includes('tags:')) {
    suggestions.push(
      'Consider adding tags: ["autodocs"] for auto-generated documentation'
    )
  }

  const result = {
    valid: issues.length === 0,
    issueCount: issues.length,
    suggestionCount: suggestions.length,
    issues,
    suggestions
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2)
      }
    ]
  }
}

async function handleGenerateStories(args: {
  project: string
  skipInteractionTests?: boolean
  overwrite?: boolean
  dryRun?: boolean
  includeA11y?: boolean
  includeComponentTests?: boolean
}) {
  const flags: string[] = [`--project="${args.project}"`]
  if (args.skipInteractionTests) flags.push('--skipInteractionTests')
  if (args.overwrite) flags.push('--overwrite')
  if (args.dryRun) flags.push('--dryRun')
  if (args.includeA11y === false) flags.push('--includeA11y=false')
  if (args.includeComponentTests) flags.push('--includeComponentTests')

  const result = await runNxGenerator(
    '@effinrich/forgekit-nx-storybook:stories',
    flags
  )

  return {
    content: [
      {
        type: 'text',
        text: result.success
          ? `Bulk story generation for project "${args.project}":\n\n${result.output}`
          : [
              `Failed to generate stories for project "${args.project}":\n\n${result.output}`,
              '\nIs @effinrich/forgekit-nx-storybook installed? Run: npm install --save-dev @effinrich/forgekit-nx-storybook'
            ].join('')
      }
    ]
  }
}

async function handleGenerateComponentTest(args: {
  componentPath: string
  overwrite?: boolean
  dryRun?: boolean
}) {
  const fullPath = path.join(WORKSPACE_ROOT, args.componentPath)

  if (!fs.existsSync(fullPath)) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: Component file not found at ${args.componentPath}`
        }
      ]
    }
  }

  const flags: string[] = [`--componentPath="${args.componentPath}"`]
  if (args.overwrite) flags.push('--overwrite')
  if (args.dryRun) flags.push('--dryRun')

  const result = await runNxGenerator(
    '@effinrich/forgekit-nx-storybook:component-test',
    flags
  )

  const ctPath = args.componentPath.replace('.tsx', '.ct.tsx')
  const generatedPath = path.join(WORKSPACE_ROOT, ctPath)
  const generatedContent =
    !args.dryRun && fs.existsSync(generatedPath)
      ? `\n\n**Generated: ${ctPath}**\n\`\`\`tsx\n${fs.readFileSync(
          generatedPath,
          'utf-8'
        )}\n\`\`\``
      : ''

  return {
    content: [
      {
        type: 'text',
        text: result.success
          ? `Generator output:\n${result.output}${generatedContent}`
          : [
              `Failed to generate component test:\n\n${result.output}`,
              '\nIs @effinrich/forgekit-nx-storybook installed? Run: npm install --save-dev @effinrich/forgekit-nx-storybook'
            ].join('')
      }
    ]
  }
}

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

function extractComponentName(content: string, fallback: string): string {
  // Try to find export const ComponentName or export default ComponentName
  const patterns = [
    /export\s+(?:default\s+)?(?:function|const)\s+([A-Z][a-zA-Z0-9]*)/,
    /export\s+default\s+([A-Z][a-zA-Z0-9]*)/,
    /const\s+([A-Z][a-zA-Z0-9]*)\s*[:=]/
  ]

  for (const pattern of patterns) {
    const match = content.match(pattern)
    if (match) {
      return match[1]
    }
  }

  // Convert kebab-case filename to PascalCase
  return fallback
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

function detectExportType(content: string): 'default' | 'named' | 'both' {
  const hasDefault = /export\s+default/.test(content)
  const hasNamed = /export\s+(?:const|function|interface|type)\s+[A-Z]/.test(
    content
  )

  if (hasDefault && hasNamed) return 'both'
  if (hasDefault) return 'default'
  return 'named'
}

function extractProps(content: string): PropInfo[] {
  const props: PropInfo[] = []

  // Try to find interface or type definitions for props
  const interfaceMatch = content.match(
    /interface\s+(\w*Props)\s*(?:extends[^{]+)?\{([^}]+)\}/s
  )
  const typeMatch = content.match(/type\s+(\w*Props)\s*=\s*\{([^}]+)\}/s)

  const propsContent = interfaceMatch?.[2] || typeMatch?.[2]

  if (propsContent) {
    // Parse prop definitions
    const propLines = propsContent.split('\n').filter(line => line.trim())

    for (const line of propLines) {
      const propMatch = line.match(/^\s*(\w+)(\?)?:\s*([^;/]+)/)
      if (propMatch) {
        props.push({
          name: propMatch[1],
          type: propMatch[3].trim(),
          required: !propMatch[2]
        })
      }
    }
  }

  return props
}

function extractImports(content: string): string[] {
  const imports: string[] = []
  const importMatches = content.matchAll(/import\s+.*?from\s+['"]([^'"]+)['"]/g)

  for (const match of importMatches) {
    imports.push(match[1])
  }

  return imports
}

function generateSuggestions(
  content: string,
  library: LibraryName | 'unknown',
  props: PropInfo[]
): string[] {
  const suggestions: string[] = []

  if (props.length === 0) {
    suggestions.push(
      'Could not extract props - consider adding TypeScript interface'
    )
  }

  if (content.includes('useState') || content.includes('useEffect')) {
    suggestions.push(
      'Component has state - consider adding interactive stories'
    )
  }

  if (content.includes('children')) {
    suggestions.push(
      'Component accepts children - add story showing composition'
    )
  }

  if (
    content.includes('react-router') ||
    content.includes('useNavigate') ||
    content.includes('useParams')
  ) {
    suggestions.push(
      'Component uses React Router — add withRouter decorator to stories'
    )
  }

  return suggestions
}

// ---------------------------------------------------------------------------
// Template generators
// ---------------------------------------------------------------------------

function getBasicTemplate(withRouter = false): string {
  if (withRouter) {
    return `import { Meta, StoryObj } from '@storybook/react-vite'
import { withRouter } from 'storybook-addon-react-router-v6'

import { ComponentName } from './component-name'

const meta = {
  component: ComponentName,
  title: 'Components / ComponentName',
  decorators: [withRouter],
  tags: ['autodocs'],
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}`
  }

  return `import { Meta, StoryObj } from '@storybook/react-vite'

import { ComponentName } from './component-name'

const meta = {
  component: ComponentName,
  title: 'Components / Category / ComponentName',
  tags: ['autodocs'],
  args: {},
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {},
}`
}

function getControlsTemplate(): string {
  return `import { Meta, StoryObj } from '@storybook/react-vite'

import { ComponentName } from './component-name'

const meta = {
  component: ComponentName,
  title: 'Components / Category / ComponentName',
  tags: ['autodocs'],
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    variant: {
      options: ['solid', 'outline', 'ghost'],
      control: { type: 'select' },
    },
    disabled: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'Click me',
    size: 'md',
    variant: 'solid',
  },
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}`
}

function getVariantsTemplate(): string {
  return `import { Meta, StoryObj } from '@storybook/react-vite'

import { ComponentName } from './component-name'

const meta = {
  component: ComponentName,
  title: 'Components / Category / ComponentName',
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </div>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <ComponentName variant="solid">Solid</ComponentName>
      <ComponentName variant="outline">Outline</ComponentName>
      <ComponentName variant="ghost">Ghost</ComponentName>
      <ComponentName variant="link">Link</ComponentName>
    </div>
  ),
}`
}

function getMswTemplate(): string {
  return `import { Meta, StoryObj } from '@storybook/react-vite'
import { http, HttpResponse } from 'msw'

import { ComponentName } from './component-name'

const meta = {
  component: ComponentName,
  title: 'Components / ComponentName',
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/data', () =>
          HttpResponse.json({ items: [{ id: 1, name: 'Item 1' }] })
        ),
      ],
    },
  },
}

export const Loading: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/data', async () => {
          await new Promise(resolve => setTimeout(resolve, 999999))
          return HttpResponse.json({})
        }),
      ],
    },
  },
}

export const Error: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/data', () =>
          HttpResponse.json({ error: 'Something went wrong' }, { status: 500 })
        ),
      ],
    },
  },
}`
}

function getRouterTemplate(): string {
  return `import { Meta, StoryObj } from '@storybook/react-vite'
import { withRouter, reactRouterParameters } from 'storybook-addon-react-router-v6'

import { ComponentName } from './component-name'

const meta = {
  component: ComponentName,
  title: 'Components / ComponentName',
  decorators: [withRouter],
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithRouteParams: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: { pathParams: { id: '123' } },
      routing: { path: '/items/:id' },
    }),
  },
}

export const WithSearchParams: Story = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: { searchParams: { filter: 'active', page: '1' } },
    }),
  },
}`
}

function getPageTemplate(): string {
  return `import { Meta, StoryObj } from '@storybook/react-vite'
import { withRouter } from 'storybook-addon-react-router-v6'
import { http, HttpResponse } from 'msw'

import { PageComponent } from './page-component'

const meta = {
  component: PageComponent,
  title: 'Pages / PageComponent',
  decorators: [withRouter],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageComponent>

export default meta
type Story = StoryObj<typeof meta>

const mockData = {
  items: [
    { id: 1, title: 'Item 1', description: 'Description 1' },
    { id: 2, title: 'Item 2', description: 'Description 2' },
  ],
  total: 2,
}

export const Default: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/page-data', () => HttpResponse.json(mockData)),
      ],
    },
  },
}

export const Empty: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/page-data', () =>
          HttpResponse.json({ items: [], total: 0 })
        ),
      ],
    },
  },
}`
}

// Start the server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Storybook MCP server running on stdio')
}

main().catch(console.error)
