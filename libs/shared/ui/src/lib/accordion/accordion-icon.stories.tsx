import { expect, within } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  AccordionItem,
  AccordionItemContent,
  AccordionItemIndicator,
  AccordionItemTrigger,
  AccordionRoot
} from './accordion'

const meta: Meta<typeof AccordionItemIndicator> = {
  title: 'Shared / Ui/AccordionItemIndicator',
  component: AccordionItemIndicator,
  tags: ['autodocs']
}

export default meta

type Story = StoryObj<typeof AccordionItemIndicator>

export const Default: Story = {
  render: () => (
    <AccordionRoot collapsible defaultValue={['a']}>
      <AccordionItem value="a">
        <AccordionItemTrigger>
          Section
          <AccordionItemIndicator />
        </AccordionItemTrigger>
        <AccordionItemContent>Panel</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  )
}

export const Interactive: Story = {
  render: () => (
    <AccordionRoot collapsible defaultValue={['a']}>
      <AccordionItem value="a">
        <AccordionItemTrigger>
          Click me
          <AccordionItemIndicator />
        </AccordionItemTrigger>
        <AccordionItemContent>Panel</AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const element = canvas.getByText(/click me/i)

    await expect(element).toBeInTheDocument()
  }
}
