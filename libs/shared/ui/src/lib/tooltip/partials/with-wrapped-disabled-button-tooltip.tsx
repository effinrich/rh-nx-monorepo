import { Button } from '../../button/button'

import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithWrappedDisabledButtonTooltip() {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>
        <span>
          <Button disabled>Hover me</Button>
        </span>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent>Hello world</TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  )
}
