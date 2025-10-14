import type { Meta } from '@storybook/react-vite'

import { LibCard } from './lib-card'

const Story: Meta<typeof LibCard> = {
  component: LibCard,
  title: 'Components/LibCard',
  args: {
    title: 'Building a Performance Framework',
    description:
      'Describes how to esablish a standard leveling framework and associated expertise for employees.',
    contentType: 'Article'
  }
}
export default Story

export const Solution = {
  args: {}
}

export const Collection = {
  args: { contentType: 'Collection' }
}

export const Module = {
  args: { contentType: 'Module' }
}

export const Template = {
  args: { contentType: 'Template' }
}

export const ThirdParty = {
  args: { contentType: 'Third-Party' }
}

export const Tool = {
  args: { contentType: 'Tool' }
}
