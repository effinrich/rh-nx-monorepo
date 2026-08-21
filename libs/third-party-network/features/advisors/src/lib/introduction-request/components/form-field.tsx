import { useFormContext } from 'react-hook-form'
import {
  Box,
  FieldErrorText,
  FieldLabel,
  FieldRoot,
  Grid,
  Input,
  Textarea
} from '@redesignhealth/ui'

import { Field, Form } from '../types'

interface FormFieldProps {
  field: Field
  label: string
  type?: 'input' | 'textarea'
}

export const FormField = ({ field, label, type = 'input' }: FormFieldProps) => {
  const { register, formState } = useFormContext<Form>()
  const errorMessage = formState.errors[field]?.message
  const isInvalid = Boolean(errorMessage)

  return (
    <FieldRoot invalid={isInvalid} as={Grid} gridTemplateColumns="1fr 3fr">
      {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
      <FieldLabel whiteSpace="pre-line">{label}</FieldLabel>
      <Box>
        {type === 'input' && <Input {...register(field)} />}
        {type === 'textarea' && (
          <Textarea {...register(field)} resize="none" minH="150px" />
        )}
        {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
        <FieldErrorText>{errorMessage}</FieldErrorText>
      </Box>
    </FieldRoot>
  )
}
