import type { Meta } from '@storybook/react-vite'

import { DrawerFormTextArea } from './drawer-form-text-area'

const Story: Meta<typeof DrawerFormTextArea> = {
  component: DrawerFormTextArea,
  title: 'DrawerFormTextArea'
}
export default Story

export const Default = {
  args: {}
}
