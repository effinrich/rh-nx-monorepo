import { Button } from '../../button/button'

import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithDefaultIsOpenPropTooltip() {
  return (
    <TooltipRoot defaultOpen>
      <TooltipTrigger asChild>
        <Button>Can't Touch This</Button>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent>Hello world</TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  )
}
