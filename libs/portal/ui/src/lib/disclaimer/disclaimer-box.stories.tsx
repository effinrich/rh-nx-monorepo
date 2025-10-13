import type { Meta } from '@storybook/react'

import { DisclaimerBox } from './disclaimer-box'

const Story: Meta<typeof DisclaimerBox> = {
  component: DisclaimerBox,
  title: 'DisclaimerBox'
}
export default Story

export const Default = {
  args: {}
}
