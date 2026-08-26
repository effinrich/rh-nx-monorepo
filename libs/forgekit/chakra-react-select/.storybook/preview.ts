import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import type { Preview } from '@storybook/react-vite'
import { createElement } from 'react'

const preview: Preview = {
  decorators: [
    Story =>
      createElement(
        ChakraProvider,
        { value: defaultSystem },
        createElement(Story)
      )
  ],
  parameters: {
    controls: { expanded: true },
    layout: 'centered'
  }
}

export default preview
