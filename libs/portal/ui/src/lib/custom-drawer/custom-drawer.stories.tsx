import type { Meta } from '@storybook/react'

import { CustomDrawer } from './custom-drawer'

const Story: Meta<typeof CustomDrawer> = {
  component: CustomDrawer,
  title: 'CustomDrawer'
}
export default Story

export const Default = {
  args: {}
}
