import { FieldErrors } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import {
  ApiFieldError,
  CeoFormFields
} from '@redesignhealth/portal/data-assets'
import {
  FieldErrorText,
  FieldHelperText,
  FieldLabel,
  FieldRoot
} from '@redesignhealth/ui'

interface FormFieldContainerProps {
  name: string
  label: string
  helperText?: string
  clientErrors: FieldErrors<CeoFormFields>
  serverErrors?: ApiFieldError[]
  children: React.ReactNode
}

// TODO: [DS-208] ErrorMessage needs to be updated for clientErrors an serverErrors

const FormFieldContainer = ({
  name,
  label,
  children,
  helperText,
  clientErrors,
  serverErrors
}: FormFieldContainerProps) => {
  const serverError = serverErrors?.find(e => e.name === name)?.description
  const clientError = clientErrors[name]?.message
  const error = clientError || serverError
  return (
    <FieldRoot invalid={!!error} data-testid={name}>
      {/* @ts-expect-error Chakra v3 children typing */}
      <FieldLabel>{label}</FieldLabel>
      {children}
      {/* @ts-expect-error Chakra v3 children typing */}
      {helperText && <FieldHelperText>{helperText}</FieldHelperText>}
      {/* @ts-expect-error Chakra v3 children typing */}
      <FieldErrorText role="alert">
        <ErrorMessage errors={clientErrors} name={name} />
      </FieldErrorText>
    </FieldRoot>
  )
}

export default FormFieldContainer
