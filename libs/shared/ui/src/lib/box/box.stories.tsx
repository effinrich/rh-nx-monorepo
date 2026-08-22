import { Meta } from '@storybook/react-vite'

import { Box } from './box'
import { BasicBox } from './partials/basic-box'
import { KbdBox } from './partials/kbd-box'
import { SpacerBox } from './partials/spacer-box'

export default {
  title: 'Components / Layout / Box',
  component: Box
} as Meta<typeof Box>

export const Basic = {
  render: () => <BasicBox />
}

export const Kbd = {
  render: () => <KbdBox />
}

export const Spacer = {
  render: () => <SpacerBox />
}
