import { FieldErrorText } from '@chakra-ui/react'

export function FormError(props: Record<string, unknown>) {
  return (
    <FieldErrorText
      mt="0"
      bg="red.500"
      color="white"
      px="1"
      lineHeight="1em"
      borderRadius="sm"
      {...props}
    />
  )
}
