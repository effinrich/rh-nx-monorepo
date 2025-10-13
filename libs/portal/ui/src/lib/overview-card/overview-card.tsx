import { ReactNode } from 'react'
import {
  type BoxProps,
  Box,
  Card,
  Divider,
  SectionHeader
} from '@redesignhealth/ui'

interface OverviewCardProps extends BoxProps {
  title: string
  description?: ReactNode
  children: ReactNode
  rightElement?: ReactNode
}

const OverviewCard = ({
  title,
  description,
  children,
  rightElement,
  ...props
}: OverviewCardProps) => {
  return (
    <Card variant="outline" as="section" {...props}>
      <SectionHeader
        p="24px 24px 0 24px"
        title={title}
        helpText={description}
        helpTextFontSize="14px"
        isDivider={false}
        rightElement={rightElement}
        hTag="h2"
        size="xs"
      />
      <Divider mt="20px" />
      <Box p="24px">{children}</Box>
    </Card>
  )
}

export default OverviewCard
