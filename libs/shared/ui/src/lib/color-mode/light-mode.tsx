import { type ComponentProps, forwardRef } from 'react'
import { Span } from '@chakra-ui/react'

export const LightMode = forwardRef<
  HTMLSpanElement,
  ComponentProps<typeof Span>
>(function LightMode(props, ref) {
  return (
    <Span
      color="fg"
      display="contents"
      className="chakra-theme light"
      ref={ref}
      {...props}
    />
  )
})
