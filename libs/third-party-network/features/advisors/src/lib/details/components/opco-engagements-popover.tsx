import { ReactNode } from 'react'
import {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverPositioner,
  PopoverRoot,
  PopoverTrigger,
  Text
} from '@redesignhealth/ui'

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
