import { Meta } from '@storybook/react-vite'

import { CloseButton } from './close-button'
import { DefaultCloseButton } from './partials/default-close-button'
import { SizesCloseButton } from './partials/sizes-close-button'
import { StateCloseButton } from './partials/state-close-button'

export default {
  title: 'Components / Data Display / CloseButton',
  component: CloseButton
} as Meta<typeof CloseButton>

export const Default = {
  render: () => <DefaultCloseButton />
}

export const State = {
  render: () => <StateCloseButton />
}

export const Sizes = {
  render: () => <SizesCloseButton />
}
