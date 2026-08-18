import { ReactNode } from 'react'

import { type BoxProps, Box } from '../box/box'
import { Separator } from '../divider/divider'
import { Flex } from '../flex/flex'
import { Heading } from '../heading/heading'
import { ElementType } from 'react'
import { Text } from '../text/text'

export interface SectionHeaderProps extends BoxProps {
  firstName?: string | undefined
  title: string
  helpText?: ReactNode
  rightElement?: ReactNode
  hTag?: ElementType
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'xs' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  helpTextFontSize?: string | number
  isDivider?: boolean
  isSticky?: boolean
}

export const SectionHeader = ({
  firstName,
  title,
  helpText,
  rightElement,
  helpTextFontSize = '16px',
  hTag = 'h1',
  isDivider = true,
  isSticky = false,
  size = 'sm' as const,
  fontWeight = 'bold',
  ...props
}: SectionHeaderProps) => {
  return (
    <Box
      {...props}
      position={isSticky ? 'sticky' : 'relative'}
      w={isSticky ? 'full' : 'auto'}
      top={isSticky ? ['72px', 0] : 'auto'}
      bgColor="white"
      zIndex={1}
    >
      <Flex justify="space-between" align="center">
        <Box>
          <Heading as={hTag} size={size} fontWeight={fontWeight}>
            {/* eslint-disable-next-line eqeqeq */}
            {title === 'Welcome' ? (
              <span>
                {firstName
                  ? `${title}, ${firstName}`
                  : `${title} to Platform Portal`}
              </span>
            ) : (
              title
            )}
          </Heading>
          {helpText && (
            <Text
              fontSize={helpTextFontSize}
              lineHeight="24px"
              fontWeight="normal"
              color="gray.600"
              mt="4px"
            >
              {helpText}
            </Text>
          )}
        </Box>
        <Box pl={2}>{rightElement}</Box>
      </Flex>
      {isDivider && <Separator mt={{ base: '12px' }} />}
    </Box>
  )
}

export default SectionHeader
