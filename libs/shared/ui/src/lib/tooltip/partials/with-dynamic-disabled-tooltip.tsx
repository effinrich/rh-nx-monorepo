import * as React from 'react'

import { rh } from '../../rh/rh'

import {
  TooltipArrow,
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithDynamicDisabledTooltip() {
  const [isDisabled, setIsDisabled] = React.useState(false)
  const handleDisabled = () => setIsDisabled(true)
  const handleEnabled = () => setIsDisabled(false)
  return (
    <TooltipRoot
      positioning={{ placement: 'bottom' }}
      openDelay={500}
      disabled={isDisabled}
    >
      <TooltipTrigger asChild>
        <rh.span
          draggable
          onDragStart={handleDisabled}
          onDragEnd={handleEnabled}
          cursor="grab"
        >
          Drag me, and you won't see
        </rh.span>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent>
          <TooltipArrow />
          Disabled after being triggered
        </TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  )
}
