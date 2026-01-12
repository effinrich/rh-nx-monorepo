# Storybook MCP Server

A Model Context Protocol (MCP) server for generating Storybook stories in the RH Design System.

## Features

This MCP server provides tools to help with Storybook story generation and management:

### Tools

1. **list_components** - List all React components in the design system libraries

   - Filter by library (shared-ui, portal-ui, or all)
   - Filter by whether components have stories

2. **analyze_component** - Analyze a React component to extract its structure

   - Extracts props, types, and dependencies
   - Identifies if component uses Router, React Query, or Chakra UI
   - Provides suggestions for story generation

3. **generate_story** - Generate a Storybook story file for a component

   - Follows established patterns in the RH Design System
   - Auto-detects library style (shared-ui vs portal-ui)
   - Optionally includes variant and interactive stories

4. **get_story_template** - Get templates for different story types

   - basic, with-controls, with-variants, with-msw, with-router, page

5. **validate_story** - Validate an existing story file
   - Checks for common issues and best practices
   - Provides improvement suggestions

### Resources

- **storybook://libraries** - Information about component libraries
- **storybook://patterns** - Common Storybook patterns used in this codebase

## Installation

```bash
cd tools/storybook-mcp
npm install
npm run build
```

## Usage with Claude Code

The MCP server is configured in `.vscode/mcp.json`. After building, the server will be available to Claude Code automatically.

### Example Usage

```
# List all components without stories
Use the list_components tool to show me components in shared-ui that don't have stories

# Generate a story for a component
Generate a Storybook story for libs/shared/ui/src/lib/card/card.tsx

# Analyze a component before generating a story
Analyze the component at libs/portal/ui/src/lib/nav/nav.tsx
```

## Development

```bash
# Watch mode for development
npm run dev

# Build for production
npm run build
```

## Story Patterns

### shared-ui Components

```tsx
import { Meta, StoryObj } from '@storybook/react-vite'
import { ComponentName } from './component-name'

export default {
  component: ComponentName,
  title: 'Components / Category / ComponentName',
  argTypes: {
    /* controls */
  },
  args: {
    /* defaults */
  }
} as Meta<typeof ComponentName>

export const Basic: StoryObj<typeof ComponentName> = {
  args: {
    /* story args */
  }
}
```

### portal-ui Components

```tsx
import type { Meta } from '@storybook/react-vite'
import { withRouter } from 'storybook-addon-react-router-v6'
import { ComponentName } from './component-name'

const Story: Meta<typeof ComponentName> = {
  component: ComponentName,
  title: 'components / ComponentName',
  decorators: [withRouter],
  args: {}
}

export default Story

export const Default = {
  render: () => <ComponentName />
}
```
