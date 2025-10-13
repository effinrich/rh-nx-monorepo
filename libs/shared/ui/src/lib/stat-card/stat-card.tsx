import { Link as RouterLink } from 'react-router-dom'

// import { useCountUp } from 'use-count-up'
import { type BoxProps } from '../box/box'
import { Button } from '../button/button'
import { Card } from '../card/card'
import { Divider } from '../divider/divider'
import { Flex } from '../flex/flex'
import { Link } from '../link/link'
import {
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber
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
  // const { value } = useCountUp({
  //   isCounting: true,
  //   end: stat,
  //   duration: 1
  // })

  return (
    <Card as="section" {...props}>
      <Stat pt={5} px={5} pb={12}>
        <StatLabel color="gray.500">{title}</StatLabel>
        <StatNumber color="gray.900" fontSize="4xl">
          {/* {value ? value : 0} */}
          {stat ? stat : 0}
        </StatNumber>
        {helpText && (
          <StatHelpText>
            <StatArrow type={arrowType} />
            {helpText}
          </StatHelpText>
        )}
      </Stat>
      {!noFooter && (
        <div>
          <Divider />

          <Flex alignItems="center" justifyContent="flex-end" h="55px" pr={4}>
            {to ? (
              <Link
                as={RouterLink}
                to={to}
                fontSize="14px"
                fontWeight="medium"
                _hover={{
                  textDecoration: 'none'
                }}
                data-id="view-all"
              >
                View all
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
    </Card>
  )
}
