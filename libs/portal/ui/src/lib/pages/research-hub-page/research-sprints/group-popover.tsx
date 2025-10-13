import { MdInfoOutline, MdOutlineClose } from 'react-icons/md'
import {
  Flex,
  IconButton,
  Popover,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text
} from '@chakra-ui/react'

interface GroupPopoverProps {
  description?: string
}

export const GroupPopover = ({ description }: GroupPopoverProps) => {
  if (!description) return null

  return (
    <Popover placement="right-start" isLazy>
      <PopoverTrigger>
        <IconButton
          icon={<MdInfoOutline />}
          aria-label="Info"
          color="gray.600"
          sx={{ '& svg': { h: '24px', w: '24px' } }}
          variant="unstyled"
        />
      </PopoverTrigger>

      <PopoverContent w="403px">
        <PopoverHeader
          as={Flex}
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
          <PopoverCloseButton
            as={IconButton}
            icon={<MdOutlineClose />}
            position="static"
            height="40px"
            width="40px"
            sx={{ '& svg': { height: '24px', width: '24px' } }}
          />
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
    </Popover>
  )
}
