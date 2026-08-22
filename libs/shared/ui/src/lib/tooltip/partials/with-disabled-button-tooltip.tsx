import { Button } from '../../button/button'

import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithDisabledButtonTooltip() {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>
        <Button disabled>Can't Touch This</Button>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent>Oh oh oh, oh oh</TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  )
}
