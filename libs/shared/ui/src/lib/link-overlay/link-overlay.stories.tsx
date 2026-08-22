import { Meta } from '@storybook/react-vite'

import { LinkBox } from './link-overlay'
import { BasicLinkOverlay } from './partials/basic-link-overlay'
import { CardGridLinkOverlay } from './partials/card-grid-link-overlay'
import { WithAvatarLinkOverlay } from './partials/with-avatar-link-overlay'
import { WithImageLinkOverlay } from './partials/with-image-link-overlay'

export default {
  component: LinkBox,
  title: 'Components / Navigation / LinkOverlay'
} as Meta<typeof LinkBox>

export const Basic = {
  render: () => <BasicLinkOverlay />
}

export const WithImage = {
  render: () => <WithImageLinkOverlay />
}

export const WithAvatar = {
  render: () => <WithAvatarLinkOverlay />
}

export const CardGrid = {
  render: () => <CardGridLinkOverlay />
}
