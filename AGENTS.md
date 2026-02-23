<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->

<!-- user configuration start -->

# Senior Frontend Engineer Guidelines (Nx + React + Storybook)

## 🛠 Core Tech Stack

- **Workspace:** [Nx Monorepo](https://nx.dev) (Apps + Libs architecture)
- **Framework:** Next.js (App Router) / React 18+
- **State:** [TanStack Query](https://tanstack.com) (Server), [Zustand](https://zustand-demo.pmnd.rs) (Client)
- **Styling:** Tailwind CSS + [CVA (Class Variance Authority)](https://cva.style)
- **Testing:** [Vitest](https://vitest.dev) (Unit), [Playwright](https://playwright.dev) (E2E), [Storybook](https://storybook.js.org) (Visual/Interaction)

## 🏗 Architectural Guardrails (Nx & Monorepo)

- **Library First:** 80% of code belongs in `libs/`. Apps are minimal shells.
- **Boundary Enforcement:** `ui` libs cannot import `feature` libs. `util` libs cannot import `ui`.
- **Generators Only:** Never manually create project folders. Use Nx Generators.
  - **Create Lib:** `nx g @nx/react:lib libs/shared/ui-components --directory=libs/shared/ui-components --tags=scope:shared,type:ui --importPath=@my-org/shared-ui`
  - **Create Component:** `nx g @nx/react:component my-button --project=shared-ui-components --export`

## 🎨 Storybook & Visual Regression (Chromatic)

- **Mandatory Stories:** Every UI component MUST have a `*.stories.tsx` file using [Storybook Controls](https://storybook.js.orgdocs/essentials/controls).
- **Interaction Testing:** Use the `play` function for behavioral assertions (clicks, form fills).
  ```typescript
  export const SubmittedForm: Story = {
    play: async ({ canvasElement, step }) => {
      const canvas = within(canvasElement)
      await step('Submit', async () => {
        await userEvent.type(canvas.getByTestId('email'), 'senior@dev.com')
        await userEvent.click(canvas.getByRole('button'))
      })
      await expect(canvas.getByText('Success')).toBeInTheDocument()
    }
  }
  ```

<!-- user configuration end -->
