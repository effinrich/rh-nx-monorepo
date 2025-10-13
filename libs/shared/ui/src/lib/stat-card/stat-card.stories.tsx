import { Meta, StoryObj } from '@storybook/react'

import { StatCard } from './stat-card'

export default {
  component: StatCard,
  title: 'Patterns / Data Display / Stat Card',
  args: {
    title: 'Total OpCos',
    stat: 228,
    helpText: '23.36%',
    arrowType: 'increase',
    noFooter: false
  },
  argTypes: {
    onClick: { action: 'clicked' },
    arrowType: {
      options: ['increase', 'decrease'],
      control: { type: 'radio' }
    }
  },
  parameters: {
    controls: {
      include: ['title', 'stat', 'helpText', 'arrowType', 'noFooter', 'onClick']
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/3TjPei1XxNoAItGhumZyxg/Platform-Portal---Design-SSOT?node-id=1799%3A37304&t=REeBl3wkGFUSIkta-4'
    }
  }
} as Meta<typeof StatCard>

export const Default: StoryObj<typeof StatCard> = {
  render: args => (
    <StatCard title={args.title} stat={args.stat} onClick={args.onClick} />
  )
}

export const WithHelpText: StoryObj<typeof StatCard> = {
  render: args => (
    <StatCard
      title={args.title}
      stat={args.stat}
      onClick={args.onClick}
      helpText={args.helpText}
      arrowType={args.arrowType}
    />
  )
}

export const WithNoFooter: StoryObj<typeof StatCard> = {
  render: args => <StatCard title={args.title} stat={args.stat} noFooter />
}
