import {
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel
} from '@redesignhealth/ui'

import { DrawerFormHeader } from '.'

export interface DrawerFormItemProps {
  label: string
  error?: string
  children: JSX.Element
  helperText?: string
  isInvalid?: boolean
}

export const DrawerFormItem = (props: DrawerFormItemProps) => {
  return (
    <FormControl variant="flex-grid" invalid={props.isInvalid}>
      {/* @ts-expect-error Chakra v3 FieldLabel children typing */}
      <DrawerFormHeader as={FormLabel}>{props.label}</DrawerFormHeader>
      {props.children}
      {/* @ts-expect-error Chakra v3 FieldErrorText children typing */}
      <FormErrorMessage>{props.error}</FormErrorMessage>
      {/* @ts-expect-error Chakra v3 FieldHelperText children typing */}
      <FormHelperText>{props.helperText}</FormHelperText>
    </FormControl>
  )
}
