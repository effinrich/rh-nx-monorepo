import { forwardRef } from 'react'

import { type InputProps, Input } from '../input'

export const FlushedCustomInput = forwardRef<HTMLInputElement, InputProps>(
  function FlushedCustomInput(props, ref) {
    return <Input ref={ref} color="gray.600" variant="flushed" {...props} />
  }
)
