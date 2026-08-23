import { expect, userEvent, waitFor, within } from 'storybook/test'

import type { Meta, StoryObj } from '@storybook/react-vite'

import { AnimationDisabledHooks } from './partials/animation-disabled-hooks'
import { BasicUsageHooks } from './partials/basic-usage-hooks'
import { FullWithLongContentHooks } from './partials/full-with-long-content-hooks'
import { InsideScrollHooks } from './partials/inside-scroll-hooks'
import { NestedDialogHooks } from './partials/nested-dialog-hooks'
import { ReturnFocusHooks } from './partials/return-focus-hooks'
import { WithCenteredPlacementHooks } from './partials/with-centered-placement-hooks'
import { Dialog } from './dialog'

const meta: Meta<typeof Dialog.Root> = {
  component: Dialog.Root,
  title: 'Components / Overlay / Dialog',
  argTypes: {
    placement: {
      options: ['center', 'top', 'bottom'],
      control: { type: 'radio' }
    },
    scrollBehavior: {
      options: ['inside', 'outside'],
      control: { type: 'radio' }
    },
    size: {
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'cover', 'full'],
      control: { type: 'radio' }
    }
  },
  args: {
    placement: 'center',
    scrollBehavior: 'outside',
    size: 'md'
  }
}

export default meta

type Story = StoryObj<typeof meta>

export const BasicUsage: Story = {
  render: args => <BasicUsageHooks {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const documentBody = within(canvasElement.ownerDocument.body)

    await userEvent.click(canvas.getByRole('button', { name: 'Open dialog' }))
    await expect(
      await documentBody.findByRole('dialog', { name: 'Welcome Home' })
    ).toBeVisible()

    await userEvent.click(documentBody.getByRole('button', { name: 'Cancel' }))
    await waitFor(() =>
      expect(
        documentBody.queryByRole('dialog', { name: 'Welcome Home' })
      ).not.toBeInTheDocument()
    )
  }
}

export const ReturnFocus: Story = {
  render: () => <ReturnFocusHooks />
}

export const NestedDialog: Story = {
  render: () => <NestedDialogHooks />
}

export const InsideScroll: Story = {
  render: () => <InsideScrollHooks />
}

export const AnimationDisabled: Story = {
  render: () => <AnimationDisabledHooks />
}

export const FullWithLongContent: Story = {
  render: () => <FullWithLongContentHooks />
}

export const WithCenteredPlacement: Story = {
  render: () => <WithCenteredPlacementHooks />
}
