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
      isDisabled={!disabledHelpText}
    >
      <FormControl data-testid={testid} isInvalid={isInvalid}>
        <FormLabel>{optional ? `${label} (optional)` : label}</FormLabel>
        {children}
        {isInvalid ? (
          <FormErrorMessage>{errorMessage}</FormErrorMessage>
        ) : (
          <FormHelperText>{helper}</FormHelperText>
        )}
      </FormControl>
    </Tooltip>
  )
}
