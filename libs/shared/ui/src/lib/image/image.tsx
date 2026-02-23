// In Chakra v3, `Img` and standalone `ImageProps` were removed.
// `Image` is now the standard component; derive the type from it.
import { Image, chakra } from '@chakra-ui/react'
export { Image }

// Img alias: Chakra v3 dropped it — re-export native img via chakra factory
export const Img = chakra('img')

import type { ComponentProps } from 'react'
export type ImageProps = ComponentProps<typeof Image>
