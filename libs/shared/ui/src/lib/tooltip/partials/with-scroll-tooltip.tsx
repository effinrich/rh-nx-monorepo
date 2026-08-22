import { Button } from '../../button/button'
import { rh } from '../../rh/rh'

import {
  TooltipArrow,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithScrollTooltip() {
  return (
    <rh.div border="solid 1px red" h="200vh" pt="48">
      <TooltipRoot closeOnScroll positioning={{ placement: 'bottom' }}>
        <TooltipTrigger asChild>
          <Button mt="300px">Can't Touch This</Button>
        </TooltipTrigger>
        <TooltipPositioner>
          <TooltipContent>
            <TooltipArrow />
            Hello world
          </TooltipContent>
        </TooltipPositioner>
      </TooltipRoot>
    </rh.div>
  )
}
