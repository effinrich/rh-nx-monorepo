import type { Meta } from '@storybook/react'

import { ResultCard } from './result-card'

const Story: Meta<typeof ResultCard> = {
  component: ResultCard,
  title: 'ResultCard',
  args: {
    title: 'Building a Performance Framework',
    description:
      'Describes how to esablish a standard leveling framework and associated expertise for employees.',
    contentType: 'Solution'
  }
}
export default Story

export const Solution = {
  args: {}
}

export const Module = {
  args: { contentType: 'Module' }
}

export const Template = {
  args: { contentType: 'Template' }
}
