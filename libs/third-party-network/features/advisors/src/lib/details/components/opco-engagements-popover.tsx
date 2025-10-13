import { ReactNode } from 'react'
import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger
} from '@chakra-ui/react'
import { Text } from '@redesignhealth/ui'

interface OpcoEngagementsPopoverProps {
  opcoName?: string
  children: ReactNode
}

export const OpcoEngagementsPopover = ({
  children,
  opcoName
}: OpcoEngagementsPopoverProps) => {
  if (!opcoName) return null

  return (
    <Popover trigger="hover">
      <PopoverTrigger>
        <Text as="span" w="fit-content" cursor="default">
          {opcoName}
        </Text>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverBody>{children}</PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
