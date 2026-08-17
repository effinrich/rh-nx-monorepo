import React from 'react'
import { IconType } from 'react-icons/lib'
import { type AlertRootProps, AlertRoot, AlertIcon, HStack } from '@redesignhealth/ui'

export interface BannerAlert extends AlertRootProps {
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
    <AlertRoot status="warning" {...rest}>
      <AlertIcon {...(icon && { as: icon })} />
      <HStack gap={2}>
        {children}
        {rightElement}
      </HStack>
    </AlertRoot>
  )
}
