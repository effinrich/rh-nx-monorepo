import type { Meta } from '@storybook/react'

import { DrawerFormItem } from './drawer-form-item'

const Story: Meta<typeof DrawerFormItem> = {
  component: DrawerFormItem,
  title: 'DrawerFormItem'
}
export default Story

export const Default = {
  args: {
    label: '',
    error: '',
    helperText: '',
    isInvalid: false
  }
}
