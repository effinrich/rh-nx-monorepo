import { ComponentAnalysis } from '../../../utils/types'

import {
  generateStoryContent,
  StoryContentOptions
} from './generate-story-content'

function makeAnalysis(
  overrides: Partial<ComponentAnalysis> = {}
): ComponentAnalysis {
  return {
    name: 'TestComponent',
    fileName: 'test-component',
    filePath: 'libs/shared/ui/src/lib/test-component/test-component.tsx',
    props: [],
    hasChildren: false,
    imports: [],
    usesRouter: false,
    usesReactQuery: false,
    usesChakra: false,
    exportType: 'named',
    ...overrides
  }
}

function makeOptions(
  overrides: Partial<StoryContentOptions> = {}
): StoryContentOptions {
  return {
    analysis: makeAnalysis(),
    storyTitle: 'Components / TestComponent',
    importPath: './test-component',
    skipInteractionTests: false,
    ...overrides
  }
}

describe('generateStoryContent', () => {
  it('should generate a valid story file with meta and default story', () => {
    const content = generateStoryContent(makeOptions())

    expect(content).toContain(
      "import type { Meta, StoryObj } from '@storybook/react-vite'"
    )
    expect(content).toContain(
      "import { TestComponent } from './test-component'"
    )
    expect(content).toContain('const meta: Meta<typeof TestComponent>')
    expect(content).toContain("title: 'Components / TestComponent'")
    expect(content).toContain("tags: ['autodocs']")
    expect(content).toContain('export default meta')
    expect(content).toContain('type Story = StoryObj<typeof TestComponent>')
    expect(content).toContain('export const Default: Story')
  })

  it('should use default import for default export components', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({ exportType: 'default' })
      })
    )

    expect(content).toContain("import TestComponent from './test-component'")
  })

  it('should use named import for named export components', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({ exportType: 'named' })
      })
    )

    expect(content).toContain(
      "import { TestComponent } from './test-component'"
    )
  })

  it('should add children args to Default story when component hasChildren', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({
          hasChildren: true,
          props: [
            {
              name: 'children',
              type: 'React.ReactNode',
              required: false,
              isCallback: false
            }
          ]
        })
      })
    )

    expect(content).toContain("children: 'TestComponent content'")
  })

  it('should generate argTypes for union props', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({
          props: [
            {
              name: 'variant',
              type: "'solid' | 'outline' | 'ghost'",
              required: false,
              isCallback: false,
              unionValues: ['solid', 'outline', 'ghost']
            }
          ]
        })
      })
    )

    expect(content).toContain("options: ['solid', 'outline', 'ghost']")
    expect(content).toContain("control: { type: 'select' }")
  })

  it('should generate action argTypes for callback props', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({
          props: [
            {
              name: 'onClick',
              type: '() => void',
              required: false,
              isCallback: true
            },
            {
              name: 'onChange',
              type: '(value: string) => void',
              required: false,
              isCallback: true
            }
          ]
        })
      })
    )

    expect(content).toContain("onClick: { action: 'onClick' }")
    expect(content).toContain("onChange: { action: 'onChange' }")
  })

  it('should generate control types for boolean/string/number props', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({
          props: [
            {
              name: 'disabled',
              type: 'boolean',
              required: false,
              isCallback: false
            },
            {
              name: 'label',
              type: 'string',
              required: false,
              isCallback: false
            },
            {
              name: 'count',
              type: 'number',
              required: false,
              isCallback: false
            }
          ]
        })
      })
    )

    expect(content).toContain("disabled: { control: { type: 'boolean' } }")
    expect(content).toContain("label: { control: { type: 'text' } }")
    expect(content).toContain("count: { control: { type: 'number' } }")
  })

  it('should generate default args for required props', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({
          props: [
            {
              name: 'label',
              type: 'string',
              required: true,
              isCallback: false
            },
            {
              name: 'count',
              type: 'number',
              required: true,
              isCallback: false
            },
            {
              name: 'onClick',
              type: '() => void',
              required: true,
              isCallback: true
            }
          ]
        })
      })
    )

    expect(content).toContain("label: 'Example label'")
    expect(content).toContain('count: 0')
    expect(content).toContain('onClick: fn()')
  })

  it('should not generate default args for optional props', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({
          props: [
            {
              name: 'subtitle',
              type: 'string',
              required: false,
              isCallback: false
            }
          ]
        })
      })
    )

    // Should appear in argTypes but not in args
    expect(content).toContain("subtitle: { control: { type: 'text' } }")
    expect(content).not.toContain("subtitle: 'Example subtitle'")
  })

  it('should generate size variant stories', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({
          props: [
            {
              name: 'size',
              type: "'sm' | 'md' | 'lg'",
              required: false,
              isCallback: false,
              unionValues: ['sm', 'md', 'lg']
            }
          ]
        })
      })
    )

    expect(content).toContain('export const Sizes: Story')
    expect(content).toContain('size="sm"')
    expect(content).toContain('size="md"')
    expect(content).toContain('size="lg"')
  })

  it('should generate variant stories', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({
          props: [
            {
              name: 'variant',
              type: "'solid' | 'outline'",
              required: false,
              isCallback: false,
              unionValues: ['solid', 'outline']
            }
          ]
        })
      })
    )

    expect(content).toContain('export const Variants: Story')
    expect(content).toContain('variant="solid"')
    expect(content).toContain('variant="outline"')
  })

  it('should generate Disabled story when disabled prop exists', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({
          props: [
            {
              name: 'disabled',
              type: 'boolean',
              required: false,
              isCallback: false
            }
          ]
        })
      })
    )

    expect(content).toContain('export const Disabled: Story')
    expect(content).toContain('disabled: true')
  })

  it('should generate colorPalette variant stories', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({
          props: [
            {
              name: 'colorPalette',
              type: "'primary' | 'secondary'",
              required: false,
              isCallback: false,
              unionValues: ['primary', 'secondary']
            }
          ]
        })
      })
    )

    expect(content).toContain('export const ColorPalettes: Story')
    expect(content).toContain('colorPalette="primary"')
    expect(content).toContain('colorPalette="secondary"')
  })

  it('should add router decorator when component uses router', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({ usesRouter: true })
      })
    )

    expect(content).toContain(
      "import { withRouter } from 'storybook-addon-remix-react-router'"
    )
    expect(content).toContain('decorators: [withRouter]')
  })

  it('should skip interaction tests when skipInteractionTests is true', () => {
    const content = generateStoryContent(
      makeOptions({
        skipInteractionTests: true,
        analysis: makeAnalysis({
          props: [
            {
              name: 'onClick',
              type: '() => void',
              required: false,
              isCallback: true
            }
          ]
        })
      })
    )

    expect(content).not.toContain("from '@storybook/test'")
    expect(content).not.toContain('ClickInteraction')
    expect(content).not.toContain('RendersCorrectly')
  })

  it('should include interaction tests when not skipped', () => {
    const content = generateStoryContent(
      makeOptions({
        skipInteractionTests: false,
        analysis: makeAnalysis({
          props: [
            {
              name: 'onClick',
              type: '() => void',
              required: false,
              isCallback: true
            }
          ]
        })
      })
    )

    expect(content).toContain("from '@storybook/test'")
    expect(content).toContain('RendersCorrectly')
  })

  it('should not include children in argTypes', () => {
    const content = generateStoryContent(
      makeOptions({
        analysis: makeAnalysis({
          hasChildren: true,
          props: [
            {
              name: 'children',
              type: 'React.ReactNode',
              required: false,
              isCallback: false
            },
            {
              name: 'title',
              type: 'string',
              required: false,
              isCallback: false
            }
          ]
        })
      })
    )

    // Extract just the argTypes block and verify children is not in it
    const argTypesMatch = content.match(/argTypes:\s*\{([^}]*)\}/)
    expect(argTypesMatch).not.toBeNull()
    expect(argTypesMatch![1]).not.toContain('children')
    // but title should be in argTypes
    expect(argTypesMatch![1]).toContain('title')
  })
})
