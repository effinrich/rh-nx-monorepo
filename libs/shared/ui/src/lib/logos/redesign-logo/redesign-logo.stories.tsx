import { Meta } from '@storybook/react'

import { RedesignLogo } from './redesign-logo'

const Story: Meta<typeof RedesignLogo> = {
  component: RedesignLogo,
  title: 'Components / Logos / Redesign Health',
  args: {}
}
export default Story

export const Default = {
  args: {}
}

export const Responsive = {
  args: {
    width: ['150px', '200px', '250px', '300px'],
    height: 'auto'
  }
}
