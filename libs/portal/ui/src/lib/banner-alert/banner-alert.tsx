import React from 'react'
import { IconType } from 'react-icons/lib'
import { type AlertProps, Alert, AlertIcon, HStack } from '@redesignhealth/ui'

export interface BannerAlert extends AlertProps {
  children: React.ReactNode
  icon?: IconType
  rightElement?: React.ReactNode
}

export const BannerAlert = ({
  children,
  icon,
  rightElement,
  ...rest
}: BannerAlert) => {
  return (
    <Alert status="warning" {...rest}>
      <AlertIcon {...(icon && { as: icon })} />
      <HStack spacing={2}>
        {children}
        {rightElement}
      </HStack>
    </Alert>
  )
}
