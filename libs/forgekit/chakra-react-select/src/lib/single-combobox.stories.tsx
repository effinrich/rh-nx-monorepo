import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { SingleCombobox } from './single-combobox'

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' }
]

const meta = {
  component: SingleCombobox,
  title: 'ForgeKit/Combobox/Single',
  args: {
    clearable: true,
    openOnClick: true,
    placeholder: 'Select a framework',
    source: { kind: 'local', items: frameworks }
  },
  argTypes: {
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outline', 'subtle', 'flushed'] }
  }
} satisfies Meta<typeof SingleCombobox>

export default meta
type Story = StoryObj<typeof meta>

export const Local: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const document = within(canvasElement.ownerDocument.body)

    await step('Choose an option', async () => {
      await userEvent.click(canvas.getByRole('combobox'))
      await userEvent.click(await document.findByRole('option', { name: 'React' }))
      await expect(canvas.getByRole('combobox')).toHaveValue('React')
    })
  }
}

export const Creatable: Story = {
  args: {
    creatable: {
      createOption: inputValue => ({ label: inputValue, value: inputValue })
    }
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const document = within(canvasElement.ownerDocument.body)

    await step('Create a new option', async () => {
      await userEvent.type(canvas.getByRole('combobox'), 'Svelte')
      await userEvent.click(
        await document.findByRole('option', { name: 'Create “Svelte”' })
      )
      await expect(canvas.getByRole('combobox')).toHaveValue('Svelte')
    })
  }
}

export const Async: Story = {
  args: {
    source: {
      kind: 'async',
      debounceMs: 100,
      minQueryLength: 1,
      load: async query =>
        frameworks.filter(option =>
          option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())
        )
    }
  }
}
