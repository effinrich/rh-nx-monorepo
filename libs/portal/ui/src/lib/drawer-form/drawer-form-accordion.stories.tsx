import type { Meta } from '@storybook/react-vite'

import { DrawerFormAccordion } from './drawer-form-accordion'

const Story: Meta<typeof DrawerFormAccordion> = {
  component: DrawerFormAccordion,
  title: 'DrawerFormAccordion'
}
export default Story

export const Default = {
  args: {
    title: '',
    expandedTitle: ''
  }
}
