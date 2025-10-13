import type { Meta } from '@storybook/react'

import { AxiosErrorAlert } from './axios-error-alert'

const Story: Meta<typeof AxiosErrorAlert> = {
  component: AxiosErrorAlert,
  title: 'AxiosErrorAlert'
}
export default Story

export const Default = {
  args: {}
}
