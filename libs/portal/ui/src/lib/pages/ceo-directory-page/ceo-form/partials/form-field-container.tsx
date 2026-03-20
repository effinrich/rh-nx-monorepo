import { FieldErrors } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import {
  ApiFieldError,
  CeoFormFields
} from '@redesignhealth/portal/data-assets'
import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel
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
  const clientError = (clientErrors as Record<string, { message?: string }>)[name]?.message
  const error = clientError || serverError
  return (
    <FormControl invalid={!!error} data-testid={name}>
      {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
      <FormLabel>{label}</FormLabel>
      {children}
      {/* @ts-expect-error Chakra v3 FieldHelperText children typing */}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
      <FormErrorMessage role="alert">
        <ErrorMessage errors={clientErrors} name={name} />
      </FormErrorMessage>
    </FormControl>
  )
}

export default FormFieldContainer
