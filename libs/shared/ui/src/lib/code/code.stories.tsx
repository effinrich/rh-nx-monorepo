import { Meta } from '@storybook/react-vite'

import { Stack } from '../../index'

import { Code } from './code'

const Story: Meta<typeof Code> = {
  component: Code,
  title: 'Components / Data Display / Code'
}
export default Story

export const Default = {
  args: {
    children: 'Hello world'
  }
}

export const Colors = () => (
  <Stack direction="row">
    <Code children="console.log(welcome)" />
    <Code colorScheme="red" children="var chakra = 'awesome!'" />
    <Code colorScheme="yellow" children="npm install chakra" />
  </Stack>
)
