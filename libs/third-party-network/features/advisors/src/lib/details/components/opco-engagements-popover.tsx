import { ReactNode } from 'react'
import {
  PopoverRoot,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverPositioner,
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
    <PopoverRoot>
      <PopoverTrigger asChild>
        <Text as="span" w="fit-content" cursor="default">
          {opcoName}
        </Text>
      </PopoverTrigger>
      <PopoverPositioner>
        {/* @ts-expect-error Chakra v3 compound component typing */}
        <PopoverContent>
          <PopoverArrow />
          <PopoverBody>{children}</PopoverBody>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  )
}
