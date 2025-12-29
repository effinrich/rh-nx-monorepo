#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Get the workspace root (parent of tools directory)
const WORKSPACE_ROOT = process.env.WORKSPACE_ROOT || path.resolve(process.cwd());

// Component library configurations
const COMPONENT_LIBS = {
  'shared-ui': {
    path: 'libs/shared/ui/src/lib',
    storyPath: 'libs/shared/ui/src/lib',
    importPath: '@redesignhealth/ui',
    storybookPort: 4400,
  },
  'portal-ui': {
    path: 'libs/portal/ui/src/lib',
    storyPath: 'libs/portal/ui/src/lib',
    importPath: '@redesignhealth/portal-ui',
    storybookPort: 4401,
  },
} as const;

type LibraryName = keyof typeof COMPONENT_LIBS;

interface ComponentInfo {
  name: string;
  path: string;
  hasStory: boolean;
  library: LibraryName;
  props: PropInfo[];
  exportType: 'default' | 'named' | 'both';
}

interface PropInfo {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: string;
  description?: string;
}

// Create MCP server
const server = new Server(
  {
    name: 'storybook-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_components',
        description:
          'List all React components in the design system libraries (shared-ui and portal-ui). Returns component names, paths, and whether they have Storybook stories.',
        inputSchema: {
          type: 'object',
          properties: {
            library: {
              type: 'string',
              enum: ['shared-ui', 'portal-ui', 'all'],
              description: 'Which library to list components from. Defaults to "all".',
            },
            hasStory: {
              type: 'boolean',
              description: 'Filter by whether components have stories. Leave empty for all.',
            },
          },
        },
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
                'Path to the component file relative to workspace root (e.g., "libs/shared/ui/src/lib/button/button.tsx")',
            },
          },
          required: ['componentPath'],
        },
      },
      {
        name: 'generate_story',
        description:
          'Generate a Storybook story file for a React component. Follows the established patterns in the RH Design System.',
        inputSchema: {
          type: 'object',
          properties: {
            componentPath: {
              type: 'string',
              description:
                'Path to the component file relative to workspace root (e.g., "libs/shared/ui/src/lib/button/button.tsx")',
            },
            storyTitle: {
              type: 'string',
              description:
                'Optional custom title for the story (e.g., "Components / Forms / Button"). If not provided, will be auto-generated.',
            },
            includeVariants: {
              type: 'boolean',
              description: 'Whether to generate variant stories (e.g., sizes, colors). Defaults to true.',
            },
            includeInteractive: {
              type: 'boolean',
              description: 'Whether to include interactive stories with state. Defaults to false.',
            },
          },
          required: ['componentPath'],
        },
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
              enum: ['basic', 'with-controls', 'with-variants', 'with-msw', 'with-router', 'page'],
              description: 'Type of story template to generate.',
            },
            library: {
              type: 'string',
              enum: ['shared-ui', 'portal-ui'],
              description: 'Which library style to use. portal-ui includes MSW and router decorators.',
            },
          },
          required: ['templateType'],
        },
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
              description: 'Path to the story file relative to workspace root.',
            },
          },
          required: ['storyPath'],
        },
      },
    ],
  };
});

// List resources (component libraries info)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'storybook://libraries',
        name: 'Component Libraries',
        description: 'Information about available component libraries in the design system',
        mimeType: 'application/json',
      },
      {
        uri: 'storybook://patterns',
        name: 'Story Patterns',
        description: 'Common Storybook story patterns used in this codebase',
        mimeType: 'text/markdown',
      },
    ],
  };
});

// Read resources
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'storybook://libraries') {
    return {
      contents: [
        {
          uri,
          mimeType: 'application/json',
          text: JSON.stringify(COMPONENT_LIBS, null, 2),
        },
      ],
    };
  }

  if (uri === 'storybook://patterns') {
    const patterns = `# Storybook Patterns in RH Design System

## Basic Story Pattern (shared-ui)
\`\`\`tsx
import { Meta, StoryObj } from '@storybook/react-vite'
import { ComponentName } from './component-name'

export default {
  component: ComponentName,
  title: 'Components / Category / ComponentName',
  argTypes: {
    // Define controls here
  },
  args: {
    // Default args
  },
} as Meta<typeof ComponentName>

export const Basic: StoryObj<typeof ComponentName> = {
  args: {
    // Story-specific args
  },
}
\`\`\`

## Portal UI Pattern (with decorators)
\`\`\`tsx
import type { Meta } from '@storybook/react-vite'
import { withRouter } from 'storybook-addon-react-router-v6'
import { ComponentName } from './component-name'

const Story: Meta<typeof ComponentName> = {
  component: ComponentName,
  title: 'components / ComponentName',
  decorators: [withRouter],
  args: {},
}

export default Story

export const Default = {
  render: () => <ComponentName />,
}
\`\`\`

## Key Conventions
- shared-ui uses "Components / Category / Name" format
- portal-ui uses "components / Name" format (lowercase)
- Use \`@storybook/react-vite\` for imports
- Portal UI stories often need router decorators
- Use Chakra UI theming addon for prop controls
`;
    return {
      contents: [
        {
          uri,
          mimeType: 'text/markdown',
          text: patterns,
        },
      ],
    };
  }

  throw new Error(`Resource not found: ${uri}`);
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case 'list_components':
      return await handleListComponents(args as { library?: string; hasStory?: boolean });

    case 'analyze_component':
      return await handleAnalyzeComponent(args as { componentPath: string });

    case 'generate_story':
      return await handleGenerateStory(
        args as {
          componentPath: string;
          storyTitle?: string;
          includeVariants?: boolean;
          includeInteractive?: boolean;
        }
      );

    case 'get_story_template':
      return await handleGetStoryTemplate(
        args as { templateType: string; library?: string }
      );

    case 'validate_story':
      return await handleValidateStory(args as { storyPath: string });

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Tool implementations

async function handleListComponents(args: { library?: string; hasStory?: boolean }) {
  const library = args.library || 'all';
  const components: ComponentInfo[] = [];

  const libsToSearch = library === 'all'
    ? Object.keys(COMPONENT_LIBS) as LibraryName[]
    : [library as LibraryName];

  for (const lib of libsToSearch) {
    const libConfig = COMPONENT_LIBS[lib];
    if (!libConfig) continue;

    const libPath = path.join(WORKSPACE_ROOT, libConfig.path);

    // Find all .tsx files that aren't stories or tests
    const pattern = path.join(libPath, '**/*.tsx');
    const files = await glob(pattern, { ignore: ['**/*.stories.tsx', '**/*.test.tsx', '**/*.spec.tsx'] });

    for (const file of files) {
      const relativePath = path.relative(WORKSPACE_ROOT, file);
      const dirName = path.dirname(file);
      const baseName = path.basename(file, '.tsx');

      // Check if there's a story file
      const storyFile = path.join(dirName, `${baseName}.stories.tsx`);
      const hasStory = fs.existsSync(storyFile);

      // Skip if filtering by hasStory
      if (args.hasStory !== undefined && args.hasStory !== hasStory) {
        continue;
      }

      // Try to determine component name and export type
      const content = fs.readFileSync(file, 'utf-8');
      const componentName = extractComponentName(content, baseName);

      if (componentName) {
        components.push({
          name: componentName,
          path: relativePath,
          hasStory,
          library: lib,
          props: [],
          exportType: detectExportType(content),
        });
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
            withStories: components.filter((c) => c.hasStory).length,
            withoutStories: components.filter((c) => !c.hasStory).length,
            components: components.sort((a, b) => a.name.localeCompare(b.name)),
          },
          null,
          2
        ),
      },
    ],
  };
}

async function handleAnalyzeComponent(args: { componentPath: string }) {
  const fullPath = path.join(WORKSPACE_ROOT, args.componentPath);

  if (!fs.existsSync(fullPath)) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: Component file not found at ${args.componentPath}`,
        },
      ],
    };
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const componentName = extractComponentName(content, path.basename(fullPath, '.tsx'));
  const props = extractProps(content);
  const imports = extractImports(content);
  const exportType = detectExportType(content);

  // Determine which library this component belongs to
  let library: LibraryName | 'unknown' = 'unknown';
  for (const [lib, config] of Object.entries(COMPONENT_LIBS)) {
    if (args.componentPath.includes(config.path)) {
      library = lib as LibraryName;
      break;
    }
  }

  // Check for existing story
  const storyPath = args.componentPath.replace('.tsx', '.stories.tsx');
  const hasStory = fs.existsSync(path.join(WORKSPACE_ROOT, storyPath));

  const analysis = {
    componentName,
    filePath: args.componentPath,
    library,
    exportType,
    hasStory,
    storyPath: hasStory ? storyPath : null,
    props,
    imports: imports.slice(0, 20), // Limit imports shown
    usesChakra: content.includes('@chakra-ui') || content.includes('@redesignhealth/ui'),
    usesRouter: content.includes('react-router') || content.includes('useNavigate') || content.includes('useParams'),
    usesQuery: content.includes('@tanstack/react-query') || content.includes('useQuery'),
    suggestions: generateSuggestions(content, library, props),
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(analysis, null, 2),
      },
    ],
  };
}

async function handleGenerateStory(args: {
  componentPath: string;
  storyTitle?: string;
  includeVariants?: boolean;
  includeInteractive?: boolean;
}) {
  const fullPath = path.join(WORKSPACE_ROOT, args.componentPath);

  if (!fs.existsSync(fullPath)) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: Component file not found at ${args.componentPath}`,
        },
      ],
    };
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const componentName = extractComponentName(content, path.basename(fullPath, '.tsx'));
  const props = extractProps(content);
  const exportType = detectExportType(content);

  // Determine library
  let library: LibraryName = 'shared-ui';
  for (const [lib, config] of Object.entries(COMPONENT_LIBS)) {
    if (args.componentPath.includes(config.path)) {
      library = lib as LibraryName;
      break;
    }
  }

  // Generate story title
  const storyTitle = args.storyTitle || generateStoryTitle(componentName, library, args.componentPath);

  // Check for dependencies
  const usesRouter = content.includes('react-router') || content.includes('useNavigate') || content.includes('Link');
  const usesQuery = content.includes('@tanstack/react-query') || content.includes('useQuery');
  const usesChakra = content.includes('@chakra-ui') || content.includes('@redesignhealth/ui');

  // Build story content
  const story = generateStoryContent({
    componentName,
    componentPath: args.componentPath,
    library,
    storyTitle,
    props,
    exportType,
    usesRouter,
    usesQuery,
    usesChakra,
    includeVariants: args.includeVariants !== false,
    includeInteractive: args.includeInteractive || false,
  });

  const storyPath = args.componentPath.replace('.tsx', '.stories.tsx');

  return {
    content: [
      {
        type: 'text',
        text: `Generated story for ${componentName}:

**Suggested file path:** ${storyPath}

\`\`\`tsx
${story}
\`\`\`

**Notes:**
- Review the generated story and adjust prop types as needed
- Add meaningful default values for props
- Consider adding more story variants for different use cases
${usesRouter ? '- This component uses React Router - withRouter decorator included' : ''}
${usesQuery ? '- This component uses React Query - consider adding MSW handlers' : ''}
`,
      },
    ],
  };
}

async function handleGetStoryTemplate(args: { templateType: string; library?: string }) {
  const library = args.library || 'shared-ui';
  const templates: Record<string, string> = {
    basic: getBasicTemplate(library as LibraryName),
    'with-controls': getControlsTemplate(library as LibraryName),
    'with-variants': getVariantsTemplate(library as LibraryName),
    'with-msw': getMswTemplate(),
    'with-router': getRouterTemplate(),
    page: getPageTemplate(),
  };

  const template = templates[args.templateType];

  if (!template) {
    return {
      content: [
        {
          type: 'text',
          text: `Unknown template type: ${args.templateType}. Available types: ${Object.keys(templates).join(', ')}`,
        },
      ],
    };
  }

  return {
    content: [
      {
        type: 'text',
        text: `# ${args.templateType} Story Template (${library})

\`\`\`tsx
${template}
\`\`\`
`,
      },
    ],
  };
}

async function handleValidateStory(args: { storyPath: string }) {
  const fullPath = path.join(WORKSPACE_ROOT, args.storyPath);

  if (!fs.existsSync(fullPath)) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: Story file not found at ${args.storyPath}`,
        },
      ],
    };
  }

  const content = fs.readFileSync(fullPath, 'utf-8');
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check for common issues
  if (!content.includes("from '@storybook/react-vite'")) {
    issues.push('Should import from @storybook/react-vite (not @storybook/react)');
  }

  if (!content.includes('export default')) {
    issues.push('Missing default export for story meta');
  }

  if (!content.includes('component:')) {
    issues.push('Missing component property in meta');
  }

  if (!content.includes('title:')) {
    suggestions.push('Consider adding a title property for better organization');
  }

  // Check for portal-ui specific patterns
  if (args.storyPath.includes('portal/ui')) {
    if (content.includes('useNavigate') || content.includes('Link')) {
      if (!content.includes('withRouter')) {
        issues.push('Component uses React Router but story missing withRouter decorator');
      }
    }
  }

  // Check for accessibility
  if (!content.includes('aria-')) {
    suggestions.push('Consider adding aria-label args for accessibility testing');
  }

  // Check for autodocs
  if (!content.includes('autodocs') && !content.includes('tags:')) {
    suggestions.push('Consider adding tags: ["autodocs"] for auto-generated documentation');
  }

  const result = {
    valid: issues.length === 0,
    issueCount: issues.length,
    suggestionCount: suggestions.length,
    issues,
    suggestions,
  };

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(result, null, 2),
      },
    ],
  };
}

// Helper functions

function extractComponentName(content: string, fallback: string): string {
  // Try to find export const ComponentName or export default ComponentName
  const patterns = [
    /export\s+(?:default\s+)?(?:function|const)\s+([A-Z][a-zA-Z0-9]*)/,
    /export\s+default\s+([A-Z][a-zA-Z0-9]*)/,
    /const\s+([A-Z][a-zA-Z0-9]*)\s*[:=]/,
  ];

  for (const pattern of patterns) {
    const match = content.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // Convert kebab-case filename to PascalCase
  return fallback
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function detectExportType(content: string): 'default' | 'named' | 'both' {
  const hasDefault = /export\s+default/.test(content);
  const hasNamed = /export\s+(?:const|function|interface|type)\s+[A-Z]/.test(content);

  if (hasDefault && hasNamed) return 'both';
  if (hasDefault) return 'default';
  return 'named';
}

function extractProps(content: string): PropInfo[] {
  const props: PropInfo[] = [];

  // Try to find interface or type definitions for props
  const interfaceMatch = content.match(/interface\s+(\w*Props)\s*(?:extends[^{]+)?\{([^}]+)\}/s);
  const typeMatch = content.match(/type\s+(\w*Props)\s*=\s*\{([^}]+)\}/s);

  const propsContent = interfaceMatch?.[2] || typeMatch?.[2];

  if (propsContent) {
    // Parse prop definitions
    const propLines = propsContent.split('\n').filter((line) => line.trim());

    for (const line of propLines) {
      const propMatch = line.match(/^\s*(\w+)(\?)?:\s*([^;/]+)/);
      if (propMatch) {
        props.push({
          name: propMatch[1],
          type: propMatch[3].trim(),
          required: !propMatch[2],
        });
      }
    }
  }

  return props;
}

function extractImports(content: string): string[] {
  const imports: string[] = [];
  const importMatches = content.matchAll(/import\s+.*?from\s+['"]([^'"]+)['"]/g);

  for (const match of importMatches) {
    imports.push(match[1]);
  }

  return imports;
}

function generateSuggestions(content: string, library: LibraryName | 'unknown', props: PropInfo[]): string[] {
  const suggestions: string[] = [];

  if (props.length === 0) {
    suggestions.push('Could not extract props - consider adding TypeScript interface');
  }

  if (content.includes('useState') || content.includes('useEffect')) {
    suggestions.push('Component has state - consider adding interactive stories');
  }

  if (content.includes('children')) {
    suggestions.push('Component accepts children - add story showing composition');
  }

  if (library === 'portal-ui') {
    suggestions.push('Portal UI component - remember to include withRouter decorator if using routing');
  }

  return suggestions;
}

function generateStoryTitle(componentName: string, library: LibraryName, componentPath: string): string {
  if (library === 'portal-ui') {
    // portal-ui uses lowercase "components / Name" format
    return `components / ${componentName}`;
  }

  // shared-ui uses "Components / Category / Name" format
  // Try to determine category from path
  const pathParts = componentPath.split('/');
  const libIndex = pathParts.indexOf('lib');

  if (libIndex >= 0 && pathParts.length > libIndex + 1) {
    const category = pathParts[libIndex + 1];
    const formattedCategory = category
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
    return `Components / ${formattedCategory} / ${componentName}`;
  }

  return `Components / ${componentName}`;
}

function generateStoryContent(options: {
  componentName: string;
  componentPath: string;
  library: LibraryName;
  storyTitle: string;
  props: PropInfo[];
  exportType: 'default' | 'named' | 'both';
  usesRouter: boolean;
  usesQuery: boolean;
  usesChakra: boolean;
  includeVariants: boolean;
  includeInteractive: boolean;
}): string {
  const {
    componentName,
    library,
    storyTitle,
    props,
    exportType,
    usesRouter,
    usesChakra,
    includeVariants,
  } = options;

  const imports: string[] = [];
  const decorators: string[] = [];

  // Add standard imports
  if (library === 'portal-ui') {
    imports.push("import type { Meta } from '@storybook/react-vite'");
  } else {
    imports.push("import { Meta, StoryObj } from '@storybook/react-vite'");
  }

  // Add router decorator if needed
  if (usesRouter || library === 'portal-ui') {
    imports.push("import { withRouter } from 'storybook-addon-react-router-v6'");
    decorators.push('withRouter');
  }

  // Add Chakra imports if needed for theming
  if (usesChakra) {
    imports.push("import { getThemingArgTypes } from '@chakra-ui/storybook-addon'");
    imports.push("import { theme } from '@chakra-ui/theme'");
  }

  // Add component import
  const importStatement = exportType === 'default'
    ? `import ${componentName} from './${path.basename(options.componentPath, '.tsx')}'`
    : `import { ${componentName} } from './${path.basename(options.componentPath, '.tsx')}'`;
  imports.push('');
  imports.push(importStatement);

  // Build argTypes from props
  const argTypes: string[] = [];
  for (const prop of props) {
    if (prop.type.includes('boolean')) {
      argTypes.push(`    ${prop.name}: { type: 'boolean' }`);
    } else if (prop.type.includes('string')) {
      argTypes.push(`    ${prop.name}: { type: 'string' }`);
    } else if (prop.type.includes('number')) {
      argTypes.push(`    ${prop.name}: { type: 'number' }`);
    } else if (prop.type.includes('|')) {
      const options = prop.type.split('|').map(t => t.trim().replace(/['"]/g, ''));
      argTypes.push(`    ${prop.name}: {
      options: [${options.map(o => `'${o}'`).join(', ')}],
      control: { type: 'select' }
    }`);
    }
  }

  // Generate story content based on library style
  if (library === 'portal-ui') {
    return `${imports.join('\n')}

const Story: Meta<typeof ${componentName}> = {
  component: ${componentName},
  title: '${storyTitle}',
${decorators.length > 0 ? `  decorators: [${decorators.join(', ')}],\n` : ''}  args: {},
}

export default Story

export const Default = {
  render: () => <${componentName} />,
}
${includeVariants ? generateVariantStories(componentName, props, 'portal-ui') : ''}`;
  }

  // shared-ui style
  return `${imports.join('\n')}

export default {
  component: ${componentName},
  title: '${storyTitle}',
${argTypes.length > 0 ? `  argTypes: {\n${argTypes.join(',\n')}\n  },\n` : ''}  args: {
    // Default args
  },
} as Meta<typeof ${componentName}>

type Story = StoryObj<typeof ${componentName}>

export const Basic: Story = {
  args: {
    // Story-specific args
  },
}
${includeVariants ? generateVariantStories(componentName, props, 'shared-ui') : ''}`;
}

function generateVariantStories(componentName: string, props: PropInfo[], library: LibraryName): string {
  const variants: string[] = [];

  // Look for size prop
  const sizeProp = props.find(p => p.name === 'size' || p.name === 'sizes');
  if (sizeProp) {
    if (library === 'portal-ui') {
      variants.push(`
export const WithSizes = {
  render: () => (
    <>
      <${componentName} size="sm" />
      <${componentName} size="md" />
      <${componentName} size="lg" />
    </>
  ),
}`);
    } else {
      variants.push(`
export const WithSizes: Story = {
  render: (args) => (
    <>
      <${componentName} {...args} size="sm" />
      <${componentName} {...args} size="md" />
      <${componentName} {...args} size="lg" />
    </>
  ),
}`);
    }
  }

  // Look for variant prop
  const variantProp = props.find(p => p.name === 'variant');
  if (variantProp) {
    if (library === 'portal-ui') {
      variants.push(`
export const WithVariants = {
  render: () => (
    <>
      <${componentName} variant="solid" />
      <${componentName} variant="outline" />
      <${componentName} variant="ghost" />
    </>
  ),
}`);
    } else {
      variants.push(`
export const WithVariants: Story = {
  render: (args) => (
    <>
      <${componentName} {...args} variant="solid" />
      <${componentName} {...args} variant="outline" />
      <${componentName} {...args} variant="ghost" />
    </>
  ),
}`);
    }
  }

  // Look for disabled prop
  const disabledProp = props.find(p => p.name === 'isDisabled' || p.name === 'disabled');
  if (disabledProp) {
    const propName = disabledProp.name;
    if (library === 'portal-ui') {
      variants.push(`
export const Disabled = {
  render: () => <${componentName} ${propName} />,
}`);
    } else {
      variants.push(`
export const Disabled: Story = {
  args: {
    ${propName}: true,
  },
}`);
    }
  }

  return variants.join('\n');
}

// Template generators
function getBasicTemplate(library: LibraryName): string {
  if (library === 'portal-ui') {
    return `import type { Meta } from '@storybook/react-vite'
import { withRouter } from 'storybook-addon-react-router-v6'

import { ComponentName } from './component-name'

const Story: Meta<typeof ComponentName> = {
  component: ComponentName,
  title: 'components / ComponentName',
  decorators: [withRouter],
  args: {},
}

export default Story

export const Default = {
  render: () => <ComponentName />,
}`;
  }

  return `import { Meta, StoryObj } from '@storybook/react-vite'

import { ComponentName } from './component-name'

export default {
  component: ComponentName,
  title: 'Components / Category / ComponentName',
  args: {},
} as Meta<typeof ComponentName>

type Story = StoryObj<typeof ComponentName>

export const Basic: Story = {
  args: {},
}`;
}

function getControlsTemplate(library: LibraryName): string {
  return `import { Meta, StoryObj } from '@storybook/react-vite'
import { getThemingArgTypes } from '@chakra-ui/storybook-addon'
import { theme } from '@chakra-ui/theme'

import { ComponentName } from './component-name'

export default {
  component: ComponentName,
  title: 'Components / Category / ComponentName',
  argTypes: {
    size: {
      options: ['sm', 'md', 'lg'],
      control: { type: 'radio' },
    },
    variant: {
      options: ['solid', 'outline', 'ghost'],
      control: { type: 'select' },
    },
    isDisabled: { type: 'boolean' },
    children: { type: 'string' },
    ...getThemingArgTypes(theme, 'ComponentName'),
  },
  args: {
    children: 'Click me',
    size: 'md',
    variant: 'solid',
  },
} as Meta<typeof ComponentName>

type Story = StoryObj<typeof ComponentName>

export const Playground: Story = {}`;
}

function getVariantsTemplate(library: LibraryName): string {
  return `import { Meta, StoryObj } from '@storybook/react-vite'
import { HStack, Stack } from '@chakra-ui/react'

import { ComponentName } from './component-name'

export default {
  component: ComponentName,
  title: 'Components / Category / ComponentName',
} as Meta<typeof ComponentName>

type Story = StoryObj<typeof ComponentName>

export const AllSizes: Story = {
  render: () => (
    <HStack spacing={4}>
      <ComponentName size="sm">Small</ComponentName>
      <ComponentName size="md">Medium</ComponentName>
      <ComponentName size="lg">Large</ComponentName>
    </HStack>
  ),
}

export const AllVariants: Story = {
  render: () => (
    <Stack spacing={4}>
      <ComponentName variant="solid">Solid</ComponentName>
      <ComponentName variant="outline">Outline</ComponentName>
      <ComponentName variant="ghost">Ghost</ComponentName>
      <ComponentName variant="link">Link</ComponentName>
    </Stack>
  ),
}`;
}

function getMswTemplate(): string {
  return `import type { Meta } from '@storybook/react-vite'
import { withRouter } from 'storybook-addon-react-router-v6'
import { http, HttpResponse } from 'msw'

import { ComponentName } from './component-name'

const Story: Meta<typeof ComponentName> = {
  component: ComponentName,
  title: 'components / ComponentName',
  decorators: [withRouter],
  args: {},
}

export default Story

export const Default = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/data', () => {
          return HttpResponse.json({
            items: [
              { id: 1, name: 'Item 1' },
              { id: 2, name: 'Item 2' },
            ],
          })
        }),
      ],
    },
  },
  render: () => <ComponentName />,
}

export const Loading = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/data', async () => {
          await new Promise((resolve) => setTimeout(resolve, 999999))
          return HttpResponse.json({})
        }),
      ],
    },
  },
  render: () => <ComponentName />,
}

export const Error = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/data', () => {
          return HttpResponse.json({ error: 'Something went wrong' }, { status: 500 })
        }),
      ],
    },
  },
  render: () => <ComponentName />,
}`;
}

function getRouterTemplate(): string {
  return `import type { Meta } from '@storybook/react-vite'
import { withRouter, reactRouterParameters } from 'storybook-addon-react-router-v6'

import { ComponentName } from './component-name'

const Story: Meta<typeof ComponentName> = {
  component: ComponentName,
  title: 'components / ComponentName',
  decorators: [withRouter],
}

export default Story

export const Default = {
  render: () => <ComponentName />,
}

export const WithRouteParams = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        pathParams: { id: '123' },
      },
      routing: { path: '/items/:id' },
    }),
  },
  render: () => <ComponentName />,
}

export const WithSearchParams = {
  parameters: {
    reactRouter: reactRouterParameters({
      location: {
        searchParams: { filter: 'active', page: '1' },
      },
    }),
  },
  render: () => <ComponentName />,
}`;
}

function getPageTemplate(): string {
  return `import type { Meta } from '@storybook/react-vite'
import { withRouter, reactRouterParameters } from 'storybook-addon-react-router-v6'
import { http, HttpResponse } from 'msw'

import { PageComponent } from './page-component'

const Story: Meta<typeof PageComponent> = {
  component: PageComponent,
  title: 'pages / PageComponent',
  decorators: [withRouter],
  parameters: {
    layout: 'fullscreen',
  },
}

export default Story

const mockData = {
  items: [
    { id: 1, title: 'Item 1', description: 'Description 1' },
    { id: 2, title: 'Item 2', description: 'Description 2' },
  ],
  total: 2,
}

export const Default = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/page-data', () => {
          return HttpResponse.json(mockData)
        }),
      ],
    },
  },
  render: () => <PageComponent />,
}

export const Empty = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/page-data', () => {
          return HttpResponse.json({ items: [], total: 0 })
        }),
      ],
    },
  },
  render: () => <PageComponent />,
}`;
}

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Storybook MCP server running on stdio');
}

main().catch(console.error);
