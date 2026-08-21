import type { ComponentProps } from 'react'
import { forwardRef } from 'react'
import {
  Checkbox as ChakraCheckbox,
  CheckboxGroup as ChakraCheckboxGroup
} from '@chakra-ui/react'

export const CheckboxGroup = ChakraCheckboxGroup
export const CheckboxRoot = ChakraCheckbox.Root
export const CheckboxHiddenInput = ChakraCheckbox.HiddenInput
export const CheckboxControl = ChakraCheckbox.Control
export const CheckboxIndicator = ChakraCheckbox.Indicator
export const CheckboxLabel = ChakraCheckbox.Label

export interface CheckboxProps extends ChakraCheckbox.RootProps {
  icon?: React.ReactNode
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>
  rootRef?: React.Ref<HTMLLabelElement>
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ children, icon, inputProps, rootRef, ...props }, ref) {
    return (
      <ChakraCheckbox.Root ref={rootRef} {...props}>
        <ChakraCheckbox.HiddenInput ref={ref} {...inputProps} />
        <ChakraCheckbox.Control>
          {icon || <ChakraCheckbox.Indicator />}
        </ChakraCheckbox.Control>
        {children != null && (
          <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>
        )}
      </ChakraCheckbox.Root>
    )
  }
)

export type {
  CheckboxControlProps,
  CheckboxLabelProps,
  CheckboxRootProps
} from '@chakra-ui/react'

export type CheckboxGroupProps = ComponentProps<typeof CheckboxGroup>
