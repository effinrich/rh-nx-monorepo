import { Meta } from '@storybook/react-vite'

import { Box } from '../box/box'

import { Spinner } from './spinner'

const Story: Meta<typeof Spinner> = {
  component: Spinner,
  title: 'Components / Feedback / Spinner',
  args: {
    color: 'primary'
  }
}
export default Story

export const Basic = {
  render: (args: typeof Spinner) => {
    return <Spinner {...args} />
  }
}

export const Size = () => (
  <Box>
    {['xl', 'lg', 'md', 'sm', 'xs'].map(size => (
      <Spinner key={size} margin={3} color="green.500" size={size} />
    ))}
  </Box>
)
export const Speed = () => (
  <Spinner color="blue.500" emptyColor="gray.200" speed="0.8s" />
)

export const EmptyColor = () => (
  <Spinner color="red.500" emptyColor="gray.200" />
)

export const WithCustomStyleConfig = () => {
  return <Spinner color="red.500" />
}
