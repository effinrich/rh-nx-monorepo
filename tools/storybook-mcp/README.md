# @effinrich/storybook-mcp

> **MCP server for Storybook story generation** — works with any React/Nx workspace.

[![npm](https://img.shields.io/npm/v/@effinrich/storybook-mcp)](https://www.npmjs.com/package/@effinrich/storybook-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server that lets AI assistants (Claude, Cursor, etc.) list, analyze, generate, and validate [Storybook](https://storybook.js.org) stories for React components in any workspace.

---

## Features

### Tools

| Tool                 | Description                                                                  |
| -------------------- | ---------------------------------------------------------------------------- |
| `list_components`    | List React components across configured libraries, with story coverage stats |
| `analyze_component`  | Analyze a component's props, types, and framework usage                      |
| `generate_story`     | Generate a `.stories.tsx` file with controls, variants, and autodocs         |
| `get_story_template` | Get copy-paste templates for common story patterns                           |
| `validate_story`     | Check an existing story file for common issues                               |

### Resources

| Resource                | Description                          |
| ----------------------- | ------------------------------------ |
| `storybook://libraries` | Configured library registry (JSON)   |
| `storybook://patterns`  | Common Storybook patterns (Markdown) |

---

## Installation

```bash
npx @effinrich/storybook-mcp
```

Or install locally:

```bash
npm install -g @effinrich/storybook-mcp
```

---

## Configuration

Create `storybook-mcp.config.json` in your workspace root:

```json
{
  "libraries": {
    "ui": {
      "path": "libs/shared/ui/src/lib",
      "importPath": "@myorg/ui",
      "storybookPort": 6006
    },
    "features": {
      "path": "libs/features/src/lib",
      "importPath": "@myorg/features",
      "storybookPort": 6007
    }
  }
}
```

The server will auto-discover libraries by scanning for `.storybook/` directories if no config file is present. You can also point to a custom config via the `STORYBOOK_MCP_CONFIG` environment variable.

---

## Usage with AI Assistants

### Augment / Claude Code

Add to your `.vscode/mcp.json`:

```json
{
  "servers": {
    "storybook": {
      "command": "node",
      "args": ["/path/to/tools/storybook-mcp/dist/index.js"],
      "env": {
        "WORKSPACE_ROOT": "${workspaceFolder}"
      }
    }
  }
}
```

### Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "storybook": {
      "command": "npx",
      "args": ["@effinrich/storybook-mcp"],
      "env": {
        "WORKSPACE_ROOT": "/path/to/your/workspace"
      }
    }
  }
}
```

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "storybook": {
      "command": "npx",
      "args": ["@effinrich/storybook-mcp"],
      "env": {
        "WORKSPACE_ROOT": "${workspaceFolder}"
      }
    }
  }
}
```

---

## Development

```bash
# Clone and install
git clone https://github.com/effinrich/storybook-mcp
cd storybook-mcp
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run locally
WORKSPACE_ROOT=/path/to/workspace node dist/index.js
```

---

## Story Patterns

### Standard component story (modern `satisfies` syntax)

```tsx
import { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from './button'

const meta = {
  component: Button,
  title: 'Components / Button',
  tags: ['autodocs'],
  argTypes: {
    variant: { options: ['solid', 'outline', 'ghost'], control: { type: 'select' } },
    disabled: { control: 'boolean' },
  },
  args: { children: 'Click me' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Disabled: Story = { args: { disabled: true } }
```

### With React Router decorator

```tsx
import { Meta, StoryObj } from '@storybook/react-vite'
import { withRouter } from 'storybook-addon-react-router-v6'

import { NavLink } from './nav-link'

const meta = {
  component: NavLink,
  title: 'Components / NavLink',
  decorators: [withRouter],
} satisfies Meta<typeof NavLink>

export default meta
export const Default: StoryObj<typeof meta> = {}
```

---

## License

MIT © [Rich Tillman](https://github.com/effinrich)
