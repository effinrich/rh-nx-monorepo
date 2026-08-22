import { HStack } from '../../h-stack/h-stack'
import { PhoneIcon } from '../../icons/icons'
import { Square } from '../../square/square'

import { Circle } from '../circle'

export function SquareAndCircleExample() {
  return (
    <HStack>
      <Circle size="40px" bg="tomato" color="white">
        <PhoneIcon />
      </Circle>
      <Square size="40px" bg="purple.700" color="white">
        <PhoneIcon />
      </Square>
    </HStack>
  )
}
