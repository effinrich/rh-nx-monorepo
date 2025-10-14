import type { Meta } from '@storybook/react-vite'

import { DisclaimerModal } from './disclaimer-modal'

const Story: Meta<typeof DisclaimerModal> = {
  component: DisclaimerModal,
  title: 'DisclaimerModal'
}
export default Story

export const Default = {
  args: {}
}
