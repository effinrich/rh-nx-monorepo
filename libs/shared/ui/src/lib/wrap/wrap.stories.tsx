import { Meta } from '@storybook/react-vite'

import { BasicWrap } from './partials/basic-wrap'
import { HorizontalAndVerticalWrap } from './partials/horizontal-and-vertical-wrap'
import { ResponsiveWrap } from './partials/responsive-wrap'
import { WithPlaceholderWrap } from './partials/with-placeholder-wrap'
import { WithZeroXSpacingWrap } from './partials/with-zero-x-spacing-wrap'
import { Wrap, WrapItem } from './wrap'

export default {
  component: Wrap,
  subcomponent: WrapItem,
  title: 'Components / Layout / Wrap'
} as Meta<typeof Wrap>

export const Basic = {
  render: () => <BasicWrap />
}

export const WithPlaceholder = {
  render: () => <WithPlaceholderWrap />
}

export const Responsive = {
  render: () => <ResponsiveWrap />
}

export const HorizontalAndVertical = {
  render: () => <HorizontalAndVerticalWrap />
}

export const WithZeroXSpacing = {
  render: () => <WithZeroXSpacingWrap />
}
