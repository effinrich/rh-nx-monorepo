import { Button } from '../../button/button'

import {
  TooltipArrow,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithButtonTooltip() {
  return (
    <TooltipRoot positioning={{ placement: 'bottom' }}>
      <TooltipTrigger asChild>
        <Button>Hover me</Button>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent>
          <TooltipArrow />
          This is a rh tooltip
        </TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  )
}
