import {
  FieldErrorText,
  FieldHelperText,
  FieldLabel,
  FieldRoot
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
    <FieldRoot variant="flex-grid" invalid={props.isInvalid}>
      <DrawerFormHeader as={FieldLabel}>{props.label}</DrawerFormHeader>
      {props.children}
      {/* @ts-expect-error Chakra v3 children typing */}
      <FieldErrorText>{props.error}</FieldErrorText>
      {/* @ts-expect-error Chakra v3 children typing */}
      <FieldHelperText>{props.helperText}</FieldHelperText>
    </FieldRoot>
  )
}
