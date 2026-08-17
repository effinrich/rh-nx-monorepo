import { MdOutlineInfo } from 'react-icons/md'
import {
  PopoverRoot,
  PopoverAnchor,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverPositioner,
  PopoverTrigger
} from '@chakra-ui/react'
import { Box } from '@redesignhealth/ui'

interface AdvisorBioProps {
  bio?: string
}

export const AdvisorBio = ({ bio }: AdvisorBioProps) => {
  if (!bio) return null

  return (
    <PopoverRoot positioning={{ placement: 'right' }} lazyMount>
      <PopoverTrigger asChild>
        <Box as="span" cursor="pointer">
          <MdOutlineInfo aria-label="info" />
        </Box>
      </PopoverTrigger>
      <PopoverAnchor>
        <Box />
      </PopoverAnchor>
      <PopoverPositioner>
        {/* @ts-expect-error Chakra v3 compound component typing */}
        <PopoverContent w="lg" maxH="sm" overflowY="scroll">
          <PopoverHeader fontWeight="semibold">Bio</PopoverHeader>
          <PopoverBody fontSize="sm" lineHeight="7" letterSpacing="tight">
            {bio}
          </PopoverBody>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  )
}
