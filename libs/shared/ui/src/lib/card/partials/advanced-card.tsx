import { MdChat, MdMoreHoriz, MdShare, MdThumbUp } from 'react-icons/md'

import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
  Box,
  Button,
  Heading,
  HStack,
  IconButton,
  Image,
  Text
} from '../../../index'
import { CardBody, CardFooter, CardHeader, CardRoot } from '../card'

export function AdvancedCard() {
  return (
    <CardRoot maxW="md">
      <CardHeader>
        <HStack gap="4">
          <AvatarRoot>
            {/* @ts-expect-error Chakra v3 compound component typing */}
            <AvatarImage src="https://bit.ly/dan-abramov" />
            <AvatarFallback name="Dan Abramov" />
          </AvatarRoot>

          <Box flex="1">
            <Heading size="sm">Platform and Data Team</Heading>
            <Text>Creator, Redesign UI</Text>
          </Box>
          <IconButton variant="ghost" colorPalette="gray" aria-label="See menu">
            <MdMoreHoriz />
          </IconButton>
        </HStack>
      </CardHeader>
      <CardBody>
        <Text>
          With Redesign UI, we wanted to sync the speed of development with the
          speed of design. we wanted the developer to be just as excited as the
          designer to create a screen.
        </Text>
      </CardBody>
      <Image
        objectFit="cover"
        src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
        alt="Redesign UI"
      />

      <CardFooter justifyContent="space-between">
        <Button flex="1" variant="ghost">
          <MdThumbUp />
          Like
        </Button>
        <Button flex="1" variant="ghost">
          <MdChat />
          Comment
        </Button>
        <Button flex="1" variant="ghost">
          <MdShare />
          Share
        </Button>
      </CardFooter>
    </CardRoot>
  )
}
