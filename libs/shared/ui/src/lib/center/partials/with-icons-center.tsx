import { Box } from '../../box/box'
import { HStack } from '../../h-stack/h-stack'
import { PhoneIcon } from '../../icons/icons'

import { Center } from '../center'

export function WithIconsCenter() {
  return (
    <HStack>
      <Center w="40px" h="40px" bg="tomato" color="white">
        <PhoneIcon />
      </Center>
      <Center w="40px" h="40px" bg="tomato" color="white">
        <Box as="span" fontWeight="bold" fontSize="lg">
          1
        </Box>
      </Center>
    </HStack>
  )
}
