import { type ComponentProps, forwardRef } from 'react'
import { Span } from '@chakra-ui/react'

export const DarkMode = forwardRef<
  HTMLSpanElement,
  ComponentProps<typeof Span>
>(function DarkMode(props, ref) {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme dark"
      ref={ref}
      {...props}
    />
  )
})
