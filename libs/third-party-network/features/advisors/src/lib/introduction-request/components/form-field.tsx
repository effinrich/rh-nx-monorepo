import { useFormContext } from 'react-hook-form'
import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
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
    <FormControl isInvalid={isInvalid} as={Grid} gridTemplateColumns="1fr 3fr">
      <FormLabel whiteSpace="pre-line">{label}</FormLabel>
      <Box>
        {type === 'input' && <Input {...register(field)} />}
        {type === 'textarea' && (
          <Textarea {...register(field)} resize="none" minH="150px" />
        )}
        <FormErrorMessage>{errorMessage}</FormErrorMessage>
      </Box>
    </FormControl>
  )
}
