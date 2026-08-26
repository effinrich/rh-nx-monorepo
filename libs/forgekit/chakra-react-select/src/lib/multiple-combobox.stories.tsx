import { expect, userEvent, within } from 'storybook/test'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { MultipleCombobox } from './multiple-combobox'

const frameworks = [
  { label: 'React', value: 'react' },
  { label: 'Vue', value: 'vue' },
  { label: 'Angular', value: 'angular' }
]

const meta = {
  component: MultipleCombobox,
  title: 'ForgeKit/Combobox/Multiple',
  args: {
    clearable: true,
    closeOnSelect: false,
    openOnClick: true,
    placeholder: 'Select frameworks',
    source: { kind: 'local', items: frameworks }
  },
  argTypes: {
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
    readOnly: { control: 'boolean' },
    size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    variant: { control: 'select', options: ['outline', 'subtle', 'flushed'] }
  }
} satisfies Meta<typeof MultipleCombobox>

export default meta
type Story = StoryObj<typeof meta>

export const Local: Story = {
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const document = within(canvasElement.ownerDocument.body)

    await step('Choose multiple options', async () => {
      await userEvent.click(canvas.getByRole('combobox'))
      await userEvent.click(await document.findByRole('option', { name: 'React' }))
      await userEvent.click(await document.findByRole('option', { name: 'Vue' }))
      await expect(canvas.getByText('React')).toBeInTheDocument()
      await expect(canvas.getByText('Vue')).toBeInTheDocument()
    })

    await step('Remove a selected option', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Remove React' }))
      await expect(canvas.queryByText('React')).not.toBeInTheDocument()
    })
  }
}

export const Creatable: Story = {
  args: {
    creatable: {
      createOption: inputValue => ({ label: inputValue, value: inputValue })
    }
  }
}
