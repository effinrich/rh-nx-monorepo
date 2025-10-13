import React from 'react'
import {
  type CardHeaderProps,
  Box,
  CardHeader,
  Flex,
  Heading,
  HStack,
  Stack
} from '@redesignhealth/ui'

import BackButton from '../back-button/back-button'

export interface DetailsCardHeaderProps extends CardHeaderProps {
  title: string
  titleAddon?: React.ReactNode
  subtitle?: React.ReactNode
  backButtonText: string
  leftAddon?: React.ReactNode
  rightAddon?: React.ReactNode
}

const DetailsCardHeader = ({
  title,
  titleAddon,
  leftAddon,
  subtitle,
  backButtonText,
  rightAddon,
  ...rest
}: DetailsCardHeaderProps) => {
  return (
    <CardHeader p={0} {...rest}>
      <Stack spacing={6}>
        <BackButton>{backButtonText}</BackButton>
        <Flex
          direction={['column', 'column', 'row']}
          justify="space-between"
          gap={2}
        >
          <HStack spacing={6} wrap="wrap">
            {leftAddon && leftAddon}
            <Stack gap={2}>
              <HStack>
                <Heading size="sm">{title}</Heading>
                {titleAddon && titleAddon}
              </HStack>
              {subtitle && <Box>{subtitle}</Box>}
            </Stack>
          </HStack>
          {rightAddon && rightAddon}
        </Flex>
      </Stack>
    </CardHeader>
  )
}

export default DetailsCardHeader
