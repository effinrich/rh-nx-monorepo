// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getErrorsFromValidation = (validation: any) => {
  if (validation.success) return undefined

  const errors = validation.error.flatten()

  for (const key of Object.keys(errors.fieldErrors)) {
    const value = errors.fieldErrors[key] as string[] | undefined
    ;(errors.fieldErrors as Record<string, unknown>)[key] = value?.[0]
  }

  return {
    formErrors: errors.formErrors as string[],
    fieldErrors: errors.fieldErrors as Record<string, string | undefined>
  }
}
