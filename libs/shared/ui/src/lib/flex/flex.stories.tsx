import { Meta } from '@storybook/react-vite'

import { Box } from '../box/box'
import { Button, ButtonGroup } from '../button/button'
import { Center } from '../center/center'
import { Heading } from '../heading/heading'
import { Square } from '../square/square'
import { Text } from '../text/text'

import { Flex, Spacer } from './flex'

export default {
  component: Flex,
  title: 'Components / Layout / Flex'
} as Meta<typeof Flex>

export const Default = {
  args: {
    color: 'white',
    children: (
      <>
        <Center w="100px" bg="green.500">
          <Text>Box 1</Text>
        </Center>
        <Square bg="blue.500" size="150px">
          <Text>Box 2</Text>
        </Square>
        <Box flex="1" bg="tomato">
          <Text>Box 3</Text>
        </Box>
      </>
    )
  }
}

export const WithSpacer = {
  args: {
    color: 'white',
    children: (
      <>
        <Box p="4" bg="red.400">
          Box 1
        </Box>
        <Spacer />
        <Box p="4" bg="green.400">
          Box 2
        </Box>
      </>
    )
  }
}

export const NavExample = {
  args: {
    color: 'white',
    gap: 2,
    alignItems: 'center',
    minWidth: 'max-content',
    children: (
      <>
        <Box p="2">
          <Heading size="md" color="primary.500">
            Redesign Health
          </Heading>
        </Box>
        <Spacer />
        <ButtonGroup gap="2">
          <Button colorPalette="primary">Sign Up</Button>
          <Button colorPalette="primary">Log in</Button>
        </ButtonGroup>
      </>
    )
  }
}
