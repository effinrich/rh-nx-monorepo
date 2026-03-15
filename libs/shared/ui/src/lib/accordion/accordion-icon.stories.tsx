import type { Meta, StoryObj } from '@storybook/react'
import { expect, userEvent, within } from 'storybook/test'
import AccordionIcon from './accordion-icon'

const meta: Meta<typeof AccordionIcon> = {
  title: 'Shared / Ui/AccordionIcon',
  component: AccordionIcon,
  tags: ['autodocs'],
}

export default meta

type Story = StoryObj<typeof AccordionIcon>

/**
 * Default AccordionIcon
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
