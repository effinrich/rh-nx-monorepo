import { Avatar as ChakraAvatar } from '@chakra-ui/react'
import { forwardRef } from 'react'

export interface AvatarProps extends ChakraAvatar.RootProps {
  name?: string
  src?: string
  srcSet?: string
  loading?: 'eager' | 'lazy'
  icon?: React.ReactElement
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(function Avatar(
  { src, srcSet, name, loading, icon, children, ...rest },
  ref
) {
  return (
    <ChakraAvatar.Root ref={ref} {...rest}>
      <ChakraAvatar.Fallback name={name}>{icon}</ChakraAvatar.Fallback>
      <ChakraAvatar.Image src={src} srcSet={srcSet} loading={loading} />
      {children}
    </ChakraAvatar.Root>
  )
})

export {
  AvatarRoot,
  AvatarImage,
  AvatarFallback,
  AvatarIcon,
  AvatarGroup
} from '@chakra-ui/react'

// Re-export with v2 names for backward compatibility
/**
 * @deprecated Use `Avatar.Indicator` from Chakra UI v3 instead.
 */
export const AvatarBadge = ChakraAvatar.Indicator

export type { AvatarRootProps, AvatarGroupProps } from '@chakra-ui/react'
