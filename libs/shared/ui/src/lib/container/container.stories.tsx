import { Meta } from '@storybook/react'

import { Container } from './container'

export default {
  component: Container,
  title: 'Components / Layout / Container'
} as Meta<typeof Container>

const content = `There are many benefits to a joint design and development system. Not only
  does it bring benefits to the design team, but it also brings benefits to
  engineering teams. It makes sure that our experiences have a consistent look
  and feel, not just in our design specs, but in production`

export const Default = {
  args: {
    maxW: '960px',
    children: content,
    centerContent: false
  }
}

export const CenterContent = {
  args: {
    centerContent: true,
    children: content
  }
}

export const WithStyles = {
  args: {
    children: content,
    bg: 'bg-surface',
    boxShadow: 'sm',
    borderRadius: 'lg',
    p: 4
  }
}

export const WithBGColor = {
  args: {
    children: content,
    bgColor: 'purple',
    boxShadow: 'sm',
    color: 'white',
    borderRadius: 'lg',
    p: 4
  }
}
