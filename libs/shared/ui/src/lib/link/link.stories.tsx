import { Meta } from '@storybook/react-vite'

import { Link } from './link'
import { DefaultLink } from './partials/default-link'
import { WithLinkOverlayLink } from './partials/with-link-overlay-link'
import { WithRoutingLibraryLink } from './partials/with-routing-library-link'

export default {
  component: Link,
  title: 'Components / Navigation / Link'
} as Meta<typeof Link>

export const Default = {
  render: () => <DefaultLink />
}

export const WithRoutingLibrary = {
  render: () => <WithRoutingLibraryLink />
}

export const WithLinkOverlay = {
  render: () => <WithLinkOverlayLink />
}
