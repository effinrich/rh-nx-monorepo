import { Button } from '../../button/button'

import {
  TooltipArrow,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithIsOpenPropTooltip() {
  return (
    <TooltipRoot open>
      <TooltipTrigger asChild>
        <Button disabled>Can't Touch This</Button>
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
