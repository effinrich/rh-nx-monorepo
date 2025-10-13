import { SafeParseReturnType } from 'zod'

export const getErrorsFromValidation = <Input, Output>(
  validation: SafeParseReturnType<Input, Output>
) => {
  if (validation.success) return undefined

  const errors = validation.error.flatten()

  for (const key of Object.keys(errors.fieldErrors)) {
    const value = errors.fieldErrors[key] as string[] | undefined
    errors.fieldErrors[key] = value?.[0]
  }

  return {
    formErrors: errors.formErrors,
    fieldErrors: errors.fieldErrors
  }
}
