import { Link as RouterLink } from 'react-router-dom'

// import { useCountUp } from 'use-count-up'
import { type BoxProps } from '../box/box'
import { Button } from '../button/button'
import { CardRoot } from '../card/card'
import { Separator } from '../divider/divider'
import { Flex } from '../flex/flex'
import { Link } from '../link/link'
import {
  StatDownIndicator,
  StatHelpText,
  StatLabel,
  StatRoot,
  StatUpIndicator,
  StatValueText
} from '../stat/stat'

export interface StatCardProps extends BoxProps {
  title: string
  stat: number | undefined
  arrowType?: 'increase' | 'decrease'
  helpText?: string
  to?: string
  onClick?: () => void
  noFooter?: boolean
}

export const StatCard = ({
  title,
  stat,
  onClick,
  helpText,
  to,
  noFooter = false,
  arrowType = 'increase',
  ...props
}: StatCardProps) => {
  return (
    <CardRoot as="section" {...props}>
      <StatRoot pt={5} px={5} pb={12}>
        <StatLabel color="gray.500">{title}</StatLabel>
        <StatValueText color="gray.900" fontSize="4xl">
          {stat ? stat : 0}
        </StatValueText>
        {helpText && (
          <StatHelpText>
            {arrowType === 'increase' ? (
              <StatUpIndicator />
            ) : (
              <StatDownIndicator />
            )}
            {helpText}
          </StatHelpText>
        )}
      </StatRoot>
      {!noFooter && (
        <div>
          <Separator />

          <Flex alignItems="center" justifyContent="flex-end" h="55px" pr={4}>
            {to ? (
              <Link
                asChild
                fontSize="14px"
                fontWeight="medium"
                _hover={{
                  textDecoration: 'none'
                }}
                data-id="view-all"
              >
                <RouterLink to={to}>View all</RouterLink>
              </Link>
            ) : (
              <Button
                variant="ghost"
                onClick={onClick}
                size="sm"
                data-id="view-all"
              >
                View All
              </Button>
            )}
          </Flex>
        </div>
      )}
    </CardRoot>
  )
}
