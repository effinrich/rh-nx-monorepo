import type { Meta } from '@storybook/react-vite'

import { DisclaimerText } from './disclaimer-text'

const Story: Meta<typeof DisclaimerText> = {
  component: DisclaimerText,
  title: 'DisclaimerText'
}
export default Story

export const Default = {
  args: {}
}
