import { Meta } from '@storybook/react-vite'

import { AnimationDisabledHooks } from './partials/animation-disabled-hooks'
import { BasicUsageHooks } from './partials/basic-usage-hooks'
import { FullWithLongContentHooks } from './partials/full-with-long-content-hooks'
import { InsideScrollHooks } from './partials/inside-scroll-hooks'
import { NestedDialogHooks } from './partials/nested-dialog-hooks'
import { ReturnFocusHooks } from './partials/return-focus-hooks'
import { WithCenteredPlacementHooks } from './partials/with-centered-placement-hooks'
import { DialogRoot } from './modal'

export default {
  component: DialogRoot,
  title: 'Components / Overlay / Dialog'
} as Meta<typeof DialogRoot>

export const BasicUsage = {
  render: () => <BasicUsageHooks />
}

export const ReturnFocus = {
  render: () => <ReturnFocusHooks />
}

export const NestedDialog = {
  render: () => <NestedDialogHooks />
}

export const InsideScroll = {
  render: () => <InsideScrollHooks />
}

export const AnimationDisabled = {
  render: () => <AnimationDisabledHooks />
}

export const FullWithLongContent = {
  render: () => <FullWithLongContentHooks />
}

export const WithCenteredPlacement = {
  render: () => <WithCenteredPlacementHooks />
}
