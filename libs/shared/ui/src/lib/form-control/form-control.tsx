import { ComponentProps, ReactNode } from 'react'
import { Field as ChakraField } from '@chakra-ui/react'

export const FieldRoot = ChakraField.Root
/** v2-compatible Field component (`<Field>` = Field.Root) */
export const Field = ChakraField.Root

type LabelProps = ComponentProps<typeof ChakraField.Label> & {
  children?: ReactNode
}
type HelperProps = ComponentProps<typeof ChakraField.HelperText> & {
  children?: ReactNode
}
type ErrorProps = ComponentProps<typeof ChakraField.ErrorText> & {
  children?: ReactNode
}

export const FieldLabel = (props: LabelProps) => <ChakraField.Label {...props} />
export const FieldHelperText = (props: HelperProps) => (
  <ChakraField.HelperText {...props} />
)
export const FieldErrorText = (props: ErrorProps) => (
  <ChakraField.ErrorText {...props} />
)
export const FieldErrorIcon = ChakraField.ErrorIcon
export const FieldRequiredIndicator = ChakraField.RequiredIndicator

export const FormControl = FieldRoot
export const FormLabel = FieldLabel
export const FormHelperText = FieldHelperText
export const FormErrorMessage = FieldErrorText
export const FormErrorIcon = FieldErrorIcon
