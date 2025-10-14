import { Meta } from '@storybook/react-vite'

import { DesignSystemLogo } from './design-system-logo'

const Story: Meta<typeof DesignSystemLogo> = {
  component: DesignSystemLogo,
  title: 'Components / Logos / Design System'
}
export default Story

export const Default = {
  args: {
    width: '250px',
    height: 'auto'
  }
}

export const Responsive = {
  args: {
    width: ['150px', '175px', '200px', '250x'],
    height: 'auto'
  }
}
