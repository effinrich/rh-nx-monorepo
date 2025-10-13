import { listAnatomy as parts } from '@chakra-ui/anatomy'
import {
  createMultiStyleConfigHelpers,
  defineStyle
} from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys)

const variants = {
  striped: definePartsStyle({
    item: defineStyle({
      _odd: {
        bg: 'gray.50'
      }
    })
  })
}
export default defineMultiStyleConfig({ variants })
