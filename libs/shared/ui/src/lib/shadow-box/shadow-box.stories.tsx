import { Meta } from '@storybook/react'

import { ShadowBox } from './shadow-box'

const Story: Meta<typeof ShadowBox> = {
  component: ShadowBox,
  title: 'Components / Layout / ShadowBox',
  args: {
    p: '24px',
    bg: 'bg-surface',
    boxShadow: 'sm',
    w: '100%',
    h: 'auto',
    maxW: '100%',
    minW: 'auto',
    maxH: 'auto',
    minH: 'auto'
  },
  parameters: {
    controls: {
      include: ['p', 'bg', 'boxShadow', 'maxW', 'minW', 'maxH', 'minH']
    }
  }
}

export default Story

export const Default = {
  args: {}
}

export const MaxWidth = {
  args: {
    maxW: '500px'
  }
}
