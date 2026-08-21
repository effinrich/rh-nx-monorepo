import { ReactNode } from 'react'
import { useFormContext } from 'react-hook-form'
import {
  FieldErrorText,
  FieldHelperText,
  FieldLabel,
  FieldRoot,
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
      <FieldRoot data-testid={testid} invalid={isInvalid}>
        {/* @ts-expect-error Chakra v3 children typing */}
        <FieldLabel>{optional ? `${label} (optional)` : label}</FieldLabel>
        {children}
        {isInvalid ? (
          // @ts-expect-error Chakra v3 children typing
          <FieldErrorText>{errorMessage}</FieldErrorText>
        ) : (
          // @ts-expect-error Chakra v3 children typing
          <FieldHelperText>{helper}</FieldHelperText>
        )}
      </FieldRoot>
    </Tooltip>
  )
}
