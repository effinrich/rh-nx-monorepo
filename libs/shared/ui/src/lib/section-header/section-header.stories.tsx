import type { Meta } from '@storybook/react-vite'

import { Button } from '../../index'

import { SectionHeader } from './section-header'

const Story: Meta<typeof SectionHeader> = {
  component: SectionHeader,
  title: 'Patterns / Layout / Section Header'
}

export default Story

export const Basic = {
  args: {
    title: 'Hello',
    firstName: undefined
  }
}

export const WithUserName = {
  args: {
    title: 'Welcome',
    firstName: 'Rich'
  }
}

export const WithOutUserName = {
  args: {
    title: 'Welcome',
    firstName: undefined
  }
}

export const WithHelpText = {
  args: {
    title: 'OpCos',
    helpText: 'Manage all OpCos here',
    firstName: undefined
  }
}

export const WithRightElement = {
  args: {
    title: 'OpCos',
    firstName: undefined,
    rightElement: (
      <Button
        onClick={() => {
          'clicked'
        }}
        colorPalette="primary"
      >
        Add OpCo
      </Button>
    )
  }
}
