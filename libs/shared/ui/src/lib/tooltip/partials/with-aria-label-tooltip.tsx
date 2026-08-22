import { Button } from '../../button/button'

import {
  TooltipArrow,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithAriaLabelTooltip() {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>
        <Button style={{ fontSize: 25 }}>
          <span role="img" aria-label="notification">
            🔔
          </span>
          <span>3</span>
        </Button>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent bg="tomato" color="white" aria-label="3 Notifications">
          <TooltipArrow />
          Notifications
        </TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  )
}
