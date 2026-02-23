import { Link as RouterLink } from 'react-router-dom'
import { As } from '@chakra-ui/react'

import { Button } from '../button/button'
import { type CardProps, Card } from '../card/card'
import { Flex } from '../flex/flex'
import { Icon } from '../icon/icon'
import { Text } from '../text/text'

export interface CtaCardProps extends CardProps {
  title: string
  ctaText?: string
  icon?: As
  helpText?: string
  bgColor?: string
  headingcolor?: string
  headingWeight?: string
  ctaVariant?: string
  ctaColorPalette?: string
  to?: string
  href?: string
  hasButtonAction?: boolean
  ctaTextAlternative?: string
  onClick?: () => void
  ctaButton?: React.ReactNode
  topVisual?: React.ReactNode
}

export const CtaCard = ({
  title,
  icon,
  onClick,
  ctaText,
  helpText,
  ctaVariant = 'solid',
  ctaColorPalette = 'primary',
  bgColor = 'gray.50',
  headingcolor = 'gray.500',
  headingWeight = 'normal',
  to,
  hasButtonAction = true,
  ctaTextAlternative,
  href,
  ctaButton,
  topVisual,
  ...props
}: CtaCardProps) => {
  return (
    <Card as="section" p="36px" bg={bgColor} {...props}>
      <Flex flexDir="column" justify="center" align="center">
        {icon && (
          <Icon
            as={icon}
            name={ctaText}
            w="124px"
            h="60px"
            color="primary.600"
          />
        )}
        {topVisual}
        <Text
          {...(ctaTextAlternative ? { pt: '24px', pb: '3px' } : { py: '6px' })}
          fontSize="16px"
          fontWeight={headingWeight}
          color={headingcolor}
          textAlign="center"
        >
          {title}
        </Text>
        {hasButtonAction ? (
          ctaButton ? (
            ctaButton
          ) : to ? (
            <Button
              as={RouterLink}
              to={to}
              variant={ctaVariant}
              colorPalette={ctaColorPalette}
              data-id="add-entity"
            >
              {ctaText}
            </Button>
          ) : href ? (
            <Button
              as="a"
              href={href}
              target="_blank"
              variant={ctaVariant}
              colorPalette={ctaColorPalette}
              data-id="add-entity"
            >
              {ctaText}
            </Button>
          ) : (
            <Button
              onClick={onClick}
              variant={ctaVariant}
              colorPalette={ctaColorPalette}
              data-id="add-entity"
            >
              {ctaText}
            </Button>
          )
        ) : (
          <Text fontSize="16px">{ctaTextAlternative}</Text>
        )}
        {helpText && (
          <Text as="sub" mt={8}>
            {helpText}
          </Text>
        )}
      </Flex>
    </Card>
  )
}

export default CtaCard
