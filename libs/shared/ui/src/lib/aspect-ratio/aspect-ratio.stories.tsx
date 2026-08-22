import { Meta } from '@storybook/react-vite'

import { AspectRatio } from './aspect-ratio'
import { WithImageAspectRatio } from './partials/with-image-aspect-ratio'
import { WithMapAspectRatio } from './partials/with-map-aspect-ratio'
import { WithResponsiveAspectRatio } from './partials/with-responsive-aspect-ratio'
import { WithVideoAspectRatio } from './partials/with-video-aspect-ratio'

export default {
  component: AspectRatio,
  title: 'Components / Layout / AspectRatio'
} as Meta<typeof AspectRatio>

export const WithVideo = {
  render: () => <WithVideoAspectRatio />
}

export const WithImage = {
  render: () => <WithImageAspectRatio />
}

export const WithMap = {
  render: () => <WithMapAspectRatio />
}

export const WithResponsive = {
  render: () => <WithResponsiveAspectRatio />
}
