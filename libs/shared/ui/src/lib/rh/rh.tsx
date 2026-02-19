// Chakra UI v3: Many v2 exports have been removed or renamed
// - As type was removed (use React.ElementType instead)
// - ThemeProvider removed (use ChakraProvider with value prop)
// - useStyleConfig removed (use recipe system instead)

export { chakra as rh } from '@chakra-ui/react'

// v2 compatibility: `As` was a Chakra type for the polymorphic `as` prop
import type { ElementType } from 'react'
export type As = ElementType
