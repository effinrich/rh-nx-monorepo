import type { Meta } from '@storybook/react'

import { DisclaimerText } from './disclaimer-text'

const Story: Meta<typeof DisclaimerText> = {
  component: DisclaimerText,
  title: 'DisclaimerText'
}
export default Story

export const Default = {
  args: {}
}
