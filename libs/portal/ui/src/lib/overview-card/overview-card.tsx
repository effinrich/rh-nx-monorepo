import { ReactNode } from 'react'
import {
  type BoxProps,
  Box,
  CardRoot,
  Separator,
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
    <CardRoot variant="outline" as="section" {...props}>
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
      <Separator mt="20px" />
      <Box p="24px">{children}</Box>
    </CardRoot>
  )
}

export default OverviewCard
