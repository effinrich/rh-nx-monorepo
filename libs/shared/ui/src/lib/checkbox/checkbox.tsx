import { forwardRef } from 'react'
import {
  Checkbox as ChakraCheckbox,
  CheckboxGroup as ChakraCheckboxGroup
} from '@chakra-ui/react'

export const CheckboxGroup = ChakraCheckboxGroup

// Compound component exports for direct usage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CheckboxRoot = ChakraCheckbox.Root as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CheckboxControl = ChakraCheckbox.Control as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CheckboxLabel = ChakraCheckbox.Label as any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CheckboxHiddenInput = ChakraCheckbox.HiddenInput as any

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
        {/* @ts-expect-error Chakra v3 CheckboxControl children typing */}
        <ChakraCheckbox.Control>
          {icon || <ChakraCheckbox.Indicator />}
        </ChakraCheckbox.Control>
        {/* @ts-expect-error Chakra v3 CheckboxLabel children typing */}
        {children && <ChakraCheckbox.Label>{children}</ChakraCheckbox.Label>}
      </ChakraCheckbox.Root>
    )
  }
)

export type {
  CheckboxControlProps,
  CheckboxLabelProps,
  CheckboxRootProps
} from '@chakra-ui/react'

// CheckboxGroupProps was removed in v3 — derive from the exported CheckboxGroup component
import type { ComponentProps } from 'react'
export type CheckboxGroupProps = ComponentProps<typeof CheckboxGroup>
