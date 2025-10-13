import { cardAnatomy } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/react'

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  cardAnatomy.keys
)

const defaultProps = {
  variant: 'outline'
}

export default defineMultiStyleConfig({
  defaultProps
})
