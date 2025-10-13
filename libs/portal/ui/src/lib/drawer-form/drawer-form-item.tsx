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
    <FormControl variant="flex-grid" isInvalid={props.isInvalid}>
      <DrawerFormHeader as={FormLabel}>{props.label}</DrawerFormHeader>
      {props.children}
      <FormErrorMessage>{props.error}</FormErrorMessage>
      <FormHelperText>{props.helperText}</FormHelperText>
    </FormControl>
  )
}
