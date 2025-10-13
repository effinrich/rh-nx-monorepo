import { Meta, StoryFn, StoryObj } from '@storybook/react'

import { Box, Button, Stack, Text } from '../../index'

import { Heading } from './heading'

export default {
  component: Heading,
  title: 'Components / Typography / Heading',
  args: {
    as: 'h1',
    size: '4xl',
    noOfLines: 1
    // fontSize: ''
  }
} as Meta<typeof Heading>

export const Default: StoryObj<typeof Heading> = {
  render: args => <Heading {...args}>I'm a Heading</Heading>
}

export const ChangingVisualSize: StoryObj<typeof Heading> = {
  render: args => (
    <Stack spacing={6}>
      <Heading as="h1" size="4xl" noOfLines={1}>
        (4xl) In love with React & Next
      </Heading>
      <Heading as="h2" size="3xl" noOfLines={1}>
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

export const TruncateHeading: StoryFn<typeof Heading> = () => (
  <Box maxW={500}>
    No Truncation
    <Heading>
      Basic text writing, including headings, body text, lists, and more.
    </Heading>
    <br />
    With Truncation
    <Heading noOfLines={1}>
      Basic text writing, including headings, body text, lists, and more.
    </Heading>
  </Box>
)

export const OverrideStyle: StoryFn<typeof Heading> = () => (
  <Heading size="lg" fontSize="50px">
    I'm overriding this heading
  </Heading>
)

export const Composition: StoryFn<typeof Heading> = () => (
  <Box maxW="32rem">
    <Heading mb={4}>Modern online and offline payments for Africa</Heading>
    <Text fontSize="xl">
      Paystack helps businesses in Africa get paid by anyone, anywhere in the
      world
    </Text>
    <Button size="lg" colorScheme="primary" mt="24px">
      Create a free account
    </Button>
  </Box>
)
