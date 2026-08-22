import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithStringTooltip() {
  return (
    <TooltipRoot>
      <TooltipTrigger asChild>
        <span>Hover me</span>
      </TooltipTrigger>
      <TooltipPositioner>
        <TooltipContent>This is a rh tooltip</TooltipContent>
      </TooltipPositioner>
    </TooltipRoot>
  )
}
