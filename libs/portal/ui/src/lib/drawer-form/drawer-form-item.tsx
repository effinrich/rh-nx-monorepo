import React from 'react'
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
  children: React.ReactNode
  helperText?: string
  isInvalid?: boolean
}

export const DrawerFormItem = (props: DrawerFormItemProps) => {
  return (
    <FormControl variant="flex-grid" invalid={props.isInvalid}>
      <DrawerFormHeader as={FormLabel}>{props.label}</DrawerFormHeader>
      {props.children}
      <FormErrorMessage>{props.error}</FormErrorMessage>
      {/* @ts-expect-error Chakra v3 FieldHelperText children typing */}
      <FormHelperText>{props.helperText}</FormHelperText>
    </FormControl>
  )
}
