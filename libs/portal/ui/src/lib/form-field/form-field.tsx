import { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Tooltip
} from '@redesignhealth/ui'

interface FormFieldProps {
  name: string
  label: string
  helper?: string
  children: ReactNode
  disabledHelpText?: string
  testid?: string
  optional?: boolean
}

export const FormField = ({
  children,
  name,
  helper,
  label,
  testid,
  disabledHelpText,
  optional = false
}: FormFieldProps) => {
  const { formState } = useFormContext()
  const errorMessage = formState.errors[name]?.message as string | undefined
  const isInvalid = Boolean(errorMessage)

  return (
    <Tooltip
      label={disabledHelpText}
      placement="top-start"
      disabled={!disabledHelpText}
    >
      <FormControl data-testid={testid} invalid={isInvalid}>
        {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
        <FormLabel>{optional ? `${label} (optional)` : label}</FormLabel>
        {children}
        {isInvalid ? (
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
        ) : (
          // @ts-expect-error Chakra v3 FieldHelperText children typing
          <FormHelperText>{helper}</FormHelperText>
        )}
      </FormControl>
    </Tooltip>
  )
}
