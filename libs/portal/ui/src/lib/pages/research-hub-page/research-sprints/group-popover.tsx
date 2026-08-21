import { MdInfoOutline, MdOutlineClose } from 'react-icons/md'
import {
  PopoverRoot,
  PopoverTrigger,
  PopoverPositioner,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverCloseTrigger
} from '@chakra-ui/react'
import { Flex, IconButton, Text } from '@redesignhealth/ui'

interface GroupPopoverProps {
  description?: string
}

export const GroupPopover = ({ description }: GroupPopoverProps) => {
  if (!description) return null

  return (
    <PopoverRoot positioning={{ placement: 'right-start' }} lazyMount>
      <PopoverTrigger asChild>
        <IconButton
          aria-label="Info"
          color="gray.600"
          css={{ '& svg': { height: '24px', width: '24px' } }}
          variant="plain"
        >
          <MdInfoOutline />
        </IconButton>
      </PopoverTrigger>

      <PopoverPositioner>
        {/* @ts-expect-error Chakra v3 compound component typing */}
        <PopoverContent w="403px">
          <PopoverHeader asChild>
            <Flex
              justifyContent="space-between"
              align="center"
              px="16px"
              py="20px"
            >
              <Text
                fontSize="18px"
                fontWeight="700"
                lineHeight="28px"
                color="gray.900"
              >
                Description
              </Text>
              <PopoverCloseTrigger asChild>
                <IconButton
                  aria-label="Close"
                  position="static"
                  height="40px"
                  width="40px"
                  variant="ghost"
                  css={{ '& svg': { height: '24px', width: '24px' } }}
                >
                  <MdOutlineClose />
                </IconButton>
              </PopoverCloseTrigger>
            </Flex>
          </PopoverHeader>
          <PopoverBody px="24px" py="16px">
            <Text
              fontSize="16px"
              fontWeight="400"
              lineHeight="24px"
              color="black"
            >
              {description}
            </Text>
          </PopoverBody>
        </PopoverContent>
      </PopoverPositioner>
    </PopoverRoot>
  )
}
