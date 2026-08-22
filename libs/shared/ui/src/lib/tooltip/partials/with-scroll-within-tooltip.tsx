import { Button } from '../../button/button'
import { rh } from '../../rh/rh'

import {
  TooltipArrow,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithScrollWithinTooltip() {
  return (
    <rh.div border="solid 1px red" pt="48" height="400px" overflow="auto">
      <TooltipRoot closeOnScroll positioning={{ placement: 'bottom' }}>
        <TooltipTrigger asChild>
          <Button mt="180px" mb="80px">
            Can't Touch This
          </Button>
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
