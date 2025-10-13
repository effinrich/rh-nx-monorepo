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
  const clientError = clientErrors[name]?.message
  const error = clientError || serverError
  return (
    <FormControl isInvalid={error} data-testid={name}>
      <FormLabel>{label}</FormLabel>
      {children}
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
      <FormErrorMessage role="alert">
        <ErrorMessage errors={clientErrors} name={name} />
      </FormErrorMessage>
    </FormControl>
  )
}

export default FormFieldContainer
