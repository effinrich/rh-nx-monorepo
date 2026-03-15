import React from 'react'
import { type CardHeaderProps } from '@redesignhealth/ui'
import { Box, CardHeader, Divider, Flex, Text } from '@redesignhealth/ui'

interface ListCardHeaderProps extends Omit<CardHeaderProps, 'title'> {
  title?: React.ReactNode
  subtitle?: React.ReactNode
  leftAddon?: React.ReactNode
}

export const ListCardHeader = ({
  title,
  children,
  leftAddon,
  subtitle,
  ...props
}: ListCardHeaderProps) => {
  const hasTitle = title || subtitle

  return (
    <>
      <CardHeader
        {...props}
        as={Flex}
        justify="space-between"
        flexDirection={['column', 'column', 'row']}
        gap="4"
        align="center"
      >
        <Flex gap="4" align="center" width={['100%', '100%', 'initial']}>
          {leftAddon && leftAddon}
          {hasTitle && (
            <Box>
              {title && (
                <Text
                  as="h3"
                  fontSize="18px"
                  fontWeight="700"
                  lineHeight="28px"
                  color="gray.900"
                >
                  {title}
                </Text>
              )}

              {subtitle && (
                <Box fontSize="14px" fontWeight="400" color="gray.600">
                  {subtitle}
                </Box>
              )}
            </Box>
          )}
        </Flex>
        {children}
      </CardHeader>
      <Divider />
    </>
  )
}
