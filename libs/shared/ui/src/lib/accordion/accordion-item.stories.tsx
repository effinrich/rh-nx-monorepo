import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import {
  AccordionRoot,
  AccordionItem,
  AccordionItemTrigger,
  AccordionItemContent
} from './accordion'

const meta: Meta<typeof AccordionItem> = {
  title: 'Shared / Ui/AccordionItem',
  component: AccordionItem,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof AccordionItem>

export const Default: Story = {
  render: () => (
    <AccordionRoot collapsible>
      <AccordionItem value="a">
        <AccordionItemTrigger>Section</AccordionItemTrigger>
        <AccordionItemContent>Panel</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )
}

export const Interactive: Story = {
  render: () => (
    <AccordionRoot collapsible>
      <AccordionItem value="a">
        <AccordionItemTrigger>Click me</AccordionItemTrigger>
        <AccordionItemContent>Panel</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByText(/click me/i)

    await expect(element).toBeInTheDocument()
    await userEvent.click(element)
  }
}
