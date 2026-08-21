import { type ComponentProps, forwardRef } from 'react'
import { ClientOnly, IconButton, Skeleton } from '@chakra-ui/react'

import { useColorMode } from './hooks/use-color-mode'
import { ColorModeIcon } from './color-mode-icon'

export interface ColorModeButtonProps
  extends Omit<ComponentProps<typeof IconButton>, 'aria-label'> {
  'aria-label'?: string
}

export const ColorModeButton = forwardRef<
  HTMLButtonElement,
  ColorModeButtonProps
>(function ColorModeButton(props, ref) {
  const { toggleColorMode } = useColorMode()
  return (
    <ClientOnly fallback={<Skeleton boxSize="9" />}>
      <IconButton
        onClick={toggleColorMode}
        variant="ghost"
        aria-label="Toggle color mode"
        size="sm"
        ref={ref}
        {...props}
      >
        <ColorModeIcon />
      </IconButton>
    </ClientOnly>
  )
})
