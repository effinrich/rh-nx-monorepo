import {
  TooltipContent,
  TooltipPositioner,
  TooltipRoot,
  TooltipTrigger
} from '../tooltip'

export function WithinFixedContainerTooltip() {
  return (
    <div
      style={{
        position: 'fixed',
        background: 'red',
        height: '100px',
        width: '200px'
      }}
    >
      <TooltipRoot>
        <TooltipTrigger asChild>
          <span>Hi</span>
        </TooltipTrigger>
        <TooltipPositioner>
          <TooltipContent aria-label="hello">Hello</TooltipContent>
        </TooltipPositioner>
      </TooltipRoot>
    </div>
  )
}
