import { MdOutlineInfo } from 'react-icons/md'
import {
  Popover,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger
} from '@chakra-ui/react'
import { Box } from '@redesignhealth/ui'

interface AdvisorBioProps {
  bio?: string
}

export const AdvisorBio = ({ bio }: AdvisorBioProps) => {
  if (!bio) return null

  return (
    <Popover trigger="hover" placement="right" isLazy>
      <PopoverTrigger>
        <MdOutlineInfo aria-label="info" />
      </PopoverTrigger>
      <PopoverAnchor>
        <Box />
      </PopoverAnchor>
      <PopoverContent w="lg" maxH="sm" overflowY="scroll">
        <PopoverHeader fontWeight="semibold">Bio</PopoverHeader>
        <PopoverBody fontSize="sm" lineHeight="7" letterSpacing="tight">
          {bio}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}
