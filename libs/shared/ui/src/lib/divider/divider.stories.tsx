import { Meta, StoryObj } from '@storybook/react-vite'

import { Box, Center, Stack, Text } from '../../index'

import { Divider } from './divider'

export default {
  component: Divider,
  title: 'Components / Layout / Divider',
  decorators: [Story => <Box pt={100}>{Story()}</Box>]
} as Meta<typeof Divider>

export const Horizontal = {
  args: {
    orientation: 'horizontal'
  }
}

export const Vertical: StoryObj<typeof Divider> = {
  render: args => (
    <Center height="50px" bgColor="primary.500">
      <Divider orientation="vertical" />
    </Center>
  )
}

export const Composition: StoryObj<typeof Divider> = {
  render: args => (
    <Stack direction="row" h="100px" p={4} bgColor="primary.500" color="white">
      <Divider orientation="vertical" />
      <Text>Redesign Health</Text>
    </Stack>
  )
}
