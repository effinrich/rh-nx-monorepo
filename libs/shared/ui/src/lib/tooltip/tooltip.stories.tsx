import { Meta } from '@storybook/react-vite'

import { WithAriaLabelTooltip } from './partials/with-aria-label-tooltip'
import { WithAutoPlacementTooltip } from './partials/with-auto-placement-tooltip'
import { WithButtonTooltip } from './partials/with-button-tooltip'
import { WithDefaultIsOpenPropTooltip } from './partials/with-default-is-open-prop-tooltip'
import { WithDialogTooltip } from './partials/with-dialog-tooltip'
import { WithDisabledButtonTooltip } from './partials/with-disabled-button-tooltip'
import { WithDynamicDisabledTooltip } from './partials/with-dynamic-disabled-tooltip'
import { WithExternalIconTooltip } from './partials/with-external-icon-tooltip'
import { WithIsOpenPropTooltip } from './partials/with-is-open-prop-tooltip'
import { WithScrollTooltip } from './partials/with-scroll-tooltip'
import { WithScrollWithinTooltip } from './partials/with-scroll-within-tooltip'
import { WithStringTooltip } from './partials/with-string-tooltip'
import { WithWrappedDisabledButtonTooltip } from './partials/with-wrapped-disabled-button-tooltip'
import { WithinFixedContainerTooltip } from './partials/within-fixed-container-tooltip'
import { TooltipRoot } from './tooltip'

export default {
  component: TooltipRoot,
  title: 'Components / Overlay / Tooltip'
} as Meta<typeof TooltipRoot>

export const WithButton = {
  render: () => <WithButtonTooltip />
}

export const WithString = {
  render: () => <WithStringTooltip />
}

export const WithAriaLabel = {
  render: () => <WithAriaLabelTooltip />
}

export const WithinFixedContainer = {
  render: () => <WithinFixedContainerTooltip />
}

export const WithDialog = {
  render: () => <WithDialogTooltip />
}

export const WithDisabledButton = {
  render: () => <WithDisabledButtonTooltip />
}

export const WithWrappedDisabledButton = {
  render: () => <WithWrappedDisabledButtonTooltip />
}

export const WithIsOpenProp = {
  render: () => <WithIsOpenPropTooltip />
}

export const WithDefaultIsOpenProp = {
  render: () => <WithDefaultIsOpenPropTooltip />
}

export const WithAutoPlacement = {
  render: () => <WithAutoPlacementTooltip />
}

export const WithScroll = {
  render: () => <WithScrollTooltip />
}

export const WithScrollWithin = {
  render: () => <WithScrollWithinTooltip />
}

export const WithDynamicDisabled = {
  render: () => <WithDynamicDisabledTooltip />
}

export const WithExternalIcon = {
  render: () => <WithExternalIconTooltip />
}
