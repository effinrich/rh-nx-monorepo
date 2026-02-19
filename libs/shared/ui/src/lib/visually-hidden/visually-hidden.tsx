export { VisuallyHidden } from '@chakra-ui/react'

// VisuallyHiddenInput was removed in Chakra v3 — create a simple shim
import { chakra } from '@chakra-ui/react'
export const VisuallyHiddenInput = chakra('input', {
  base: {
    border: '0',
    clip: 'rect(0, 0, 0, 0)',
    height: '1px',
    width: '1px',
    margin: '-1px',
    padding: '0',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    position: 'absolute',
  }
})
