import type { Meta } from '@storybook/react-vite'

import { DisclaimerBox } from './disclaimer-box'

const Story: Meta<typeof DisclaimerBox> = {
  component: DisclaimerBox,
  title: 'DisclaimerBox'
}
export default Story

export const Default = {
  args: {}
}
