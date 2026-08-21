import type { ReactNode } from 'react'
import { chakra } from '@chakra-ui/react'

export interface SvgIconProps {
  boxSize?: string
  viewBox?: string
  children?: ReactNode
}

export function SvgIcon({ children, boxSize = '1em', ...props }: SvgIconProps) {
  return (
    <chakra.svg
      viewBox="0 0 24 24"
      focusable="false"
      aria-hidden
      boxSize={boxSize}
      {...props}
    >
      {children}
    </chakra.svg>
  )
}
