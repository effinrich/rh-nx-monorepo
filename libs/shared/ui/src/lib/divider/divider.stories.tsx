import { Meta, StoryObj } from '@storybook/react-vite'

import { Box, Center, Stack, Text } from '../../index'

import { Separator } from './divider'

export default {
  component: Separator,
  title: 'Components / Layout / Separator',
  decorators: [Story => <Box pt={100}>{Story()}</Box>]
} as Meta<typeof Separator>

export const Horizontal = {
  args: {
    orientation: 'horizontal'
  }
}

export const Vertical: StoryObj<typeof Separator> = {
  render: () => (
    <Center height="50px" bgColor="primary.500">
      <Separator orientation="vertical" />
    </Center>
  )
}

export const Composition: StoryObj<typeof Separator> = {
  render: () => (
    <Stack direction="row" h="100px" p={4} bgColor="primary.500" color="white">
      <Separator orientation="vertical" />
      <Text>Redesign Health</Text>
    </Stack>
  )
}
