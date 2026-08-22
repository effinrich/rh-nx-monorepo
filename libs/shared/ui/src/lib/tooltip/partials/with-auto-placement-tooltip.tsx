import { Button } from '../../button/button'

import {
  TooltipArrow,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithAutoPlacementTooltip() {
  return (
    <TooltipRoot positioning={{ placement: 'bottom' }}>
      <TooltipTrigger asChild>
        <Button>Can't Touch This</Button>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent>
          <TooltipArrow />
          Hello world
        </TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  )
}
