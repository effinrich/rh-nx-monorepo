import { forwardRef } from 'react'

import { type InputProps, Input } from '../input/input'

export const CustomInput = forwardRef<HTMLInputElement, InputProps>(
  function CustomInput({ value, onClick, onChange }, ref) {
    return (
      <Input
        autoComplete="off"
        value={value}
        ref={ref}
        onClick={onClick}
        onChange={onChange}
        placeholder="MM/DD/YYYY"
        maxW="100%"
      />
    )
  }
)
