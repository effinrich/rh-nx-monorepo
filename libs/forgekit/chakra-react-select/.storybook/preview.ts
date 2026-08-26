import { createElement } from 'react'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

import type { Preview } from '@storybook/react-vite'

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
