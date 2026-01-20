import { forwardRef } from 'react'
import {
  Checkbox as ChakraCheckbox,
  CheckboxGroup as ChakraCheckboxGroup
} from '@chakra-ui/react'

export const CheckboxGroup = ChakraCheckboxGroup

export interface CheckboxProps extends ChakraCheckbox.RootProps {
  icon?: React.ReactNode
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  isIndeterminate?: boolean
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    { children, icon, inputProps, isIndeterminate, checked, ...props },
    ref
  ) {
    return (
      <ChakraCheckbox.Root
        checked={isIndeterminate ? 'indeterminate' : checked}
        {...props}
      >
        <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />
        <ChakraCheckbox.Control>
          {icon || <ChakraCheckbox.Indicator />}
        </ChakraCheckbox.Control>
        {children && <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>}
      </ChakraCheckbox.Root>
    )
  }
)

export type {
  CheckboxControlProps,
  CheckboxGroupProps,
  CheckboxLabelProps,
  CheckboxRootProps
} from '@chakra-ui/react'
