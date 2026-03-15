import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import AccordionButton from './accordion-button'

const meta: Meta<typeof AccordionButton> = {
  title: 'Shared / Ui/AccordionButton',
  component: AccordionButton,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof AccordionButton>

/**
 * Default AccordionButton
 */
export const Default: Story = {
}

/**
 * Interactive test
 */
export const Interactive: Story = {
  args: {
    children: 'Click me',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByText(/click me/i)
    
    // Verify element renders
    await expect(element).toBeInTheDocument()
    
    // Test interaction
    await userEvent.click(element)
  },
}
