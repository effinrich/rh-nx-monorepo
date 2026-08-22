import { expect, within } from 'storybook/test'

import { Meta } from '@storybook/react-vite'

import { AvatarRoot } from './avatar'
import { AvatarsGroupAvatar } from './partials/avatars-group-avatar'
import { BasicAvatar } from './partials/basic-avatar'
import { WithCustomIconAvatar } from './partials/with-custom-icon-avatar'
import { WithSizesAvatar } from './partials/with-sizes-avatar'
import { WithSrcSetAvatar } from './partials/with-src-set-avatar'

export default {
  component: AvatarRoot,
  title: 'Components / Media & Icons / Avatar'
} as Meta<typeof AvatarRoot>

export const Basic = {
  render: () => <BasicAvatar />
}

export const WithCustomIcon = {
  render: () => <WithCustomIconAvatar />
}

export const WithSizes = {
  render: () => <WithSizesAvatar />
}

export const WithSrcSet = {
  render: () => <WithSrcSetAvatar />
}

export const AvatarsGroup = {
  render: () => <AvatarsGroupAvatar />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByText('+1')).toBeInTheDocument()
  }
}
