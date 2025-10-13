import { ReactNode } from 'react'
import { type BoxProps, Box } from '@redesignhealth/ui'

import TextBlock from './text-block'

export interface FilterBoxProps extends BoxProps {
  title?: string
  description?: ReactNode
  children?: ReactNode
}

export const FilterBox = ({
  title,
  description,
  children,
  ...props
}: FilterBoxProps) => {
  return (
    <Box rounded="lg" bg="gray.200" p={5} {...props}>
      <TextBlock title={title} description={description} />
      {children}
    </Box>
  )
}

export default FilterBox
