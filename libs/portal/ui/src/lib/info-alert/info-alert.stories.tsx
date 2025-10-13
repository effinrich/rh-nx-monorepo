import type { Meta } from '@storybook/react'

import { InfoAlert } from './info-alert'

const Story: Meta<typeof InfoAlert> = {
  component: InfoAlert,
  title: 'InfoAlert'
}
export default Story

export const Default = {
  args: {}
}
