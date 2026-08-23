import { Meta, StoryObj } from '@storybook/react-vite'

import { Stack } from '../../index'

import { CompositionHeading } from './partials/composition-heading'
import { OverrideStyleHeading } from './partials/override-style-heading'
import { TruncateHeadingExample } from './partials/truncate-heading'
import { Heading } from './heading'

export default {
  component: Heading,
  title: 'Components / Typography / Heading',
  args: {
    as: 'h1',
    size: '4xl',
    lineClamp: 1
  }
} as Meta<typeof Heading>

export const Default: StoryObj<typeof Heading> = {
  render: args => <Heading {...args}>I'm a Heading</Heading>
}

export const ChangingVisualSize: StoryObj<typeof Heading> = {
  render: () => (
    <Stack gap={6}>
      <Heading as="h1" size="4xl" lineClamp={1}>
        (4xl) In love with React & Next
      </Heading>
      <Heading as="h2" size="3xl" lineClamp={1}>
        (3xl) In love with React & Next
      </Heading>
      <Heading as="h2" size="2xl">
        (2xl) In love with React & Next
      </Heading>
      <Heading as="h2" size="xl">
        (xl) In love with React & Next
      </Heading>
      <Heading as="h3" size="lg">
        (lg) In love with React & Next
      </Heading>
      <Heading as="h4" size="md">
        (md) In love with React & Next
      </Heading>
      <Heading as="h5" size="sm">
        (sm) In love with React & Next
      </Heading>
      <Heading as="h6" size="xs">
        (xs) In love with React & Next
      </Heading>
    </Stack>
  )
}

export const TruncateHeading = {
  render: () => <TruncateHeadingExample />
}

export const OverrideStyle = {
  render: () => <OverrideStyleHeading />
}

export const Composition = {
  render: () => <CompositionHeading />
}
